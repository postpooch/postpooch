-- Shared default pipeline stages (profile_id IS NULL) + per-user custom stages.

-- 1) Drop composite FK so stages can be shared across profiles
alter table public.crm_transactions
  drop constraint if exists crm_transactions_stage_id_profile_id_fkey;

-- 2) Drop uniqueness that assumed every stage belonged to one profile
alter table public.crm_pipeline_stages
  drop constraint if exists crm_pipeline_stages_id_profile_id_key;
alter table public.crm_pipeline_stages
  drop constraint if exists crm_pipeline_stages_profile_id_name_key;
alter table public.crm_pipeline_stages
  drop constraint if exists crm_pipeline_stages_profile_id_position_key;

-- 3) Allow shared defaults
alter table public.crm_pipeline_stages
  alter column profile_id drop not null;

-- 4) Insert one shared copy of each default stage (skip if already present)
insert into public.crm_pipeline_stages (profile_id, name, color, position, is_closed, is_won)
select v.profile_id, v.name, v.color, v.position, v.is_closed, v.is_won
from (
  values
    (null::uuid, 'New Lead', '#356f8f', 0::smallint, false, false),
    (null::uuid, 'Contacted', '#c9824f', 1::smallint, false, false),
    (null::uuid, 'Qualified', '#256f68', 2::smallint, false, false),
    (null::uuid, 'Showing / Search', '#9b5c35', 3::smallint, false, false),
    (null::uuid, 'Offer / Agreement', '#6f3f26', 4::smallint, false, false),
    (null::uuid, 'Under Contract', '#b9483a', 5::smallint, false, false),
    (null::uuid, 'Closing', '#746c67', 6::smallint, false, false),
    (null::uuid, 'Closed', '#1e5a55', 7::smallint, true, true),
    (null::uuid, 'Lost', '#9b5c35', 8::smallint, true, false)
) as v(profile_id, name, color, position, is_closed, is_won)
where not exists (
  select 1 from public.crm_pipeline_stages existing
  where existing.profile_id is null and existing.name = v.name
);

-- 5) Point existing deals at the shared stage with the same name
update public.crm_transactions t
set stage_id = shared.id
from public.crm_pipeline_stages old
join public.crm_pipeline_stages shared
  on shared.profile_id is null
 and shared.name = old.name
where t.stage_id = old.id
  and old.profile_id is not null;

-- 6) Remove per-user copies of the defaults (keep true custom stages)
delete from public.crm_pipeline_stages s
where s.profile_id is not null
  and exists (
    select 1
    from public.crm_pipeline_stages shared
    where shared.profile_id is null
      and shared.name = s.name
  );

-- 7) Enforce uniqueness separately for defaults vs user customs
create unique index if not exists crm_pipeline_stages_default_name_key
  on public.crm_pipeline_stages (name)
  where profile_id is null;

create unique index if not exists crm_pipeline_stages_default_position_key
  on public.crm_pipeline_stages (position)
  where profile_id is null;

create unique index if not exists crm_pipeline_stages_user_name_key
  on public.crm_pipeline_stages (profile_id, name)
  where profile_id is not null;

create unique index if not exists crm_pipeline_stages_user_position_key
  on public.crm_pipeline_stages (profile_id, position)
  where profile_id is not null;

-- 8) Deals reference a stage by id only; app validates access (shared or owned)
alter table public.crm_transactions
  drop constraint if exists crm_transactions_stage_id_fkey;
alter table public.crm_transactions
  add constraint crm_transactions_stage_id_fkey
  foreign key (stage_id) references public.crm_pipeline_stages(id)
  on update cascade on delete restrict;

-- 9) Stop seeding defaults per new profile
drop trigger if exists seed_crm_pipeline_after_profile_insert on public.profiles;
drop function if exists public.seed_crm_pipeline_for_new_profile();
drop function if exists public.seed_crm_pipeline_stages(uuid);

-- 10) RLS: read shared + own; write only own customs
drop policy if exists crm_pipeline_stages_owner_all on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_select on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_insert on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_update on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_delete on public.crm_pipeline_stages;

create policy crm_pipeline_stages_select on public.crm_pipeline_stages
  for select to authenticated
  using (profile_id is null or profile_id = (select auth.uid()));

create policy crm_pipeline_stages_insert on public.crm_pipeline_stages
  for insert to authenticated
  with check (profile_id = (select auth.uid()));

create policy crm_pipeline_stages_update on public.crm_pipeline_stages
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy crm_pipeline_stages_delete on public.crm_pipeline_stages
  for delete to authenticated
  using (profile_id = (select auth.uid()));
