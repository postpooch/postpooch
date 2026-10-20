# Social-media context builder: Phase 1 design

Status: corrected Phase 1 design baseline. This document does not authorize applying the draft migration or implementing Phase 2.

## Decisions needing my approval

1. **Identity storage:** approve the recommended hybrid: typed columns for stable identity facts, the existing city relation for markets, and row-per-instruction tables for preferences, frequency instructions, and temporary instructions. The initial registry fields are listed in section 4.
2. **Mutation-planning framework:** approve the shared universal chat-model factory plus LangChain structured output behind the existing generic `MutationPlanner` contract. No provider or model is part of the application-level architecture. The factory delegates registered providers to LangChain and isolates any additional provider integration internally. `openai:gpt-5.6-terra` with low reasoning effort may be the initial configuration, but remains replaceable and must earn production use through evaluation.
3. **Note durability:** approve saving the immutable note and its processing-control row before either external AI call. This guarantees that an accepted note survives Jev or LLM failure, at the cost of retaining notes whose processing fails.
4. **Conflict behavior:** approve reserving `conflict` exclusively for a mutation plan made from a stale context revision, without automatically re-running Jev or the mutation planner. A lost processing lease is instead the internal condition `PROCESSING_ATTEMPT_SUPERSEDED`. A separate retry of the existing note takes a fresh snapshot.
5. **Time zone:** approve `social_media_context_states.time_zone` as the canonical IANA time zone for context extraction. The current application sends a browser time zone to scheduling code but does not persist a user time zone in PostgreSQL.
6. **Database login:** before finalizing the Phase 2 migration, use the application's existing `getDbPool()` connection to query the effective PostgreSQL account and its relevant privileges. Return/log only the account name and permission conclusions; never disclose or parse the password or the rest of `DATABASE_URL`.
7. **Audit retention:** approve database-enforced append-only notes, outcomes, and changes, plus `ON DELETE RESTRICT` for notes. Account erasure would therefore require a deliberate privileged privacy workflow rather than ordinary application deletion.
8. **Provisional Jev policy:** approve the conservative, explicitly unvalidated threshold candidates in section 5 as a starting point only. They must not ship until live TypeSafe development and holdout evaluation is complete.

## Open questions

- **PENDING TYPESAFE ACCESS:** live Jev calls, observed probabilities, threshold iteration, latency/cost measurements, and the one-time holdout run cannot be completed until a TypeSafe account and `TYPESAFE_API_KEY` are available.
- The Next/Vercel connection mode is not established by tracked configuration. The effective PostgreSQL username and RLS-related privileges are discoverable safely through `current_user`/role capability queries over the existing application connection; that verification remains pending Phase 2 preflight. The Trigger.dev worker's documented transaction-pooler configuration does not establish the Vercel application's mode or role.
- Confirm whether `UTC` is an acceptable temporary default for profiles created before the Studio captures an IANA time zone.
- Confirm whether all initial identity fields in section 4 should be editable by notes, especially `target_audience` and `personal_context`.
- Confirm the production note-retention/privacy policy before enabling `ON DELETE RESTRICT` on immutable notes.

## 1. Existing-system findings

### Database and repository conventions

- `lib/db/client.ts:34-50` exposes a process-wide `pg.Pool`. It reads the server-only `DATABASE_URL` and passes it as `connectionString`; it does not set a role separately. The effective account must be verified with `SELECT current_user` through this pool, not inferred from the fact that `pg` is used.
- `.env.example:2` declares `DATABASE_URL` without identifying its username, host, or pooler mode. The actual application login cannot safely be inferred from tracked files.
- `README.md:31-44,65-86` documents `postpooch_worker` specifically for the Trigger.dev posting worker and says that worker should use a transaction-pooler URL. `scripts/upload-trigger-environment.mjs:16` maps `POSTPOOCH_DATABASE_URL` into the worker's `DATABASE_URL`. This is not evidence that the Vercel application uses `postpooch_worker`.
- `supabase/migrations/20260728000000_posting_automation.sql:55-57,171-185` grants `service_role` access to posting automation. No raw-`pg` runtime path in the context-builder area is shown to connect as `service_role`; the new migration must not grant it access.
- `lib/crm/repository.ts:20-25,187-220` demonstrates the preferred raw, parameterized SQL repository style, including ownership predicates such as `WHERE id = $n AND profile_id = $n`.
- `src/posting/repository.ts:229-280` demonstrates acquiring a `PoolClient` and using an explicit `BEGIN` transaction. The context builder should follow this repository-layer transaction pattern rather than introduce PostgREST or a database function.

The architecture to preserve is:

`browser -> app/api/.../route.ts -> requireAuthenticatedProfile() -> repository -> getDbPool() -> PostgreSQL`

### Authentication and ownership

- `lib/auth/token_check.ts:33-85` reads the authenticated Supabase user from the server-side cookie and resolves `profiles.id` via `requireAuthenticatedProfile()`.
- `schema.txt:607-615` shows that `profiles.id` is both the profile primary key and a foreign key to `auth.users.id`.
- The social-media tables use `profile_id`, so every new owned table and query must key on `requireAuthenticatedProfile().profile.id`. A request body, query string, Jev result, or LLM result must never supply or override that identifier.
- Supabase JS is used for authentication, not social-media data access. The context builder must continue using server-side `pg` only.

### Existing schema

`schema.txt:680-757` contains skeletal tables for cities, identities, identity/city connections, notes, preferences, frequency instructions, and temporary instructions. The instruction tables do not yet contain instruction text or lifecycle fields. The identity table does not yet contain facts. The draft migration in section 3 extends these tables rather than creating parallel replacements.

### Existing context writers

The only persisted social-media context mutations currently implemented are market/city membership changes:

| Caller/writer | Evidence | Required revision participation |
| --- | --- | --- |
| `components/dashboard/social-media/city-picker.tsx` | Lines 149-180 call the city POST and DELETE routes. | Consume the revised route response; it must not write context by another path. |
| `app/api/social_media/cities/route.ts` | Lines 21-26 authenticate and call `connectCityToProfile`. | Use the centralized context repository transaction. |
| `app/api/social_media/cities/[cityId]/route.ts` | Lines 8-21 authenticate and call `disconnectCityFromProfile`. | Use the centralized context repository transaction. |
| `lib/social-media/cities.ts` | Lines 76-89 lazily insert an identity; lines 113-150 insert a city connection; lines 160-173 delete one. | Refactor mutators to use one transaction and increment the shared revision exactly once when state changes. |

There are no other persisted writers for these context types:

- `components/dashboard/social-media/creative-profile.tsx:442-452` only changes local component state for scalar profile fields. Its embedded city picker is the exception and already persists cities.
- `components/dashboard/social-media/creative-studio.tsx:389-395` adds notes only to local component state.
- Repository-wide SQL searches found no other `INSERT`, `UPDATE`, or `DELETE` against identities, preferences, frequency instructions, or temporary instructions.

The revision design remains practical if Phase 2 centralizes these current writers and all new writers in one `SocialMediaContextRepository`. Direct SQL mutations outside that repository become a prohibited convention. Administrative data repairs must explicitly increment the same revision.

### API and test conventions

- Social-media routes use Zod input validation, `requireAuthenticatedProfile()`, `socialJson`, and `socialError` (`app/api/social_media/cities/route.ts`).
- `lib/social-media/http.ts` returns private, no-store JSON responses and maps authentication errors.
- `package.json` uses Vitest through `npm test`; `vitest.config.ts` supplies the `@` alias. Existing tests are colocated as `*.test.ts`.
- There is no installed or implemented LLM/provider abstraction. `package.json` contains neither LangChain nor a general chat-model provider adapter, and repository search finds no structured-output client. Phase 2 should add LangChain as the model-agnostic mutation-planner boundary rather than expose a provider SDK to route or domain code.

### Time zone finding

- `components/dashboard/social-media/weekly-schedule-picker.tsx:261-267` derives the browser's IANA zone and sends it to the scheduling route.
- `lib/schedules/timezone.ts` validates an IANA identifier and defaults to `UTC`.
- No profile or social-media table in `schema.txt` stores that value. The Trigger schedule configuration is not a reliable application database source for context extraction.
- Recommendation: store the context builder's canonical time zone on `social_media_context_states`, validate it with the existing `resolveScheduleTimezone` logic, and update it when Studio/profile scheduling settings are saved.

