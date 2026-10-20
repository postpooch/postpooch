-- Backend-only social-media context builder storage.
-- The application runtime role was verified through getDbPool() before this migration.

do $$
begin
  if exists (select 1 from public.social_media_identities where profile_id is null) then
    raise exception 'social_media_identities contains rows without profile_id';
  end if;
  if exists (
    select profile_id from public.social_media_identities group by profile_id having count(*) > 1
  ) then
    raise exception 'social_media_identities contains duplicate profile rows';
  end if;
  if exists (
    select 1 from public.social_media_identities_cities_connections
    where identity_id is null or city_id is null
  ) then
    raise exception 'identity city connections contain null foreign keys';
  end if;
  if exists (select 1 from public.social_media_preferences)
    or exists (select 1 from public.social_media_frequency_based_instructions)
    or exists (select 1 from public.social_media_temporary_instructions) then
    raise exception 'skeletal instruction tables contain rows that cannot be safely backfilled';
  end if;
  if exists (
    select 1 from public.social_media_notes
    where profile_id is null or note is null or btrim(note) = ''
  ) then
    raise exception 'social_media_notes contains invalid legacy rows';
  end if;
end
$$;

create table public.social_media_context_states (
  profile_id uuid primary key references public.profiles (id) on update cascade on delete cascade,
  revision bigint not null default 0 check (revision >= 0),
  time_zone text not null default 'UTC' check (char_length(time_zone) between 1 and 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_media_identities
  alter column profile_id set not null,
  add column updated_at timestamptz not null default now(),
  add column display_name text,
  add column professional_title text,
  add column brokerage_name text,
  add column target_audience text,
  add column specialties text[] not null default '{}',
  add column personal_context text,
  add column primary_brand_color text,
  add column secondary_brand_color text,
  add constraint social_media_identities_profile_key unique (profile_id),
  add constraint social_media_identities_id_profile_key unique (id, profile_id),
  add constraint social_media_identities_display_name_length
    check (display_name is null or char_length(display_name) between 1 and 120),
  add constraint social_media_identities_professional_title_length
    check (professional_title is null or char_length(professional_title) between 1 and 120),
  add constraint social_media_identities_brokerage_name_length
    check (brokerage_name is null or char_length(brokerage_name) between 1 and 160),
  add constraint social_media_identities_target_audience_length
    check (target_audience is null or char_length(target_audience) between 1 and 1000),
  add constraint social_media_identities_specialties_count check (cardinality(specialties) <= 20),
  add constraint social_media_identities_personal_context_length
    check (personal_context is null or char_length(personal_context) between 1 and 2000),
  add constraint social_media_identities_primary_color_format
    check (primary_brand_color is null or primary_brand_color ~ '^#[0-9A-Fa-f]{6}$'),
  add constraint social_media_identities_secondary_color_format
    check (secondary_brand_color is null or secondary_brand_color ~ '^#[0-9A-Fa-f]{6}$');

alter table public.social_media_identities_cities_connections add column profile_id uuid;

update public.social_media_identities_cities_connections as connection
set profile_id = identity.profile_id
from public.social_media_identities as identity
where identity.id = connection.identity_id and connection.profile_id is null;

alter table public.social_media_identities_cities_connections
  alter column profile_id set not null,
  alter column identity_id set not null,
  alter column city_id set not null,
  add constraint social_media_identity_cities_profile_id_fkey
    foreign key (profile_id) references public.profiles (id) on update cascade on delete cascade,
  add constraint social_media_identity_cities_owned_identity_fkey
    foreign key (identity_id, profile_id) references public.social_media_identities (id, profile_id)
    on update cascade on delete cascade,
  add constraint social_media_identity_cities_identity_city_key unique (identity_id, city_id);

alter table public.social_media_preferences
  alter column profile_id set not null,
  add column instruction text not null,
  add column updated_at timestamptz not null default now(),
  add constraint social_media_preferences_instruction_length
    check (char_length(btrim(instruction)) between 1 and 500),
  add constraint social_media_preferences_id_profile_key unique (id, profile_id);

alter table public.social_media_frequency_based_instructions
  alter column profile_id set not null,
  add column instruction text not null,
  add column updated_at timestamptz not null default now(),
  add constraint social_media_frequency_instruction_length
    check (char_length(btrim(instruction)) between 1 and 500),
  add constraint social_media_frequency_id_profile_key unique (id, profile_id);

alter table public.social_media_notes
  alter column profile_id set not null,
  alter column note set not null,
  add column submission_key uuid,
  add constraint social_media_notes_note_length check (char_length(note) between 1 and 4000),
  add constraint social_media_notes_id_profile_key unique (id, profile_id);

update public.social_media_notes set submission_key = gen_random_uuid() where submission_key is null;

alter table public.social_media_notes
  alter column submission_key set not null,
  add constraint social_media_notes_profile_submission_key unique (profile_id, submission_key),
  drop constraint social_media_notes_profile_id_fkey,
  add constraint social_media_notes_profile_id_fkey
    foreign key (profile_id) references public.profiles (id) on update cascade on delete restrict;

alter table public.social_media_temporary_instructions
  alter column profile_id set not null,
  add column updated_at timestamptz not null default now(),
  add column instruction text not null,
  add column instruction_type text not null,
  add column remaining_posts integer,
  add column starts_at timestamptz,
  add column ends_at timestamptz,
  add column source_time_zone text not null,
  add column source_note_id uuid not null,
  add column source_note_text text not null,
  add constraint social_media_temporary_id_profile_key unique (id, profile_id),
  add constraint social_media_temporary_instruction_length
    check (char_length(btrim(instruction)) between 1 and 500),
  add constraint social_media_temporary_source_note_length
    check (char_length(source_note_text) between 1 and 4000),
  add constraint social_media_temporary_source_time_zone_length
    check (char_length(source_time_zone) between 1 and 64),
  add constraint social_media_temporary_source_note_fkey
    foreign key (source_note_id, profile_id) references public.social_media_notes (id, profile_id)
    on update cascade on delete restrict,
  add constraint social_media_temporary_shape_check check (
    (instruction_type = 'counter' and remaining_posts is not null and remaining_posts between 1 and 100
      and starts_at is null and ends_at is null)
    or
    (instruction_type = 'date_range' and remaining_posts is null and starts_at is not null
      and ends_at is not null and starts_at < ends_at)
  );

create table public.social_media_note_processing (
  note_id uuid primary key,
  profile_id uuid not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'finished')),
  attempt_count integer not null default 0 check (attempt_count between 0 and 10),
  lease_token uuid,
  lease_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_media_note_processing_note_fkey
    foreign key (note_id, profile_id) references public.social_media_notes (id, profile_id)
    on update cascade on delete cascade,
  constraint social_media_note_processing_lease_shape check (
    (status = 'processing' and lease_token is not null and lease_expires_at is not null)
    or (status <> 'processing' and lease_token is null and lease_expires_at is null)
  )
);

