/**
 * Helpers for editor preview routing. Preview uses the same `router.match()`
 * pipeline as the live site by materializing real path segments.
 */

import { blogPostSlug, type WebsiteBlogPost } from "@/lib/websites/blog-post";

export function firstCatalogSlug(
  items: ReadonlyArray<{ slug: string }> | undefined,
): string | undefined {
  const slug = items?.[0]?.slug?.trim();
  return slug || undefined;
}

/** Build preview params `{ slug }` from the first catalog item. */
export function slugPreviewParams(
  items: ReadonlyArray<{ slug: string }> | undefined,
): Record<string, string> {
  const slug = firstCatalogSlug(items);
  return slug ? { slug } : {};
}

/** Build preview params `{ slug }` from the newest tenant blog post. */
export function blogPostPreviewParams(
  posts: readonly WebsiteBlogPost[] | undefined,
): Record<string, string> {
  const post = posts?.[0];
  return post ? { slug: blogPostSlug(post) } : {};
}

/** Build preview params `{ id }` from the first catalog item. */
export function idPreviewParams(
  items: ReadonlyArray<{ id: string }> | undefined,
): Record<string, string> {
  const id = items?.[0]?.id?.trim();
  return id ? { id } : {};
}

/**
 * Turn a route pattern + params into URL segments for `router.match()`.
 *
 * `/properties/[slug]` + `{ slug: "lake-house" }` → `["properties", "lake-house"]`
 */
export function patternToPathSegments(
  pattern: string,
  params: Record<string, string>,
): string[] | null {
  const trimmed = pattern.trim();
  if (trimmed === "/" || trimmed === "") return [];

  const segments: string[] = [];
  for (const part of trimmed.replace(/^\//, "").split("/").filter(Boolean)) {
    if (part.startsWith("[") && part.endsWith("]")) {
      const key = part.slice(1, -1);
      const value = params[key]?.trim();
      if (!value) return null;
      segments.push(value);
    } else {
      segments.push(part);
    }
  }
  return segments;
}

/** Parse a pathname like `/properties/lake-house` into URL segments. */
export function pathnameToPathSegments(pathname: string): string[] {
  const clean = pathname.split("?")[0]?.replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "") return [];
  return clean.replace(/^\//, "").split("/").filter(Boolean);
}
