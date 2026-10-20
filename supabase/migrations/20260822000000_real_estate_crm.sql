-- PostPooch real-estate CRM
-- Tenant ownership is always public.profiles.id. The API also scopes every query
-- by profile_id; these constraints and RLS policies provide defense in depth.

create or replace function public.set_crm_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.crm_pipeline_stages (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  name text not null,
  color text not null default '#256f68',
  position smallint not null default 0 check (position >= 0),
  is_closed boolean not null default false,
  is_won boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  unique (profile_id, name),
  unique (profile_id, position),
  check (not is_won or is_closed)
);

create table public.crm_contacts (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  first_name text not null,
  last_name text not null default '',
  email text,
  phone text,
  contact_types text[] not null default '{}',
  lead_status text not null default 'new' check (lead_status in ('new', 'contacted', 'qualified', 'nurturing', 'active_client', 'past_client', 'inactive')),
  lead_source text,
  priority text not null default 'warm' check (priority in ('hot', 'warm', 'cold')),
  price_min numeric(14,2) check (price_min is null or price_min >= 0),
  price_max numeric(14,2) check (price_max is null or price_max >= 0),
  preferred_locations text[] not null default '{}',
  preapproved boolean not null default false,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  check (price_min is null or price_max is null or price_max >= price_min),
  check (cardinality(contact_types) <= 8),
  check (cardinality(preferred_locations) <= 20)
);

create table public.crm_tags (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  name text not null,
  color text not null default '#256f68',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  unique (profile_id, name)
);

create table public.crm_contact_tags (
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  contact_id uuid not null,
  tag_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, contact_id, tag_id),
  foreign key (contact_id, profile_id) references public.crm_contacts(id, profile_id) on update cascade on delete cascade,
  foreign key (tag_id, profile_id) references public.crm_tags(id, profile_id) on update cascade on delete cascade
);

create table public.crm_properties (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  property_type text not null default 'single_family' check (property_type in ('single_family', 'condo', 'townhome', 'multi_family', 'land', 'commercial', 'other')),
  listing_status text not null default 'prospect' check (listing_status in ('prospect', 'coming_soon', 'active', 'pending', 'sold', 'leased', 'off_market')),
  mls_number text,
  listing_price numeric(14,2) check (listing_price is null or listing_price >= 0),
  bedrooms numeric(5,1) check (bedrooms is null or bedrooms >= 0),
  bathrooms numeric(5,1) check (bathrooms is null or bathrooms >= 0),
  square_feet integer check (square_feet is null or square_feet >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  unique (profile_id, mls_number)
);

create table public.crm_partners (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  name text not null,
  partner_type text not null default 'vendor' check (partner_type in ('brokerage', 'lender', 'title', 'inspector', 'contractor', 'photographer', 'attorney', 'vendor', 'other')),
  contact_name text,
  email text,
  phone text,
  website text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id)
);

create table public.crm_transactions (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  title text not null,
  contact_id uuid,
  property_id uuid,
  partner_id uuid,
  stage_id uuid not null,
  side text not null default 'buyer' check (side in ('buyer', 'seller', 'landlord', 'tenant', 'referral', 'other')),
  status text not null default 'active' check (status in ('active', 'won', 'lost', 'on_hold')),
  estimated_value numeric(14,2) check (estimated_value is null or estimated_value >= 0),
  offer_amount numeric(14,2) check (offer_amount is null or offer_amount >= 0),
  expected_closing_date date,
  actual_closing_date date,
  estimated_commission numeric(14,2) check (estimated_commission is null or estimated_commission >= 0),
  actual_commission numeric(14,2) check (actual_commission is null or actual_commission >= 0),
  lead_source text,
  description text,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  foreign key (contact_id, profile_id) references public.crm_contacts(id, profile_id) on update cascade on delete restrict,
  foreign key (property_id, profile_id) references public.crm_properties(id, profile_id) on update cascade on delete restrict,
  foreign key (partner_id, profile_id) references public.crm_partners(id, profile_id) on update cascade on delete restrict,
  foreign key (stage_id, profile_id) references public.crm_pipeline_stages(id, profile_id) on update cascade on delete restrict
);

