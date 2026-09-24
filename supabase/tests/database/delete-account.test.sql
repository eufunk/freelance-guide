-- Tests for delete_own_account(). Run with: npm run db:test
begin;
select plan(6);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'delete-me@example.test'),
  ('00000000-0000-0000-0000-0000000000d2', 'keep-me@example.test');

insert into public.task_progress (user_id, task_id, status, started_at)
  values ('00000000-0000-0000-0000-0000000000d1', 'list-skills', 'in_progress', now());

-- Logged-out visitors cannot call it.
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';
select throws_ok(
  'select public.delete_own_account()',
  '42501',
  null,
  'logged-out visitors cannot delete accounts'
);

-- A user deletes their own account.
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000d1", "role": "authenticated"}';
select lives_ok('select public.delete_own_account()', 'a user can delete their own account');

reset role;

select is(
  (select count(*)::int from auth.users where id = '00000000-0000-0000-0000-0000000000d1'),
  0,
  'the account is gone'
);
select is(
  (select count(*)::int from public.profiles where user_id = '00000000-0000-0000-0000-0000000000d1'),
  0,
  'the profile is gone'
);
select is(
  (select count(*)::int from public.task_progress where user_id = '00000000-0000-0000-0000-0000000000d1'),
  0,
  'the progress is gone'
);
select is(
  (select count(*)::int from auth.users where id = '00000000-0000-0000-0000-0000000000d2'),
  1,
  'other accounts are not affected'
);

select * from finish();
rollback;