## 2. Database model

### Recommended physical design

Use a hybrid model:

- Stable, validated identity facts use typed columns on the one-row-per-profile `social_media_identities` table.
- Markets remain a normalized relation to `social_media_cities`; add `profile_id` to the connection table for direct ownership checks and a composite foreign key back to the owning identity.
- Preferences and frequency instructions remain individual text rows because they are ordered prompt items and are naturally edited as lists.
- Temporary instructions use typed columns for their mutually exclusive counter/date-range lifecycle.
- A per-profile state row owns the global optimistic revision and operational time zone.
- Notes, outcomes, and effect records are separate so immutable notes never carry mutable processing status.

This deviates from a pure key/value identity store because the known identity facts have different types and validation, and they will be consumed by both TypeScript and Python. Typed columns make invalid states harder to store and queries easier to audit. The language-neutral registry in section 4 preserves extensibility without sacrificing database types.

### Tables and key constraints

| Table | Purpose and important constraints |
| --- | --- |
| `social_media_context_states` | One row per `profile_id`; nonnegative `revision`; canonical `time_zone`; CAS target for every context mutation. |
| `social_media_identities` | Exactly one row per profile; typed fields; unique `(id, profile_id)` for owned composite references. |
| `social_media_identities_cities_connections` | Owned market relation with `profile_id`; unique `(identity_id, city_id)`; composite FK ensures identity and owner match. |
| `social_media_preferences` | One bounded instruction per row, 1-500 characters. |
| `social_media_frequency_based_instructions` | Same row shape as preferences, enabling one generic list editor. |
| `social_media_temporary_instructions` | `counter` rows have only `remaining_posts`; `date_range` rows have absolute UTC `starts_at`/`ends_at`; source note ID and source note text are retained. |
| `social_media_notes` | Canonical note text, client submission UUID, unique `(profile_id, submission_key)`, append-only. |
| `social_media_note_processing` | Mutable coordination/lease row; deliberately separate from the immutable note. |
| `social_media_note_outcomes` | Append-only result per attempt, including classification/plan evidence and revisions. |
| `social_media_context_changes` | Append-only successful effects with category, operation, target, before, and after. |

All owned record tables carry `profile_id`. All by-ID selects, updates, and deletes must include that column in SQL. Composite foreign keys prevent accidental cross-profile audit relationships.

### Indexes

- Unique identity per profile.
- Unique note submission key per profile.
- Unique city per identity.
- Profile/time indexes for list and audit reads.
- Profile/category indexes for prompt-building reads.
- Processing status/lease index for reclaiming an abandoned attempt.

### RLS and grants

Enable RLS on every context-builder table, create no policies for `anon` or `authenticated`, and explicitly revoke all privileges from `PUBLIC`, `anon`, `authenticated`, `service_role`, and `postpooch_worker`. These explicit revocations apply only to the context-builder objects in this migration; do not change global/default privileges or permissions on unrelated tables.

The Vercel backend's effective PostgreSQL role is whatever `current_user` reports through `getDbPool()`; `lib/db/client.ts` supplies no override. Raw `pg` does **not** itself bypass RLS. Before finalizing the migration, a server-only preflight using the existing pool must query only:

```sql
select current_user, session_user;

select rolname, rolsuper, rolbypassrls
from pg_catalog.pg_roles
where rolname = current_user;

select pg_has_role(current_user, 'service_role', 'member')
  as is_service_role_or_member;
```

The preflight must fail if the backend account is `service_role` or inherits that role; this feature is intentionally not exposed through that access path. After applying the draft to an isolated/staging database, use the same application connection and `has_schema_privilege`/`has_table_privilege` to confirm: schema `USAGE`; state `SELECT/INSERT/UPDATE`; identities `SELECT/INSERT/UPDATE`; identity/city connections `SELECT/INSERT/DELETE`; preferences, frequency instructions, and temporary instructions `SELECT/INSERT/UPDATE/DELETE`; notes `SELECT/INSERT`; processing `SELECT/INSERT/UPDATE`; and outcomes/changes `SELECT/INSERT`. Also prove with a rolled-back owned read/write integration test that RLS behaves as expected. Log only the account name and boolean permission conclusions; never log the URL, host, or password.

The draft deliberately adds no positive runtime-role grant until this check identifies the real account. If that account owns the new objects or has `rolsuper`/`rolbypassrls` plus the required object privileges, no additional grant is needed. If it lacks RLS bypass, the current “no backend policies” security design cannot work merely by adding table grants; stop migration finalization and resolve that deployment mismatch explicitly. Never solve it by granting `service_role` access.

RLS blocks PostgREST/client identities because they have no policies or privileges. Whether it also blocks the raw-`pg` application depends on the verified database account. Even when that account bypasses RLS, authorization remains mandatory in application SQL.

## 3. Full DRAFT migration SQL (not applied)

Suggested filename: `supabase/migrations/20260925000000_social_media_context_builder.sql`.