create table public.crm_tasks (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  contact_id uuid,
  property_id uuid,
  transaction_id uuid,
  title text not null,
  task_type text not null default 'follow_up' check (task_type in ('follow_up', 'call', 'email', 'showing', 'open_house', 'inspection', 'appraisal', 'documents', 'closing', 'other')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  due_at timestamptz,
  completed_at timestamptz,
  details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  foreign key (contact_id, profile_id) references public.crm_contacts(id, profile_id) on update cascade on delete cascade,
  foreign key (property_id, profile_id) references public.crm_properties(id, profile_id) on update cascade on delete cascade,
  foreign key (transaction_id, profile_id) references public.crm_transactions(id, profile_id) on update cascade on delete cascade
);

create table public.crm_notes (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  contact_id uuid,
  property_id uuid,
  transaction_id uuid,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, profile_id),
  foreign key (contact_id, profile_id) references public.crm_contacts(id, profile_id) on update cascade on delete cascade,
  foreign key (property_id, profile_id) references public.crm_properties(id, profile_id) on update cascade on delete cascade,
  foreign key (transaction_id, profile_id) references public.crm_transactions(id, profile_id) on update cascade on delete cascade,
  check (contact_id is not null or property_id is not null or transaction_id is not null)
);

create table public.crm_activities (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on update cascade on delete cascade,
  contact_id uuid,
  property_id uuid,
  transaction_id uuid,
  task_id uuid,
  activity_type text not null check (activity_type in ('contact_created', 'contact_updated', 'property_created', 'property_updated', 'transaction_created', 'transaction_updated', 'stage_changed', 'task_created', 'task_completed', 'note_added')),
  summary text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (id, profile_id),
  foreign key (contact_id, profile_id) references public.crm_contacts(id, profile_id) on update cascade on delete cascade,
  foreign key (property_id, profile_id) references public.crm_properties(id, profile_id) on update cascade on delete cascade,
  foreign key (transaction_id, profile_id) references public.crm_transactions(id, profile_id) on update cascade on delete cascade,
  foreign key (task_id, profile_id) references public.crm_tasks(id, profile_id) on update cascade on delete cascade,
  check (jsonb_typeof(metadata) = 'object')
);

create index crm_contacts_profile_created_idx on public.crm_contacts (profile_id, created_at desc);
create index crm_contacts_profile_status_idx on public.crm_contacts (profile_id, lead_status, updated_at desc);
create index crm_contacts_profile_follow_up_idx on public.crm_contacts (profile_id, next_follow_up_at) where next_follow_up_at is not null;
create index crm_contacts_profile_name_idx on public.crm_contacts (profile_id, lower(last_name), lower(first_name));
create index crm_properties_profile_created_idx on public.crm_properties (profile_id, created_at desc);
create index crm_properties_profile_status_idx on public.crm_properties (profile_id, listing_status, updated_at desc);
create index crm_transactions_profile_stage_idx on public.crm_transactions (profile_id, stage_id, position, updated_at desc);
create index crm_transactions_profile_status_idx on public.crm_transactions (profile_id, status, expected_closing_date);
create index crm_transactions_profile_contact_idx on public.crm_transactions (profile_id, contact_id);
create index crm_transactions_profile_property_idx on public.crm_transactions (profile_id, property_id);
create index crm_tasks_profile_due_idx on public.crm_tasks (profile_id, completed_at, due_at);
create index crm_tasks_profile_contact_idx on public.crm_tasks (profile_id, contact_id);
create index crm_tasks_profile_transaction_idx on public.crm_tasks (profile_id, transaction_id);
create index crm_notes_profile_contact_idx on public.crm_notes (profile_id, contact_id, created_at desc);
create index crm_notes_profile_transaction_idx on public.crm_notes (profile_id, transaction_id, created_at desc);
create index crm_activities_profile_created_idx on public.crm_activities (profile_id, created_at desc);
create index crm_partners_profile_type_idx on public.crm_partners (profile_id, partner_type, name);

