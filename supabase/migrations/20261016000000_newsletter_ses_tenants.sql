-- Per-profile SES tenants and authenticated sending identities.
-- AWS provisioning is asynchronous and idempotent; this migration only creates
-- durable desired state and safe access boundaries.

begin;

create table if not exists public.newsletter_ses_tenants (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  tenant_name text not null unique,
  ses_tenant_id text unique,
  ses_tenant_arn text unique,
  configuration_set_name text not null,
  status text not null default 'pending',
  suppression_scope text not null default 'TENANT',
  reputation_policy text not null default 'STANDARD',
  attempt_count integer not null default 0,
  last_attempt_at timestamptz,
  next_attempt_at timestamptz,
  ready_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_ses_tenants_status_check
    check (status in ('pending', 'provisioning', 'ready', 'failed')),
  constraint newsletter_ses_tenants_suppression_check
    check (suppression_scope = 'TENANT'),
  constraint newsletter_ses_tenants_reputation_check
    check (reputation_policy = 'STANDARD')
);

create table if not exists public.newsletter_sending_identities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  identity_domain text not null unique,
  from_local_part text not null,
  from_email text not null unique,
  mail_from_domain text not null unique,
  reply_to_email text not null,
  reply_to_verified_at timestamptz,
  ses_identity_arn text unique,
  verification_status text not null default 'PENDING',
  dkim_tokens text[],
  status text not null default 'pending',
  verified_at timestamptz,
  ready_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_sending_identities_status_check
    check (status in ('pending', 'provisioning', 'ready', 'failed')),
  constraint newsletter_sending_identities_domain_check
    check (identity_domain like 'mail-%.postpoochmail.com'),
  constraint newsletter_sending_identities_from_check
    check (from_email = from_local_part || '@' || identity_domain),
  constraint newsletter_sending_identities_mail_from_check
    check (mail_from_domain = 'bounce.' || identity_domain)
);

alter table public.newsletter_campaigns
  add column if not exists newsletter_sending_identity_id uuid,
  add column if not exists newsletter_ses_tenant_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'newsletter_campaigns_sending_identity_fkey'
  ) then
    alter table public.newsletter_campaigns
      add constraint newsletter_campaigns_sending_identity_fkey
      foreign key (newsletter_sending_identity_id)
      references public.newsletter_sending_identities(id);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'newsletter_campaigns_ses_tenant_fkey'
  ) then
    alter table public.newsletter_campaigns
      add constraint newsletter_campaigns_ses_tenant_fkey
      foreign key (newsletter_ses_tenant_id)
      references public.newsletter_ses_tenants(id);
  end if;
end $$;

create index if not exists newsletter_ses_tenants_retry_idx
  on public.newsletter_ses_tenants (status, next_attempt_at);

-- Existing accounts and future recovery runs get the same deterministic AWS
-- names. ON CONFLICT makes this safe to run repeatedly.
insert into public.newsletter_ses_tenants (
  profile_id,
  tenant_name,
  configuration_set_name,
  status
)
select
  profile.id,
  'pp-' || replace(profile.id::text, '-', ''),
  'my-first-configuration-set',
  'pending'
from public.profiles profile
on conflict (profile_id) do nothing;

insert into public.newsletter_sending_identities (
  profile_id,
  identity_domain,
  from_local_part,
  from_email,
  mail_from_domain,
  reply_to_email,
  reply_to_verified_at,
  status
)
select
  profile.id,
  'mail-' || replace(profile.id::text, '-', '') || '.postpoochmail.com',
  'sender-' || replace(profile.id::text, '-', ''),
  'sender-' || replace(profile.id::text, '-', '') || '@mail-' ||
    replace(profile.id::text, '-', '') || '.postpoochmail.com',
  'bounce.mail-' || replace(profile.id::text, '-', '') || '.postpoochmail.com',
  lower(auth_user.email),
  auth_user.email_confirmed_at,
  'pending'
