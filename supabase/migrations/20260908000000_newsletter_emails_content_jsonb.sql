-- Store newsletter draft documents as jsonb (Templatical JSON).
-- Catalog templates remain text MJML on newsletter_templates.content.
--
-- Legacy MJML drafts become a jsonb string so they survive the cast; the app
-- converts them to a Templatical object on first editor load.

begin;

create or replace function public.newsletter_emails_content_to_jsonb(raw text)
returns jsonb
language plpgsql
immutable
as $$
begin
  if raw is null or btrim(raw) = '' then
    return null;
  end if;

  begin
    if jsonb_typeof(raw::jsonb) = 'object' then
      return raw::jsonb;
    end if;
  exception
    when others then
      null;
  end;

  -- MJML / non-JSON text → jsonb string (app migrates on load).
  return to_jsonb(raw);
end;
$$;

alter table public.newsletter_emails
  alter column content type jsonb
  using public.newsletter_emails_content_to_jsonb(content);

alter table public.newsletter_emails
  drop constraint if exists newsletter_emails_content_document_check;

alter table public.newsletter_emails
  add constraint newsletter_emails_content_document_check
  check (
    content is null
    or jsonb_typeof(content) = 'object'
    or jsonb_typeof(content) = 'string'
  );

drop function public.newsletter_emails_content_to_jsonb(text);

commit;
