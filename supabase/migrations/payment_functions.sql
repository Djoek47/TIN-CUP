-- Create payment functions for deposits, cashouts, and transfers

-- Deposit funds to user account
create or replace function public.deposit_funds(p_amount_cents bigint)
returns json language plpgsql security definer as $$
declare
  v_user_id text;
  v_new_balance bigint;
begin
  -- Get current user from auth
  v_user_id := auth.uid()::text;
  
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Update user balance
  update public.profiles
  set balance_cents = balance_cents + p_amount_cents
  where id = v_user_id
  returning balance_cents into v_new_balance;

  -- Record in ledger
  insert into public.ledger_entries (user_id, kind, amount_cents, balance_after_cents, description)
  values (v_user_id, 'deposit', p_amount_cents, v_new_balance, 'Loaded funds');

  -- Create notification
  insert into public.notifications (user_id, kind, title, body)
  values (v_user_id, 'deposit', 'Funds loaded', 'Added ' || (p_amount_cents::float / 100)::text || ' to your stash');

  return json_build_object(
    'success', true,
    'new_balance_cents', v_new_balance,
    'message', 'Deposit successful'
  );
end;
$$;

-- Cashout funds from user account
create or replace function public.cashout_funds(p_amount_cents bigint)
returns json language plpgsql security definer as $$
declare
  v_user_id text;
  v_current_balance bigint;
  v_new_balance bigint;
begin
  v_user_id := auth.uid()::text;
  
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Get current balance
  select balance_cents into v_current_balance
  from public.profiles
  where id = v_user_id;

  if v_current_balance is null then
    raise exception 'User profile not found';
  end if;

  if p_amount_cents > v_current_balance then
    raise exception 'Insufficient balance';
  end if;

  -- Update balance
  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id
  returning balance_cents into v_new_balance;

  -- Record in ledger
  insert into public.ledger_entries (user_id, kind, amount_cents, balance_after_cents, description)
  values (v_user_id, 'cashout', -p_amount_cents, v_new_balance, 'Cashed out');

  -- Create notification
  insert into public.notifications (user_id, kind, title, body)
  values (v_user_id, 'cashout', 'Cash out complete', 'Withdrew ' || (p_amount_cents::float / 100)::text || ' from your stash');

  return json_build_object(
    'success', true,
    'new_balance_cents', v_new_balance,
    'message', 'Cashout successful'
  );
end;
$$;

-- Send gift and update balances
create or replace function public.send_gift(
  p_recipient_id text,
  p_amount_cents bigint,
  p_message text default null,
  p_beg_id uuid default null
)
returns json language plpgsql security definer as $$
declare
  v_sender_id text;
  v_sender_balance bigint;
  v_recipient_balance bigint;
  v_new_sender_balance bigint;
  v_new_recipient_balance bigint;
  v_gift_id uuid;
  v_recipient_name text;
begin
  v_sender_id := auth.uid()::text;
  
  if v_sender_id is null then
    raise exception 'Not authenticated';
  end if;

  if v_sender_id = p_recipient_id then
    raise exception 'Cannot gift to yourself';
  end if;

  -- Get sender balance
  select balance_cents into v_sender_balance
  from public.profiles
  where id = v_sender_id;

  if v_sender_balance < p_amount_cents then
    raise exception 'Insufficient balance for gift';
  end if;

  -- Get recipient info
  select balance_cents, display_name into v_recipient_balance, v_recipient_name
  from public.profiles
  where id = p_recipient_id;

  if v_recipient_balance is null then
    raise exception 'Recipient not found';
  end if;

  -- Update sender balance
  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_sender_id
  returning balance_cents into v_new_sender_balance;

  -- Update recipient balance
  update public.profiles
  set balance_cents = balance_cents + p_amount_cents
  where id = p_recipient_id
  returning balance_cents into v_new_recipient_balance;

  -- Create gift record
  insert into public.gifts (sender_id, recipient_id, amount_cents, coins, message, beg_id)
  values (v_sender_id, p_recipient_id, p_amount_cents, p_amount_cents / 100, p_message, p_beg_id)
  returning id into v_gift_id;

  -- Record in sender ledger
  insert into public.ledger_entries (user_id, kind, amount_cents, balance_after_cents, description, ref_id)
  values (v_sender_id, 'gift_sent', -p_amount_cents, v_new_sender_balance, 'Sent gift to ' || coalesce(v_recipient_name, 'someone'), v_gift_id);

  -- Record in recipient ledger
  insert into public.ledger_entries (user_id, kind, amount_cents, balance_after_cents, description, ref_id)
  values (p_recipient_id, 'gift_received', p_amount_cents, v_new_recipient_balance, 'Received gift', v_gift_id);

  -- Create notification for recipient
  insert into public.notifications (user_id, kind, title, body, data)
  values (
    p_recipient_id,
    'gift',
    'Gift received',
    p_message || ' - ' || (p_amount_cents::float / 100)::text,
    json_build_object('gift_id', v_gift_id, 'sender_id', v_sender_id, 'amount_cents', p_amount_cents)
  );

  return json_build_object(
    'success', true,
    'gift_id', v_gift_id,
    'sender_new_balance', v_new_sender_balance,
    'recipient_new_balance', v_new_recipient_balance
  );
end;
$$;

-- Lord membership payment
create or replace function public.become_lord(p_amount_cents bigint default 10000)
returns json language plpgsql security definer as $$
declare
  v_user_id text;
  v_balance bigint;
begin
  v_user_id := auth.uid()::text;
  
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Update profile to mark as lord
  update public.profiles
  set is_lord = true, fate = 'lord'
  where id = v_user_id
  returning balance_cents into v_balance;

  -- Record payment in ledger
  insert into public.ledger_entries (user_id, kind, amount_cents, balance_after_cents, description)
  values (v_user_id, 'deposit', p_amount_cents, v_balance + p_amount_cents, 'Lord membership purchased');

  -- Create notification
  insert into public.notifications (user_id, kind, title, body)
  values (v_user_id, 'system', 'Welcome to the Monarch&apos;s Circle', 'You are now a Lord');

  return json_build_object(
    'success', true,
    'is_lord', true,
    'message', 'You are now a Lord'
  );
end;
$$;