create table public.social_media_note_outcomes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  note_id uuid not null,
  attempt_number integer not null check (attempt_number between 1 and 10),
  result_state text not null check (result_state in
    ('applied', 'no_change', 'needs_review', 'conflict', 'infrastructure_failure')),
  snapshot_revision bigint check (snapshot_revision is null or snapshot_revision >= 0),
  committed_revision bigint check (committed_revision is null or committed_revision >= 1),
  classification jsonb,
  mutation_plan jsonb,
  reason_code text,
  detail jsonb not null default '{}'::jsonb check (jsonb_typeof(detail) = 'object'),
  created_at timestamptz not null default now(),
  constraint social_media_note_outcomes_attempt_key unique (note_id, attempt_number),
  constraint social_media_note_outcomes_id_owner_note_key unique (id, profile_id, note_id),
  constraint social_media_note_outcomes_note_fkey
    foreign key (note_id, profile_id) references public.social_media_notes (id, profile_id)
    on update cascade on delete restrict,
  constraint social_media_note_outcomes_json_shape check (
    (classification is null or jsonb_typeof(classification) = 'object')
    and (mutation_plan is null or jsonb_typeof(mutation_plan) = 'object')
  ),
  constraint social_media_note_outcomes_revision_shape check (
    (result_state = 'applied' and snapshot_revision is not null
      and committed_revision = snapshot_revision + 1)
    or (result_state <> 'applied' and committed_revision is null)
  )
);

