-- Editor drafts share the media table with templates and schedules.
-- Each media row belongs to exactly one parent: schedule, template, or post project.
-- Fabric JSON lives on media.image_design. post_projects.name holds the title.

begin;

alter table public.media
  add column if not exists post_project_id uuid
  references public.post_projects (id)
  on update cascade
  on delete cascade;

alter table public.post_projects
  add column if not exists name text;

comment on column public.media.post_project_id is
  'Draft parent. Exactly one of schedule_id, template_id, post_project_id must be set.';

comment on column public.post_projects.name is
  'Editor project title. Fabric JSON lives on child media.image_design.';

-- Old rule: parent is schedule XOR template. Must drop before project-owned media can exist.
alter table public.media
  drop constraint if exists media_has_exactly_one_parent;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'post_projects'
      and column_name = 'image_design'
  ) then
    update public.post_projects
    set name = nullif(btrim(image_design ->> 'projectName'), '')
    where image_design is not null
      and nullif(btrim(coalesce(name, '')), '') is null;

    insert into public.media (post_project_id, display_order, image_design)
    select
      p.id,
      1,
      case
        when jsonb_typeof(p.image_design) = 'object'
          then p.image_design - 'projectName'
        else p.image_design
      end
    from public.post_projects as p
    where p.image_design is not null
      and not exists (
        select 1
        from public.media as m
        where m.post_project_id = p.id
      );

    alter table public.post_projects
      drop column image_design;
  end if;
end $$;

alter table public.media
  add constraint media_has_exactly_one_parent
  check (num_nonnulls(schedule_id, template_id, post_project_id) = 1)
  not valid;

create index if not exists media_post_project_id_idx
  on public.media (post_project_id);

create unique index if not exists media_post_project_display_order_unique
  on public.media (post_project_id, display_order)
  where post_project_id is not null;

commit;
