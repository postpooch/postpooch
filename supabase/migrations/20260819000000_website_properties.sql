begin;

alter table public.websites
  add column if not exists properties_enabled boolean not null default true;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on update cascade on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null,
  status text not null default 'for_sale',
  property_type text not null default '',
  title text not null default '',
  address text not null default '',
  neighborhood text not null default '',
  city text not null default '',
  region text not null default '',
  postal_code text not null default '',
  country text not null default 'US',
  price_amount numeric(14, 2),
  currency text not null default 'USD',
  bedrooms numeric(5, 1),
  bathrooms numeric(5, 1),
  living_area numeric(12, 2),
  lot_size numeric(14, 2),
  area_unit text not null default 'sqft',
  year_built integer,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  is_visible boolean not null default true,
  display_order integer not null default 0,
  constraint properties_status_check check (
    status in ('for_sale', 'coming_soon', 'pending', 'sold', 'for_rent', 'rented', 'off_market')
  ),
  constraint properties_area_unit_check check (area_unit in ('sqft', 'sqm')),
  constraint properties_slug_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint properties_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint properties_country_check check (country = '' or country ~ '^[A-Z]{2}$'),
  constraint properties_price_check check (price_amount is null or price_amount >= 0),
  constraint properties_bedrooms_check check (bedrooms is null or bedrooms >= 0),
  constraint properties_bathrooms_check check (bathrooms is null or bathrooms >= 0),
  constraint properties_living_area_check check (living_area is null or living_area >= 0),
  constraint properties_lot_size_check check (lot_size is null or lot_size >= 0),
  constraint properties_year_built_check check (year_built is null or year_built between 1000 and 3000),
  constraint properties_display_order_check check (display_order >= 0),
  constraint properties_visible_identity_check check (
    not is_visible or title <> '' or address <> ''
  ),
  constraint properties_features_array_check check (jsonb_typeof(features) = 'array'),
  constraint properties_images_array_check check (jsonb_typeof(images) = 'array')
);

create unique index if not exists properties_website_slug_unique_lower
  on public.properties (website_id, lower(slug));

create index if not exists properties_website_public_order_idx
  on public.properties (website_id, featured desc, display_order asc, created_at asc)
  where is_visible;

create index if not exists properties_website_updated_idx
  on public.properties (website_id, updated_at desc);