create trigger set_crm_pipeline_stages_updated_at before update on public.crm_pipeline_stages for each row execute function public.set_crm_updated_at();
create trigger set_crm_contacts_updated_at before update on public.crm_contacts for each row execute function public.set_crm_updated_at();
create trigger set_crm_tags_updated_at before update on public.crm_tags for each row execute function public.set_crm_updated_at();
create trigger set_crm_properties_updated_at before update on public.crm_properties for each row execute function public.set_crm_updated_at();
create trigger set_crm_partners_updated_at before update on public.crm_partners for each row execute function public.set_crm_updated_at();
create trigger set_crm_transactions_updated_at before update on public.crm_transactions for each row execute function public.set_crm_updated_at();
create trigger set_crm_tasks_updated_at before update on public.crm_tasks for each row execute function public.set_crm_updated_at();
create trigger set_crm_notes_updated_at before update on public.crm_notes for each row execute function public.set_crm_updated_at();

create or replace function public.seed_crm_pipeline_stages(target_profile_id uuid)
returns void
language sql
set search_path = public
as $$
  insert into public.crm_pipeline_stages (profile_id, name, color, position, is_closed, is_won)
  values
    (target_profile_id, 'New Lead', '#356f8f', 0, false, false),
    (target_profile_id, 'Contacted', '#c9824f', 1, false, false),
    (target_profile_id, 'Qualified', '#256f68', 2, false, false),
    (target_profile_id, 'Showing / Search', '#9b5c35', 3, false, false),
    (target_profile_id, 'Offer / Agreement', '#6f3f26', 4, false, false),
    (target_profile_id, 'Under Contract', '#b9483a', 5, false, false),
    (target_profile_id, 'Closing', '#746c67', 6, false, false),
    (target_profile_id, 'Closed', '#1e5a55', 7, true, true),
    (target_profile_id, 'Lost', '#9b5c35', 8, true, false)
  on conflict (profile_id, name) do nothing;
$$;

create or replace function public.seed_crm_pipeline_for_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.seed_crm_pipeline_stages(new.id);
  return new;
end;
$$;

create trigger seed_crm_pipeline_after_profile_insert
after insert on public.profiles
for each row execute function public.seed_crm_pipeline_for_new_profile();

select public.seed_crm_pipeline_stages(id) from public.profiles;

alter table public.crm_pipeline_stages enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_tags enable row level security;
alter table public.crm_contact_tags enable row level security;
alter table public.crm_properties enable row level security;
alter table public.crm_partners enable row level security;
alter table public.crm_transactions enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_notes enable row level security;
alter table public.crm_activities enable row level security;

create policy crm_pipeline_stages_owner_all on public.crm_pipeline_stages for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_contacts_owner_all on public.crm_contacts for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_tags_owner_all on public.crm_tags for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_contact_tags_owner_all on public.crm_contact_tags for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_properties_owner_all on public.crm_properties for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_partners_owner_all on public.crm_partners for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_transactions_owner_all on public.crm_transactions for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_tasks_owner_all on public.crm_tasks for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_notes_owner_all on public.crm_notes for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy crm_activities_owner_all on public.crm_activities for all to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

comment on table public.crm_contacts is 'Real-estate contacts owned by a PostPooch profile tenant.';
comment on table public.crm_properties is 'CRM properties, separate from public.properties website listing content.';
comment on table public.crm_transactions is 'Buyer, seller, lease, and referral opportunities in the CRM pipeline.';
comment on column public.crm_contacts.profile_id is 'Server-derived tenant identifier; never accepted from browser input.';
