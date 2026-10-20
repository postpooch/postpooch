begin;

alter table public.websites
  add column if not exists blog_posts_enabled boolean not null default true;

create index if not exists blog_posts_website_created_idx
  on public.blog_posts (website_id, created_at desc);

create or replace function public.website_blog_posts_are_public(target_website_id uuid)
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
       and blog_posts_enabled
  );
$$;

revoke all on function public.website_blog_posts_are_public(uuid) from public;
grant execute on function public.website_blog_posts_are_public(uuid) to anon, authenticated;

alter table public.blog_posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'blog_posts'
       and policyname = 'blog_posts_public_read'
  ) then
    create policy blog_posts_public_read
      on public.blog_posts for select to anon, authenticated
      using (
        coalesce(title, '') <> ''
        and public.website_blog_posts_are_public(website_id)
      );
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'blog_posts'
       and policyname = 'blog_posts_owner_read'
  ) then
    create policy blog_posts_owner_read
      on public.blog_posts for select to authenticated
      using (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'blog_posts'
       and policyname = 'blog_posts_owner_insert'
  ) then
    create policy blog_posts_owner_insert
      on public.blog_posts for insert to authenticated
      with check (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'blog_posts'
       and policyname = 'blog_posts_owner_update'
  ) then
    create policy blog_posts_owner_update
      on public.blog_posts for update to authenticated
      using (public.is_website_owner(website_id))
      with check (public.is_website_owner(website_id));
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'blog_posts'
       and policyname = 'blog_posts_owner_delete'
  ) then
    create policy blog_posts_owner_delete
      on public.blog_posts for delete to authenticated
      using (public.is_website_owner(website_id));
  end if;
end
$$;

grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

commit;
