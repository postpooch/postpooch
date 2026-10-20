-- Durable newsletter delivery state and atomic worker operations.
-- Safe to run more than once; existing newsletter data is preserved.

begin;

-- Fail atomically before making any schema or data changes when a database
-- contains legacy duplicates that require an explicit customer-data decision.
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_roles
    where rolname = 'postpooch_worker'
      and rolcanlogin
      and not rolsuper
      and not rolcreatedb
      and not rolcreaterole
  ) then
    raise exception 'Required postpooch_worker login role is missing or has unsafe elevated attributes';
  end if;
  if exists (
    select 1
    from public.newsletter_sends
    where newsletter_campaign_id is not null and crm_contact_id is not null
    group by newsletter_campaign_id, crm_contact_id
    having count(*) > 1
  ) then
    raise exception 'Cannot add newsletter_sends campaign/contact uniqueness: duplicate legacy rows require manual review';
  end if;
  if exists (
    select 1
    from public.newsletter_campaigns
    where newsletter_email_id is not null
    group by newsletter_email_id
    having count(*) > 1
  ) then
    raise exception 'Cannot add newsletter campaign/email uniqueness: duplicate legacy rows require manual review';
  end if;
  if exists (
    select 1
    from public.newsletter_campaign_audience_connections
    where newsletter_campaign_id is not null and newsletter_audience_id is not null
    group by newsletter_campaign_id, newsletter_audience_id
    having count(*) > 1
  ) then
    raise exception 'Cannot add campaign/audience uniqueness: duplicate legacy rows require manual review';
  end if;
  if exists (
    select 1
    from public.newsletter_audience_contact_connections
    where newsletter_audience_id is not null and crm_contact_id is not null
    group by newsletter_audience_id, crm_contact_id
    having count(*) > 1
  ) then
    raise exception 'Cannot add audience/contact uniqueness: duplicate legacy rows require manual review';
  end if;
end $$;

alter table public.crm_contacts
  add column if not exists email_marketing_status text not null default 'unknown',
  add column if not exists email_marketing_status_changed_at timestamptz;

alter table public.crm_contacts
  alter column email_marketing_status set default 'unknown',
  drop constraint if exists crm_contacts_email_marketing_status_check;

alter table public.crm_contacts
  add constraint crm_contacts_email_marketing_status_check
  check (email_marketing_status in ('unknown', 'subscribed', 'unsubscribed', 'suppressed', 'invalid'))
  not valid;

alter table public.newsletter_audiences
  add column if not exists name text;

update public.newsletter_audiences
set name = 'Audience'
where name is null or btrim(name) = '';

alter table public.newsletter_audiences
  alter column name set default 'Audience',
  alter column name set not null;

alter table public.newsletter_campaigns
  add column if not exists from_email text,
  add column if not exists status text not null default 'draft',
  add column if not exists dispatch_status text not null default 'not_queued',
  add column if not exists recipient_preparation_status text not null default 'not_started',
  add column if not exists recipient_preparation_started_at timestamptz,
  add column if not exists recipient_prepared_at timestamptz,
  add column if not exists dispatch_queued_at timestamptz,
  add column if not exists fanout_completed_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists cancelled_at timestamptz,
  add column if not exists last_error text,
  add column if not exists sqs_message_id text,
  add column if not exists total_send_count integer not null default 0,
  add column if not exists terminal_send_count integer not null default 0,
  add column if not exists sent_count integer not null default 0,
  add column if not exists failed_count integer not null default 0,
  add column if not exists suppressed_count integer not null default 0,
  add column if not exists cancelled_count integer not null default 0,
  add column if not exists uncertain_count integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_campaigns_status_check'
  ) then
    alter table public.newsletter_campaigns
      add constraint newsletter_campaigns_status_check
      check (status in ('draft', 'preparing', 'queued', 'dispatching', 'sending', 'completed', 'cancelled', 'failed'))
      not valid;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_campaigns_dispatch_status_check'
  ) then
    alter table public.newsletter_campaigns
      add constraint newsletter_campaigns_dispatch_status_check
      check (dispatch_status in ('not_queued', 'queued', 'queue_failed', 'fanout_complete'))
      not valid;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_campaigns_preparation_status_check'
  ) then
    alter table public.newsletter_campaigns
      add constraint newsletter_campaigns_preparation_status_check
      check (recipient_preparation_status in ('not_started', 'preparing', 'prepared', 'failed'))
      not valid;
  end if;
