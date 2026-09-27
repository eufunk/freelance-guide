-- ---------------------------------------------------------------------------
-- events: minimal first-party product metrics (Phase 11)
--
-- Only logged-in users are tracked. Users may write their own events but not
-- read, change or delete them; evaluation happens with SQL as admin (see
-- supabase/analysis/). Events are deleted together with the account.
-- A retention period is still open (guide/Umsetzungsfortschritt.md).
-- ---------------------------------------------------------------------------

create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (
    name in (
      'onboarding_completed',
      'task_started',
      'task_completed',
      'stage_completed',
      'calculator_used',
      'template_copied'
    )
  ),
  properties jsonb not null default '{}' check (jsonb_typeof(properties) = 'object'),
  created_at timestamptz not null default now()
);

create index events_user_id_created_at_idx on public.events (user_id, created_at);
create index events_name_created_at_idx on public.events (name, created_at);

alter table public.events enable row level security;

create policy "Users can record their own events"
  on public.events for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- No select, update or delete policies: users cannot read or change events.
revoke all on public.events from anon;
revoke select, update, delete, truncate on public.events from authenticated;
