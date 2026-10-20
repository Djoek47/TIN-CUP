-- Obol / 0bol bootstrap schema (empty project)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id text primary key,
  handle text,
  display_name text,
  bio text,
  fate text default 'vagrant',
  is_lord boolean not null default false,
  onboarded boolean not null default false,
  coins bigint not null default 0,
  balance_cents bigint not null default 0,
  gold_mg_available numeric not null default 0,
  gold_mg_hold numeric not null default 0,
  gold_mg_total numeric not null default 0,
  display_currency text not null default 'USD',
  mass_unit text not null default 'g',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.begs (
  id uuid primary key default gen_random_uuid(),
  author_id text references public.profiles(id) on delete set null,
  title text not null,
  story text,
  goal_cents bigint not null default 0,
  raised_cents bigint not null default 0,
  backers integer not null default 0,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  sender_id text references public.profiles(id) on delete set null,
  recipient_id text references public.profiles(id) on delete set null,
  amount_cents bigint not null default 0,
  coins bigint not null default 0,
  message text,
  beg_id uuid references public.begs(id) on delete set null,
  tx_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade,
  kind text not null,
  amount_cents bigint,
  balance_after_cents bigint,
  description text,
  ref_id uuid,
  gold_mg numeric,
  fiat_cents bigint,
  currency text default 'USD',
  xau_rate numeric,
  rail text default 'mock',
  escrow_status text default 'held',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade,
  kind text not null,
  title text,
  body text,
  data jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.begs enable row level security;
alter table public.gifts enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.notifications enable row level security;

-- Permissive policies for TestFlight MVP (tighten before public launch)
do $$ begin
  create policy profiles_read on public.profiles for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy profiles_write on public.profiles for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy begs_all on public.begs for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy gifts_all on public.gifts for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy ledger_all on public.ledger_entries for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy notifications_all on public.notifications for all using (true) with check (true);
exception when duplicate_object then null; end $$;
