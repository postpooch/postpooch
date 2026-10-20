-- Harden crm_deals / crm_deal_stages for the Deals Kanban board.
-- Seeds default Buyer + Seller stages on new profiles (and backfills existing ones).

-- 1) client_type enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'client_type') then
    create type public.client_type as enum ('buyer', 'seller');
  end if;
end $$;

-- 2) Deal stages: ordering + non-null basics
update public.crm_deal_stages
set
  name = coalesce(nullif(trim(name), ''), 'Untitled stage'),
  color = coalesce(nullif(trim(color), ''), '#256f68'),
  client_type = coalesce(client_type, 'buyer')
where name is null or trim(name) = '' or color is null or trim(color) = '' or client_type is null;

delete from public.crm_deal_stages where profile_id is null;

alter table public.crm_deal_stages
  alter column profile_id drop default,
  alter column profile_id set not null,
  alter column name set not null,
  alter column client_type set not null,
  alter column color set default '#256f68',
  alter column color set not null;

alter table public.crm_deal_stages
  add column if not exists position smallint not null default 0,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'crm_deal_stages_position_check'
  ) then
    alter table public.crm_deal_stages
      add constraint crm_deal_stages_position_check check (position >= 0);
  end if;
end $$;

create unique index if not exists crm_deal_stages_user_name_key
  on public.crm_deal_stages (profile_id, client_type, name);

create index if not exists crm_deal_stages_profile_client_idx
  on public.crm_deal_stages (profile_id, client_type, position);

drop trigger if exists set_crm_deal_stages_updated_at on public.crm_deal_stages;
create trigger set_crm_deal_stages_updated_at
  before update on public.crm_deal_stages
  for each row execute function public.set_crm_updated_at();

-- 3) Deals: title, normalize price, card order, updated_at
alter table public.crm_deals
  add column if not exists name text,
  add column if not exists position integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

update public.crm_deals
set name = coalesce(nullif(trim(name), ''), nullif(trim(description), ''), 'Untitled deal')
where name is null or trim(name) = '';

-- Drop orphaned rows that cannot satisfy NOT NULL profile/client_type
delete from public.crm_deals where profile_id is null or client_type is null;

alter table public.crm_deals
  alter column name set not null,
  alter column client_type set not null,
  alter column profile_id set not null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'crm_deals' and column_name = 'Price'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'crm_deals' and column_name = 'price'
  ) then
    alter table public.crm_deals rename column "Price" to price;
  end if;
end $$;

alter table public.crm_deals
  add column if not exists price bigint;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'crm_deals_position_check'
  ) then
    alter table public.crm_deals
      add constraint crm_deals_position_check check (position >= 0);
  end if;
end $$;

-- Safer stage deletes: block removing a stage that still has deals
alter table public.crm_deals
  drop constraint if exists crm_deals_crm_deal_stage_id_fkey;

alter table public.crm_deals
  add constraint crm_deals_crm_deal_stage_id_fkey
  foreign key (crm_deal_stage_id) references public.crm_deal_stages(id)
  on update cascade on delete restrict;

create index if not exists crm_deals_profile_stage_idx
  on public.crm_deals (profile_id, crm_deal_stage_id, position);

create index if not exists crm_deals_profile_client_idx
  on public.crm_deals (profile_id, client_type);

drop trigger if exists set_crm_deals_updated_at on public.crm_deals;
create trigger set_crm_deals_updated_at
  before update on public.crm_deals
  for each row execute function public.set_crm_updated_at();

-- 4) Connection tables: required FKs + uniqueness
alter table public.crm_deal_and_contact_connections
  alter column crm_deal_id drop default,
  alter column crm_contact_id drop default;

delete from public.crm_deal_and_contact_connections
where crm_deal_id is null or crm_contact_id is null;

delete from public.crm_deal_and_contact_connections a
using public.crm_deal_and_contact_connections b
where a.id > b.id
  and a.crm_deal_id = b.crm_deal_id
  and a.crm_contact_id = b.crm_contact_id;

alter table public.crm_deal_and_contact_connections
  alter column crm_deal_id set not null,
  alter column crm_contact_id set not null;

create unique index if not exists crm_deal_contact_unique
  on public.crm_deal_and_contact_connections (crm_deal_id, crm_contact_id);

delete from public.crm_deal_and_partners_connections
where crm_deal_id is null or crm_partner_id is null;

delete from public.crm_deal_and_partners_connections a
using public.crm_deal_and_partners_connections b
where a.id > b.id
  and a.crm_deal_id = b.crm_deal_id
  and a.crm_partner_id = b.crm_partner_id;

alter table public.crm_deal_and_partners_connections
  alter column crm_deal_id set not null,
  alter column crm_partner_id set not null;

create unique index if not exists crm_deal_partner_unique
  on public.crm_deal_and_partners_connections (crm_deal_id, crm_partner_id);

-- 5) Seed default Buyer / Seller stages for each profile
create or replace function public.seed_crm_deal_stages(target_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_deal_stages (profile_id, name, client_type, color, position)
  values
    (target_profile_id, 'Buyer Contract', 'buyer', '#ea580c', 0),
    (target_profile_id, 'Offer', 'buyer', '#1961ed', 1),
    (target_profile_id, 'Pending', 'buyer', '#ca8a04', 2),
    (target_profile_id, 'Closed', 'buyer', '#16a34a', 3),
    (target_profile_id, 'Listed', 'seller', '#ea580c', 0),
    (target_profile_id, 'Offer', 'seller', '#1961ed', 1),
    (target_profile_id, 'Pending', 'seller', '#ca8a04', 2),
    (target_profile_id, 'Closed', 'seller', '#16a34a', 3)
  on conflict (profile_id, client_type, name) do nothing;
end;
$$;

create or replace function public.seed_crm_deal_stages_for_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.seed_crm_deal_stages(new.id);
  return new;
end;
$$;

drop trigger if exists seed_crm_deal_stages_after_profile_insert on public.profiles;
create trigger seed_crm_deal_stages_after_profile_insert
  after insert on public.profiles
  for each row execute function public.seed_crm_deal_stages_for_new_profile();

select public.seed_crm_deal_stages(id) from public.profiles;

-- 6) RLS policies (RLS already enabled; policies were missing)
drop policy if exists crm_deal_stages_owner_all on public.crm_deal_stages;
create policy crm_deal_stages_owner_all on public.crm_deal_stages
  for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

drop policy if exists crm_deals_owner_all on public.crm_deals;
create policy crm_deals_owner_all on public.crm_deals
  for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

drop policy if exists crm_deal_contact_connections_owner_all on public.crm_deal_and_contact_connections;
create policy crm_deal_contact_connections_owner_all on public.crm_deal_and_contact_connections
  for all to authenticated
  using (
    exists (
      select 1 from public.crm_deals d
      where d.id = crm_deal_id and d.profile_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.crm_deals d
      where d.id = crm_deal_id and d.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_contacts c
      where c.id = crm_contact_id and c.profile_id = (select auth.uid())
    )
  );

drop policy if exists crm_deal_partner_connections_owner_all on public.crm_deal_and_partners_connections;
create policy crm_deal_partner_connections_owner_all on public.crm_deal_and_partners_connections
  for all to authenticated
  using (
    exists (
      select 1 from public.crm_deals d
      where d.id = crm_deal_id and d.profile_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.crm_deals d
      where d.id = crm_deal_id and d.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_partners p
      where p.id = crm_partner_id and p.profile_id = (select auth.uid())
    )
  );