```sql
-- DRAFT ONLY. Do not apply until the decisions and runtime DB role are confirmed.

do $$
begin
  if exists (
    select 1 from public.social_media_identities where profile_id is null
  ) then
    raise exception 'social_media_identities contains rows without profile_id';
  end if;

  if exists (
    select profile_id
    from public.social_media_identities
    group by profile_id
    having count(*) > 1
  ) then
    raise exception 'social_media_identities contains duplicate profile rows';
  end if;

  if exists (
    select 1
    from public.social_media_identities_cities_connections
    where identity_id is null or city_id is null
  ) then
    raise exception 'identity city connections contain null foreign keys';
  end if;

  if exists (
    select 1
    from public.social_media_preferences
  ) or exists (
    select 1
    from public.social_media_frequency_based_instructions
  ) or exists (
    select 1
    from public.social_media_temporary_instructions
  ) then
    raise exception 'skeletal instruction tables contain rows that cannot be safely backfilled';
  end if;

  if exists (
    select 1
    from public.social_media_notes
    where profile_id is null or note is null or btrim(note) = ''
  ) then
    raise exception 'social_media_notes contains invalid legacy rows';
  end if;
end
$$;

create table public.social_media_context_states (
  profile_id uuid primary key
    references public.profiles (id) on update cascade on delete cascade,
  revision bigint not null default 0 check (revision >= 0),
  time_zone text not null default 'UTC'
    check (char_length(time_zone) between 1 and 64),
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
  add constraint social_media_identities_specialties_count
    check (cardinality(specialties) <= 20),
  add constraint social_media_identities_personal_context_length
    check (personal_context is null or char_length(personal_context) between 1 and 2000),
  add constraint social_media_identities_primary_color_format
    check (primary_brand_color is null or primary_brand_color ~ '^#[0-9A-Fa-f]{6}$'),
  add constraint social_media_identities_secondary_color_format
    check (secondary_brand_color is null or secondary_brand_color ~ '^#[0-9A-Fa-f]{6}$');

alter table public.social_media_identities_cities_connections
  add column profile_id uuid;

update public.social_media_identities_cities_connections as connection
set profile_id = identity.profile_id
from public.social_media_identities as identity
where identity.id = connection.identity_id
  and connection.profile_id is null;

alter table public.social_media_identities_cities_connections
  alter column profile_id set not null,
  alter column identity_id set not null,
  alter column city_id set not null,
  add constraint social_media_identity_cities_profile_id_fkey
    foreign key (profile_id) references public.profiles (id)
    on update cascade on delete cascade,
  add constraint social_media_identity_cities_owned_identity_fkey
    foreign key (identity_id, profile_id)
    references public.social_media_identities (id, profile_id)
    on update cascade on delete cascade,
  add constraint social_media_identity_cities_identity_city_key
    unique (identity_id, city_id);

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
  add constraint social_media_notes_note_length
    check (char_length(note) between 1 and 4000),
  add constraint social_media_notes_id_profile_key unique (id, profile_id);

update public.social_media_notes
set submission_key = gen_random_uuid()
where submission_key is null;

alter table public.social_media_notes
  alter column submission_key set not null,
  add constraint social_media_notes_profile_submission_key
    unique (profile_id, submission_key),
  drop constraint social_media_notes_profile_id_fkey,
  add constraint social_media_notes_profile_id_fkey
    foreign key (profile_id) references public.profiles (id)
    on update cascade on delete restrict;

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
    foreign key (source_note_id, profile_id)
    references public.social_media_notes (id, profile_id)
    on update cascade on delete restrict,
  add constraint social_media_temporary_shape_check check (
    (
      instruction_type = 'counter'
      and remaining_posts is not null
      and remaining_posts between 1 and 100
      and starts_at is null
      and ends_at is null
    )
    or
    (
      instruction_type = 'date_range'
      and remaining_posts is null
      and starts_at is not null
      and ends_at is not null
      and starts_at < ends_at
    )
  );

create table public.social_media_note_processing (
  note_id uuid primary key,
  profile_id uuid not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'finished')),
  attempt_count integer not null default 0 check (attempt_count between 0 and 10),
  lease_token uuid,
  lease_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_media_note_processing_note_fkey
    foreign key (note_id, profile_id)
    references public.social_media_notes (id, profile_id)
    on update cascade on delete cascade,
  constraint social_media_note_processing_lease_shape check (
    (status = 'processing' and lease_token is not null and lease_expires_at is not null)
    or
    (status <> 'processing' and lease_token is null and lease_expires_at is null)
  )
);

create table public.social_media_note_outcomes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  note_id uuid not null,
  attempt_number integer not null check (attempt_number between 1 and 10),
  result_state text not null
    check (result_state in (
      'applied',
      'no_change',
      'needs_review',
      'conflict',
      'infrastructure_failure'
    )),
  snapshot_revision bigint check (snapshot_revision is null or snapshot_revision >= 0),
  committed_revision bigint check (committed_revision is null or committed_revision >= 1),
  classification jsonb,
  mutation_plan jsonb,
  reason_code text,
  detail jsonb not null default '{}'::jsonb
    check (jsonb_typeof(detail) = 'object'),
  created_at timestamptz not null default now(),
  constraint social_media_note_outcomes_attempt_key unique (note_id, attempt_number),
  constraint social_media_note_outcomes_id_owner_note_key unique (id, profile_id, note_id),
  constraint social_media_note_outcomes_note_fkey
    foreign key (note_id, profile_id)
    references public.social_media_notes (id, profile_id)
    on update cascade on delete restrict,
  constraint social_media_note_outcomes_json_shape check (
    (classification is null or jsonb_typeof(classification) = 'object')
    and (mutation_plan is null or jsonb_typeof(mutation_plan) = 'object')
  ),
  constraint social_media_note_outcomes_revision_shape check (
    (
      result_state = 'applied'
      and snapshot_revision is not null
      and committed_revision = snapshot_revision + 1
    )
    or
    (
      result_state <> 'applied'
      and committed_revision is null
    )
  )
);

create table public.social_media_context_changes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  note_id uuid not null,
  outcome_id uuid not null,
  category text not null
    check (category in ('identity', 'preference', 'frequency', 'temporary')),
  operation text not null check (operation in ('add', 'update', 'delete')),
  target_type text not null,
  target_id uuid,
  target_key text,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now(),
  constraint social_media_context_changes_note_fkey
    foreign key (note_id, profile_id)
    references public.social_media_notes (id, profile_id)
    on update cascade on delete restrict,
  constraint social_media_context_changes_outcome_fkey
    foreign key (outcome_id, profile_id, note_id)
    references public.social_media_note_outcomes (id, profile_id, note_id)
    on update cascade on delete restrict,
  constraint social_media_context_changes_target_check
    check (target_id is not null or target_key is not null),
  constraint social_media_context_changes_value_shape check (
    (operation = 'add' and before_value is null and after_value is not null)
    or
    (operation = 'update' and before_value is not null and after_value is not null)
    or
    (operation = 'delete' and before_value is not null and after_value is null)
  )
);

insert into public.social_media_context_states (profile_id)
select id
from public.profiles
on conflict (profile_id) do nothing;

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
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  raise exception '% is append-only', tg_table_name
    using errcode = '55000';
end;
$$;

create trigger social_media_notes_append_only
before update or delete on public.social_media_notes
for each row execute function public.reject_social_media_append_only_mutation();

create trigger social_media_note_outcomes_append_only
before update or delete on public.social_media_note_outcomes
for each row execute function public.reject_social_media_append_only_mutation();

create trigger social_media_context_changes_append_only
before update or delete on public.social_media_context_changes
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

-- service_role is explicitly revoked from these context-builder objects.
-- Deliberately no postpooch_worker grant.
-- Before Phase 2 application, query current_user through getDbPool().
-- If that exact runtime role is not the owner and lacks inherited privileges,
-- stop and reconcile its object privileges and RLS behavior before finalizing.

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
```

The migration intentionally fails rather than inventing content if the existing skeletal instruction tables contain rows. Before Phase 2, run read-only preflight counts and resolve any such rows explicitly.

## 4. Identity registry architecture

### Canonical source

Create a checked-in, language-neutral file such as `shared/social-media/identity-fields.json`. It is the canonical application-level registry. Each entry contains:

```json
{
  "key": "primary_brand_color",
  "label": "Primary brand color",
  "valueType": "hex_color",
  "storage": { "kind": "column", "column": "primary_brand_color" },
  "nullable": true,
  "mutableFromNotes": true,
  "maxLength": 7
}
```

For relation-backed markets, the same registry uses `storage.kind = "relation"` and names the city connection table. The registry defines labels, semantic types, nullability, note mutability, and validation bounds. Prompt construction, planner enums, deterministic validation, form metadata, and future Python serialization derive from it.

TypeScript loads the JSON through a small validated adapter and generates/exports the field-key union and Zod schemas. The future FastAPI service loads the same JSON artifact and builds Pydantic validation/serialization. A schema-parity test checks each `storage.column` and expected PostgreSQL type against a migration manifest or isolated test database. A typed-column addition therefore requires one registry entry and one aligned migration, not duplicate prompt and validator mappings.

### Initial registry

| Key | Label | Type/storage | Bounds |
| --- | --- | --- | --- |
| `display_name` | Name | nullable text column | 1-120 |
| `professional_title` | Professional title | nullable text column | 1-120 |
| `brokerage_name` | Brokerage or team | nullable text column | 1-160 |
| `markets` | Markets served | city relation | existing catalog rows only; maximum 20 |
| `target_audience` | Target audience | nullable text column | 1-1000 |
| `specialties` | Specialties | text-array column | at most 20 items; each 1-80 |
| `personal_context` | Personal context | nullable text column | 1-2000 |
| `primary_brand_color` | Primary brand color | nullable `#RRGGBB` column | exactly 7 characters |
| `secondary_brand_color` | Secondary brand color | nullable `#RRGGBB` column | exactly 7 characters |

Voice, emoji, point-of-view, visual direction, photography direction, prohibited wording, and similar style guidance are preferences, not identity facts. The onboarding form may seed preference rows from those controls. Posting rhythm is out of this context-builder scope.

## 5. Jev questions and provisional thresholds

### Integration boundary

Use the current TypeSafe JavaScript SDK and `jev-latest`. Per the live TypeSafe documentation, one `systemOne` request may send structured state and several independent typed questions. Noul returns a yes probability; Choice returns a selected option, full probabilities, and confidence.

All question definitions, question IDs, and threshold policy live in one server-only file, proposed as `lib/social-media/context/classification-policy.ts`. Do not scatter threshold constants through routes or planners.

```ts
type ContextCategory = "identity" | "preference" | "frequency" | "temporary";
type TemporaryType = "counter" | "date_range" | "unclear";

type NoteClassification = {
  probabilities: Record<ContextCategory, number>;
  temporaryType: {
    choice: TemporaryType;
    probabilities: Record<TemporaryType, number>;
    confidence: number;
  };
  model: string;
  usage: { inputTokens: number; outputTokens: number };
};

interface NoteClassifier {
  classify(input: { note: string }): Promise<NoteClassification>;
}
```

