-- IPI Golf Intelligence — Neon schema
--
-- Applied to the Neon project's `neondb` database (production branch). The app reads/writes these
-- tables from the browser through Neon's Data API. Both tables store the whole Lead/Assessment
-- object as one JSONB blob under `data` — matching what the app keeps in localStorage — so adding
-- a field to either domain type later never needs a schema migration.
--
-- Access model: no login is required. The `anonymous` role has full read/write access (RLS
-- policy below), so the app works for every visitor without signing in. Signed-in users (via the
-- dormant Neon Auth UI) get the same full access through a separate `authenticated` policy —
-- kept for if/when login is turned back on, but not required today.

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

grant usage on schema public to anonymous;
grant select, insert, update, delete on leads, assessments to anonymous;
grant select, insert, update, delete on leads, assessments to authenticated;

drop policy if exists "anonymous full access" on leads;
create policy "anonymous full access" on leads
  for all
  to anonymous
  using (true)
  with check (true);

drop policy if exists "anonymous full access" on assessments;
create policy "anonymous full access" on assessments
  for all
  to anonymous
  using (true)
  with check (true);

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
