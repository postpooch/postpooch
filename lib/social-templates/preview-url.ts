const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Join CLOUDFLARE_R2_PUBLIC_BASE_URL with templates.preview_path.
 * Returns null when the path is empty or not a safe object key
 * (schemes, protocol-relative URLs, traversal, or query/hash).
 */
export function socialTemplatePreviewUrl(
  publicBaseUrl: string,
  previewPath: string | null | undefined,
): string | null {
  const base = publicBaseUrl.trim().replace(/\/+$/, "");
  const key = normalizePreviewObjectKey(previewPath);
  if (!base || !key) return null;

  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/${encodedKey}`;
}

export function requireR2PublicBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    throw new Error(
      "CLOUDFLARE_R2_PUBLIC_BASE_URL is required to load social template previews.",
    );
  }
  return trimmed;
}

export function normalizePreviewObjectKey(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") return null;

  const raw = value.trim();
  if (!raw) return null;
  if (SCHEME_PATTERN.test(raw) || raw.startsWith("//")) return null;
  if (raw.includes("\\") || raw.includes("?") || raw.includes("#")) {
    return null;
  }

  const trimmed = raw.replace(/^\/+/, "");
  if (!trimmed) return null;

  const segments = trimmed.split("/").filter((segment) => segment.length > 0);
  if (
    segments.length === 0 ||
    segments.some((segment) => segment === "." || segment === "..")
  ) {
    return null;
  }

  return segments.join("/");
}
