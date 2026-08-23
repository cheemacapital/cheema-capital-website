-- Cheema Capital dashboard — schema
-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE throughout).

-- One row per saved diagnostic result. A user can have more than one
-- (e.g. retakes it later), the dashboard shows their most recent.
create table if not exists diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track text not null,               -- 'business' | 'wealth' | 'aspiring'
  tier text,                         -- 'basic' | 'full' (business only)
  answers jsonb not null default '[]'::jsonb,   -- the answer labels, in order
  primary_gap text,
  secondary_gap text,
  scores jsonb,                      -- { Ops, Brand, GTM, Bandwidth } for the full business tier
  created_at timestamptz not null default now()
);

alter table diagnostic_results enable row level security;

drop policy if exists "select own results" on diagnostic_results;
create policy "select own results" on diagnostic_results
  for select using (auth.uid() = user_id);

drop policy if exists "insert own results" on diagnostic_results;
create policy "insert own results" on diagnostic_results
  for insert with check (auth.uid() = user_id);

-- One row per user — the freeform "reference area." Upserted on save,
-- not a list of entries, matching the MVP scope (a single running notes
-- doc, not a full notes app).
create table if not exists notes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now()
);

alter table notes enable row level security;

drop policy if exists "select own notes" on notes;
create policy "select own notes" on notes
  for select using (auth.uid() = user_id);

drop policy if exists "upsert own notes" on notes;
create policy "upsert own notes" on notes
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own notes" on notes;
create policy "update own notes" on notes
  for update using (auth.uid() = user_id);

-- Chat history, so the companion has memory across a session and the
-- dashboard can show the conversation on return visits.
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,                -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz not null default now()
);

alter table chat_messages enable row level security;

drop policy if exists "select own messages" on chat_messages;
create policy "select own messages" on chat_messages
  for select using (auth.uid() = user_id);

drop policy if exists "insert own messages" on chat_messages;
create policy "insert own messages" on chat_messages
  for insert with check (auth.uid() = user_id);
