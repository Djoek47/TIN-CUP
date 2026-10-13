-- Apple-camera live presence (no LiveKit)
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id text not null references public.profiles(id) on delete cascade,
  handle text not null,
  title text not null default 'Live',
  goal_cents bigint not null default 0,
  raised_cents bigint not null default 0,
  category text not null default 'STORY',
  audience text not null default 'PUBLIC',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists live_sessions_open_idx
  on public.live_sessions (started_at desc)
  where ended_at is null;

alter table public.live_sessions enable row level security;

do $$ begin
  create policy live_sessions_all on public.live_sessions for all using (true) with check (true);
exception when duplicate_object then null; end $$;
