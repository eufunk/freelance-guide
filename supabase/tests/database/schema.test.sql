-- Database tests (pgTAP). Run with: npm run test:db
begin;
select plan(18);

-- Two users. The trigger creates their profiles.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'b@example.test');

-- Count only these two users: the local database may also hold users from E2E runs.
select is(
  (select count(*)::int from public.profiles
    where user_id in ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000b')),
  2,
  'sign-up creates an empty profile for each user'
);

-- Data of user B, created with admin rights.
insert into public.task_progress (user_id, task_id, status)
  values ('00000000-0000-0000-0000-00000000000b', 'list-skills', 'in_progress');
insert into public.calculator_results (user_id, calculator, inputs, result)
  values ('00000000-0000-0000-0000-00000000000b', 'hourly-rate', '{}', 85);

-- ---------------------------------------------------------------------------
-- Act as user A
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000a", "role": "authenticated"}';

select results_eq(
  'select user_id from public.profiles',
  $$values ('00000000-0000-0000-0000-00000000000a'::uuid)$$,
  'a user sees only their own profile'
);

select is(
  (select count(*)::int from public.task_progress),
  0,
  'a user does not see task progress of others'
);

select is(
  (select count(*)::int from public.calculator_results),
  0,
  'a user does not see calculator results of others'
);

update public.profiles set name = 'Anna' where user_id = '00000000-0000-0000-0000-00000000000a';
select is(
  (select name from public.profiles),
  'Anna',
  'a user can update their own profile'
);

update public.profiles set name = 'Hacked' where user_id = '00000000-0000-0000-0000-00000000000b';

select lives_ok(
  $$insert into public.task_progress (user_id, task_id, status, started_at)
    values ('00000000-0000-0000-0000-00000000000a', 'list-skills', 'in_progress', now())$$,
  'a user can save their own task progress'
);

select throws_ok(
  $$insert into public.task_progress (user_id, task_id, status)
    values ('00000000-0000-0000-0000-00000000000b', 'rate-skills', 'todo')$$,
  '42501',
  null,
  'a user cannot save task progress for someone else'
);

select lives_ok(
  $$update public.task_progress set status = 'completed', completed_at = now()
    where task_id = 'list-skills'$$,
  'a user can complete their own task'
);

select throws_ok(
  $$update public.task_progress set user_id = '00000000-0000-0000-0000-00000000000b'
    where task_id = 'list-skills'$$,
  '42501',
  null,
  'a user cannot move their progress to someone else'
);

select throws_ok(
  $$insert into public.profiles (user_id) values ('00000000-0000-0000-0000-00000000000c')$$,
  '42501',
  null,
  'a user cannot create profiles'
);

-- ---------------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------------

select throws_ok(
  $$update public.task_progress set status = 'completed', completed_at = null
    where task_id = 'list-skills'$$,
  '23514',
  null,
  'a completed task needs completed_at'
);

select throws_ok(
  $$update public.task_progress set status = 'done' where task_id = 'list-skills'$$,
  '23514',
  null,
  'status must be todo, in_progress or completed'
);

select throws_ok(
  $$update public.profiles set goal = 'get-rich'
    where user_id = '00000000-0000-0000-0000-00000000000a'$$,
  '23514',
  null,
  'goal must be one of the known goals'
);

select throws_ok(
  $$insert into public.task_progress (user_id, task_id, status)
    values ('00000000-0000-0000-0000-00000000000a', 'Not An ID', 'todo')$$,
  '23514',
  null,
  'task IDs must be kebab-case'
);

-- ---------------------------------------------------------------------------
-- Logged-out visitors
-- ---------------------------------------------------------------------------
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';

select throws_ok(
  'select * from public.profiles',
  '42501',
  null,
  'logged-out visitors cannot read profiles'
);

-- ---------------------------------------------------------------------------
-- Back to admin rights: check the effects and deletion
-- ---------------------------------------------------------------------------
reset role;

select is(
  (select name from public.profiles where user_id = '00000000-0000-0000-0000-00000000000b'),
  null,
  'a user cannot update someone else''s profile'
);

delete from auth.users where id = '00000000-0000-0000-0000-00000000000b';

select is(
  (select count(*)::int from public.profiles where user_id = '00000000-0000-0000-0000-00000000000b'),
  0,
  'deleting a user deletes their profile'
);

select is(
  (select count(*)::int from public.task_progress where user_id = '00000000-0000-0000-0000-00000000000b')
  + (select count(*)::int from public.calculator_results where user_id = '00000000-0000-0000-0000-00000000000b'),
  0,
  'deleting a user deletes their progress and calculator results'
);

select * from finish();
rollback;
