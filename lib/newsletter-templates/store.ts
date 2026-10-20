import "server-only";

import { getDbPool } from "@/lib/db/client";
import { requireR2PublicBaseUrl } from "@/lib/social-templates/preview-url";

import { toNewsletterTemplateCard, toNewsletterTemplateCards } from "./catalog";
import type {
  NewsletterTemplateCard,
  NewsletterTemplateCursor,
  NewsletterTemplatePage,
  NewsletterTemplateRow,
} from "./types";

export const NEWSLETTER_TEMPLATE_PAGE_SIZE = 24;

/**
 * Paginated newsletter templates for the dashboard picker.
 * Newest first; only rows with a usable preview path become cards.
 */
export async function listNewsletterTemplateCards(input?: {
  limit?: number;
  cursor?: NewsletterTemplateCursor;
}): Promise<NewsletterTemplatePage> {
  const publicBaseUrl = requireR2PublicBaseUrl(
    process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
  );
  const limit = Math.min(
    Math.max(Math.trunc(input?.limit ?? NEWSLETTER_TEMPLATE_PAGE_SIZE), 1),
    48,
  );

  const rows = await listNewsletterTemplateRows({
    limit: limit + 1,
    cursor: input?.cursor,
  });

  const hasMore = rows.length > limit;
  // Slice by row count so nextCursor stays aligned with DB pagination.
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const lastRow = pageRows.at(-1);

  return {
    templates: toNewsletterTemplateCards(pageRows, publicBaseUrl),
    nextCursor:
      hasMore && lastRow
        ? { createdAt: lastRow.created_at, id: lastRow.id }
        : null,
  };
}

export async function getNewsletterTemplateCard(
  id: string,
): Promise<NewsletterTemplateCard | null> {
  const publicBaseUrl = requireR2PublicBaseUrl(
    process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
  );
  const result = await getDbPool().query<NewsletterTemplateRow>(
    `
      select
        id,
        preview_img_path,
        created_at::text as created_at
      from public.newsletter_templates
      where id = $1::uuid
      limit 1
    `,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return toNewsletterTemplateCard(row, publicBaseUrl);
}

async function listNewsletterTemplateRows(input: {
  limit: number;
  cursor?: NewsletterTemplateCursor;
}): Promise<NewsletterTemplateRow[]> {
  const result = await getDbPool().query<NewsletterTemplateRow>(
    `
      select
        t.id,
        t.preview_img_path,
        t.created_at::text as created_at
      from public.newsletter_templates as t
      where nullif(btrim(t.preview_img_path), '') is not null
        and (
          $1::timestamptz is null
          or t.created_at < $1::timestamptz
          or (t.created_at = $1::timestamptz and t.id < $2::uuid)
        )
      order by t.created_at desc, t.id desc
      limit $3::integer
    `,
    [input.cursor?.createdAt ?? null, input.cursor?.id ?? null, input.limit],
  );

  return result.rows;
}
