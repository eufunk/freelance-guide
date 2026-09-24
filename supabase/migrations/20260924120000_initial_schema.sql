-- Initial schema (Phase 3): user state only. Content (roadmap, tasks, ...)
-- lives in the repository; rows here refer to content by its stable ID.
--
-- Every table has Row Level Security: users can only read and write their own
-- rows. Deleting a user in auth.users deletes all their data (on delete cascade).

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per user, created on sign-up, filled during onboarding
-- ---------------------------------------------------------------------------

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text check (char_length(name) between 1 and 100),
  country text check (char_length(country) between 1 and 100),
  experience_level text check (char_length(experience_level) between 1 and 50),
  main_skill text check (char_length(main_skill) between 1 and 100),
  additional_skills text[] not null default '{}' check (cardinality(additional_skills) <= 20),
  years_experience smallint check (years_experience between 0 and 60),
  has_portfolio boolean,
  has_freelance_experience boolean,
  -- Must match `goals` in lib/content/schema.ts.
  goal text check (goal in ('become-freelancer', 'first-client', 'more-clients')),
  hours_per_week smallint check (hours_per_week between 1 and 80),
  desired_start_date date,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Creates the empty profile when a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger-only function running with elevated rights: nobody may call it directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- No insert/delete policies: rows are created by the trigger and deleted with
-- the user.

-- ---------------------------------------------------------------------------
-- task_progress: status of a roadmap task per user
-- ---------------------------------------------------------------------------

create table public.task_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id text not null check (task_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null check (status in ('todo', 'in_progress', 'completed')),
  -- 'onboarding' = marked as already done during onboarding.
  source text not null default 'user' check (source in ('user', 'onboarding')),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, task_id),
  constraint completed_at_matches_status check ((status = 'completed') = (completed_at is not null))
);

create trigger task_progress_set_updated_at
  before update on public.task_progress
  for each row execute function public.set_updated_at();

alter table public.task_progress enable row level security;

create policy "Users can read their own task progress"
  on public.task_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own task progress"
  on public.task_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own task progress"
  on public.task_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own task progress"
  on public.task_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- calculator_results: latest result per calculator and user
-- ---------------------------------------------------------------------------

create table public.calculator_results (
  user_id uuid not null references auth.users (id) on delete cascade,
  calculator text not null check (calculator in ('hourly-rate', 'project-price')),
  inputs jsonb not null check (jsonb_typeof(inputs) = 'object'),
  result numeric(12, 2) not null check (result >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, calculator)
);

create trigger calculator_results_set_updated_at
  before update on public.calculator_results
  for each row execute function public.set_updated_at();

alter table public.calculator_results enable row level security;

create policy "Users can read their own calculator results"
  on public.calculator_results for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own calculator results"
  on public.calculator_results for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own calculator results"
  on public.calculator_results for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own calculator results"
  on public.calculator_results for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Logged-out visitors (anon) get no access at all.
-- ---------------------------------------------------------------------------

revoke all on public.profiles, public.task_progress, public.calculator_results from anon;
