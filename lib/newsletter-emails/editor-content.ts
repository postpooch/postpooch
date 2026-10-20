import "server-only";

import {
  createDefaultTemplateContent,
  isRenderableTemplateContent,
  type TemplateContent,
} from "@templatical/types";

import { NEWSLETTER_TEMPLATE_DEFAULTS } from "@/components/dashboard/newsletter/editor-theme";

import {
  importMjmlToEditorContent,
  looksLikeMjml,
} from "./mjml-to-editor";

export type ResolvedNewsletterEditorContent = {
  content: TemplateContent;
  /**
   * Legacy rows may still store MJML (as text, or as a jsonb string).
   * When true, rewrite the row as a Templatical JSON object once.
   */
  shouldPersistJson: boolean;
};

export function createBlankEditorContent(): TemplateContent {
  return createDefaultTemplateContent(
    NEWSLETTER_TEMPLATE_DEFAULTS.fontFamily,
    NEWSLETTER_TEMPLATE_DEFAULTS,
  );
}

export function isBlankEditorContent(content: TemplateContent): boolean {
  return content.blocks.length === 0;
}

/**
 * Validate a client/DB payload as Templatical JSON.
 */
export function asNewsletterEditorContent(
  value: unknown,
): TemplateContent | null {
  return isRenderableTemplateContent(value) ? value : null;
}

/**
 * Resolve DB content for the editor.
 * Accepts jsonb objects (preferred), JSON text, or legacy MJML.
 */
export function resolveNewsletterEditorContent(
  stored: unknown,
): ResolvedNewsletterEditorContent {
  if (stored == null) {
    return {
      content: createBlankEditorContent(),
      shouldPersistJson: false,
    };
  }

  if (typeof stored === "object") {
    const content = asNewsletterEditorContent(stored);
    if (content) {
      return { content, shouldPersistJson: false };
    }
  }

  if (typeof stored === "string") {
    const value = stored.trim();
    if (!value) {
      return {
        content: createBlankEditorContent(),
        shouldPersistJson: false,
      };
    }

    if (value.startsWith("{")) {
      try {
        const parsed: unknown = JSON.parse(value);
        const content = asNewsletterEditorContent(parsed);
        if (content) {
          // Text/jsonb-string rows should be rewritten as a jsonb object once.
          return { content, shouldPersistJson: true };
        }
      } catch {
        // Fall through to MJML import when the payload isn't JSON.
      }
    }

    if (looksLikeMjml(value)) {
      return {
        content: importMjmlToEditorContent(value),
        shouldPersistJson: true,
      };
    }
  }

  throw new Error("Stored email content is neither Templatical JSON nor MJML.");
}

export function isBlankStoredEditorContent(stored: unknown): boolean {
  if (stored == null) return true;

  if (typeof stored === "object") {
    const content = asNewsletterEditorContent(stored);
    return content ? isBlankEditorContent(content) : false;
  }

  if (typeof stored === "string") {
    const value = stored.trim();
    if (!value) return true;
    try {
      const parsed: unknown = JSON.parse(value);
      const content = asNewsletterEditorContent(parsed);
      return content ? isBlankEditorContent(content) : false;
    } catch {
      return false;
    }
  }

  return false;
}
