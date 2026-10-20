import { convertMjmlTemplate } from "@templatical/import-mjml";
import type { TemplateContent } from "@templatical/types";

export function looksLikeMjml(text: string) {
  const start = text.replace(/^\uFEFF/, "").trimStart().slice(0, 2_000);
  return /<mjml[\s>]/i.test(start) || /<mj-[a-z]/i.test(start);
}

/**
 * Convert catalog MJML into Templatical's editable JSON using the official
 * importer. Callers should persist the returned JSON as the email draft.
 */
export function importMjmlToEditorContent(mjml: string): TemplateContent {
  const source = mjml.trim();
  if (!source) {
    throw new Error("Cannot import empty MJML.");
  }
  if (!looksLikeMjml(source)) {
    throw new Error("Content does not look like MJML.");
  }

  const { content, report } = convertMjmlTemplate(source);

  if (content.blocks.length === 0) {
    throw new Error("MJML import produced no editable blocks.");
  }

  if (report.summary.approximated > 0 || report.summary.htmlFallback > 0) {
    console.info("[newsletter-mjml-import]", report.summary, {
      approximated: report.entries
        .filter((entry) => entry.status === "approximated")
        .map((entry) => entry.note)
        .filter(Boolean)
        .slice(0, 8),
    });
  }

  return content;
}
