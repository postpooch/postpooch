-- Durable execution ledger for the Trigger.dev -> Fabric -> R2 -> Zernio flow.
-- Keep schedule_id as an audit value rather than a foreign key: one-time
-- schedules are deleted after publishing, while their execution record remains.
create table if not exists public.posting_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  schedule_id uuid not null,
  occurrence_at timestamptz not null,
  trigger_run_id text,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'published', 'failed')),
  template_id uuid references public.templates (id) on update cascade on delete set null,
  zernio_request_id uuid not null,
  zernio_post_id text,
  media_urls jsonb,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  lease_expires_at timestamptz,
  published_at timestamptz,
  last_error text,
  constraint posting_runs_schedule_occurrence_key
    unique (schedule_id, occurrence_at),
  constraint posting_runs_media_urls_is_array
    check (media_urls is null or jsonb_typeof(media_urls) = 'array')
);

create index if not exists posting_runs_status_lease_idx
  on public.posting_runs (status, lease_expires_at);

create index if not exists media_schedule_id_idx
  on public.media (schedule_id);

create index if not exists media_template_id_idx
  on public.media (template_id);

-- These partial indexes also guarantee an unambiguous carousel order.
create unique index if not exists media_schedule_display_order_unique
  on public.media (schedule_id, display_order)
  where schedule_id is not null;

create unique index if not exists media_template_display_order_unique
  on public.media (template_id, display_order)
  where template_id is not null;

-- NOT VALID allows this migration to be installed before legacy rows are
-- cleaned up, while still protecting all new and updated rows.
alter table public.media
  add constraint media_display_order_positive
  check (display_order is null or display_order > 0) not valid;

alter table public.media
  add constraint media_has_exactly_one_parent
  check ((schedule_id is null) <> (template_id is null)) not valid;

alter table public.posting_runs enable row level security;
revoke all on table public.posting_runs from anon, authenticated;
grant select, insert, update, delete on table public.posting_runs to service_role;

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
  on conflict (schedule_id, occurrence_at) do nothing;

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
) to service_role;

comment on table public.posting_runs is
  'Idempotency, retry, and audit ledger for scheduled social posts.';

comment on function public.acquire_posting_run is
  'Atomically claims one scheduled occurrence with a recoverable lease.';
