-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  partner_id uuid references public.profiles(id),
  couple_id uuid,
  invite_code text unique,
  created_at timestamptz default now()
);

-- Couples table
create table if not exists public.couples (
  id uuid default uuid_generate_v4() primary key,
  user1_id uuid references public.profiles(id) on delete cascade not null,
  user2_id uuid references public.profiles(id) on delete cascade not null,
  anniversary_date date,
  created_at timestamptz default now()
);

-- Messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  couple_id uuid references public.couples(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Memories table
create table if not exists public.memories (
  id uuid default uuid_generate_v4() primary key,
  couple_id uuid references public.couples(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  caption text,
  taken_at date,
  created_at timestamptz default now()
);

-- Journal entries (personal)
create table if not exists public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text not null,
  created_at timestamptz default now()
);

-- Milestones (shared)
create table if not exists public.milestones (
  id uuid default uuid_generate_v4() primary key,
  couple_id uuid references public.couples(id) on delete cascade not null,
  created_by uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  event_date date not null,
  emoji text default '🌹',
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.messages enable row level security;
alter table public.memories enable row level security;
alter table public.journal_entries enable row level security;
alter table public.milestones enable row level security;

-- Profiles: users can read their own + partner profile
create policy "profiles_select" on public.profiles for select using (
  auth.uid() = id or
  id in (select partner_id from public.profiles where id = auth.uid())
);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Couples: only members can see/update their couple
create policy "couples_select" on public.couples for select using (
  auth.uid() = user1_id or auth.uid() = user2_id
);
create policy "couples_insert" on public.couples for insert with check (
  auth.uid() = user1_id or auth.uid() = user2_id
);
create policy "couples_update" on public.couples for update using (
  auth.uid() = user1_id or auth.uid() = user2_id
);

-- Messages: only couple members
create policy "messages_select" on public.messages for select using (
  couple_id in (select id from public.couples where user1_id = auth.uid() or user2_id = auth.uid())
);
create policy "messages_insert" on public.messages for insert with check (
  couple_id in (select id from public.couples where user1_id = auth.uid() or user2_id = auth.uid())
  and sender_id = auth.uid()
);

-- Memories: only couple members
create policy "memories_select" on public.memories for select using (
  couple_id in (select id from public.couples where user1_id = auth.uid() or user2_id = auth.uid())
);
create policy "memories_insert" on public.memories for insert with check (
  couple_id in (select id from public.couples where user1_id = auth.uid() or user2_id = auth.uid())
  and uploaded_by = auth.uid()
);
create policy "memories_update" on public.memories for update using (uploaded_by = auth.uid());
create policy "memories_delete" on public.memories for delete using (uploaded_by = auth.uid());

-- Journal: personal only
create policy "journal_select" on public.journal_entries for select using (author_id = auth.uid());
create policy "journal_insert" on public.journal_entries for insert with check (author_id = auth.uid());
create policy "journal_update" on public.journal_entries for update using (author_id = auth.uid());
create policy "journal_delete" on public.journal_entries for delete using (author_id = auth.uid());

-- Milestones: couple members
create policy "milestones_select" on public.milestones for select using (
  couple_id in (select id from public.couples where user1_id = auth.uid() or user2_id = auth.uid())
);
create policy "milestones_insert" on public.milestones for insert with check (
  couple_id in (select id from public.couples where user1_id = auth.uid() or user2_id = auth.uid())
  and created_by = auth.uid()
);
create policy "milestones_update" on public.milestones for update using (created_by = auth.uid());
create policy "milestones_delete" on public.milestones for delete using (created_by = auth.uid());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, invite_code)
  values (
    new.id,
    split_part(new.email, '@', 1),
    upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