create table public.social_media_context_changes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  note_id uuid not null,
  outcome_id uuid not null,
  category text not null check (category in ('identity', 'preference', 'frequency', 'temporary')),
  operation text not null check (operation in ('add', 'update', 'delete')),
  target_type text not null,
  target_id uuid,
  target_key text,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now(),
  constraint social_media_context_changes_note_fkey
    foreign key (note_id, profile_id) references public.social_media_notes (id, profile_id)
    on update cascade on delete restrict,
  constraint social_media_context_changes_outcome_fkey
    foreign key (outcome_id, profile_id, note_id)
    references public.social_media_note_outcomes (id, profile_id, note_id)
    on update cascade on delete restrict,
  constraint social_media_context_changes_target_check check (target_id is not null or target_key is not null),
  constraint social_media_context_changes_value_shape check (
    (operation = 'add' and before_value is null and after_value is not null)
    or (operation = 'update' and before_value is not null and after_value is not null)
    or (operation = 'delete' and before_value is not null and after_value is null)
  )
);

insert into public.social_media_context_states (profile_id)
select id from public.profiles on conflict (profile_id) do nothing;

create index social_media_identity_cities_profile_created_idx
  on public.social_media_identities_cities_connections (profile_id, created_at, id);
create index social_media_preferences_profile_created_idx
  on public.social_media_preferences (profile_id, created_at, id);
create index social_media_frequency_profile_created_idx
  on public.social_media_frequency_based_instructions (profile_id, created_at, id);
create index social_media_temporary_profile_created_idx
  on public.social_media_temporary_instructions (profile_id, created_at, id);
create index social_media_notes_profile_created_idx
  on public.social_media_notes (profile_id, created_at desc, id);
create index social_media_note_processing_status_lease_idx
  on public.social_media_note_processing (status, lease_expires_at);
create index social_media_note_outcomes_profile_created_idx
  on public.social_media_note_outcomes (profile_id, created_at desc, id);
create index social_media_context_changes_profile_created_idx
  on public.social_media_context_changes (profile_id, created_at desc, id);

create or replace function public.reject_social_media_append_only_mutation()
returns trigger language plpgsql security invoker set search_path = pg_catalog
as $$
begin
  raise exception '% is append-only', tg_table_name using errcode = '55000';
end;
$$;

create trigger social_media_notes_append_only before update or delete on public.social_media_notes
for each row execute function public.reject_social_media_append_only_mutation();
create trigger social_media_note_outcomes_append_only before update or delete on public.social_media_note_outcomes
for each row execute function public.reject_social_media_append_only_mutation();
create trigger social_media_context_changes_append_only before update or delete on public.social_media_context_changes
for each row execute function public.reject_social_media_append_only_mutation();

alter table public.social_media_context_states enable row level security;
alter table public.social_media_identities enable row level security;
alter table public.social_media_identities_cities_connections enable row level security;
alter table public.social_media_preferences enable row level security;
alter table public.social_media_frequency_based_instructions enable row level security;
alter table public.social_media_temporary_instructions enable row level security;
alter table public.social_media_notes enable row level security;
alter table public.social_media_note_processing enable row level security;
alter table public.social_media_note_outcomes enable row level security;
alter table public.social_media_context_changes enable row level security;

revoke all privileges on table
  public.social_media_context_states,
  public.social_media_identities,
  public.social_media_identities_cities_connections,
  public.social_media_preferences,
  public.social_media_frequency_based_instructions,
  public.social_media_temporary_instructions,
  public.social_media_notes,
  public.social_media_note_processing,
  public.social_media_note_outcomes,
  public.social_media_context_changes
from public, anon, authenticated, service_role, postpooch_worker;

revoke all on function public.reject_social_media_append_only_mutation()
from public, anon, authenticated, service_role, postpooch_worker;

comment on table public.social_media_context_states is
  'Global optimistic revision and operational time zone for one profile context.';
comment on table public.social_media_notes is
  'Immutable record of every accepted social-media context note.';
comment on table public.social_media_note_processing is
  'Mutable processing coordination kept separate from immutable notes.';
comment on table public.social_media_note_outcomes is
  'Append-only terminal result records for note-processing attempts.';
comment on table public.social_media_context_changes is
  'Append-only before/after audit of successfully committed context effects.';
