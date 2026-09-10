-- IPI Golf Intelligence — Supabase schema
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- for a fresh project. Both tables store the whole Lead/Assessment object as
-- one JSONB blob under `data` — matching what the app already keeps in
-- localStorage — so adding a field to either domain type later never needs a
-- schema migration here.
--
-- Access model: any authenticated user can read/write every row (this is a
-- small internal sales-pipeline tool where the team is meant to share
-- visibility, not a per-user siloed app). Anonymous (logged-out) access is
-- blocked entirely by RLS.

create table if not exists leads (
  id uuid primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists assessments (
  id uuid primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table leads enable row level security;
alter table assessments enable row level security;

drop policy if exists "authenticated users have full access" on leads;
create policy "authenticated users have full access" on leads
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated users have full access" on assessments;
create policy "authenticated users have full access" on assessments
  for all
  to authenticated
  using (true)
  with check (true);
