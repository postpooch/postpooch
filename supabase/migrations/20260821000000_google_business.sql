begin;

create table public.google_business_connections (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on update cascade on delete cascade,
  zernio_profile_id text not null,
  zernio_account_id text not null,
  provider_account_name text,
  status text not null default 'active',
  needs_reconnection boolean not null default false,
  sync_status text not null default 'pending',
  sync_error text,
  last_sync_started_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint google_business_connections_status_check
    check (status in ('active', 'disconnected', 'error')),
  constraint google_business_connections_sync_status_check
    check (sync_status in ('pending', 'syncing', 'synced', 'failed')),
  constraint google_business_connections_profile_account_key
    unique (profile_id, zernio_account_id)
);

create index google_business_connections_profile_idx
  on public.google_business_connections (profile_id, status);

create table public.google_business_locations (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.google_business_connections (id) on update cascade on delete cascade,
  zernio_location_id text not null,
  google_account_id text,
  google_location_name text,
  store_code text,
  title text not null default '',
  formatted_address text,
  storefront_address jsonb,
  primary_phone text,
  additional_phones jsonb not null default '[]'::jsonb,
  website_uri text,
  description text,
  categories jsonb not null default '{}'::jsonb,
  regular_hours jsonb not null default '{"periods":[]}'::jsonb,
  special_hours jsonb not null default '{"specialHourPeriods":[]}'::jsonb,
  services jsonb not null default '[]'::jsonb,
  place_id text,
  maps_uri text,
  review_url text,
  is_verified boolean not null default false,
  average_rating numeric(3,2),
  review_count integer not null default 0,
  is_selected boolean not null default false,
  is_available boolean not null default true,
  mutation_version bigint not null default 0,
  last_mutated_at timestamptz,
  last_sync_started_at timestamptz,
  last_synced_at timestamptz,
  sync_status text not null default 'pending',
  sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint google_business_locations_connection_location_key
    unique (connection_id, zernio_location_id),
  constraint google_business_locations_rating_check
    check (average_rating is null or average_rating between 0 and 5),
  constraint google_business_locations_review_count_check
    check (review_count >= 0),
  constraint google_business_locations_mutation_version_check
    check (mutation_version >= 0),
  constraint google_business_locations_additional_phones_check
    check (jsonb_typeof(additional_phones) = 'array'),
  constraint google_business_locations_categories_check
    check (jsonb_typeof(categories) = 'object'),
  constraint google_business_locations_services_check
    check (jsonb_typeof(services) = 'array'),
  constraint google_business_locations_sync_status_check
    check (sync_status in ('pending', 'syncing', 'synced', 'failed'))
);

create index google_business_locations_connection_idx
  on public.google_business_locations (connection_id, is_available, is_selected desc);
create index google_business_locations_sync_idx
  on public.google_business_locations (sync_status, last_synced_at)
  where is_available;
create unique index google_business_locations_one_selected_per_connection
  on public.google_business_locations (connection_id)
  where is_selected;

create table public.google_business_reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.google_business_locations (id) on update cascade on delete cascade,
  provider_review_id text not null,
  provider_resource_name text,
  reviewer_name text not null default 'Google user',
  reviewer_photo_url text,
  is_anonymous boolean not null default false,
  rating smallint not null,
  comment text,
  reply_comment text,
  reply_updated_at timestamptz,
  provider_created_at timestamptz,
  provider_updated_at timestamptz,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint google_business_reviews_location_review_key unique (location_id, provider_review_id),
  constraint google_business_reviews_rating_check check (rating between 1 and 5)
);

create index google_business_reviews_location_time_idx
  on public.google_business_reviews (location_id, provider_created_at desc nulls last);

create table public.google_business_metrics (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.google_business_locations (id) on update cascade on delete cascade,
  metric_date date not null,
  metric_name text not null,
  metric_value bigint not null default 0,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint google_business_metrics_location_date_name_key
    unique (location_id, metric_date, metric_name),
  constraint google_business_metrics_value_check check (metric_value >= 0)
);

create index google_business_metrics_location_date_idx
  on public.google_business_metrics (location_id, metric_date desc);

