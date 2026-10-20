-- Least-privilege PostgreSQL login for the Trigger.dev posting worker.
-- Set its password separately after applying this migration; secrets must not
-- be stored in migration files.
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_roles
    where rolname = 'postpooch_worker'
  ) then
    create role postpooch_worker
      login
      nosuperuser
      nocreatedb
      nocreaterole
      noinherit
      connection limit 10;
  end if;
end
$$;

grant usage on schema public to postpooch_worker;

grant select on table
  public.schedules,
  public.templates,
  public.media
to postpooch_worker;

grant delete on table public.schedules to postpooch_worker;

grant select, insert, update
  on table public.posting_runs
  to postpooch_worker;

grant execute on function public.acquire_posting_run(
  uuid,
  timestamptz,
  text,
  uuid,
  integer
) to postpooch_worker;

-- These policies are scoped to the worker role. They have no effect on anon or
-- authenticated users, and remain ready if RLS is enabled on the source tables.
create policy postpooch_worker_select_schedules
  on public.schedules
  for select
  to postpooch_worker
  using (true);

create policy postpooch_worker_delete_schedules
  on public.schedules
  for delete
  to postpooch_worker
  using (true);

create policy postpooch_worker_select_templates
  on public.templates
  for select
  to postpooch_worker
  using (true);

create policy postpooch_worker_select_media
  on public.media
  for select
  to postpooch_worker
  using (true);

create policy postpooch_worker_select_posting_runs
  on public.posting_runs
  for select
  to postpooch_worker
  using (true);

create policy postpooch_worker_insert_posting_runs
  on public.posting_runs
  for insert
  to postpooch_worker
  with check (true);

create policy postpooch_worker_update_posting_runs
  on public.posting_runs
  for update
  to postpooch_worker
  using (true)
  with check (true);

comment on role postpooch_worker is
  'Least-privilege login for the PostPooch Trigger.dev posting worker.';
