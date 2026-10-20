export class DummyTemplateError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "DummyTemplateError";
  }
}

const ASSET_KEYS = new Set(["src", "source"]);
const HTTP_PATTERN = /^https?:\/\//i;
const DATA_IMAGE_PATTERN = /^data:image\/[a-z0-9+.-]+;base64,/i;

export function isRewritableFabricImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return HTTP_PATTERN.test(trimmed) || DATA_IMAGE_PATTERN.test(trimmed);
}

/**
 * Fabric.js stores bitmap assets on Image `src` and Pattern `source`.
 * Text and other fields are ignored so caption URLs are not rewritten.
 */
export function collectFabricImageUrls(
  value: unknown,
  found: string[] = [],
): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectFabricImageUrls(item, found);
    return found;
  }

  if (!value || typeof value !== "object") return found;

  for (const [key, child] of Object.entries(value)) {
    if (
      ASSET_KEYS.has(key) &&
      typeof child === "string" &&
      isRewritableFabricImageUrl(child)
    ) {
      if (!found.includes(child)) found.push(child);
    } else {
      collectFabricImageUrls(child, found);
    }
  }

  return found;
}

export function replaceFabricImageUrls<T>(
  value: T,
  mapping: ReadonlyMap<string, string>,
): T {
  if (mapping.size === 0) return value;
  if (Array.isArray(value)) {
    return value.map((item) => replaceFabricImageUrls(item, mapping)) as T;
  }
  if (!value || typeof value !== "object") return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (
      ASSET_KEYS.has(key) &&
      typeof child === "string" &&
      mapping.has(child)
    ) {
      next[key] = mapping.get(child);
    } else {
      next[key] = replaceFabricImageUrls(child, mapping);
    }
  }
  return next as T;
}

export function stripFabricCrossOrigin<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripFabricCrossOrigin(item)) as T;
  }
  if (!value || typeof value !== "object") return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "crossOrigin") {
      next[key] = null;
    } else {
      next[key] = stripFabricCrossOrigin(child);
    }
  }
  return next as T;
}

export function looksLikeFabricJson(bytes: Buffer) {
  const start = bytes.subarray(0, 80).toString("utf8").replace(/^\uFEFF/, "").trimStart();
  return start.startsWith("{");
}
