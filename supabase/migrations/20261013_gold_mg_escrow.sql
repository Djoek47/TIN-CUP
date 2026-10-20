-- Obol gold_mg escrow ledger
-- Canonical unit: gold_mg (reference XAU milligrams — not physical delivery)

alter table if exists public.profiles
  add column if not exists gold_mg_available numeric not null default 0,
  add column if not exists gold_mg_hold numeric not null default 0,
  add column if not exists gold_mg_total numeric not null default 0,
  add column if not exists display_currency text not null default 'USD',
  add column if not exists mass_unit text not null default 'g';

alter table if exists public.ledger_entries
  add column if not exists gold_mg numeric,
  add column if not exists fiat_cents bigint,
  add column if not exists currency text default 'USD',
  add column if not exists xau_rate numeric,
  add column if not exists rail text default 'mock',
  add column if not exists escrow_status text default 'held';

-- Mint gold into escrow (deposit)
create or replace function public.mint_gold_escrow(
  p_fiat_cents bigint,
  p_currency text default 'USD',
  p_xau_rate numeric default 2650,
  p_rail text default 'mock',
  p_ref text default null
)
returns json language plpgsql security definer as $$
declare
  v_user_id text;
  v_gold_mg numeric;
  v_hold numeric;
  v_avail numeric;
  v_new_total numeric;
  v_troy_oz_mg numeric := 31103.4768;
begin
  v_user_id := auth.uid()::text;
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;
  if p_fiat_cents is null or p_fiat_cents <= 0 then
    raise exception 'Invalid amount';
  end if;

  -- gold_mg = fiat_dollars / (xau_per_oz / troy_oz_mg)
  v_gold_mg := (p_fiat_cents::numeric / 100.0) / (p_xau_rate / v_troy_oz_mg);
  v_hold := v_gold_mg * 0.30;
  v_avail := v_gold_mg - v_hold;

  update public.profiles
  set
    gold_mg_available = coalesce(gold_mg_available, 0) + v_avail,
    gold_mg_hold = coalesce(gold_mg_hold, 0) + v_hold,
    gold_mg_total = coalesce(gold_mg_total, 0) + v_gold_mg,
    balance_cents = coalesce(balance_cents, 0) + p_fiat_cents
  where id = v_user_id
  returning gold_mg_total into v_new_total;

  insert into public.ledger_entries (
    user_id, kind, amount_cents, balance_after_cents, description, ref_id,
    gold_mg, fiat_cents, currency, xau_rate, rail, escrow_status
  ) values (
    v_user_id, 'deposit', p_fiat_cents, null, 'Escrow mint', p_ref,
    v_gold_mg, p_fiat_cents, p_currency, p_xau_rate, p_rail, 'held'
  );

  insert into public.notifications (user_id, kind, title, body)
  values (
    v_user_id,
    'deposit',
    'Escrow credited',
    'Minted ' || round(v_gold_mg, 3)::text || ' mg reference gold'
  );

  return json_build_object(
    'success', true,
    'gold_mg', v_gold_mg,
    'gold_mg_total', v_new_total,
    'escrow_status', 'held'
  );
end;
$$;

-- Release gold from available (cash out)
create or replace function public.release_gold_cashout(
  p_fiat_cents bigint,
  p_currency text default 'USD',
  p_xau_rate numeric default 2650,
  p_rail text default 'mock'
)
returns json language plpgsql security definer as $$
declare
  v_user_id text;
  v_gold_mg numeric;
  v_avail numeric;
  v_troy_oz_mg numeric := 31103.4768;
begin
  v_user_id := auth.uid()::text;
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  v_gold_mg := (p_fiat_cents::numeric / 100.0) / (p_xau_rate / v_troy_oz_mg);

  select gold_mg_available into v_avail from public.profiles where id = v_user_id;
  if v_avail is null then
    raise exception 'User profile not found';
  end if;
  if v_gold_mg > v_avail then
    raise exception 'Insufficient available gold';
  end if;

  update public.profiles
  set
    gold_mg_available = gold_mg_available - v_gold_mg,
    gold_mg_total = gold_mg_total - v_gold_mg,
    balance_cents = greatest(coalesce(balance_cents, 0) - p_fiat_cents, 0)
  where id = v_user_id;

  insert into public.ledger_entries (
    user_id, kind, amount_cents, description,
    gold_mg, fiat_cents, currency, xau_rate, rail, escrow_status
  ) values (
    v_user_id, 'cashout', -p_fiat_cents, 'Cash out release',
    v_gold_mg, p_fiat_cents, p_currency, p_xau_rate, p_rail, 'released'
  );

  insert into public.notifications (user_id, kind, title, body)
  values (v_user_id, 'cashout', 'Cash out complete', 'Released from escrow');

  return json_build_object('success', true, 'gold_mg', v_gold_mg, 'escrow_status', 'released');
end;
$$;
