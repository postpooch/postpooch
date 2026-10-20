import { DummyTemplateError } from "./fabric-image-urls";

export { DummyTemplateError };

const HTTP_PATTERN = /^https?:\/\//i;
const DATA_IMAGE_PATTERN = /^data:image\/[a-z0-9+.-]+;base64,/i;

/**
 * MJML / email HTML image refs live in:
 * - `src` / `background-url` attributes (`mj-image`, `mj-section`, `mj-hero`, …)
 * - CSS `url(...)` in `mj-style` or inline styles
 *
 * `href` is intentionally ignored so navigation links stay untouched.
 */
const ATTR_URL_PATTERN =
  /\b(?:src|background-url)\s*=\s*(["'])([\s\S]*?)\1/gi;
const CSS_URL_PATTERN = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;

export function isRewritableMjmlImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return HTTP_PATTERN.test(trimmed) || DATA_IMAGE_PATTERN.test(trimmed);
}

export function collectMjmlImageUrls(mjml: string): string[] {
  const found: string[] = [];

  const push = (raw: string) => {
    const value = raw.trim();
    if (!isRewritableMjmlImageUrl(value)) return;
    if (!found.includes(value)) found.push(value);
  };

  for (const match of mjml.matchAll(ATTR_URL_PATTERN)) {
    if (match[2]) push(match[2]);
  }
  for (const match of mjml.matchAll(CSS_URL_PATTERN)) {
    if (match[2]) push(match[2]);
  }

  return found;
}

function rewriteCapturedUrl(
  full: string,
  url: string,
  mapping: ReadonlyMap<string, string>,
) {
  const mapped = mapping.get(url.trim());
  if (!mapped) return full;
  return full.replace(url, mapped);
}

/**
 * Rewrites only image attribute / CSS url() captures. Caption or body text
 * that happens to mention the same stock URL is left alone.
 */
export function replaceMjmlImageUrls(
  mjml: string,
  mapping: ReadonlyMap<string, string>,
): string {
  if (mapping.size === 0) return mjml;

  const withAttrs = mjml.replace(
    new RegExp(ATTR_URL_PATTERN.source, ATTR_URL_PATTERN.flags),
    (full, _quote: string, url: string) =>
      rewriteCapturedUrl(full, url, mapping),
  );

  return withAttrs.replace(
    new RegExp(CSS_URL_PATTERN.source, CSS_URL_PATTERN.flags),
    (full, _quote: string, url: string) =>
      rewriteCapturedUrl(full, url, mapping),
  );
}

export function looksLikeMjml(text: string) {
  const start = text.replace(/^\uFEFF/, "").trimStart().slice(0, 2_000);
  return /<mjml[\s>]/i.test(start) || /<mj-[a-z]/i.test(start);
}

export function parseMjmlDocument(bytes: Buffer): string {
  let text: string;
  try {
    text = bytes.toString("utf8").replace(/^\uFEFF/, "");
  } catch {
    throw new DummyTemplateError("That file could not be read as UTF-8 MJML.", 400);
  }

  if (!text.trim()) {
    throw new DummyTemplateError("MJML files cannot be empty.", 400);
  }
  if (!looksLikeMjml(text)) {
    throw new DummyTemplateError(
      "That file does not look like MJML. Expect an <mjml> root or mj-* tags.",
      400,
    );
  }
  return text;
}
