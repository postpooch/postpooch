import "server-only";

import type { TemplateContent } from "@templatical/types";

import { getDbPool } from "@/lib/db/client";

import {
  asNewsletterEditorContent,
  createBlankEditorContent,
  isBlankStoredEditorContent,
} from "./editor-content";
import {
  importMjmlToEditorContent,
  looksLikeMjml,
} from "./mjml-to-editor";
import type { NewsletterEmail, NewsletterEmailRow } from "./types";

function toNewsletterEmail(row: NewsletterEmailRow): NewsletterEmail {
  return {
    id: row.id,
    createdAt: row.created_at,
    profileId: row.profile_id,
    campaignId: row.newsletter_campaign_id,
    content: row.content ?? null,
    isBlank: isBlankStoredEditorContent(row.content),
  };
}

/**
 * Create an empty draft as Templatical JSON (never MJML).
 */
export async function createBlankNewsletterEmail(
  profileId: string,
): Promise<NewsletterEmail> {
  return insertNewsletterEmailContent(profileId, createBlankEditorContent());
}

/**
 * Clone a catalog template into a draft.
 * Catalog rows are MJML → convert once to Templatical JSON → store JSON.
 */
export async function createNewsletterEmailFromTemplate(input: {
  profileId: string;
  templateId: string;
}): Promise<NewsletterEmail | null> {
  const templateResult = await getDbPool().query<{ content: string | null }>(
    `
      select content
      from public.newsletter_templates
      where id = $1::uuid
      limit 1
    `,
    [input.templateId],
  );
  const template = templateResult.rows[0];
  if (!template) return null;

  const source = template.content?.trim() ?? "";
  if (!source || !looksLikeMjml(source)) {
    throw new Error("That template has no usable MJML content.");
  }

  return insertNewsletterEmailContent(
    input.profileId,
    importMjmlToEditorContent(source),
  );
}

async function insertNewsletterEmailContent(
  profileId: string,
  content: TemplateContent,
): Promise<NewsletterEmail> {
  if (!asNewsletterEditorContent(content)) {
    throw new Error("Unable to serialize newsletter content.");
  }

  const result = await getDbPool().query<NewsletterEmailRow>(
    `
      insert into public.newsletter_emails (profile_id, content)
      values ($1::uuid, $2::jsonb)
      returning
        id,
        created_at::text as created_at,
        profile_id,
        newsletter_campaign_id,
        content
    `,
    [profileId, JSON.stringify(content)],
  );
  const row = result.rows[0];
  if (!row) {
    throw new Error("Newsletter email insert did not return a row.");
  }
  return toNewsletterEmail(row);
}

/**
 * Load a draft the profile owns. Returns null when missing or not theirs.
 */
export async function getNewsletterEmailForProfile(
  emailId: string,
  profileId: string,
): Promise<NewsletterEmail | null> {
  const result = await getDbPool().query<NewsletterEmailRow>(
    `
      select
        id,
        created_at::text as created_at,
        profile_id,
        newsletter_campaign_id,
        content
      from public.newsletter_emails
      where id = $1::uuid
        and profile_id = $2::uuid
      limit 1
    `,
    [emailId, profileId],
  );
  const row = result.rows[0];
  if (!row) return null;
  return toNewsletterEmail(row);
}

/**
 * Replace an email's Templatical JSON document, scoped to its owner.
 * Returning null deliberately conflates missing and unauthorized rows.
 */
export async function updateNewsletterEmailContent(input: {
  emailId: string;
  profileId: string;
  content: TemplateContent;
}): Promise<NewsletterEmail | null> {
  if (!asNewsletterEditorContent(input.content)) {
    throw new Error("Invalid newsletter editor content.");
  }

  const result = await getDbPool().query<NewsletterEmailRow>(
    `
      update public.newsletter_emails
      set content = $3::jsonb
      where id = $1::uuid
        and profile_id = $2::uuid
      returning
        id,
        created_at::text as created_at,
        profile_id,
        newsletter_campaign_id,
        content
    `,
    [input.emailId, input.profileId, JSON.stringify(input.content)],
  );
  const row = result.rows[0];
  if (!row) return null;
  return toNewsletterEmail(row);
}
