-- ============================================================
-- Agentic Devs Collective Hub — Members Table Migration
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- This creates the members table and a trigger to auto-populate
-- it when a new user signs up via auth.users.
-- ============================================================

-- 1. Create the members table
create table if not exists public.members (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  city text,
  chapter_id uuid,  -- left null initially; assigned when member joins a chapter
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.members enable row level security;

-- 3. RLS Policies
create policy "Users can view own member profile"
  on public.members for select
  using (auth.uid() = id);

create policy "Users can update own member profile"
  on public.members for update
  using (auth.uid() = id);

-- 4. Function to handle new user creation
-- Uses SECURITY DEFINER so it can insert into public.members
-- even though the user hasn't been fully authenticated yet.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.members (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

-- 5. Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
