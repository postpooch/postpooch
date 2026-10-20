begin;

create table if not exists public.website_template_settings (
  website_id uuid not null references public.websites (id) on update cascade on delete cascade,
  template text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_template_settings_pkey primary key (website_id, template),
  constraint website_template_settings_settings_object_check check (jsonb_typeof(settings) = 'object')
);

create index if not exists website_template_settings_website_idx
  on public.website_template_settings (website_id);

alter table public.pages
  add column if not exists template text;

update public.pages as page
set template = website.template
from public.websites as website
where page.website_id = website.id
  and page.template is null
  and website.template is not null;

alter table public.pages
  drop constraint if exists pages_website_id_path_key;

delete from public.pages
where template is null;

alter table public.pages
  alter column template set not null;

alter table public.pages
  add constraint pages_website_template_path_key unique (website_id, template, path);

create index if not exists pages_website_template_idx
  on public.pages (website_id, template);

insert into public.website_template_settings (website_id, template, settings)
select website.id, website.template, website.settings
from public.websites as website
where website.template is not null
  and jsonb_typeof(website.settings) = 'object'
on conflict (website_id, template) do nothing;

create or replace function public.set_website_template_settings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_website_template_settings_updated_at on public.website_template_settings;
create trigger set_website_template_settings_updated_at
before update on public.website_template_settings
for each row execute function public.set_website_template_settings_updated_at();

alter table public.website_template_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'website_template_settings'
       and policyname = 'website_template_settings_owner_read'
  ) then
    create policy website_template_settings_owner_read
      on public.website_template_settings for select to authenticated
      using (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'website_template_settings'
       and policyname = 'website_template_settings_owner_insert'
  ) then
    create policy website_template_settings_owner_insert
      on public.website_template_settings for insert to authenticated
      with check (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'website_template_settings'
       and policyname = 'website_template_settings_owner_update'
  ) then
    create policy website_template_settings_owner_update
      on public.website_template_settings for update to authenticated
      using (public.is_website_owner(website_id))
      with check (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'website_template_settings'
       and policyname = 'website_template_settings_owner_delete'
  ) then
    create policy website_template_settings_owner_delete
      on public.website_template_settings for delete to authenticated
      using (public.is_website_owner(website_id));
  end if;
end
$$;

grant select on public.website_template_settings to authenticated;
grant insert, update, delete on public.website_template_settings to authenticated;

commit;
