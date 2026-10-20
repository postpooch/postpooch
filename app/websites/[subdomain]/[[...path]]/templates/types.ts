import type { ReactNode } from "react";
import type { ZodType } from "zod";

import type { WebsiteBlogPost } from "@/lib/websites/blog-post";
import type { WebsiteProperty } from "@/lib/websites/property";

/**
 * Tenant website identity from `public.websites`.
 * Page-specific editable content does NOT live here.
 */
export type WebsiteSite = {
  /** `websites.id` — not the profile UUID. */
  id: string;
  /** `websites.profile_id` — owning profile. */
  profileId: string;
  subdomain: string;
  template: string;
  /** Master switch for all property routes and sections on this website. */
  propertiesEnabled: boolean;
  /** Master switch for journal/blog/insights routes and sections. */
  blogPostsEnabled: boolean;
  /** Raw per-template settings JSONB until the template validates it. */
  settings: unknown;
};

/**
 * Props every template page receives after the tenant boundary
 * has matched a route and loaded/validated content.
 */
export type TemplatePageProps<TContent, TSettings> = {
  site: WebsiteSite;
  settings: TSettings;
  content: TContent;
  params: Record<string, string>;
  /** Visible tenant-owned properties in their configured display order. */
  properties: readonly WebsiteProperty[];
  /** Published tenant-owned posts, newest first. */
  blogPosts: readonly WebsiteBlogPost[];
};

/**
 * One route owned by a template router.
 * The route pattern is also the canonical `pages.path` key.
 */
export type TemplateRouteDefinition<TContent, TSettings> = {
  /** Canonical pattern, e.g. `/`, `/about`, `/listings/[id]`. */
  path: string;
  Page: (props: TemplatePageProps<TContent, TSettings>) => ReactNode;
  contentSchema: ZodType<TContent>;
  defaultContent: TContent;
  /**
   * Required for dynamic patterns. Returns real URL params (e.g. a catalog slug)
   * so the editor preview can call the same `match()` pipeline as production.
   */
  previewParams?: (
    settings: TSettings,
    properties: readonly WebsiteProperty[],
    blogPosts: readonly WebsiteBlogPost[],
  ) => Record<string, string>;
  /** Marks collection/detail routes that disappear with the master switch. */
  isPropertyRoute?: boolean;
  /** Marks journal/blog/insights routes that disappear with the posts switch. */
  isBlogRoute?: boolean;
};

/**
 * Result of `router.match(path)`.
 * `pattern` is what Query #2 uses against `pages.path`.
 */
export type TemplateRouteMatch = {
  pattern: string;
  params: Record<string, string>;
  /** Internal index into the router's route list (for render). */
  routeIndex: number;
};

export type TemplateRenderInput = {
  match: TemplateRouteMatch;
  site: WebsiteSite;
  /**
   * Saved `pages.content` for the matched pattern, or `null` when
   * no `pages` row exists (use the route's built-in defaults).
   */
  rawContent: unknown | null;
  properties?: readonly WebsiteProperty[];
  blogPosts?: readonly WebsiteBlogPost[];
};

/**
 * Shared contract every website template exposes to the tenant catch-all.
 * Match first (so the catch-all can query `pages`), then render.
 */
export type TemplateRouter = {
  match: (path: string[] | undefined) => TemplateRouteMatch | null;
  render: (input: TemplateRenderInput) => ReactNode;
  /** Plain-data route catalog used by the dashboard editor. */
  editorRoutes: readonly TemplateEditorRoute[];
  /** True when a route should disappear with the website property switch. */
  isPropertyRoute: (pattern: string) => boolean;
  /** True when a route should disappear with the website posts switch. */
  isBlogRoute: (pattern: string) => boolean;
  /** Apply defaults and validate a website-wide settings document. */
  resolveSettings: (rawSettings: unknown) => unknown;
  /** Apply defaults and validate content for one canonical route pattern. */
  resolveContent: (pattern: string, rawContent: unknown | null) => unknown;
  /**
   * Build a render match for a canonical route pattern in the editor preview.
   * Uses `previewParams` + `match()` so params match what the live site would use.
   */
  editorPreviewMatch: (
    pattern: string,
    rawSettings: unknown,
    rawProperties?: unknown,
    rawBlogPosts?: unknown,
  ) => TemplateRouteMatch | null;
};

export type TemplateEditorRoute = {
  path: string;
  label: string;
};
