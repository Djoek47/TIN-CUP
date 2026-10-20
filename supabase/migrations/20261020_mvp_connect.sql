-- MVP bare-bones connect: Connect cash-out, LiveKit room, push, dual-entry gift, auth-aware RPCs

alter table if exists public.profiles
  add column if not exists stripe_account_id text,
  add column if not exists stripe_charges_enabled boolean not null default false,
  add column if not exists stripe_payouts_enabled boolean not null default false,
  add column if not exists push_token text,
  add column if not exists auth_user_id uuid unique;

alter table if exists public.live_sessions
  add column if not exists room_name text;

create table if not exists public.processed_stripe_events (
  id text primary key,
  kind text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  entry_cents bigint not null default 500,
  bounty_cents bigint not null default 0,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- Dual-entry gift transfer (auth.uid() as sender)
create or replace function public.send_gold_gift(
  p_to_handle text,
  p_fiat_cents bigint,
  p_currency text default 'USD',
  p_xau_rate numeric default 2650,
  p_message text default null
)
returns json language plpgsql security definer as $$
declare
  v_sender text;
  v_recipient text;
  v_gold_mg numeric;
  v_avail numeric;
  v_troy_oz_mg numeric := 31103.4768;
begin
  v_sender := auth.uid()::text;
  if v_sender is null then
    raise exception 'Not authenticated';
  end if;
  if p_fiat_cents is null or p_fiat_cents <= 0 then
    raise exception 'Invalid amount';
  end if;

  select id into v_recipient
  from public.profiles
  where lower(handle) = lower(replace(p_to_handle, '@', ''))
  limit 1;

  if v_recipient is null then
    raise exception 'Recipient not found';
  end if;
  if v_recipient = v_sender then
    raise exception 'Cannot gift yourself';
  end if;

  v_gold_mg := (p_fiat_cents::numeric / 100.0) / (p_xau_rate / v_troy_oz_mg);

  select gold_mg_available into v_avail from public.profiles where id = v_sender for update;
  if v_avail is null or v_gold_mg > v_avail then
    raise exception 'Insufficient available gold';
  end if;

  update public.profiles
  set
    gold_mg_available = gold_mg_available - v_gold_mg,
    gold_mg_total = gold_mg_total - v_gold_mg,
    balance_cents = greatest(coalesce(balance_cents, 0) - p_fiat_cents, 0),
    updated_at = now()
  where id = v_sender;

  update public.profiles
  set
    gold_mg_available = coalesce(gold_mg_available, 0) + v_gold_mg,
    gold_mg_total = coalesce(gold_mg_total, 0) + v_gold_mg,
    balance_cents = coalesce(balance_cents, 0) + p_fiat_cents,
    updated_at = now()
  where id = v_recipient;

  insert into public.gifts (sender_id, recipient_id, amount_cents, message)
  values (v_sender, v_recipient, p_fiat_cents, p_message);

  insert into public.ledger_entries (
    user_id, kind, amount_cents, description, gold_mg, fiat_cents, currency, xau_rate, rail, escrow_status
  ) values (
    v_sender, 'gift', -p_fiat_cents, 'Pour to @' || replace(p_to_handle, '@', ''),
    v_gold_mg, p_fiat_cents, p_currency, p_xau_rate, 'stripe', 'spent'
  );

  insert into public.ledger_entries (
    user_id, kind, amount_cents, description, gold_mg, fiat_cents, currency, xau_rate, rail, escrow_status
  ) values (
    v_recipient, 'gift', p_fiat_cents, 'Pour from sender',
    v_gold_mg, p_fiat_cents, p_currency, p_xau_rate, 'stripe', 'held'
  );

  insert into public.notifications (user_id, kind, title, body)
  values (
    v_recipient, 'gift', 'You received gold',
    'Someone poured ' || (p_fiat_cents::numeric / 100.0)::text || ' ' || p_currency
  );

  return json_build_object('success', true, 'gold_mg', v_gold_mg, 'recipient_id', v_recipient);
end;
$$;

-- Hold gold for challenge entry / bounty (auth.uid())
create or replace function public.hold_gold_escrow(
  p_fiat_cents bigint,
  p_kind text,
  p_label text,
  p_currency text default 'USD',
  p_xau_rate numeric default 2650
)
returns json language plpgsql security definer as $$
declare
  v_user text;
  v_gold_mg numeric;
  v_avail numeric;
  v_troy_oz_mg numeric := 31103.4768;
begin
  v_user := auth.uid()::text;
  if v_user is null then raise exception 'Not authenticated'; end if;
  if p_fiat_cents is null or p_fiat_cents <= 0 then raise exception 'Invalid amount'; end if;

  v_gold_mg := (p_fiat_cents::numeric / 100.0) / (p_xau_rate / v_troy_oz_mg);
  select gold_mg_available into v_avail from public.profiles where id = v_user for update;
  if v_avail is null or v_gold_mg > v_avail then raise exception 'Insufficient available gold'; end if;

  update public.profiles
  set
    gold_mg_available = gold_mg_available - v_gold_mg,
    gold_mg_hold = coalesce(gold_mg_hold, 0) + v_gold_mg,
    updated_at = now()
  where id = v_user;

  insert into public.ledger_entries (
    user_id, kind, amount_cents, description, gold_mg, fiat_cents, currency, xau_rate, rail, escrow_status
  ) values (
    v_user, coalesce(p_kind, 'hold'), -p_fiat_cents, p_label,
    v_gold_mg, p_fiat_cents, p_currency, p_xau_rate, 'stripe', 'held'
  );

  return json_build_object('success', true, 'gold_mg', v_gold_mg);
end;
$$;

-- Service-role mint by explicit user id (Stripe webhook)
create or replace function public.mint_gold_escrow_for_user(
  p_user_id text,
  p_fiat_cents bigint,
  p_currency text default 'USD',
  p_xau_rate numeric default 2650,
  p_rail text default 'stripe',
  p_ref text default null
)
returns json language plpgsql security definer as $$
declare
  v_gold_mg numeric;
  v_hold numeric;
  v_avail numeric;
  v_new_total numeric;
  v_troy_oz_mg numeric := 31103.4768;
begin
  if p_user_id is null or p_fiat_cents is null or p_fiat_cents <= 0 then
    raise exception 'Invalid mint params';
  end if;
  if p_ref is not null and exists (
    select 1 from public.ledger_entries where description = 'Escrow mint' and rail = p_rail and fiat_cents = p_fiat_cents and user_id = p_user_id and amount_cents = p_fiat_cents
      and created_at > now() - interval '1 day'
      and coalesce(description, '') || coalesce(p_ref, '') = 'Escrow mint' || coalesce(p_ref, '')
  ) then
    -- soft idempotency via processed_stripe_events preferred
    null;
  end if;

  v_gold_mg := (p_fiat_cents::numeric / 100.0) / (p_xau_rate / v_troy_oz_mg);
  v_hold := v_gold_mg * 0.30;
  v_avail := v_gold_mg - v_hold;

  update public.profiles
  set
    gold_mg_available = coalesce(gold_mg_available, 0) + v_avail,
    gold_mg_hold = coalesce(gold_mg_hold, 0) + v_hold,
    gold_mg_total = coalesce(gold_mg_total, 0) + v_gold_mg,
    balance_cents = coalesce(balance_cents, 0) + p_fiat_cents,
    updated_at = now()
  where id = p_user_id
  returning gold_mg_total into v_new_total;

  if v_new_total is null then
    raise exception 'User profile not found';
  end if;

  insert into public.ledger_entries (
    user_id, kind, amount_cents, description, gold_mg, fiat_cents, currency, xau_rate, rail, escrow_status
  ) values (
    p_user_id, 'deposit', p_fiat_cents, coalesce(p_ref, 'Escrow mint'),
    v_gold_mg, p_fiat_cents, p_currency, p_xau_rate, p_rail, 'held'
  );

  insert into public.notifications (user_id, kind, title, body)
  values (p_user_id, 'deposit', 'Escrow credited', 'Minted reference gold from deposit');

  return json_build_object('success', true, 'gold_mg', v_gold_mg, 'gold_mg_total', v_new_total);
end;
$$;

grant execute on function public.send_gold_gift to authenticated;
grant execute on function public.hold_gold_escrow to authenticated;
grant execute on function public.mint_gold_escrow_for_user to service_role;
