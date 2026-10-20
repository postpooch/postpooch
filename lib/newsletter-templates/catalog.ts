import {
  normalizePreviewObjectKey,
  socialTemplatePreviewUrl,
} from "@/lib/social-templates/preview-url";

import type { NewsletterTemplateCard, NewsletterTemplateRow } from "./types";

const FALLBACK_NAME = "Newsletter template";
const HASH_STEM_PATTERN = /^[a-f0-9-]{16,}$/i;

export function newsletterTemplateDisplayName(
  previewPath: string | null | undefined,
): string {
  return humanizePreviewStem(previewPath) ?? FALLBACK_NAME;
}

function humanizePreviewStem(
  previewPath: string | null | undefined,
): string | null {
  const key = normalizePreviewObjectKey(previewPath);
  const stem = key
    ?.split("/")
    .at(-1)
    ?.replace(/\.[a-z0-9]+$/i, "")
    ?.trim();
  if (!stem || HASH_STEM_PATTERN.test(stem)) return null;

  const spaced = stem
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (!spaced) return null;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function toNewsletterTemplateCard(
  row: NewsletterTemplateRow,
  publicBaseUrl: string,
): NewsletterTemplateCard | null {
  const previewUrl = socialTemplatePreviewUrl(
    publicBaseUrl,
    row.preview_img_path,
  );
  if (!previewUrl) return null;

  return {
    id: row.id,
    previewUrl,
    name: newsletterTemplateDisplayName(row.preview_img_path),
  };
}

export function toNewsletterTemplateCards(
  rows: readonly NewsletterTemplateRow[],
  publicBaseUrl: string,
): NewsletterTemplateCard[] {
  const cards: NewsletterTemplateCard[] = [];
  for (const row of rows) {
    const card = toNewsletterTemplateCard(row, publicBaseUrl);
    if (card) cards.push(card);
  }
  return cards;
}
