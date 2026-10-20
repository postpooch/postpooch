import "server-only";

import type { PoolClient } from "pg";

import { getDbPool } from "@/lib/db/client";
import type { NewsletterAudienceInput } from "./input";
import type {
  NewsletterAudience,
  NewsletterContactOption,
} from "./types";

export class NewsletterAudienceNotFoundError extends Error {
  constructor() {
    super("Audience not found.");
    this.name = "NewsletterAudienceNotFoundError";
  }
}

export class NewsletterAudienceContactError extends Error {
  constructor() {
    super("One or more selected contacts are unavailable.");
    this.name = "NewsletterAudienceContactError";
  }
}

export class NewsletterAudienceConflictError extends Error {
  constructor() {
    super("This audience has campaign history and cannot be deleted.");
    this.name = "NewsletterAudienceConflictError";
  }
}

const AUDIENCE_COLUMNS = `
  a.id,
  a.name,
  a.created_at::text as "createdAt",
  count(c.id)::int as "memberCount",
  count(c.id) filter (
    where c.email is not null
      and btrim(c.email) <> ''
      and c.email_marketing_status in ('unknown', 'subscribed')
  )::int as "contactCount",
  coalesce(
    array_agg(c.id order by lower(c.last_name), lower(c.first_name), c.id)
      filter (where c.id is not null),
    '{}'::uuid[]
  ) as "contactIds"
`;

export async function listNewsletterAudiencesForProfile(
  profileId: string,
): Promise<NewsletterAudience[]> {
  const result = await getDbPool().query<NewsletterAudience>(
    `
      select ${AUDIENCE_COLUMNS}
      from public.newsletter_audiences a
      left join public.newsletter_audience_contact_connections acc
        on acc.newsletter_audience_id = a.id
      left join public.crm_contacts c
        on c.id = acc.crm_contact_id
       and c.profile_id = a.profile_id
      where a.profile_id = $1::uuid
      group by a.id, a.name, a.created_at
      order by lower(a.name), a.created_at, a.id
    `,
    [profileId],
  );
  return result.rows;
}

export async function listNewsletterContactsForProfile(
  profileId: string,
): Promise<NewsletterContactOption[]> {
  const result = await getDbPool().query<NewsletterContactOption>(
    `
      select
        id,
        first_name as "firstName",
        last_name as "lastName",
        email,
        email_marketing_status as "emailMarketingStatus"
      from public.crm_contacts
      where profile_id = $1::uuid
      order by lower(last_name), lower(first_name), created_at, id
    `,
    [profileId],
  );
  return result.rows;
}

export async function createNewsletterAudience(input: {
  profileId: string;
  audience: NewsletterAudienceInput;
}): Promise<NewsletterAudience> {
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    await assertContactsOwned(client, input.profileId, input.audience.contactIds);

    const result = await client.query<{ id: string }>(
      `
        insert into public.newsletter_audiences (profile_id, name)
        values ($1::uuid, $2)
        returning id
      `,
      [input.profileId, input.audience.name],
    );
    const audienceId = result.rows[0]?.id;
    if (!audienceId) throw new Error("NEWSLETTER_AUDIENCE_INSERT_FAILED");

    await insertAudienceContacts(client, audienceId, input.audience.contactIds);
    const audience = await getAudience(client, input.profileId, audienceId);
    await client.query("commit");
    return audience;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateNewsletterAudience(input: {
  profileId: string;
  audienceId: string;
  audience: NewsletterAudienceInput;
}): Promise<NewsletterAudience> {
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    await lockOwnedAudience(client, input.profileId, input.audienceId);
    await assertContactsOwned(client, input.profileId, input.audience.contactIds);

    await client.query(
      `
        update public.newsletter_audiences
        set name = $3
        where id = $1::uuid and profile_id = $2::uuid
      `,
      [input.audienceId, input.profileId, input.audience.name],
    );
    await client.query(
      `delete from public.newsletter_audience_contact_connections where newsletter_audience_id = $1::uuid`,
      [input.audienceId],
    );
    await insertAudienceContacts(
      client,
      input.audienceId,
      input.audience.contactIds,
    );

    const audience = await getAudience(client, input.profileId, input.audienceId);
    await client.query("commit");
    return audience;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteNewsletterAudience(input: {
  profileId: string;
  audienceId: string;
}) {
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    await lockOwnedAudience(client, input.profileId, input.audienceId);
    const history = await client.query<{ exists: boolean }>(
      `
        select exists (
          select 1
          from public.newsletter_campaign_audience_connections cac
          where cac.newsletter_audience_id = $1::uuid
        ) as exists
      `,
      [input.audienceId],
    );
    if (history.rows[0]?.exists) throw new NewsletterAudienceConflictError();

    await client.query(
      `delete from public.newsletter_audiences where id = $1::uuid and profile_id = $2::uuid`,
      [input.audienceId, input.profileId],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

async function lockOwnedAudience(
  client: PoolClient,
  profileId: string,
  audienceId: string,
) {
  const result = await client.query<{ id: string }>(
    `
      select id
      from public.newsletter_audiences
      where id = $1::uuid and profile_id = $2::uuid
      for update
    `,
    [audienceId, profileId],
  );
  if (!result.rows[0]) throw new NewsletterAudienceNotFoundError();
}

async function assertContactsOwned(
  client: PoolClient,
  profileId: string,
  contactIds: string[],
) {
  const result = await client.query<{ id: string }>(
    `
      select id
      from public.crm_contacts
      where profile_id = $1::uuid and id = any($2::uuid[])
    `,
    [profileId, contactIds],
  );
  if (result.rows.length !== contactIds.length) {
    throw new NewsletterAudienceContactError();
  }
}

async function insertAudienceContacts(
  client: PoolClient,
  audienceId: string,
  contactIds: string[],
) {
  await client.query(
    `
      insert into public.newsletter_audience_contact_connections (
        newsletter_audience_id,
        crm_contact_id
      )
      select $1::uuid, contact_id
      from unnest($2::uuid[]) as contact_id
      on conflict do nothing
    `,
    [audienceId, contactIds],
  );
}

async function getAudience(
  client: PoolClient,
  profileId: string,
  audienceId: string,
) {
  const result = await client.query<NewsletterAudience>(
    `
      select ${AUDIENCE_COLUMNS}
      from public.newsletter_audiences a
      left join public.newsletter_audience_contact_connections acc
        on acc.newsletter_audience_id = a.id
      left join public.crm_contacts c
        on c.id = acc.crm_contact_id
       and c.profile_id = a.profile_id
      where a.id = $1::uuid and a.profile_id = $2::uuid
      group by a.id, a.name, a.created_at
    `,
    [audienceId, profileId],
  );
  const audience = result.rows[0];
  if (!audience) throw new NewsletterAudienceNotFoundError();
  return audience;
}
