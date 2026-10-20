-- Auth-aware RLS layer (keeps public read for lobby; write prefers auth.uid())
-- Demo address profiles (0x1111… / 0x2222…) remain writable via existing open policies
-- until demo seats are retired. New authenticated users use auth.uid() as profiles.id.

do $$ begin
  create policy profiles_auth_update on public.profiles
    for update using (auth.uid()::text = id) with check (auth.uid()::text = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy profiles_auth_insert on public.profiles
    for insert with check (auth.uid()::text = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy ledger_auth_read on public.ledger_entries
    for select using (auth.uid()::text = user_id or true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notifications_auth_read on public.notifications
    for select using (auth.uid()::text = user_id or true);
exception when duplicate_object then null; end $$;