end $$;

alter table public.newsletter_sends
  add column if not exists queued_at timestamptz,
  add column if not exists processing_started_at timestamptz,
  add column if not exists processing_lease_expires_at timestamptz,
  add column if not exists processing_claim_token uuid,
  add column if not exists ses_request_started_at timestamptz,
  add column if not exists sent_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_error text,
  add column if not exists ses_message_id text,
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

update public.newsletter_sends
set status = 'pending'
where status is null;

alter table public.newsletter_sends
  alter column status set default 'pending',
  alter column status set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_sends_status_check'
  ) then
    alter table public.newsletter_sends
      add constraint newsletter_sends_status_check
      check (status in ('pending', 'sending', 'sent', 'failed', 'cancelled', 'suppressed', 'uncertain'))
      not valid;
  end if;
end $$;

create unique index if not exists newsletter_sends_campaign_contact_uidx
  on public.newsletter_sends (newsletter_campaign_id, crm_contact_id)
  where newsletter_campaign_id is not null and crm_contact_id is not null;

create unique index if not exists newsletter_campaigns_email_uidx
  on public.newsletter_campaigns (newsletter_email_id)
  where newsletter_email_id is not null;

create unique index if not exists newsletter_sends_unsubscribe_token_uidx
  on public.newsletter_sends (unsubscribe_token);

create index if not exists newsletter_sends_campaign_cursor_idx
  on public.newsletter_sends (newsletter_campaign_id, created_at, id);

create index if not exists newsletter_sends_claim_idx
  on public.newsletter_sends (status, processing_lease_expires_at);

create unique index if not exists newsletter_campaign_audience_uidx
  on public.newsletter_campaign_audience_connections (newsletter_campaign_id, newsletter_audience_id)
  where newsletter_campaign_id is not null and newsletter_audience_id is not null;

create unique index if not exists newsletter_audience_contact_uidx
  on public.newsletter_audience_contact_connections (newsletter_audience_id, crm_contact_id)
  where newsletter_audience_id is not null and crm_contact_id is not null;

create index if not exists newsletter_audience_contacts_audience_idx
  on public.newsletter_audience_contact_connections (newsletter_audience_id, crm_contact_id);

create or replace function public.newsletter_prepare_campaign(p_campaign_id uuid)
returns table (prepared boolean, send_count integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_campaign public.newsletter_campaigns%rowtype;
  v_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_campaign_id::text, 0));

  select * into v_campaign
  from public.newsletter_campaigns
  where id = p_campaign_id
  for update;

  if not found then
    raise exception 'newsletter campaign not found';
  end if;
  if v_campaign.status = 'cancelled' then
    raise exception 'newsletter campaign is cancelled';
  end if;
  if v_campaign.recipient_preparation_status = 'prepared' then
    return query select true, v_campaign.total_send_count;
    return;
  end if;

  update public.newsletter_campaigns
  set recipient_preparation_status = 'preparing',
      recipient_preparation_started_at = coalesce(recipient_preparation_started_at, now()),
      status = 'preparing',
      last_error = null
  where id = p_campaign_id;

  insert into public.newsletter_sends (
    newsletter_campaign_id,
    crm_contact_id,
    email_address,
    status
  )
  select distinct on (lower(btrim(c.email)))
    p_campaign_id,
    c.id,
    btrim(c.email),
    'pending'
  from public.newsletter_campaign_audience_connections cac
  join public.newsletter_audiences a
    on a.id = cac.newsletter_audience_id
   and a.profile_id = v_campaign.profile_id
  join public.newsletter_audience_contact_connections acc
    on acc.newsletter_audience_id = a.id
  join public.crm_contacts c
    on c.id = acc.crm_contact_id
   and c.profile_id = v_campaign.profile_id
  where cac.newsletter_campaign_id = p_campaign_id
    and c.email is not null
    and btrim(c.email) <> ''
    and c.email_marketing_status = 'subscribed'
  order by lower(btrim(c.email)), c.id
  on conflict do nothing;

  select count(*)::integer into v_count
  from public.newsletter_sends
  where newsletter_campaign_id = p_campaign_id;

  update public.newsletter_campaigns
  set recipient_preparation_status = 'prepared',
      recipient_prepared_at = now(),
      total_send_count = v_count,
      status = case when v_count = 0 then 'completed' else 'dispatching' end,
      completed_at = case when v_count = 0 then now() else completed_at end
  where id = p_campaign_id;

  return query select true, v_count;
