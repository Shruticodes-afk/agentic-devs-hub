-- ============================================================
-- Agentic Devs Collective Hub — Events Tables Migration
-- ============================================================
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the events table
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  event_type text not null,
  event_date timestamptz not null,
  location text not null,
  capacity integer,
  registered_count integer default 0 not null,
  created_at timestamptz default now() not null
);

-- 2. Create the event_registrations table
create table if not exists public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(event_id, user_id)
);

-- 3. Enable Row Level Security
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;

-- 4. RLS Policies for events
-- Public can view events
create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

-- 5. RLS Policies for event_registrations
-- Users can view their own registrations
create policy "Users can view their own registrations"
  on public.event_registrations for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own registrations
create policy "Users can register themselves"
  on public.event_registrations for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 6. Trigger to increment registered_count
create or replace function increment_event_registration_count()
returns trigger as $$
begin
  update public.events
  set registered_count = registered_count + 1
  where id = new.event_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_event_registration_inserted
  after insert on public.event_registrations
  for each row execute procedure increment_event_registration_count();
