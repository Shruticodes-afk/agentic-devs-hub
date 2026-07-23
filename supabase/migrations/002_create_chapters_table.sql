-- ============================================================
-- Agentic Devs Collective Hub — Chapters Table Migration
-- ============================================================
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the chapters table
create table if not exists public.chapters (
  id uuid default gen_random_uuid() primary key,
  city text not null,
  country text not null,
  member_count integer default 0 not null,
  status text not null check (status in ('active', 'forming')),
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.chapters enable row level security;

-- 3. RLS Policies
-- Allow anyone (even unauthenticated) to read chapters for the public directory
create policy "Chapters are viewable by everyone"
  on public.chapters for select
  using (true);

-- 4. Foreign key update for members table
-- Add the foreign key constraint to members.chapter_id referencing chapters.id
alter table public.members
  add constraint fk_members_chapter
  foreign key (chapter_id)
  references public.chapters (id)
  on delete set null;
