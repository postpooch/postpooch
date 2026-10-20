import { normalizePreviewObjectKey, socialTemplatePreviewUrl } from "./preview-url";
import type { EditorTemplateCard, EditorTemplateRow } from "./types";

const FALLBACK_NAME = "Template";
const MAX_NAME_LENGTH = 48;
const HASH_STEM_PATTERN = /^[a-f0-9-]{16,}$/i;

export function editorTemplateDisplayName(
  text: string | null | undefined,
  previewPath?: string | null,
): string {
  const firstLine = text?.trim().split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (firstLine) {
    if (firstLine.length <= MAX_NAME_LENGTH) return firstLine;
    return `${firstLine.slice(0, MAX_NAME_LENGTH - 1).trimEnd()}…`;
  }
  return humanizePreviewStem(previewPath) ?? FALLBACK_NAME;
}

function humanizePreviewStem(previewPath: string | null | undefined): string | null {
  const key = normalizePreviewObjectKey(previewPath);
  const stem = key
    ?.split("/")
    .at(-1)
    ?.replace(/\.[a-z0-9]+$/i, "")
    ?.trim();
  if (!stem || HASH_STEM_PATTERN.test(stem)) return null;

  const spaced = stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  if (!spaced) return null;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function toEditorTemplateCard(
  row: EditorTemplateRow,
  publicBaseUrl: string,
): EditorTemplateCard | null {
  const previewUrl = socialTemplatePreviewUrl(publicBaseUrl, row.preview_path);
  if (!previewUrl) return null;

  return {
    id: row.id,
    previewUrl,
    name: editorTemplateDisplayName(row.text, row.preview_path),
    description: row.text?.trim() ?? "",
  };
}

export function toEditorTemplateCards(
  rows: readonly EditorTemplateRow[],
  publicBaseUrl: string,
): EditorTemplateCard[] {
  const cards: EditorTemplateCard[] = [];
  for (const row of rows) {
    const card = toEditorTemplateCard(row, publicBaseUrl);
    if (card) cards.push(card);
  }
  return cards;
}