end;
$$;

create or replace function public.newsletter_claim_sends(
  p_items jsonb,
  p_claim_token uuid,
  p_lease_seconds integer default 300
)
returns table (
  disposition text,
  send_id uuid,
  campaign_id uuid,
  email_address text,
  subject_line text,
  preview_text text,
  from_name text,
  from_email text,
  email_content jsonb,
  unsubscribe_token uuid,
  attempt_count integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_send public.newsletter_sends%rowtype;
  v_campaign record;
  v_contact_status text;
begin
  if jsonb_typeof(p_items) <> 'array' then
    raise exception 'p_items must be a JSON array';
  end if;
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'lease seconds out of range';
  end if;

  -- Deterministic lock ordering avoids deadlocks when duplicate SQS deliveries
  -- put overlapping sends into two concurrent Lambda batches.
  for v_item in
    select value
    from jsonb_array_elements(p_items)
    order by value->>'campaignId', value->>'newsletterSendId'
  loop
    disposition := null;
    send_id := (v_item->>'newsletterSendId')::uuid;
    campaign_id := (v_item->>'campaignId')::uuid;
    email_address := null;
    subject_line := null;
    preview_text := null;
    from_name := null;
    from_email := null;
    email_content := null;
    unsubscribe_token := null;
    attempt_count := null;

    select * into v_send
    from public.newsletter_sends s
    where s.id = send_id
    for update;

    if not found then
      disposition := 'not_found';
      return next;
      continue;
    end if;
    if v_send.newsletter_campaign_id is distinct from campaign_id then
      disposition := 'campaign_mismatch';
      return next;
      continue;
    end if;
    if v_send.status in ('sent', 'failed', 'cancelled', 'suppressed', 'uncertain') then
      disposition := 'terminal';
      return next;
      continue;
    end if;

    select c.*, e.content as email_content
      into v_campaign
    from public.newsletter_campaigns c
    join public.newsletter_emails e on e.id = c.newsletter_email_id
    where c.id = campaign_id;

    if not found then
      disposition := 'not_found';
      return next;
      continue;
    end if;

    if v_campaign.status in ('cancelled', 'failed') then
      update public.newsletter_sends
      set status = 'cancelled', failed_at = now(), last_error = 'Campaign cancelled before send'
      where id = send_id;
      update public.newsletter_campaigns
      set terminal_send_count = terminal_send_count + 1,
          cancelled_count = cancelled_count + 1
      where id = campaign_id;
      disposition := 'terminal';
      return next;
      continue;
    end if;

    select c.email_marketing_status into v_contact_status
    from public.crm_contacts c
    where c.id = v_send.crm_contact_id
      and c.profile_id = v_campaign.profile_id;

    if v_contact_status is distinct from 'subscribed' then
      update public.newsletter_sends
      set status = 'suppressed', failed_at = now(), last_error = 'Recipient is not eligible for marketing email'
      where id = send_id;
      update public.newsletter_campaigns
      set terminal_send_count = terminal_send_count + 1,
          suppressed_count = suppressed_count + 1
      where id = campaign_id;
      update public.newsletter_campaigns
      set status = 'completed', completed_at = coalesce(completed_at, now())
      where id = campaign_id
        and status <> 'cancelled'
        and total_send_count > 0
        and terminal_send_count >= total_send_count;
      disposition := 'terminal';
      return next;
      continue;
    end if;

    if v_send.status = 'sending' and v_send.processing_lease_expires_at > now() then
      disposition := 'busy';
      return next;
      continue;
    end if;

    if v_send.status = 'sending'
       and v_send.processing_lease_expires_at <= now()
       and v_send.ses_request_started_at is not null then
      update public.newsletter_sends
      set status = 'uncertain',
          failed_at = now(),
          last_error = 'SES request may have been accepted before the worker stopped; manual review required',
          processing_claim_token = null,
          processing_lease_expires_at = null
      where id = send_id;
      update public.newsletter_campaigns
      set terminal_send_count = terminal_send_count + 1,
          uncertain_count = uncertain_count + 1
      where id = campaign_id;
      update public.newsletter_campaigns
      set status = 'completed', completed_at = coalesce(completed_at, now())
      where id = campaign_id
        and status <> 'cancelled'
        and total_send_count > 0
        and terminal_send_count >= total_send_count;
      disposition := 'terminal';
      return next;
      continue;
    end if;

    update public.newsletter_sends
    set status = 'sending',
        processing_started_at = now(),
        processing_lease_expires_at = now() + make_interval(secs => p_lease_seconds),
        processing_claim_token = p_claim_token,
        ses_request_started_at = null,
        last_attempt_at = now(),
        attempt_count = newsletter_sends.attempt_count + 1,
        last_error = null
    where id = send_id
    returning newsletter_sends.* into v_send;

    update public.newsletter_campaigns
    set status = case when status in ('queued', 'dispatching') then 'sending' else status end
    where id = campaign_id;

    disposition := 'claimed';
    email_address := v_send.email_address;
    subject_line := v_campaign.subject_line;
    preview_text := v_campaign.preview_text;
    from_name := v_campaign.from_name;
    from_email := v_campaign.from_email;
    email_content := v_campaign.email_content;
    unsubscribe_token := v_send.unsubscribe_token;
    attempt_count := v_send.attempt_count;
    return next;
  end loop;
end;
$$;

create or replace function public.newsletter_mark_ses_request_started(
  p_send_id uuid,
  p_claim_token uuid
)
returns boolean
language sql
security definer
set search_path = ''
as $$
  update public.newsletter_sends
  set ses_request_started_at = now()
  where id = p_send_id
    and status = 'sending'
    and processing_claim_token = p_claim_token
    and processing_lease_expires_at > now()
  returning true;
$$;

create or replace function public.newsletter_complete_sends(
  p_results jsonb,
  p_claim_token uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
  v_send public.newsletter_sends%rowtype;
  v_outcome text;
  v_error text;
begin
  if jsonb_typeof(p_results) <> 'array' then
    raise exception 'p_results must be a JSON array';
  end if;

  for v_result in select value from jsonb_array_elements(p_results)
  loop
    select * into v_send
    from public.newsletter_sends
    where id = (v_result->>'newsletterSendId')::uuid
      and status = 'sending'
      and processing_claim_token = p_claim_token
    for update;

    if not found then
      continue;
    end if;

    v_outcome := v_result->>'outcome';
    v_error := left(coalesce(v_result->>'error', ''), 2000);

    if v_outcome = 'sent' then
      update public.newsletter_sends
      set status = 'sent',
          sent_at = now(),
          ses_message_id = left(v_result->>'sesMessageId', 255),
          last_error = null,
          processing_claim_token = null,
          processing_lease_expires_at = null
      where id = v_send.id;
      update public.newsletter_campaigns
      set terminal_send_count = terminal_send_count + 1,
          sent_count = sent_count + 1
      where id = v_send.newsletter_campaign_id;
    elsif v_outcome = 'retry' then
      update public.newsletter_sends
      set status = 'pending',
          last_error = v_error,
          ses_request_started_at = null,
          processing_claim_token = null,
          processing_lease_expires_at = null
      where id = v_send.id;
    elsif v_outcome = 'uncertain' then
      update public.newsletter_sends
      set status = 'uncertain',
          failed_at = now(),
          last_error = v_error,
          processing_claim_token = null,
          processing_lease_expires_at = null
      where id = v_send.id;
      update public.newsletter_campaigns
      set terminal_send_count = terminal_send_count + 1,
          uncertain_count = uncertain_count + 1
      where id = v_send.newsletter_campaign_id;
    else
      update public.newsletter_sends
      set status = 'failed',
          failed_at = now(),
          last_error = v_error,
          ses_request_started_at = null,
          processing_claim_token = null,
          processing_lease_expires_at = null
      where id = v_send.id;
      update public.newsletter_campaigns
      set terminal_send_count = terminal_send_count + 1,
          failed_count = failed_count + 1
      where id = v_send.newsletter_campaign_id;
    end if;

    update public.newsletter_campaigns
    set status = 'completed', completed_at = coalesce(completed_at, now())
    where id = v_send.newsletter_campaign_id
      and status <> 'cancelled'
      and total_send_count > 0
      and terminal_send_count >= total_send_count;
  end loop;
end;
$$;

revoke all on function public.newsletter_prepare_campaign(uuid) from public, anon, authenticated;
revoke all on function public.newsletter_claim_sends(jsonb, uuid, integer) from public, anon, authenticated;
revoke all on function public.newsletter_mark_ses_request_started(uuid, uuid) from public, anon, authenticated;
revoke all on function public.newsletter_complete_sends(jsonb, uuid) from public, anon, authenticated;

-- Lambda uses the repository's existing transaction-pooler worker role instead
-- of a superuser connection. Lambda #1 gets only the columns needed for page
-- reads and fan-out progress. Recipient claims/finalization remain behind the
-- security-definer functions below.
revoke all privileges on table public.newsletter_campaigns from postpooch_worker;
revoke all privileges on table public.newsletter_sends from postpooch_worker;

grant select (
  id,
  recipient_preparation_status,
  status,
  total_send_count,
  fanout_completed_at,
  completed_at
) on table public.newsletter_campaigns to postpooch_worker;

grant update (
  dispatch_status,
  fanout_completed_at,
  status,
  completed_at
) on table public.newsletter_campaigns to postpooch_worker;

grant select (
  id,
  newsletter_campaign_id,
  created_at,
  queued_at
) on table public.newsletter_sends to postpooch_worker;

grant update (queued_at)
  on table public.newsletter_sends to postpooch_worker;
grant execute on function public.newsletter_prepare_campaign(uuid) to postpooch_worker;
grant execute on function public.newsletter_claim_sends(jsonb, uuid, integer) to postpooch_worker;
grant execute on function public.newsletter_mark_ses_request_started(uuid, uuid) to postpooch_worker;
grant execute on function public.newsletter_complete_sends(jsonb, uuid) to postpooch_worker;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'newsletter_campaigns'
      and policyname = 'postpooch_worker_select_newsletter_campaigns'
  ) then
    create policy postpooch_worker_select_newsletter_campaigns
      on public.newsletter_campaigns for select
      to postpooch_worker using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'newsletter_campaigns'
      and policyname = 'postpooch_worker_update_newsletter_campaigns'
  ) then
    create policy postpooch_worker_update_newsletter_campaigns
      on public.newsletter_campaigns for update
      to postpooch_worker using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'newsletter_sends'
      and policyname = 'postpooch_worker_select_newsletter_sends'
  ) then
    create policy postpooch_worker_select_newsletter_sends
      on public.newsletter_sends for select
      to postpooch_worker using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'newsletter_sends'
      and policyname = 'postpooch_worker_update_newsletter_sends'
  ) then
    create policy postpooch_worker_update_newsletter_sends
      on public.newsletter_sends for update
      to postpooch_worker using (true) with check (true);
  end if;
end $$;

commit;
