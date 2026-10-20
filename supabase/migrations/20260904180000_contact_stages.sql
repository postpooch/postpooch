-- Move pipeline stage from deals onto contacts (Follow Up Boss–style).
-- Renames crm_pipeline_stages → crm_contact_stages and drops stage from transactions.

-- 1) Rename stages table (no-op if already renamed)
do $$
begin
  if to_regclass('public.crm_pipeline_stages') is not null
     and to_regclass('public.crm_contact_stages') is null then
    alter table public.crm_pipeline_stages rename to crm_contact_stages;
  end if;
end $$;

-- 2) Add stage to contacts
alter table public.crm_contacts
  add column if not exists stage_id uuid;

alter table public.crm_contacts
  drop constraint if exists crm_contacts_stage_id_fkey;

alter table public.crm_contacts
  add constraint crm_contacts_stage_id_fkey
  foreign key (stage_id) references public.crm_contact_stages(id)
  on update cascade on delete set null;

create index if not exists crm_contacts_profile_stage_idx
  on public.crm_contacts (profile_id, stage_id);

-- 3) Best-effort backfill from each contact's most recent deal stage (while column still exists)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'crm_transactions'
      and column_name = 'stage_id'
  ) then
    update public.crm_contacts c
    set stage_id = latest.stage_id
    from (
      select distinct on (t.profile_id, t.contact_id)
        t.profile_id,
        t.contact_id,
        t.stage_id
      from public.crm_transactions t
      where t.contact_id is not null
        and t.stage_id is not null
      order by t.profile_id, t.contact_id, (t.status = 'active') desc, t.updated_at desc
    ) latest
    where c.profile_id = latest.profile_id
      and c.id = latest.contact_id
      and c.stage_id is null;
  end if;
end $$;

-- 4) Drop stage from transactions (pipeline board removed)
drop index if exists public.crm_transactions_profile_stage_idx;

alter table public.crm_transactions
  drop constraint if exists crm_transactions_stage_id_fkey;
alter table public.crm_transactions
  drop constraint if exists crm_transactions_stage_id_profile_id_fkey;

alter table public.crm_transactions
  drop column if exists stage_id;

-- 5) Keep updated_at trigger on renamed table
drop trigger if exists set_crm_pipeline_stages_updated_at on public.crm_contact_stages;
drop trigger if exists set_crm_contact_stages_updated_at on public.crm_contact_stages;
create trigger set_crm_contact_stages_updated_at
  before update on public.crm_contact_stages
  for each row execute function set_crm_updated_at();

-- 6) RLS: read shared + own; write only own customs
drop policy if exists crm_pipeline_stages_select on public.crm_contact_stages;
drop policy if exists crm_pipeline_stages_insert on public.crm_contact_stages;
drop policy if exists crm_pipeline_stages_update on public.crm_contact_stages;
drop policy if exists crm_pipeline_stages_delete on public.crm_contact_stages;
drop policy if exists crm_contact_stages_select on public.crm_contact_stages;
drop policy if exists crm_contact_stages_insert on public.crm_contact_stages;
drop policy if exists crm_contact_stages_update on public.crm_contact_stages;
drop policy if exists crm_contact_stages_delete on public.crm_contact_stages;

create policy crm_contact_stages_select on public.crm_contact_stages
  for select to authenticated
  using (profile_id is null or profile_id = (select auth.uid()));

create policy crm_contact_stages_insert on public.crm_contact_stages
  for insert to authenticated
  with check (profile_id = (select auth.uid()));

create policy crm_contact_stages_update on public.crm_contact_stages
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy crm_contact_stages_delete on public.crm_contact_stages
  for delete to authenticated
  using (profile_id = (select auth.uid()));
