-- Tests for the events table (Phase 11). Run with: npm run db:test
begin;
select plan(10);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'events-a@example.test'),
  ('00000000-0000-0000-0000-0000000000e2', 'events-b@example.test');

-- An event of user B, created with admin rights.
insert into public.events (user_id, name, properties)
  values ('00000000-0000-0000-0000-0000000000e2', 'task_started', '{"taskId": "list-skills"}');

-- ---------------------------------------------------------------------------
-- Logged-out visitors
-- ---------------------------------------------------------------------------
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';

select throws_ok(
  $$insert into public.events (user_id, name)
    values ('00000000-0000-0000-0000-0000000000e1', 'template_copied')$$,
  '42501',
  null,
  'logged-out visitors cannot record events'
);

-- ---------------------------------------------------------------------------
-- Act as user A
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';

select lives_ok(
  $$insert into public.events (user_id, name, properties)
    values ('00000000-0000-0000-0000-0000000000e1', 'template_copied', '{"templateId": "client-outreach"}')$$,
  'a user can record their own event'
);

select throws_ok(
  $$insert into public.events (user_id, name)
    values ('00000000-0000-0000-0000-0000000000e2', 'template_copied')$$,
  '42501',
  null,
  'a user cannot record events for someone else'
);

select throws_ok(
  'select count(*) from public.events',
  '42501',
  null,
  'a user cannot read events, not even their own'
);

select throws_ok(
  $$update public.events set name = 'task_completed'$$,
  '42501',
  null,
  'a user cannot change events'
);

select throws_ok(
  'delete from public.events',
  '42501',
  null,
  'a user cannot delete events'
);

reset role;

-- ---------------------------------------------------------------------------
-- Constraints (as admin)
-- ---------------------------------------------------------------------------
select throws_ok(
  $$insert into public.events (user_id, name)
    values ('00000000-0000-0000-0000-0000000000e1', 'page_viewed')$$,
  '23514',
  null,
  'only the defined event names are allowed'
);

select throws_ok(
  $$insert into public.events (user_id, name, properties)
    values ('00000000-0000-0000-0000-0000000000e1', 'task_started', '[]')$$,
  '23514',
  null,
  'properties must be a JSON object'
);

-- ---------------------------------------------------------------------------
-- Account deletion removes the events
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
select public.delete_own_account();
reset role;

select is(
  (select count(*)::int from public.events where user_id = '00000000-0000-0000-0000-0000000000e1'),
  0,
  'deleting the account deletes its events'
);
select is(
  (select count(*)::int from public.events where user_id = '00000000-0000-0000-0000-0000000000e2'),
  1,
  'events of other users are not affected'
);

select * from finish();
rollback;