from public.profiles profile
join auth.users auth_user on auth_user.id = profile.id
where auth_user.email is not null and btrim(auth_user.email) <> ''
on conflict (profile_id) do nothing;

alter table public.newsletter_ses_tenants enable row level security;
alter table public.newsletter_sending_identities enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'newsletter_ses_tenants'
      and policyname = 'profiles_read_own_newsletter_ses_tenant'
  ) then
    create policy profiles_read_own_newsletter_ses_tenant
      on public.newsletter_ses_tenants for select
      to authenticated using (profile_id = (select auth.uid()));
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'newsletter_sending_identities'
      and policyname = 'profiles_read_own_newsletter_sending_identity'
  ) then
    create policy profiles_read_own_newsletter_sending_identity
      on public.newsletter_sending_identities for select
      to authenticated using (profile_id = (select auth.uid()));
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'newsletter_ses_tenants'
      and policyname = 'worker_manage_newsletter_ses_tenants'
  ) then
    create policy worker_manage_newsletter_ses_tenants
      on public.newsletter_ses_tenants for all
      to postpooch_worker using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'newsletter_sending_identities'
      and policyname = 'worker_manage_newsletter_sending_identities'
  ) then
    create policy worker_manage_newsletter_sending_identities
      on public.newsletter_sending_identities for all
      to postpooch_worker using (true) with check (true);
  end if;
end $$;

revoke all privileges on table public.newsletter_ses_tenants from public, anon, authenticated, postpooch_worker;
revoke all privileges on table public.newsletter_sending_identities from public, anon, authenticated, postpooch_worker;

grant select on table public.newsletter_ses_tenants to authenticated;
grant select on table public.newsletter_sending_identities to authenticated;

grant select (
  profile_id, tenant_name, ses_tenant_id, ses_tenant_arn,
  configuration_set_name, status, attempt_count, next_attempt_at, ready_at
) on table public.newsletter_ses_tenants to postpooch_worker;

grant update (
  ses_tenant_id, ses_tenant_arn, status, suppression_scope,
  reputation_policy, attempt_count, last_attempt_at, next_attempt_at,
  ready_at, last_error, updated_at
) on table public.newsletter_ses_tenants to postpooch_worker;

grant select (
  profile_id, identity_domain, from_email, mail_from_domain,
  reply_to_email, reply_to_verified_at, ses_identity_arn,
  verification_status, dkim_tokens, status, verified_at, ready_at
) on table public.newsletter_sending_identities to postpooch_worker;

grant update (
  ses_identity_arn, verification_status, dkim_tokens, status,
  verified_at, ready_at, last_error, updated_at
) on table public.newsletter_sending_identities to postpooch_worker;

create or replace function public.newsletter_campaign_sending_context(p_campaign_ids uuid[])
returns table (
  campaign_id uuid,
  from_email text,
  reply_to_email text,
  tenant_name text,
  configuration_set_name text
)
language sql
security definer
set search_path = ''
as $$
  select
    campaign.id,
    identity.from_email,
    identity.reply_to_email,
    tenant.tenant_name,
    tenant.configuration_set_name
  from public.newsletter_campaigns campaign
  join public.newsletter_sending_identities identity
    on identity.profile_id = campaign.profile_id
   and (
     campaign.newsletter_sending_identity_id is null
     or campaign.newsletter_sending_identity_id = identity.id
   )
  join public.newsletter_ses_tenants tenant
    on tenant.profile_id = campaign.profile_id
   and (
     campaign.newsletter_ses_tenant_id is null
     or campaign.newsletter_ses_tenant_id = tenant.id
   )
  where campaign.id = any(p_campaign_ids)
    and identity.status = 'ready'
    and identity.verification_status = 'SUCCESS'
    and identity.reply_to_verified_at is not null
    and tenant.status = 'ready';
$$;

revoke all on function public.newsletter_campaign_sending_context(uuid[])
  from public, anon, authenticated;
grant execute on function public.newsletter_campaign_sending_context(uuid[])
  to postpooch_worker;

commit;
