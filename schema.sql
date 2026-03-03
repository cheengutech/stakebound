-- ── STAKEBOUND SCHEMA ────────────────────────────────────────
-- Run this in Supabase SQL Editor (Database → SQL Editor → New query)

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  phone text unique,
  name text,
  created_at timestamptz default now()
);

-- Commitments table
create table if not exists public.commitments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  goal text not null,
  stake_amount integer not null, -- in cents
  deadline timestamptz not null,
  status text default 'active' check (status in ('active', 'success', 'failed', 'pending_verification')),
  created_at timestamptz default now()
);

-- Judges table
create table if not exists public.judges (
  id uuid default gen_random_uuid() primary key,
  commitment_id uuid references public.commitments(id) on delete cascade,
  phone text not null,
  name text,
  accepted boolean default false,
  created_at timestamptz default now()
);

-- Verification tokens table (for /v/[token] links)
create table if not exists public.verification_tokens (
  id uuid default gen_random_uuid() primary key,
  token text unique default gen_random_uuid()::text,
  commitment_id uuid references public.commitments(id) on delete cascade,
  judge_id uuid references public.judges(id) on delete cascade,
  used boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- SMS log (for debugging)
create table if not exists public.sms_log (
  id uuid default gen_random_uuid() primary key,
  to_phone text,
  message text,
  direction text check (direction in ('inbound', 'outbound')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.commitments enable row level security;
alter table public.judges enable row level security;
alter table public.verification_tokens enable row level security;
alter table public.sms_log enable row level security;

-- RLS Policies
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

create policy "Users can read own commitments" on public.commitments
  for select using (auth.uid() = user_id);

create policy "Users can insert own commitments" on public.commitments
  for insert with check (auth.uid() = user_id);

create policy "Service role full access" on public.users
  for all using (true);

-- Indexes
create index if not exists commitments_user_id_idx on public.commitments(user_id);
create index if not exists judges_commitment_id_idx on public.judges(commitment_id);
create index if not exists verification_tokens_token_idx on public.verification_tokens(token);
create index if not exists verification_tokens_commitment_id_idx on public.verification_tokens(commitment_id);