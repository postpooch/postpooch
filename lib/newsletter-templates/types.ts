/**
 * Newsletter template catalog DTOs.
 *
 * Rows come from public.newsletter_templates. There is no name column, so the
 * gallery title is derived from preview_img_path. Never send `content` (MJML)
 * to the picker client — only id + preview URL + display name.
 */

export type NewsletterTemplateRow = {
  id: string;
  preview_img_path: string | null;
  created_at: string;
};

export type NewsletterTemplateCard = {
  id: string;
  previewUrl: string;
  name: string;
};

export type NewsletterTemplateCursor = {
  createdAt: string;
  id: string;
};

export type NewsletterTemplatePage = {
  templates: NewsletterTemplateCard[];
  nextCursor: NewsletterTemplateCursor | null;
};