`JevNoteClassifier` implements the interface. There is no fallback classifier. A TypeSafe authentication, rate-limit, overload, timeout, malformed-response, or network failure produces `infrastructure_failure`; it never silently invokes the mutation LLM or another classifier.

### Exact one-request question set

State:

```json
{
  "note": "<untrusted user note>"
}
```

Questions:

```ts
{
  identity: noul(
    "Does `note` ask to add, correct, replace, or remove a durable factual or structured fact about the realtor or their brand identity?",
    {
      true:
        "The note changes facts such as name, professional title, brokerage/team, markets served, target audience, specialties, personal background, or exact brand colors. A correction or retraction of such a fact is included.",
      false:
        "The note only changes stylistic preferences, recurring content cadence, a temporary campaign, or makes no context request."
    },
  ),
  preference: noul(
    "Does `note` ask to add, change, or remove a lasting default preference for how social content should sound, look, or behave?",
    {
      true:
        "The note changes an ongoing default for tone, wording, emoji use, point of view, visual style, colors used as a style instruction rather than an exact brand fact, imagery, formatting, or topics to favor or avoid. Retractions of earlier preferences are included.",
      false:
        "The note only changes identity facts, specifies how often something should recur, limits an instruction to posts/dates, or makes no context request."
    },
  ),
  frequency: noul(
    "Does `note` ask to add, change, or remove a recurring or occasional content instruction whose use should depend on how recently or how often it has appeared?",
    {
      true:
        "The note describes an ongoing cadence or content mix such as occasionally, weekly, monthly, every few posts, more often, less often, or not too frequently. Retractions of recurring instructions are included.",
      false:
        "The note is a permanent style default, a factual identity change, limited to a fixed number of upcoming posts or date range, or makes no context request."
    },
  ),
  temporary: noul(
    "Does `note` ask to add, change, or remove an instruction that is intentionally limited to a fixed number of upcoming posts or a bounded calendar period/event window?",
    {
      true:
        "The instruction applies to the next post or next N posts, or has a stated/relative start, end, date range, month, holiday, event window, or other temporary boundary. Retractions or changes of temporary instructions are included.",
      false:
        "The instruction is an indefinite identity fact, lasting preference, recurring cadence based on history, or makes no context request."
    },
  ),
  temporary_type: choice(
    "Assuming `note` contains a temporary instruction, which boundary type does it use? Choose unclear when the boundary cannot be safely resolved from the note.",
    {
      counter:
        "It applies to the next post or a fixed integer number of upcoming posts.",
      date_range:
        "It applies during a bounded date/time interval, including a relative interval that can be resolved using a reference timestamp and time zone.",
      unclear:
        "It is vaguely temporary, mixes incompatible boundaries, or lacks enough information to choose counter versus date range."
    },
  ),
}
```

The five questions are independent and sent together. Code ignores `temporary_type` whenever the temporary Noul is not included. Jev never proposes edits and never selects add/update/delete.

### Provisional/unvalidated threshold policy

These round values are initial production candidates, not measured or statistically validated:

- **Include a category:** Noul probability `>= 0.75`.
- **Exclude a category:** Noul probability `<= 0.25`.
- **Routing uncertainty:** any category in `(0.25, 0.75)` makes the whole note `needs_review`; do not partially apply confident categories because one note is atomic and may contain multiple changes.
- **Temporary subtype:** when temporary is included, accept `counter` or `date_range` only when its selected probability is `>= 0.70`; otherwise treat it as `unclear` and return `needs_review`.
- If every category is excluded, invoke the mutation planner only with a disposition-only schema. It may return `no_change` or `needs_review`, but it cannot add a category or operation. This safely distinguishes “just testing” from an unresolved reference such as “undo that” without creating a second classifier.

All numeric values above are **PROVISIONAL/UNVALIDATED — PENDING TYPESAFE ACCESS**. Development examples must be used to revise wording and candidate bands first. The holdout set is run exactly once after that iteration and must not be used for further tuning.

## 6. Jev synthetic experiment fixtures and results

The 26 fixtures below are synthetic. Eighteen are development examples and eight are sealed holdout examples. Expected labels are multi-label. `I`, `P`, `F`, and `T` mean identity, preference, frequency, and temporary.

Because TypeSafe access is unavailable, no API call was made and no probability is fabricated. Every observation and pass/fail cell is explicitly pending.

| ID | Split | Synthetic note | Expected labels / temporary type | Expected downstream disposition | Observed I/P/F/T probabilities | Observed temporary probabilities | Pass/fail | Failure cause |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | dev | “My name should appear as Jordan Lee, not Jordyn Lee.” | I | plan identity update | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D02 | dev | “Keep the captions warm and conversational, and use emojis sparingly.” | P | plan preference edits | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D03 | dev | “Work in a seller tip about once every four posts.” | F | plan frequency add/update | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D04 | dev | “Make the next two posts about my open house.” | T / counter | plan counter instruction | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D05 | dev | “From December 1 through December 31, add a little holiday humor.” | T / date_range | plan absolute date range | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D06 | dev | “I joined Sonoran Peak Realty, and please make the writing less formal.” | I + P | plan both atomically | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D07 | dev | “For the next three posts focus on downsizing, then keep sharing a downsizing tip occasionally.” | F + T / counter | plan both atomically | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D08 | dev | “Just testing the notes box—keep doing what you're doing.” | none | no_change | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D09 | dev | “Make the posts feel more like me.” | P | needs_review: mutation ambiguity | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D10 | dev | “Forget what I said about bright colors.” | P | delete/update matching preference, or review if target is ambiguous | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D11 | dev | “I no longer work at Desert & Pine; my brokerage is North Mesa Realty.” | I | plan brokerage replacement | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D12 | dev | “The next post should announce the price reduction at 18 Oak Lane.” | T / counter | plan counter of one | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D13 | dev | “Use a playful tone from June 10 until June 17.” | T / date_range | plan absolute date range | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D14 | dev | “For a while, focus on my new listing.” | T / unclear | needs_review: unresolved boundary | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D15 | dev | “Use fewer emojis, and include a local market-stat post monthly.” | P + F | plan both atomically | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D16 | dev | “My primary brand color is now #234E52.” | I | plan typed color update | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D17 | dev | “Stop doing the recurring lender spotlight.” | F | delete matching frequency row | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| D18 | dev | “I now serve Tempe, make the voice more upbeat, mention relocation quarterly, and use the next two posts for our food drive.” | I + P + F + T / counter | plan all atomically | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H01 | holdout | “Add Chandler to the markets I serve.” | I | plan market add | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H02 | holdout | “Don't use cursive lettering in graphics anymore.” | P | add/update preference | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H03 | holdout | “I'd like neighborhood spotlights now and then, but not in every post.” | F | plan frequency instruction | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H04 | holdout | “Use my new headshot theme for the next 4 posts.” | T / counter | plan counter instruction | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H05 | holdout | “Until the end of next week, mention that buyers can tour the model home.” | T / date_range | resolve using reference time/zone | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H06 | holdout | “My title is Associate Broker, and for Friday only keep the tone celebratory.” | I + T / date_range | plan both atomically | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H07 | holdout | “Undo that last change.” | none determinable | needs_review: unresolved reference | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |
| H08 | holdout | “Thanks, everything looks good as-is.” | none | no_change | **PENDING TYPESAFE ACCESS** | **PENDING TYPESAFE ACCESS** | **PENDING** | **PENDING** |

When access becomes available, report every failing row using exactly one primary cause and optional notes: false positive, false negative, multi-label miss, temporary-type miss, ambiguous fixture, question wording, or threshold. Development failures may change questions/thresholds. Holdout failures are reported separately and must not trigger further tuning against that holdout.

## 7. Mutation contracts

### Planner envelope

The normal LLM returns one strict structured object:

```ts
type MutationPlan =
  | { disposition: "mutate"; operations: ContextOperation[] }
  | { disposition: "no_change"; reasonCode: "explicit_no_change" | "already_satisfied" }
  | {
      disposition: "needs_review";
      reasonCode:
        | "ambiguous_target"
        | "ambiguous_value"
        | "unsupported_request"
        | "unresolved_reference"
        | "unresolved_time_boundary"
        | "conflicting_instructions";
    };
```

