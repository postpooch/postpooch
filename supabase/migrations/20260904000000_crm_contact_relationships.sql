-- Contact relationships: shared default types + per-user custom types,
-- and directed links between two contacts owned by the same profile.

-- 1) Types table (defaults: profile_id IS NULL; customs: profile_id = owner)
create table if not exists public.crm_contacts_relationships_types (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  profile_id uuid references public.profiles(id) on update cascade on delete cascade,
  type_1 text,
  type_2 text
);

-- 2) Relationship edges between two contacts
create table if not exists public.crm_contacts_relationships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  relationship_type text,
  person_1_id uuid references public.crm_contacts(id) on update cascade on delete cascade,
  person_2_id uuid references public.crm_contacts(id) on update cascade on delete cascade,
  crm_contacts_relationship_type_id uuid references public.crm_contacts_relationships_types(id) on update cascade on delete cascade
);

-- 3) Harden nullability / self-links where safe
update public.crm_contacts_relationships_types
set type_1 = coalesce(nullif(trim(type_1), ''), 'Related')
where type_1 is null or trim(type_1) = '';

do $$
begin
  alter table public.crm_contacts_relationships_types
    alter column type_1 set not null;
exception
  when others then null;
end $$;

do $$
begin
  alter table public.crm_contacts_relationships
    alter column person_1_id set not null,
    alter column person_2_id set not null,
    alter column crm_contacts_relationship_type_id set not null;
exception
  when others then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'crm_contacts_relationships_distinct_people'
  ) then
    alter table public.crm_contacts_relationships
      add constraint crm_contacts_relationships_distinct_people
      check (person_1_id <> person_2_id);
  end if;
end $$;

-- 4) Indexes for list/detail lookups
create index if not exists crm_contacts_relationships_person_1_idx
  on public.crm_contacts_relationships (person_1_id);

create index if not exists crm_contacts_relationships_person_2_idx
  on public.crm_contacts_relationships (person_2_id);

create index if not exists crm_contacts_relationships_type_idx
  on public.crm_contacts_relationships (crm_contacts_relationship_type_id);

create index if not exists crm_contacts_relationships_types_profile_idx
  on public.crm_contacts_relationships_types (profile_id);

-- One undirected edge per type between the same ordered pair
create unique index if not exists crm_contacts_relationships_pair_type_key
  on public.crm_contacts_relationships (
    least(person_1_id, person_2_id),
    greatest(person_1_id, person_2_id),
    crm_contacts_relationship_type_id
  );

-- Unique type labels: defaults vs per-user customs
create unique index if not exists crm_contacts_relationships_types_default_key
  on public.crm_contacts_relationships_types (lower(type_1), lower(coalesce(type_2, '')))
  where profile_id is null;

create unique index if not exists crm_contacts_relationships_types_user_key
  on public.crm_contacts_relationships_types (profile_id, lower(type_1), lower(coalesce(type_2, '')))
  where profile_id is not null;

-- 5) Seed shared defaults (person_1 holds type_1, person_2 holds type_2 when present)
insert into public.crm_contacts_relationships_types (profile_id, type_1, type_2)
select v.profile_id, v.type_1, v.type_2
from (
  values
    (null::uuid, 'Parent', 'Child'),
    (null::uuid, 'Spouse', null::text),
    (null::uuid, 'Partner', null::text),
    (null::uuid, 'Sibling', null::text),
    (null::uuid, 'Relative', null::text),
    (null::uuid, 'Roommate', null::text),
    (null::uuid, 'Guarantor', 'Guaranteed'),
    (null::uuid, 'Referring Agent', 'Referred Client')
) as v(profile_id, type_1, type_2)
where not exists (
  select 1
  from public.crm_contacts_relationships_types existing
  where existing.profile_id is null
    and lower(existing.type_1) = lower(v.type_1)
    and lower(coalesce(existing.type_2, '')) = lower(coalesce(v.type_2, ''))
);

-- 6) RLS: types readable as shared+own; writable only for own customs.
--    Relationship rows are only reachable when both contacts belong to the caller.
alter table public.crm_contacts_relationships_types enable row level security;
alter table public.crm_contacts_relationships enable row level security;

drop policy if exists crm_contacts_relationships_types_select on public.crm_contacts_relationships_types;
drop policy if exists crm_contacts_relationships_types_insert on public.crm_contacts_relationships_types;
drop policy if exists crm_contacts_relationships_types_update on public.crm_contacts_relationships_types;
drop policy if exists crm_contacts_relationships_types_delete on public.crm_contacts_relationships_types;

create policy crm_contacts_relationships_types_select on public.crm_contacts_relationships_types
  for select to authenticated
  using (profile_id is null or profile_id = (select auth.uid()));

create policy crm_contacts_relationships_types_insert on public.crm_contacts_relationships_types
  for insert to authenticated
  with check (profile_id = (select auth.uid()));

create policy crm_contacts_relationships_types_update on public.crm_contacts_relationships_types
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy crm_contacts_relationships_types_delete on public.crm_contacts_relationships_types
  for delete to authenticated
  using (profile_id = (select auth.uid()));

drop policy if exists crm_contacts_relationships_select on public.crm_contacts_relationships;
drop policy if exists crm_contacts_relationships_insert on public.crm_contacts_relationships;
drop policy if exists crm_contacts_relationships_update on public.crm_contacts_relationships;
drop policy if exists crm_contacts_relationships_delete on public.crm_contacts_relationships;

create policy crm_contacts_relationships_select on public.crm_contacts_relationships
  for select to authenticated
  using (
    exists (
      select 1 from public.crm_contacts p1
      where p1.id = person_1_id and p1.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_contacts p2
      where p2.id = person_2_id and p2.profile_id = (select auth.uid())
    )
  );

create policy crm_contacts_relationships_insert on public.crm_contacts_relationships
  for insert to authenticated
  with check (
    exists (
      select 1 from public.crm_contacts p1
      where p1.id = person_1_id and p1.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_contacts p2
      where p2.id = person_2_id and p2.profile_id = (select auth.uid())
    )
  );

create policy crm_contacts_relationships_update on public.crm_contacts_relationships
  for update to authenticated
  using (
    exists (
      select 1 from public.crm_contacts p1
      where p1.id = person_1_id and p1.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_contacts p2
      where p2.id = person_2_id and p2.profile_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.crm_contacts p1
      where p1.id = person_1_id and p1.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_contacts p2
      where p2.id = person_2_id and p2.profile_id = (select auth.uid())
    )
  );

create policy crm_contacts_relationships_delete on public.crm_contacts_relationships
  for delete to authenticated
  using (
    exists (
      select 1 from public.crm_contacts p1
      where p1.id = person_1_id and p1.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.crm_contacts p2
      where p2.id = person_2_id and p2.profile_id = (select auth.uid())
    )
  );

comment on table public.crm_contacts_relationships_types is
  'Shared (profile_id null) and per-user custom relationship role pairs. type_1 is person_1; type_2 is person_2 (null = symmetric).';
comment on table public.crm_contacts_relationships is
  'Directed link between two crm_contacts. person_1 holds type_1; person_2 holds type_2 when present.';
comment on column public.crm_contacts_relationships.person_1_id is
  'Contact that holds type_1 of the relationship type (e.g. Parent).';
comment on column public.crm_contacts_relationships.person_2_id is
  'Contact that holds type_2 of the relationship type (e.g. Child), or the other spouse/partner when type_2 is null.';