create table public.google_business_search_keywords (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.google_business_locations (id) on update cascade on delete cascade,
  period_start date not null,
  period_end date not null,
  keyword text not null,
  impressions bigint not null default 0,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint google_business_search_keywords_period_start_check
    check (period_start = date_trunc('month', period_start)::date),
  constraint google_business_search_keywords_period_end_check
    check (period_end = date_trunc('month', period_end)::date and period_end >= period_start),
  constraint google_business_search_keywords_impressions_check check (impressions >= 0),
  constraint google_business_search_keywords_location_period_keyword_key
    unique (location_id, period_start, period_end, keyword)
);

create index google_business_search_keywords_location_period_idx
  on public.google_business_search_keywords (location_id, period_end desc, impressions desc);

create table public.google_business_webhook_events (
  event_id text primary key,
  event_type text not null,
  zernio_account_id text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error text,
  payload jsonb not null
);

alter table public.images
  add column if not exists google_business_location_id uuid
    references public.google_business_locations (id) on update cascade on delete cascade,
  add column if not exists provider_media_id text,
  add column if not exists media_category text,
  add column if not exists source text,
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists updated_at timestamptz not null default now();

create unique index images_google_business_provider_media_key
  on public.images (google_business_location_id, provider_media_id)
  where google_business_location_id is not null and provider_media_id is not null;
create index images_google_business_location_idx
  on public.images (google_business_location_id, created_at desc)
  where google_business_location_id is not null;

create or replace function public.set_google_business_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_google_business_connections_updated_at
before update on public.google_business_connections
for each row execute function public.set_google_business_updated_at();
create trigger set_google_business_locations_updated_at
before update on public.google_business_locations
for each row execute function public.set_google_business_updated_at();
create trigger set_google_business_reviews_updated_at
before update on public.google_business_reviews
for each row execute function public.set_google_business_updated_at();
create trigger set_google_business_metrics_updated_at
before update on public.google_business_metrics
for each row execute function public.set_google_business_updated_at();
create trigger set_google_business_search_keywords_updated_at
before update on public.google_business_search_keywords
for each row execute function public.set_google_business_updated_at();

create or replace function public.is_google_business_connection_owner(target_connection_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.google_business_connections
    where id = target_connection_id and profile_id = (select auth.uid())
  );
$$;

create or replace function public.is_google_business_location_owner(target_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.google_business_locations as location
    join public.google_business_connections as connection on connection.id = location.connection_id
    where location.id = target_location_id and connection.profile_id = (select auth.uid())
  );
$$;

revoke all on function public.is_google_business_connection_owner(uuid) from public;
revoke all on function public.is_google_business_location_owner(uuid) from public;
grant execute on function public.is_google_business_connection_owner(uuid) to authenticated;
grant execute on function public.is_google_business_location_owner(uuid) to authenticated;

alter table public.google_business_connections enable row level security;
alter table public.google_business_locations enable row level security;
alter table public.google_business_reviews enable row level security;
alter table public.google_business_metrics enable row level security;
alter table public.google_business_search_keywords enable row level security;
alter table public.google_business_webhook_events enable row level security;
alter table public.images enable row level security;

-- Browser/Supabase clients receive read-only access. All writes go through the
-- authenticated application API so a client cannot bypass the Zernio-first rule.
create policy google_business_connections_owner_read
  on public.google_business_connections for select to authenticated
  using (profile_id = (select auth.uid()));
create policy google_business_locations_owner_read
  on public.google_business_locations for select to authenticated
  using (public.is_google_business_connection_owner(connection_id));
create policy google_business_reviews_owner_read
  on public.google_business_reviews for select to authenticated
  using (public.is_google_business_location_owner(location_id));
create policy google_business_metrics_owner_read
  on public.google_business_metrics for select to authenticated
  using (public.is_google_business_location_owner(location_id));
create policy google_business_keywords_owner_read
  on public.google_business_search_keywords for select to authenticated
  using (public.is_google_business_location_owner(location_id));
create policy google_business_images_owner_read
  on public.images for select to authenticated
  using (
    google_business_location_id is not null
    and public.is_google_business_location_owner(google_business_location_id)
  );

grant select on public.google_business_connections to authenticated;
grant select on public.google_business_locations to authenticated;
grant select on public.google_business_reviews to authenticated;
grant select on public.google_business_metrics to authenticated;
grant select on public.google_business_search_keywords to authenticated;
grant select on public.images to authenticated;

commit;