The schema allows at most 12 operations per note and at most 5 operations in any one category. Empty `mutate` plans are invalid. The LLM cannot return SQL, table names, owner IDs, arbitrary field names, or UUIDs.

### Identity operations

```ts
type IdentityOperation =
  | { kind: "identity.set"; field: IdentityScalarField; value: unknown }
  | { kind: "identity.clear"; field: IdentityNullableField }
  | { kind: "identity.market_add"; cityName: string; stateCode: string }
  | { kind: "identity.market_delete"; targetIndex: number };
```

`field` is generated from the registry and the structured schema uses the field-specific value type. Trusted code resolves a market add to exactly one catalog row. Zero or multiple matches produce `needs_review`. Existing markets are shown with short indices and mapped back to UUIDs only after schema and revision validation.

### Generic list editor

Preferences and frequency instructions share one editor and the same operation shapes:

```ts
type ListCategory = "preference" | "frequency";

type ListOperation =
  | { kind: "list.add"; category: ListCategory; text: string }
  | { kind: "list.update"; category: ListCategory; targetIndex: number; text: string }
  | { kind: "list.delete"; category: ListCategory; targetIndex: number };
```

The model sees rows only as `{ index: 1, text: "..." }`. It never sees row IDs. Code retains an in-memory map from `(category, index)` to the owned UUID from snapshot revision `V`. Duplicate operations against one target, nonexistent indices, duplicate resulting text, empty text, and text over 500 characters fail deterministic validation.

### Temporary operations

```ts
type TemporaryOperation =
  | {
      kind: "temporary.add_counter";
      instruction: string;
      remainingPosts: number;
    }
  | {
      kind: "temporary.add_date_range";
      instruction: string;
      startsAt: string;
      endsAt: string;
    }
  | {
      kind: "temporary.update_counter";
      targetIndex: number;
      instruction: string;
      remainingPosts: number;
    }
  | {
      kind: "temporary.update_date_range";
      targetIndex: number;
      instruction: string;
      startsAt: string;
      endsAt: string;
    }
  | { kind: "temporary.delete"; targetIndex: number };
```

The planner receives the server reference timestamp and canonical IANA time zone. It must output absolute RFC 3339 instants for date ranges. Trusted code parses them, requires `startsAt < endsAt`, applies a maximum two-year range, and stores them as `timestamptz`. Date-only inclusive phrases resolve to a half-open interval: local midnight at the start through local midnight after the inclusive end date, converted to UTC. Counter values are integers from 1 to 100.

Every added or updated temporary row stores the source note ID, canonical source note text, and source time zone. This builder does not evaluate activity, decrement counters, or delete expired rows.

## 8. LLM editor design

### LangChain and model-agnostic boundary

Use LangChain for mutation-planner model invocation. PostPooch's shared universal factory returns the same `BaseChatModel` interface regardless of provider. It delegates providers supported by `initChatModel()` to LangChain and contains any extra adapter required for providers not registered there. Use `model.withStructuredOutput(...)` when that integration supports it; any provider-specific response/schema wrapper stays inside the model-calling layer and is converted to the same application `MutationPlan` before returning.

