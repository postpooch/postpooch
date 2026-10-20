-- Context User durable artifacts, reusable realtor assets, and replay-safe finalization.
-- This migration intentionally depends on 20260925000000_social_media_context_builder.sql.
begin;

do $$
begin
  if to_regclass('public.social_media_context_states') is null then
    raise exception 'Context Builder prerequisite is missing: social_media_context_states';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'social_media_temporary_instructions'
      and column_name = 'source_time_zone'
  ) then
    raise exception 'Context Builder prerequisite columns are missing';
  end if;
  if not exists (
    select 1 from pg_roles where rolname = 'postpooch_worker'
  ) then
    raise exception 'Required existing role postpooch_worker is missing';
  end if;
  if exists (select 1 from public.social_media_past_posts) then
    raise exception 'social_media_past_posts contains legacy rows requiring an explicit backfill decision';
  end if;
end
$$;

alter table public.social_media_context_changes
  drop constraint social_media_context_changes_category_check;

alter table public.social_media_context_changes
  add constraint social_media_context_changes_category_check
  check (category in ('identity', 'preference', 'frequency', 'temporary', 'asset'));

alter table public.posting_runs
  add column context_snapshot jsonb,
  add column creative_output jsonb,
  add column caption text,
  add column history_summary text,
  add column visual_qa_status text,
  add column visual_revision_count smallint not null default 0,
  add column final_temporary_satisfaction jsonb,
  add constraint posting_runs_context_snapshot_shape check (
    context_snapshot is null or jsonb_typeof(context_snapshot) = 'object'
  ),
  add constraint posting_runs_creative_output_shape check (
    creative_output is null or jsonb_typeof(creative_output) = 'object'
  ),
  add constraint posting_runs_caption_length check (
    caption is null or char_length(caption) between 1 and 10000
  ),
  add constraint posting_runs_history_summary_length check (
    history_summary is null or char_length(history_summary) between 1 and 1000
  ),
  add constraint posting_runs_visual_qa_status_check check (
    visual_qa_status is null or visual_qa_status in
      ('pending', 'needs_revision', 'accepted', 'accepted_with_minor_issues', 'blocked')
  ),
  add constraint posting_runs_visual_revision_count_check check (
    visual_revision_count between 0 and 2
  ),
  add constraint posting_runs_temp_satisfaction_shape check (
    final_temporary_satisfaction is null or (
      jsonb_typeof(final_temporary_satisfaction) = 'object'
      and jsonb_typeof(final_temporary_satisfaction -> 'instructionIds') = 'array'
      and jsonb_typeof(final_temporary_satisfaction -> 'visualRevision') = 'number'
      and final_temporary_satisfaction ->> 'schemaVersion' = 'temporary-satisfaction.v1'
    )
  ),
  add constraint posting_runs_temp_satisfaction_requires_acceptance check (
    final_temporary_satisfaction is null
      or visual_qa_status in ('accepted', 'accepted_with_minor_issues')
  );

alter table public.media
  add column posting_run_id uuid
    references public.posting_runs (id)
    on update cascade
    on delete cascade;

alter table public.media drop constraint media_has_exactly_one_parent;
alter table public.media
  add constraint media_has_exactly_one_parent
  check (num_nonnulls(schedule_id, template_id, post_project_id, posting_run_id) = 1)
  not valid;

create index media_posting_run_id_idx on public.media (posting_run_id);
create unique index media_posting_run_display_order_unique
  on public.media (posting_run_id, display_order)
  where posting_run_id is not null;

alter table public.social_media_past_posts
  alter column profile_id drop default,
  alter column profile_id set not null,
  add column posting_run_id uuid not null
    references public.posting_runs (id)
    on update cascade
    on delete restrict,
  add column published_at timestamptz not null,
  add column summary text not null,
  add constraint social_media_past_posts_posting_run_key unique (posting_run_id),
  add constraint social_media_past_posts_summary_length
    check (char_length(btrim(summary)) between 1 and 1000);

