-- PL/pgSQL output-column names are variables inside the function body. Using
-- the named constraint avoids ambiguity with the schedule_id and occurrence_at
-- output columns while preserving the same atomic upsert behavior.
create or replace function public.acquire_posting_run(
  p_schedule_id uuid,
  p_occurrence_at timestamptz,
  p_trigger_run_id text,
  p_zernio_request_id uuid,
  p_lease_seconds integer default 300
)
returns table (
  id uuid,
  schedule_id uuid,
  occurrence_at timestamptz,
  trigger_run_id text,
  status text,
  template_id uuid,
  zernio_request_id uuid,
  zernio_post_id text,
  media_urls jsonb,
  acquired boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.posting_runs%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 3600 then
    raise exception 'p_lease_seconds must be between 30 and 3600';
  end if;

  insert into public.posting_runs (
    schedule_id,
    occurrence_at,
    trigger_run_id,
    zernio_request_id
  )
  values (
    p_schedule_id,
    p_occurrence_at,
    p_trigger_run_id,
    p_zernio_request_id
  )
  on conflict on constraint posting_runs_schedule_occurrence_key do nothing;

  select pr.*
  into v_run
  from public.posting_runs as pr
  where pr.schedule_id = p_schedule_id
    and pr.occurrence_at = p_occurrence_at
  for update;

  if v_run.status = 'published' then
    return query
    select
      v_run.id,
      v_run.schedule_id,
      v_run.occurrence_at,
      v_run.trigger_run_id,
      v_run.status,
      v_run.template_id,
      v_run.zernio_request_id,
      v_run.zernio_post_id,
      v_run.media_urls,
      false;
    return;
  end if;

  if v_run.status = 'processing'
    and v_run.lease_expires_at > now()
    and v_run.trigger_run_id is distinct from p_trigger_run_id
  then
    return query
    select
      v_run.id,
      v_run.schedule_id,
      v_run.occurrence_at,
      v_run.trigger_run_id,
      v_run.status,
      v_run.template_id,
      v_run.zernio_request_id,
      v_run.zernio_post_id,
      v_run.media_urls,
      false;
    return;
  end if;

  update public.posting_runs as pr
  set
    trigger_run_id = p_trigger_run_id,
    status = 'processing',
    attempt_count = pr.attempt_count + 1,
    lease_expires_at = now() + make_interval(secs => p_lease_seconds),
    updated_at = now(),
    last_error = null
  where pr.id = v_run.id
  returning pr.* into v_run;

  return query
  select
    v_run.id,
    v_run.schedule_id,
    v_run.occurrence_at,
    v_run.trigger_run_id,
    v_run.status,
    v_run.template_id,
    v_run.zernio_request_id,
    v_run.zernio_post_id,
    v_run.media_urls,
    true;
end;
$$;

revoke all on function public.acquire_posting_run(
  uuid,
  timestamptz,
  text,
  uuid,
  integer
) from public, anon, authenticated;

grant execute on function public.acquire_posting_run(
  uuid,
  timestamptz,
  text,
  uuid,
  integer
) to service_role, postpooch_worker;