References: [LangChain models and `initChatModel()`](https://docs.langchain.com/oss/javascript/langchain/models) and [LangChain structured output](https://docs.langchain.com/oss/javascript/langchain/structured-output).

The rest of the application sees only:

```text
realtor note + current saved context
                ↓
        mutation planner
                ↓
     proposed context changes
```

Route code, mutation contracts, deterministic validation, repositories, transaction logic, and audit code must not import a provider SDK or branch on a provider/model name.

```ts
interface MutationPlanner {
  plan(input: MutationPlannerInput): Promise<MutationPlan>;
}

type MutationPlannerInput = {
  note: string;
  routedCategories: ContextCategory[];
  snapshot: PlannerSnapshot;
  identityRegistry: IdentityRegistry;
  referenceTimestamp: string;
  timeZone: string;
};
```

`MutationPlan` remains the provider-independent discriminated union in section 7. It must not be reshaped around OpenAI Responses, Anthropic tool use, Gemini response schemas, or any other provider-specific wire format.

Implement a LangChain-backed adapter and a model factory behind this interface:

1. `createPlannerModel()` reads the configured provider/model identifier and initializes it through the shared universal chat-model factory.
2. A provider adapter applies only that provider's invocation settings and structured-output method.
3. The adapter parses/normalizes the provider result into `MutationPlan`.
4. The common Zod/Standard Schema validates the normalized result again before the planner returns it.
5. Callers receive only `MutationPlan` or a provider-neutral planner error.

`openai:gpt-5.6-terra` with low reasoning effort may be the initial configured model. That is configuration, not architecture and not a claim that Terra is faster, cheaper, more reliable, or more accurate than Sol, Luna, Claude, Gemini, or any other model. Representative planner evaluations must compare mutation accuracy, latency, refusal behavior, structured-output reliability, and cost before selecting or changing the production model. Swapping the configured model must not require changes outside the model factory/provider adapter and environment credentials.

### Why LangChain, not LangGraph, in Phase 2

LangChain is the appropriate layer for this bounded, single-request model call and provider-independent structured result. The approved three stages and transaction boundary remain ordinary application orchestration. LangGraph is not required in Phase 2 because this context builder has no model-directed tool loop, durable graph checkpoint, or open-ended agent loop; adding a graph would duplicate the database-owned processing and concurrency state. If the workflow later becomes resumable or gains multi-step/human-in-the-loop branches, the existing `NoteClassifier`, `MutationPlanner`, validator, and repository can become LangGraph nodes without changing their contracts.

### Provider-specific configuration stays internal

No provider-specific setting appears in `MutationPlannerInput`, `MutationPlan`, routes, or repositories.

If OpenAI is configured, its LangChain adapter must use the Responses API with response storage disabled. The current `@langchain/openai` adapter exposes `zdrEnabled: true`, which emits `store: false` for Responses requests; Phase 2 must verify this behavior against the installed adapter version and in an outbound-request contract test. OpenAI documents `store` as the control for later API retrieval and says it defaults to true when omitted: [Responses create API](https://developers.openai.com/api/reference/resources/responses/methods/create).

OpenAI Structured Outputs requires an object at the root of the provider-facing schema and does not permit a top-level `anyOf`; a discriminated union such as the generic `MutationPlan` therefore cannot be sent as the OpenAI schema root directly ([OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs#root-objects-must-not-be-anyof-and-must-be-an-object)). The OpenAI adapter wraps the unchanged generic contract only at that provider boundary, conceptually:

```ts
{
  proposal: MutationPlan;
}
```

The adapter unwraps `proposal`, validates it as the normal provider-independent `MutationPlan`, and returns only that union to its caller. This wrapper is an OpenAI wire-format requirement only. It must not appear in `MutationPlanner`, `MutationPlannerInput`, route code, repository code, or the generic application mutation contract.

The OpenAI adapter must not use Conversations, `previous_response_id`, tools, web search, file search, code execution, or any model-triggered side effect. It sends the planner messages plus structured schema and returns only the normalized proposal. Other providers receive equivalent provider-local configuration without leaking it into application contracts.

```ts
interface StructuredMutationPlanner {
  plan(input: {
    note: string;
    routedCategories: ContextCategory[];
    snapshot: PlannerSnapshot;
    identityRegistry: IdentityRegistry;
    referenceTimestamp: string;
    timeZone: string;
  }): Promise<MutationPlan>;
}
```

### Prompt construction

- System instructions define the allowed contracts and state that all note/context strings are untrusted data, not instructions.
- Serialize the note and stored context in a named JSON data object; do not interpolate either into system instructions.
- Include only routed categories. The planner cannot add a category Jev did not confidently route.
- Show identity registry keys and typed values, never database column names not in the registry.
- Show preference, frequency, market, and temporary rows with short 1-based indices, never UUIDs.
- Include the reference timestamp and IANA zone for temporary extraction.
- Do not bind tools or enable browsing, file search, code execution, conversation state, or side effects. The model has no SQL or database client.
- Treat provider refusals, invalid structured output after bounded LangChain/provider handling, timeout, or provider errors as `infrastructure_failure`; do not execute partial output.

For an all-excluded classification, use a separate strict disposition-only schema that can emit only `no_change` or `needs_review`. This is not a fallback classifier: it cannot route or mutate anything.

### Deterministic validation

Before opening a transaction, trusted code validates:

- strict schema and discriminants;
- routed category membership;
- operation and per-category counts;
- registry field existence, mutability, and value type;
- note/instruction length and normalized nonempty strings;
- index existence in the snapshot map;
- no duplicate or contradictory operations against a target;
- exact market catalog resolution;
- temporary counter/date bounds;
- resulting list limits and duplicate instructions;
- that no owner ID, UUID, SQL, or unknown property is present.

Validation failure caused by an ambiguous but plausible request becomes `needs_review`. A provider/schema transport failure becomes `infrastructure_failure`. Programmer invariant violations should be logged as infrastructure failures, never executed.

## 9. Transaction and concurrency design

### Global revision protocol

Every context write uses the same `social_media_context_states.revision`, including city routes, future profile saves, and builder mutations. Planning occurs against snapshot revision `V` without holding a connection, transaction, row lock, advisory lock, or session state.

Before any context snapshot/read or mutation depends on the state row, the centralized repository calls an idempotent helper using the same trusted `profile_id`:

```sql
insert into public.social_media_context_states (profile_id, revision)
values ($1, 0)
on conflict (profile_id) do nothing;
```

The draft migration seeds rows for all profiles that exist when it runs; this repository helper covers profiles created afterward and races between their first requests. Creating the tracking row is operational initialization, not a user context change, so it does not increment `revision` or create a context-change audit row. Snapshot reads then select the guaranteed row and revision.

The apply transaction first fences the active processing lease, then performs:

```sql
update public.social_media_context_states
set revision = revision + 1,
    updated_at = now()
where profile_id = $1
  and revision = $2
returning revision;
```

If no row is returned, no context operation or successful-effect audit is applied. This is the one and only `conflict` condition: the plan was made from revision `V`, but the profile context no longer has revision `V`. Record a `conflict` outcome and finish the still-owned attempt in the same short transaction. `SELECT ... FOR UPDATE` by itself is insufficient because the AI plan was created before the transaction.

The city mutators and future profile-save route use the same repository and increment once only when they actually change state. A duplicate city add is a no-op and does not increment. Removing a missing city keeps the existing 404 behavior and does not increment.

### Atomic profile save

The Studio profile form must stage scalar identity edits and selected cities in client state and submit them together to one profile-save route. It must not persist each city immediately through the per-city endpoints while the same profile edit is still unsaved.

`SocialMediaContextRepository.saveProfile()` receives the authenticated profile ID, validated registry-backed identity values, and validated city IDs, then uses one checked-out `pg` client and one transaction to:

1. ensure the context-state row exists without incrementing it;
2. lock that profile's context-state row with `SELECT ... FOR UPDATE`, then read the current identity and city set for the same `profile_id`;
3. compute a deterministic scalar/city diff;
4. upsert the identity and add/delete the owned city connections using helpers that accept the existing transaction client;
5. if and only if the combined diff is nonempty, increment the shared revision exactly once;
6. commit all identity, city, and revision changes together.

Any identity, city-catalog, ownership, constraint, or revision error rolls back the complete profile save. A save whose scalar values and city set are unchanged commits no context write and does not increment the revision. The standalone city routes may continue to support isolated city changes elsewhere, but the profile form must use the atomic profile-save route.

Generic database triggers are not recommended for revision increments: one logical edit can touch several tables but must increment only once, and the builder must control CAS ordering. Repository centralization plus concurrency tests is the clearer invariant.

### Conflict behavior

Do not automatically reload and repeat external AI calls inside the same Vercel request. The repository has no general route-duration configuration, and a second Jev plus LLM round would create an unpredictable tail. Return HTTP 409 with `state: "conflict"`, the immutable `noteId`, and a retry action. A retry endpoint for that owned note creates a new processing attempt against a fresh snapshot; it does not create another note.

`conflict` is never used for lease/fencing ownership. If an older worker's lease token is no longer current or its lease is expired at finalization, raise the internal condition `PROCESSING_ATTEMPT_SUPERSEDED`. That worker immediately rolls back and stops. It must make no context change, no revision increment, no processing-row update, no terminal outcome that could compete with the newer attempt, and no successful-change audit row. If the superseded request still needs an HTTP response, return a transport error object with code `PROCESSING_ATTEMPT_SUPERSEDED`, not a `ContextBuilderResult` with state `conflict`.

### Idempotency and duplicate processing

`POST /api/social_media/notes` accepts:

```ts
{
  note: string;          // 1-4000 characters after canonicalization
  submissionKey: string; // client-generated UUID
}
```

Canonicalize once with Unicode NFC and trim only leading/trailing whitespace. Preserve case and internal whitespace. Insert the note and processing row in one short transaction using `INSERT ... ON CONFLICT (profile_id, submission_key) DO NOTHING RETURNING ...`.

On conflict, select the existing note by both trusted `profile_id` and `submission_key`:

- If canonical text is byte-for-byte equal, it is an idempotent replay. Return the existing terminal result with 200, or 202 plus `Retry-After` while it is processing. Do not start duplicate AI calls.
- If canonical text differs, do not reveal the stored text, do not create another note, and do not classify or plan. Return HTTP 409:

```json
{
  "error": {
    "code": "IDEMPOTENCY_KEY_REUSED",
    "message": "This submission key was already used for different note text."
  }
}
```

This request-level idempotency error is not the context-builder `conflict` result, which is reserved for stale revision plans. The database unique constraint determines the winner for simultaneous differing payloads; the loser performs the same owned lookup and comparison.

The mutable processing row is claimed with an atomic status/lease update that generates a new fencing token and attempt number. Final apply/finalization requires the same token and an unexpired lease inside the transaction. A stale worker cannot commit after another request reclaims the attempt; losing this fence produces `PROCESSING_ATTEMPT_SUPERSEDED`, not `conflict`.

### Numbered request timing diagram

1. Authenticate with `requireAuthenticatedProfile()` and take `profile.id` as the only owner ID.
2. Parse strict JSON; canonicalize and validate note length and submission-key UUID.
3. `BEGIN`; insert immutable note and pending processing row, or detect an existing key; `COMMIT`.
4. For a replay, compare canonical text and return 200/202 or the idempotency 409 without AI work.
5. Atomically claim the processing row with a lease/fencing token.
6. Idempotently ensure the profile's context-state row exists at revision 0 if absent; read the complete owned context snapshot, canonical time zone, and revision `V`; release the connection.
7. Send one TypeSafe request containing the four independent Nouls and `temporary_type` Choice.
8. Apply the routing thresholds. Return through the outcome path if routing is uncertain.
9. Send at most one strict structured-output mutation-planning request for the confidently routed categories.
10. Deterministically validate and resolve the proposed operations against the snapshot and registry.
11. `BEGIN` on one `pg` client; verify the processing fence is current and unexpired. If not, `ROLLBACK` and stop with `PROCESSING_ATTEMPT_SUPERSEDED` without writing an outcome or modifying the newer attempt.
12. CAS revision `V -> V + 1`. If it fails, and only then, insert a `conflict` outcome, finish the still-owned attempt, and `COMMIT` without context effects.
13. Apply every validated mutation with `profile_id` predicates, insert one change row per actual effect, insert the applied outcome, mark processing finished, and `COMMIT` atomically.
14. Return the typed result. For `no_change`, `needs_review`, or AI infrastructure failure, use a short transaction to append the outcome and finish processing without incrementing revision.

The design is compatible with direct, session-pooler, and transaction-pooler connections because it uses only transaction-scoped operations on one checked-out client. It uses no session advisory locks, session variables, temporary tables, or named prepared statements.

## 10. Note, outcome, and audit model

### When to write the note

Recommendation: write the note before classification/planning. Authentication and request validation happen first; then the note and pending processing row commit before external network calls. This satisfies “save every submitted note” for every accepted request, including `no_change`, `needs_review`, conflict, and AI failures.

- If authentication or input validation fails, the request was not accepted and no note is stored.
- If the initial database transaction fails, return infrastructure failure; storage cannot be claimed.
- If Jev or the LLM fails after insertion, append `infrastructure_failure` when the database is reachable. If the database is also unavailable, the pending/leased row permits later recovery.
- Successful effects and the `applied` outcome commit in the same transaction as context mutations and revision increment.
- `no_change` and `needs_review` have an outcome but no change rows and no revision increment.
- `conflict` has an outcome but no change rows and no revision increment from this note.
- `PROCESSING_ATTEMPT_SUPERSEDED` is not a context result and does not append a competing terminal outcome; the newer fenced attempt owns finalization.

### Immutability

Application-level immutability means the repository exposes only insert/select methods for notes, outcomes, and changes. No route or normal service method supports update/delete.

Database-enforced immutability is also worthwhile because the normal backend role is privileged and RLS cannot protect backend traffic. BEFORE UPDATE/DELETE triggers reject mutations, and note ownership uses `ON DELETE RESTRICT`. These triggers deter bugs and ordinary privileged queries; they do not protect against a database administrator who can disable or drop triggers. That distinction must be explicit.

`social_media_note_processing` is intentionally mutable and is not an audit record. It contains status/lease coordination only. Terminal results live in append-only `social_media_note_outcomes`.

### Change audit examples

- Identity color update: category `identity`, operation `update`, target key `primary_brand_color`, before/after JSON objects.
- Preference addition: category `preference`, operation `add`, generated target row ID, after JSON object.
- Frequency deletion: category `frequency`, operation `delete`, owned target row ID, before JSON object.
- Temporary update: category `temporary`, operation `update`, target row ID, full validated before/after lifecycle objects.

## 11. Authorization and security

### Authorization rules

- Routes call `requireAuthenticatedProfile()` before repositories receive an owner ID.
- Every SELECT, UPDATE, and DELETE on owned data includes `profile_id = $trustedProfileId`. By-ID mutations use `WHERE id = $id AND profile_id = $trustedProfileId` or an equivalent owned join.
- Every INSERT sets `profile_id` only from `requireAuthenticatedProfile().profile.id`.
- Jev, the mutation LLM, request bodies, route parameters, and query strings never choose an owner ID.
- Model-visible short indices map to UUIDs only in trusted server memory. The model cannot alter the map.
- No browser code receives `DATABASE_URL`, `TYPESAFE_API_KEY`, or any selected model provider's API key.

### Untrusted text and prompt injection

Notes and stored context are untrusted data. Place them in explicit data fields and tell both model integrations that these fields cannot change system instructions, schemas, routed categories, authorization, tools, or allowed operations. Do not concatenate user text into instruction strings.

Structured output is a boundary, not authorization. The executor accepts only the discriminated unions and performs all target, owner, bounds, field-registry, and snapshot checks. SQL is fixed and parameterized. Any note asking for SQL, another user's records, credentials, new operations, or instruction overrides has no executable representation.

Limits:

- note: 4,000 characters after NFC/outer trim;
- stored instruction: 500 characters;
- specialties: 20 values, each 80 characters;
- context list: 100 rows per category enforced by application transaction checks;
- operations: 12 total and 5 per category per note;
- counter: 1-100 posts;
- date range: positive and no longer than two years;
- one classification request and at most one mutation-planning request per attempt.

### Database security

- Enable RLS with no `anon`/`authenticated` policies.
- Revoke table/function access on the new context-builder objects from `PUBLIC`, `anon`, `authenticated`, `service_role`, and `postpooch_worker` explicitly.
- Do not change global/default grants or permissions for unrelated existing objects.
- Verify the Vercel raw-`pg` account, object privileges, and RLS-bypass behavior through `getDbPool()` before adding any positive grant. Raw `pg` alone does not imply RLS bypass.
- Do not use a PostgreSQL apply function by default. A normal repository transaction is easier to authorize, test, and keep consistent with existing code.

### Future context-user access

Do not grant `postpooch_worker` anything now. The future Python/FastAPI context user will need read-only access to:

- `social_media_context_states` (`revision` and `time_zone`);
- `social_media_identities`;
- `social_media_identities_cities_connections` and `social_media_cities`;
- `social_media_preferences`;
- `social_media_frequency_based_instructions`;
- `social_media_temporary_instructions`.

It does not need note-processing, outcome, or change-audit access to build a prompt. Create a dedicated least-privilege role only when that service exists. Counter decrement/cleanup belongs to the future context user and will require a separately reviewed write path and revision policy.

## 12. Result-state semantics and failure behavior

| State | Exact meaning | Example | Revision/effects | HTTP guidance |
| --- | --- | --- | --- | --- |
| `applied` | At least one validated context effect committed atomically. | “Use emojis sparingly” updates an existing preference. | Revision increments once; one or more change rows. | 201 first submission; 200 replay. |
| `no_change` | The intended final context is unchanged. The user explicitly requests no change, submits irrelevant test text, or requests a state that already exactly holds. | “Just testing”; “keep doing what you're doing”; exact preference already exists. | No revision increment; no change rows; outcome saved. | 200/201 with state. |
| `needs_review` | A context change is probably intended, but routing or exact mutations cannot be formulated safely. | “Make posts feel more like me”; “undo that”; “for a while.” | No revision increment; no change rows; reason code saved. | 200/201 with state and safe clarification message. |
| `conflict` | A valid AI mutation plan was built from revision `V`, but context revision `V` changed before apply. This state has no other meaning. | The planner reads revision 5, a profile/city change commits revision 6, and the revision-5 plan then attempts to apply. | Stale plan applies nothing; no successful change rows; conflict outcome saved. | 409 with note ID and retry action. |
| `infrastructure_failure` | Required infrastructure failed; this says nothing about user intent. | TypeSafe unavailable, configured model-provider timeout, invalid provider response, or database failure after note acceptance. | No context effect; outcome saved when PostgreSQL is available. | 503, retryable flag based on error class. |

`needs_review` and `no_change` are not generic error buckets. Provider failures never become `needs_review`; ambiguous change requests never become `infrastructure_failure`. The separate `IDEMPOTENCY_KEY_REUSED` HTTP 409 is a request-contract error, not a context result state. `PROCESSING_ATTEMPT_SUPERSEDED` is an internal fencing condition, also not a context result state.

## 13. Test and evaluation plan

All database integration tests must run against an isolated local/test PostgreSQL instance, never a shared or production Supabase project.

### Unit tests

- Note NFC/trim canonicalization and 1-4000 length bounds.
- Registry loading, generated field enums, per-type validation, and migration-manifest parity.
- Jev response parsing, threshold boundaries, multi-label selection, ignored temporary subtype, and no-fallback failures using synthetic response fixtures.
- Planner discriminated unions for every operation kind, unknown-key rejection, operation limits, and refusal handling.
- LangChain model-factory/provider adapters normalize provider-specific wrappers into the same `MutationPlan`; generic planner callers contain no provider branches.
- Generic list index mapping and rejection of stale/missing/duplicate targets.
- Temporary relative-date resolution around time-zone offsets and daylight-saving transitions; absolute half-open intervals.
- Result-state mapping and distinction between ambiguity and infrastructure failure.

### Repository integration tests

- Every owned read/write is isolated by `profile_id`, including same UUID-shaped targets owned by another profile.
- One context mutation increments revision once; multi-operation note increments once; no-op increments zero times.
- Current city add/delete routes participate in the revision protocol.
- A first-ever snapshot/mutation for a profile with no context-state row creates revision 0 idempotently; the first real change commits revision 1, even under concurrent first requests.
- A profile save that changes identity fields and cities commits both plus one revision increment in one transaction; a forced city/constraint failure rolls back identity changes, and an unchanged save increments zero times.
- Identity/city composite ownership constraints reject mismatches.
- All plan effects, change rows, outcome, processing finalization, and revision commit or roll back together.
- A stale revision returns conflict and writes no context/change effects.
- Append-only triggers reject UPDATE/DELETE even through the privileged application role.
- RLS has no client policies and explicit grants/revocations exclude `PUBLIC`, `anon`, `authenticated`, `service_role`, and `postpooch_worker` from the new objects.
- The sanitized database-account preflight reports only `current_user`/`session_user` and boolean privilege/RLS conclusions; a staged rolled-back access test verifies the backend account can perform every required operation.

### Idempotency/concurrency tests

- Same profile/key/canonical text returns the original terminal result.
- Outer whitespace and Unicode NFC equivalents replay; case or internal-whitespace changes return `IDEMPOTENCY_KEY_REUSED` 409.
- Same key may be used by different profiles.
- Concurrent identical submissions perform one AI workflow.
- Concurrent differing payloads produce one accepted note and one idempotency 409.
- Two notes planning at revision `V`: exactly one commits, the other conflicts.
- A city change between plan and apply causes builder conflict.
- Expired lease reclamation fences the old worker; an old token returns `PROCESSING_ATTEMPT_SUPERSEDED`, cannot commit, cannot increment revision, cannot overwrite processing state, and cannot emit successful-change audit rows or a `conflict` outcome.
- Retry of a conflicted existing note uses a new attempt and fresh revision without inserting a duplicate note.

### Jev evaluation

1. Once TypeSafe access exists, run only D01-D18 and record raw probabilities, model version, token usage, latency, pass/fail, and primary failure cause.
2. Iterate on question wording and provisional bands using only development data.
3. Freeze questions and thresholds.
4. Run H01-H08 once.
5. Report holdout failures separately; do not tune against them.
6. Treat the small synthetic set as a smoke evaluation, not statistical validation. Add anonymized, consented production-like examples before enabling automatic writes broadly.

Current status: **LIVE JEV EXPERIMENTS, PROBABILITY MEASUREMENTS, THRESHOLD TUNING, AND HOLDOUT RESULTS ARE PENDING TYPESAFE ACCESS.**

### Mutation-planner model evaluation

Maintain one provider-independent corpus containing identity, list-editor, temporary, multi-category, no-change, ambiguous, refusal-inducing, and prompt-injection cases. Run the identical `MutationPlannerInput` and validate the identical `MutationPlan` contract for every candidate model. Compare mutation accuracy, end-to-end latency, refusal behavior, schema/structured-output reliability, and measured cost. Record provider/model versions and settings. Selection is configuration based on these results; no candidate, including Terra, is presumed superior before measurement. Provider contract tests must also prove that changing the model factory leaves routes, contracts, validation, repository calls, and context application unchanged. If OpenAI is tested, capture the outbound request in a test double and assert response storage is disabled and no tools/conversation linkage are present. A separate OpenAI provider contract test must assert that the provider-facing Structured Outputs schema has an object root containing `proposal`, while the adapter unwraps it and generic `MutationPlanner` callers receive only `MutationPlan`.

### Route/UI tests

- Unauthenticated requests return 401 and store nothing.
- Invalid input returns 400 and stores nothing.
- Applied/no-change/review/conflict/infrastructure responses render distinct Studio feedback.
- The browser creates and reuses one submission UUID for retries of the same payload.
- A changed note receives a new submission UUID; accidental reuse with changed text surfaces the 409.

## 14. Files expected to change in Phase 2

Exact organization may be adjusted to existing naming conventions, but responsibilities must remain separated.

### Existing files to modify

- `package.json`, `package-lock.json`: add the TypeSafe SDK, LangChain packages, and only the adapter package(s) for configured model providers after approval/access.
- `.env.example`: document server-only variables without values.
- `lib/social-media/http.ts`: map validation, conflict, idempotency, and infrastructure errors.
- `lib/social-media/cities.ts`: move all city mutations behind the context repository and shared revision transaction.
- `app/api/social_media/cities/route.ts`: use the revision-aware repository.
- `app/api/social_media/cities/[cityId]/route.ts`: use the revision-aware repository.
- `components/dashboard/social-media/city-picker.tsx`: support staged city selection in the profile form instead of issuing per-city writes before profile save; retain direct route use only for truly standalone city edits.
- `components/dashboard/social-media/creative-profile.tsx`: submit registry-backed fields, canonical time zone, and the complete selected-city set through one atomic profile-save route.
- `components/dashboard/social-media/creative-studio.tsx`: submit notes with an idempotency UUID and render typed outcomes.

### New files/directories

- `supabase/migrations/<timestamp>_social_media_context_builder.sql`
- `shared/social-media/identity-fields.json`
- `lib/social-media/context/registry.ts`
- `lib/social-media/context/classification-policy.ts`
- `lib/social-media/context/note-classifier.ts`
- `lib/social-media/context/jev-note-classifier.ts`
- `lib/social-media/context/mutation-contracts.ts`
- `lib/social-media/context/mutation-planner.ts`
- `lib/social-media/context/langchain-mutation-planner.ts`
- `lib/ai/universal-chat-model.ts`: the shared provider-neutral construction boundary used by Builder and Context User
- provider integration code only inside that universal boundary and only for providers actually enabled
- `lib/social-media/context/repository.ts`
- `lib/social-media/context/service.ts`
- `app/api/social_media/profile/route.ts`
- `app/api/social_media/notes/route.ts`
- `app/api/social_media/notes/[noteId]/retry/route.ts`
- colocated `*.test.ts` files for policy, contracts, registry, service, repository, concurrency, and routes.

No Trigger.dev, scheduling, Pexels, Fabric.js, Zernio, Cloudflare, past-post generation, or Python context-user implementation belongs in Phase 2 of this context-builder work.

## 15. Required environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Server-only secret; existing | Raw `pg` application connection. Use that connection to query the effective account and permission booleans; never expose, print, or parse the URL itself. |
| `TYPESAFE_API_KEY` | Server-only secret; new and currently unavailable | Authenticates the Jev `systemOne` request. Absence disables processing as infrastructure failure; there is no classifier fallback. |
| `CONTEXT_BUILDER_LLM_MODEL` | Server-only non-secret configuration; new | LangChain provider/model identifier. An initial candidate is `openai:gpt-5.6-terra`; changing it must not change application contracts. |
| Selected provider credential, for example `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GOOGLE_API_KEY` | Server-only secret; conditional | Only the credential required by the configured universal-factory provider is required. Provider credentials never reach browser code or generic planner contracts. |

Provider-specific request settings stay in the provider adapter. If OpenAI/Terra is initially selected, that adapter configures low reasoning effort, Responses API usage, and response storage disabled (`zdrEnabled: true`/verified `store: false`). Jev model alias `jev-latest`, thresholds, note limits, operation limits, timeouts, and retry policy remain version-controlled server configuration so behavior changes are reviewable. There are no new browser-safe or `NEXT_PUBLIC_` variables.

## 16. Assumptions

- `profiles.id` remains the owner key and continues to equal the authenticated Supabase user ID.
- The Vercel route can make one Jev request and at most one LangChain mutation-planner model request within its configured duration; automatic conflict re-planning is excluded.
- The raw-`pg` account's ownership, object privileges, and `rolbypassrls`/superuser status are unknown until the sanitized `getDbPool()` preflight runs. No RLS bypass is assumed from the client library.
- The centralized repository ensures a missing context-state row at revision 0 before snapshots or mutations; creation alone is not a context change.
- One profile save sends identity and cities together and commits them atomically with zero or one shared revision increment.
- Existing skeletal preference, frequency, and temporary tables contain no meaningful rows; the migration intentionally aborts if they do.
- Existing notes, if any, have non-null owners and nonempty text; legacy submission keys may be generated during migration.
- The city catalog remains authoritative for market identity values.
- A context list will not exceed 100 rows per category; the application enforces this bound transactionally.
- Temporary date ranges are stored as absolute UTC instants plus the source IANA zone; the future context user, not this builder, evaluates them.
- The future Python service can consume the same checked-in JSON registry artifact or an identically versioned package containing it.
- TypeSafe numeric thresholds and every mutation-planner model configuration are initial candidates and require evaluation before automatic production mutation. Terra is only one initial candidate, not part of the architecture.
