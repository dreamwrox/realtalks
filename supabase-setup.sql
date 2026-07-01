-- ============================================================
--  Talks Live — database setup
--  Paste this whole file into Supabase → SQL Editor → Run.
-- ============================================================

-- 1) PROFILES: one row per user, holds their chosen username.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles readable by signed-in users" on public.profiles;
create policy "profiles readable by signed-in users"
  on public.profiles for select to authenticated using (true);

drop policy if exists "users insert their own profile" on public.profiles;
create policy "users insert their own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- 2) MESSAGES: each row is one message from sender to recipient.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null references public.profiles(id) on delete cascade,
  recipient uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

-- You can only read messages you sent or received.
drop policy if exists "read own messages" on public.messages;
create policy "read own messages"
  on public.messages for select to authenticated
  using (auth.uid() = sender or auth.uid() = recipient);

-- You can only send messages as yourself.
drop policy if exists "send as self" on public.messages;
create policy "send as self"
  on public.messages for insert to authenticated
  with check (auth.uid() = sender);

create index if not exists messages_pair_idx on public.messages (sender, recipient, created_at);

-- 3) REALTIME: let the app receive new messages instantly.
alter publication supabase_realtime add table public.messages;
