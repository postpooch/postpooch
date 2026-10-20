import "server-only";

import { cache } from "react";

import { getDbPool } from "@/lib/db/client";

import { toEditorTemplateCards } from "./catalog";
import { requireR2PublicBaseUrl } from "./preview-url";
import type { EditorTemplateCard, EditorTemplateRow } from "./types";

/**
 * Editor-accessible templates for the social canvas picker.
 *
 * Visibility is the table flag, not profile ownership: a row appears iff
 * editor_accessible is true. Preview URLs are built here so the client never
 * needs CLOUDFLARE_R2_PUBLIC_BASE_URL. Request-memoized so multiple server
 * callers share one query.
 */
export const getEditorTemplateCards = cache(
  async (): Promise<EditorTemplateCard[]> => {
    const publicBaseUrl = requireR2PublicBaseUrl(
      process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
    );
    const rows = await listEditorAccessibleTemplateRows();
    return toEditorTemplateCards(rows, publicBaseUrl);
  },
);

async function listEditorAccessibleTemplateRows(): Promise<EditorTemplateRow[]> {
  const result = await getDbPool().query<EditorTemplateRow>(
    `
      select
        id,
        text,
        preview_path
      from public.templates
      where editor_accessible is true
        and nullif(btrim(preview_path), '') is not null
      order by created_at desc, id desc
    `,
  );

  return result.rows;
}