create index social_media_past_posts_profile_published_idx
  on public.social_media_past_posts (profile_id, published_at desc, id);

create table public.social_media_assets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null
    references public.profiles (id) on update cascade on delete cascade,
  storage_key text not null,
  purpose text not null
    check (purpose in ('headshot', 'logo', 'office', 'listing', 'community', 'other')),
  original_filename text not null,
  mime_type text not null
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  width integer not null check (width between 1 and 20000),
  height integer not null check (height between 1 and 20000),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint social_media_assets_storage_key_key unique (storage_key),
  constraint social_media_assets_id_profile_key unique (id, profile_id),
  constraint social_media_assets_storage_key_length
    check (char_length(storage_key) between 1 and 1024),
  constraint social_media_assets_filename_length
    check (char_length(original_filename) between 1 and 255),
  constraint social_media_assets_deleted_at_check
    check (deleted_at is null or deleted_at >= created_at)
);

create index social_media_assets_profile_created_idx
  on public.social_media_assets (profile_id, created_at desc, id)
  where deleted_at is null;

create table public.social_media_note_assets (
  profile_id uuid not null
    references public.profiles (id) on update cascade on delete cascade,
  note_id uuid not null,
  asset_id uuid not null,
  primary key (note_id, asset_id),
  constraint social_media_note_assets_owned_note_fkey
    foreign key (note_id, profile_id)
    references public.social_media_notes (id, profile_id)
    on update cascade on delete cascade,
  constraint social_media_note_assets_owned_asset_fkey
    foreign key (asset_id, profile_id)
    references public.social_media_assets (id, profile_id)
    on update cascade on delete restrict
);

create index social_media_note_assets_profile_note_idx
  on public.social_media_note_assets (profile_id, note_id);

create table public.social_media_temporary_instruction_assets (
  profile_id uuid not null
    references public.profiles (id) on update cascade on delete cascade,
  temporary_instruction_id uuid not null,
  asset_id uuid not null,
  primary key (temporary_instruction_id, asset_id),
  constraint social_media_temp_assets_owned_instruction_fkey
    foreign key (temporary_instruction_id, profile_id)
    references public.social_media_temporary_instructions (id, profile_id)
    on update cascade on delete cascade,
  constraint social_media_temp_assets_owned_asset_fkey
    foreign key (asset_id, profile_id)
    references public.social_media_assets (id, profile_id)
    on update cascade on delete restrict
);

create index social_media_temp_assets_profile_instruction_idx
  on public.social_media_temporary_instruction_assets
  (profile_id, temporary_instruction_id);

create table public.social_media_frequency_instruction_assets (
  profile_id uuid not null
    references public.profiles (id) on update cascade on delete cascade,
  frequency_instruction_id uuid not null,
  asset_id uuid not null,
  primary key (frequency_instruction_id, asset_id),
  constraint social_media_frequency_assets_owned_instruction_fkey
    foreign key (frequency_instruction_id, profile_id)
    references public.social_media_frequency_based_instructions (id, profile_id)
    on update cascade on delete cascade,
  constraint social_media_frequency_assets_owned_asset_fkey
    foreign key (asset_id, profile_id)
    references public.social_media_assets (id, profile_id)
    on update cascade on delete restrict
);

create index social_media_frequency_assets_profile_instruction_idx
  on public.social_media_frequency_instruction_assets
  (profile_id, frequency_instruction_id);

create table public.social_media_preference_assets (
  profile_id uuid not null
    references public.profiles (id) on update cascade on delete cascade,
  preference_id uuid not null,
  asset_id uuid not null,
  primary key (preference_id, asset_id),
  constraint social_media_preference_assets_owned_preference_fkey
    foreign key (preference_id, profile_id)
    references public.social_media_preferences (id, profile_id)
    on update cascade on delete cascade,
  constraint social_media_preference_assets_owned_asset_fkey
    foreign key (asset_id, profile_id)
    references public.social_media_assets (id, profile_id)
    on update cascade on delete restrict
);