-- Preserve existing template listings by converting any legacy catalog arrays
-- into first-class tenant records. Rows already migrated are left untouched.
with legacy_catalog as (
  select
    website.id as website_id,
    website.template,
    entry.item,
    entry.ordinality,
    trim(both '-' from lower(regexp_replace(
      coalesce(
        nullif(entry.item ->> 'slug', ''),
        nullif(entry.item ->> 'address', ''),
        nullif(entry.item ->> 'title', ''),
        nullif(entry.item ->> 'name', ''),
        'property-' || entry.ordinality::text
      ),
      '[^a-zA-Z0-9]+', '-', 'g'
    ))) as normalized_slug
  from public.websites as website
  cross join lateral jsonb_array_elements(
    coalesce(
      website.settings -> 'catalog' ->
        case when website.template in ('elena', 'harbor', 'rowan') then 'listings' else 'properties' end,
      '[]'::jsonb
    )
  ) with ordinality as entry(item, ordinality)
  where website.template in ('elena', 'harbor', 'luxury', 'mara', 'mila', 'nathan', 'rowan', 'rowe', 'vale', 'voss')
)
insert into public.properties (
  website_id, slug, status, property_type, title, address, neighborhood,
  city, region, country, price_amount, currency, bedrooms, bathrooms,
  living_area, lot_size, area_unit, year_built, description, features,
  images, featured, is_visible, display_order
)
select
  website_id,
  normalized_slug,
  case
    when lower(coalesce(item ->> 'status', '')) like '%coming%' then 'coming_soon'
    when lower(coalesce(item ->> 'status', '')) like '%pending%' then 'pending'
    when lower(coalesce(item ->> 'status', '')) like '%rented%' then 'rented'
    when lower(coalesce(item ->> 'status', '')) like '%rent%' then 'for_rent'
    when lower(coalesce(item ->> 'status', '')) like '%sold%' then 'sold'
    when lower(coalesce(item ->> 'status', '')) like '%off%' then 'off_market'
    else 'for_sale'
  end,
  coalesce(item ->> 'type', item ->> 'eyebrow', 'Residence'),
  coalesce(item ->> 'title', item ->> 'name', item ->> 'address', ''),
  coalesce(item ->> 'address', item ->> 'location', item ->> 'title', item ->> 'name', ''),
  coalesce(item ->> 'neighborhood', item ->> 'neighbourhood', item ->> 'area', ''),
  coalesce(item ->> 'city', ''),
  '',
  case when template = 'mila' then 'NL' when template = 'mara' then 'CA' else 'US' end,
  nullif(regexp_replace(coalesce(item ->> 'price', ''), '[^0-9]', '', 'g'), '')::numeric,
  case when template = 'mila' then 'EUR' when template = 'mara' then 'CAD' else 'USD' end,
  nullif(regexp_replace(coalesce(item ->> 'beds', item ->> 'bedrooms', ''), '[^0-9.]', '', 'g'), '')::numeric,
  nullif(regexp_replace(coalesce(item ->> 'baths', item ->> 'bathrooms', ''), '[^0-9.]', '', 'g'), '')::numeric,
  nullif(regexp_replace(coalesce(item ->> 'sqft', item ->> 'living', item ->> 'area', ''), '[^0-9.]', '', 'g'), '')::numeric,
  nullif(regexp_replace(coalesce(item ->> 'plot', item ->> 'acres', ''), '[^0-9.]', '', 'g'), '')::numeric,
  case when template = 'mila' then 'sqm' else 'sqft' end,
  nullif(regexp_replace(coalesce(item ->> 'year', ''), '[^0-9]', '', 'g'), '')::integer,
  coalesce(item ->> 'description', item ->> 'summary', item ->> 'blurb', item ->> 'intro', ''),
  case
    when jsonb_typeof(item -> 'features') = 'array' then item -> 'features'
    when jsonb_typeof(item -> 'details') = 'array' then item -> 'details'
    else '[]'::jsonb
  end,
  case
    when jsonb_typeof(item -> 'gallery') = 'array' and jsonb_array_length(item -> 'gallery') > 0 then item -> 'gallery'
    when jsonb_typeof(item -> 'images') = 'array' and jsonb_array_length(item -> 'images') > 0 then item -> 'images'
    when coalesce(item ->> 'image', item ->> 'hero') is not null then jsonb_build_array(coalesce(item ->> 'image', item ->> 'hero'))
    else '[]'::jsonb
  end,
  ordinality <= 3,
  true,
  ordinality - 1
from legacy_catalog
where normalized_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
on conflict do nothing;

create or replace function public.set_property_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_property_updated_at on public.properties;
create trigger set_property_updated_at
before update on public.properties
for each row execute function public.set_property_updated_at();

create or replace function public.is_website_owner(target_website_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.websites
     where id = target_website_id
       and profile_id = (select auth.uid())
  );
$$;

create or replace function public.website_properties_are_public(target_website_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.websites
     where id = target_website_id
       and properties_enabled
  );
$$;

revoke all on function public.is_website_owner(uuid) from public;
revoke all on function public.website_properties_are_public(uuid) from public;
grant execute on function public.is_website_owner(uuid) to authenticated;
grant execute on function public.website_properties_are_public(uuid) to anon, authenticated;

alter table public.properties enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'properties'
       and policyname = 'properties_public_read'
  ) then
    create policy properties_public_read
      on public.properties for select to anon, authenticated
      using (is_visible and public.website_properties_are_public(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'properties'
       and policyname = 'properties_owner_read'
  ) then
    create policy properties_owner_read
      on public.properties for select to authenticated
      using (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'properties'
       and policyname = 'properties_owner_insert'
  ) then
    create policy properties_owner_insert
      on public.properties for insert to authenticated
      with check (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'properties'
       and policyname = 'properties_owner_update'
  ) then
    create policy properties_owner_update
      on public.properties for update to authenticated
      using (public.is_website_owner(website_id))
      with check (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'properties'
       and policyname = 'properties_owner_delete'
  ) then
    create policy properties_owner_delete
      on public.properties for delete to authenticated
      using (public.is_website_owner(website_id));
  end if;
end
$$;

grant select on public.properties to anon, authenticated;
grant insert, update, delete on public.properties to authenticated;

commit;
