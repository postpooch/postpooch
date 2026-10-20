/**
 * Editor template catalog DTOs.
 *
 * Rows come from public.templates. The table has no name, pillar, or format
 * columns, so the gallery card is the preview image plus a caption-derived
 * title. Keep this shape small: never pass ai_prompt to the client.
 */

export type EditorTemplateRow = {
  id: string;
  text: string | null;
  preview_path: string | null;
};

export type EditorTemplateCard = {
  id: string;
  previewUrl: string;
  name: string;
  /** Caption text used for search; the gallery does not render it. */
  description: string;
};