create index social_media_preference_assets_profile_preference_idx
  on public.social_media_preference_assets (profile_id, preference_id);

alter table public.social_media_assets enable row level security;
alter table public.social_media_note_assets enable row level security;
alter table public.social_media_temporary_instruction_assets enable row level security;
alter table public.social_media_frequency_instruction_assets enable row level security;
alter table public.social_media_preference_assets enable row level security;

revoke all privileges on table
  public.social_media_assets,
  public.social_media_note_assets,
  public.social_media_temporary_instruction_assets,
  public.social_media_frequency_instruction_assets,
  public.social_media_preference_assets
from public, anon, authenticated, service_role, postpooch_worker;

grant select on table
  public.social_media_context_states,
  public.social_media_identities,
  public.social_media_identities_cities_connections,
  public.social_media_cities,
  public.social_media_preferences,
  public.social_media_frequency_based_instructions,
  public.social_media_temporary_instructions,
  public.social_media_past_posts,
  public.social_media_assets,
  public.social_media_temporary_instruction_assets,
  public.social_media_frequency_instruction_assets,
  public.social_media_preference_assets
to postpooch_worker;

create policy postpooch_worker_select_context_states
  on public.social_media_context_states for select to postpooch_worker using (true);
create policy postpooch_worker_select_identities
  on public.social_media_identities for select to postpooch_worker using (true);
create policy postpooch_worker_select_identity_cities
  on public.social_media_identities_cities_connections for select to postpooch_worker using (true);
create policy postpooch_worker_select_social_cities
  on public.social_media_cities for select to postpooch_worker using (true);
create policy postpooch_worker_select_preferences
  on public.social_media_preferences for select to postpooch_worker using (true);
create policy postpooch_worker_select_frequency
  on public.social_media_frequency_based_instructions for select to postpooch_worker using (true);
create policy postpooch_worker_select_temporary
  on public.social_media_temporary_instructions for select to postpooch_worker using (true);
create policy postpooch_worker_select_past_posts
  on public.social_media_past_posts for select to postpooch_worker using (true);
create policy postpooch_worker_select_assets
  on public.social_media_assets for select to postpooch_worker using (true);
create policy postpooch_worker_select_temp_assets
  on public.social_media_temporary_instruction_assets for select to postpooch_worker using (true);
create policy postpooch_worker_select_frequency_assets
  on public.social_media_frequency_instruction_assets for select to postpooch_worker using (true);
create policy postpooch_worker_select_preference_assets
  on public.social_media_preference_assets for select to postpooch_worker using (true);

grant insert (posting_run_id, display_order, image_design),
      update (display_order, image_design)
on table public.media to postpooch_worker;
grant delete on table public.media to postpooch_worker;

create policy postpooch_worker_insert_posting_run_media
  on public.media for insert to postpooch_worker
  with check (
    posting_run_id is not null
    and schedule_id is null
    and template_id is null
    and post_project_id is null
    and exists (select 1 from public.posting_runs pr where pr.id = media.posting_run_id)
  );

create policy postpooch_worker_update_posting_run_media
  on public.media for update to postpooch_worker
  using (posting_run_id is not null)
  with check (
    posting_run_id is not null
    and schedule_id is null
    and template_id is null
    and post_project_id is null
  );

create policy postpooch_worker_delete_posting_run_media
  on public.media for delete to postpooch_worker
  using (posting_run_id is not null);

