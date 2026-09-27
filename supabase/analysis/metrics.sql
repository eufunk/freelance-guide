-- Product metrics (Phase 11). No dashboard in the MVP: run these queries as admin
-- in the SQL editor of Supabase Studio (locally http://127.0.0.1:54323).
-- Users cannot read the events table themselves.


-- 1. Primary metric: share of users who complete at least one task within 7 days
--    after their first onboarding. Only users whose 7 days are over are counted,
--    grouped by the week of their onboarding.
with onboarded as (
  select user_id, min(created_at) as onboarded_at
  from public.events
  where name = 'onboarding_completed'
  group by user_id
  having min(created_at) < now() - interval '7 days'
),
activated as (
  select distinct o.user_id
  from onboarded o
  join public.events e
    on e.user_id = o.user_id
    and e.name = 'task_completed'
    and e.created_at >= o.onboarded_at
    and e.created_at < o.onboarded_at + interval '7 days'
)
select
  date_trunc('week', o.onboarded_at)::date as onboarding_week,
  count(*) as onboarded_users,
  count(a.user_id) as users_with_completed_task,
  round(100.0 * count(a.user_id) / count(*), 1) as percent
from onboarded o
left join activated a on a.user_id = o.user_id
group by 1
order by 1;


-- 2. All events per week and name.
select
  date_trunc('week', created_at)::date as week,
  name,
  count(*) as events,
  count(distinct user_id) as users
from public.events
group by 1, 2
order by 1, 2;


-- 3. Most used calculators and templates (last 30 days).
select
  name,
  coalesce(properties ->> 'calculator', properties ->> 'templateId') as item,
  count(*) as events,
  count(distinct user_id) as users
from public.events
where name in ('calculator_used', 'template_copied')
  and created_at > now() - interval '30 days'
group by 1, 2
order by 3 desc;
