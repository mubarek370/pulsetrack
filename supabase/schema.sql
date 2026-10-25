-- ==============================================================================
-- PulseTrack: Supabase Database Schema & Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. Profiles Table (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  units text default 'kg' check (units in ('kg', 'lbs')),
  timezone text default 'UTC',
  theme text default 'dark' check (theme in ('light', 'dark')),
  updated_at timestamptz default now()
);

-- Function & Trigger to automatically create a profile row upon signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Habits Table
create table if not exists public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  color text default 'indigo',
  icon text default 'target',
  archived boolean default false,
  created_at timestamptz default now()
);

-- 3. Habit Daily Check-in Logs
create table if not exists public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  completed boolean default true,
  unique (habit_id, date)
);

-- 4. Workouts Table
create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  type text not null,
  duration integer not null default 0,
  volume numeric not null default 0,
  calories integer not null default 0,
  notes text,
  created_at timestamptz default now()
);

-- 5. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.workouts enable row level security;

-- Policies for profiles
drop policy if exists "Users can view and edit own profile" on public.profiles;
create policy "Users can view and edit own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policies for habits
drop policy if exists "Users can manage own habits" on public.habits;
create policy "Users can manage own habits"
  on public.habits
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies for habit_logs
drop policy if exists "Users can manage own habit logs" on public.habit_logs;
create policy "Users can manage own habit logs"
  on public.habit_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies for workouts
drop policy if exists "Users can manage own workouts" on public.workouts;
create policy "Users can manage own workouts"
  on public.workouts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Helpful indexes for query performance
create index if not exists idx_habits_user_id on public.habits (user_id);
create index if not exists idx_habit_logs_habit_date on public.habit_logs (habit_id, date);
create index if not exists idx_habit_logs_user_date on public.habit_logs (user_id, date);
create index if not exists idx_workouts_user_date on public.workouts (user_id, date desc);
