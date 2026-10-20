begin;

alter table public.google_business_locations
  add column if not exists open_info jsonb not null default '{}'::jsonb,
  add column if not exists service_area jsonb not null default '{}'::jsonb,
  add column if not exists more_hours jsonb not null default '[]'::jsonb,
  add column if not exists attributes jsonb not null default '[]'::jsonb,
  add column if not exists place_actions jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_open_info_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_open_info_check
      check (jsonb_typeof(open_info) = 'object');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_service_area_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_service_area_check
      check (jsonb_typeof(service_area) = 'object');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_more_hours_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_more_hours_check
      check (jsonb_typeof(more_hours) = 'array');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_attributes_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_attributes_check
      check (jsonb_typeof(attributes) = 'array');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_place_actions_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_place_actions_check
      check (jsonb_typeof(place_actions) = 'array');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_special_hours_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_special_hours_check
      check (jsonb_typeof(special_hours) = 'object');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'google_business_locations_storefront_address_object_check'
  ) then
    alter table public.google_business_locations
      add constraint google_business_locations_storefront_address_object_check
      check (storefront_address is null or jsonb_typeof(storefront_address) = 'object');
  end if;
end
$$;

commit;