create or replace function public.finalize_context_user_post(p_posting_run_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid;
  v_status text;
  v_published_at timestamptz;
  v_history_summary text;
  v_visual_qa_status text;
  v_visual_revision_count smallint;
  v_satisfaction jsonb;
  v_snapshot jsonb;
  v_instruction record;
  v_context_changed boolean := false;
  v_updated integer;
begin
  select s.profile_id, pr.status, pr.published_at, pr.history_summary,
         pr.visual_qa_status, pr.visual_revision_count,
         pr.final_temporary_satisfaction, pr.context_snapshot
  into v_profile_id, v_status, v_published_at, v_history_summary,
       v_visual_qa_status, v_visual_revision_count, v_satisfaction, v_snapshot
  from public.posting_runs pr
  join public.schedules s on s.id = pr.schedule_id
  where pr.id = p_posting_run_id
  for update of pr;

  if not found or v_profile_id is null then
    raise exception 'Posting run or owned schedule was not found';
  end if;
  if v_status <> 'published' or v_published_at is null then
    raise exception 'Posting run is not durably published';
  end if;
  if v_visual_qa_status not in ('accepted', 'accepted_with_minor_issues') then
    raise exception 'Posting run does not have accepted visual QA';
  end if;
  if v_history_summary is null or btrim(v_history_summary) = '' then
    raise exception 'Posting run history summary is missing';
  end if;
  if v_satisfaction is null
     or (v_satisfaction ->> 'visualRevision')::smallint <> v_visual_revision_count then
    raise exception 'Final temporary satisfaction is missing or stale';
  end if;

  if exists (
    select 1 from public.social_media_past_posts
    where posting_run_id = p_posting_run_id
  ) then
    return false;
  end if;

  perform 1 from public.social_media_context_states
  where profile_id = v_profile_id for update;
  if not found then
    raise exception 'Context state was not found for published profile';
  end if;

  for v_instruction in
    select t.id, t.remaining_posts
    from public.social_media_temporary_instructions t
    join (
      select distinct value::uuid as id
      from jsonb_array_elements_text(v_satisfaction -> 'instructionIds')
    ) requested on requested.id = t.id
    where t.profile_id = v_profile_id
      and t.instruction_type = 'counter'
      and t.remaining_posts > 0
      and exists (
        select 1
        from jsonb_array_elements(
          coalesce(v_snapshot -> 'activeTemporaryInstructions', '[]'::jsonb)
        ) active
        where active ->> 'id' = t.id::text
      )
    order by t.id
    for update of t
  loop
    if v_instruction.remaining_posts = 1 then
      delete from public.social_media_temporary_instructions
      where id = v_instruction.id and profile_id = v_profile_id
        and instruction_type = 'counter' and remaining_posts = 1;
    else
      update public.social_media_temporary_instructions
      set remaining_posts = remaining_posts - 1, updated_at = now()
      where id = v_instruction.id and profile_id = v_profile_id
        and instruction_type = 'counter'
        and remaining_posts = v_instruction.remaining_posts;
    end if;
    get diagnostics v_updated = row_count;
    if v_updated = 1 then v_context_changed := true; end if;
  end loop;

  if v_context_changed then
    update public.social_media_context_states
    set revision = revision + 1, updated_at = now()
    where profile_id = v_profile_id;
    get diagnostics v_updated = row_count;
    if v_updated <> 1 then
      raise exception 'Context state was not found for published profile';
    end if;
  end if;

  insert into public.social_media_past_posts
    (profile_id, posting_run_id, published_at, summary)
  values (v_profile_id, p_posting_run_id, v_published_at, v_history_summary);

  return true;
end
$$;

revoke all on function public.finalize_context_user_post(uuid)
from public, anon, authenticated, service_role;
grant execute on function public.finalize_context_user_post(uuid)
to postpooch_worker;

comment on column public.media.posting_run_id is
  'Generated-post occurrence parent. Exactly one media parent column is non-null.';
comment on table public.social_media_assets is
  'Reusable realtor-owned social image library; ordinary deletion sets deleted_at and preserves the stable R2 identity.';
comment on table public.social_media_note_assets is
  'Durable image associations for immutable notes and Builder retries; asset-side deletion is restricted.';
comment on function public.finalize_context_user_post(uuid) is
  'Exactly-once published history insertion and satisfied current-counter consumption.';

commit;
