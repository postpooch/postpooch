import type { ZodType } from "zod";

import {
  WebsiteBlogPostsSchema,
  isPublishedBlogPost,
  orderWebsiteBlogPosts,
} from "@/lib/websites/blog-post";
import {
  WebsitePropertiesSchema,
  orderWebsiteProperties,
} from "@/lib/websites/property";

import { matchRoute } from "./match-route";
import { patternToPathSegments } from "./preview-route";
import type {
  TemplateRenderInput,
  TemplateRouteDefinition,
  TemplateRouteMatch,
  TemplateRouter,
} from "./types";

type CreateTemplateRouterOptions<TSettings> = {
  settingsSchema: ZodType<TSettings>;
  /** Empties legacy listing arrays after validation while preserving schema shape. */
  legacyPropertyCatalogKey?: "properties" | "listings";
  /** Extra catalog arrays that must never render as live listings. */
  emptyCatalogKeys?: readonly string[];
  /** Empties legacy journal/insights arrays after validation while preserving schema shape. */
  legacyBlogCatalogKey?: "posts" | "articles" | "insights" | "journal";
  /** Optional hash/external links that represent property navigation. */
  propertyNavigationHrefs?: readonly string[];
  /** Optional hash/external links that represent journal navigation. */
  blogNavigationHrefs?: readonly string[];
  /**
   * Routes may each have a different content shape. That variance is erased
   * here; each route still validates with its own schema before render.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous route content types
  routes: Array<TemplateRouteDefinition<any, TSettings>>;
};

function emptyCatalogKey(settings: unknown, key: string | undefined) {
  if (!key || !settings || typeof settings !== "object") return;
  const catalog = (settings as { catalog?: unknown }).catalog;
  if (catalog && typeof catalog === "object" && !Array.isArray(catalog)) {
    (catalog as Record<string, unknown>)[key] = [];
  }
}

/**
 * Build a template router that separates route matching from rendering.
 *
 * 1. `match(path)` → canonical pattern + params (no I/O)
 * 2. catch-all loads `pages.content` for that pattern
 * 3. `render({ match, site, rawContent })` validates settings/content and renders
 */
export function createTemplateRouter<TSettings>(
  options: CreateTemplateRouterOptions<TSettings>,
): TemplateRouter {
  const { settingsSchema, routes } = options;

  function resolveSettings(rawSettings: unknown): TSettings {
    const settings = settingsSchema.parse(rawSettings);
    emptyCatalogKey(settings, options.legacyPropertyCatalogKey);
    emptyCatalogKey(settings, options.legacyBlogCatalogKey);
    options.emptyCatalogKeys?.forEach((key) => emptyCatalogKey(settings, key));
    return settings;
  }

  function routeLabel(path: string): string {
    if (path === "/") return "Home";
    return path
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment.startsWith("[")
          ? "Detail"
          : segment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      )
      .join(" · ");
  }

  function getRoute(pattern: string) {
    return routes.find((route) => route.path === pattern);
  }

  function isFlaggedHref(
    href: string,
    extra: readonly string[] | undefined,
    flag: "isPropertyRoute" | "isBlogRoute",
  ): boolean {
    if (extra?.includes(href)) return true;
    const pathname = href.split(/[?#]/, 1)[0];
    if (!pathname?.startsWith("/")) return false;
    const segments = pathname.split("/").filter(Boolean);
    return routes.some(
      (route) => route[flag] && matchRoute(segments, route.path) !== null,
    );
  }

  function hideNavigation(
    settings: TSettings,
    extra: readonly string[] | undefined,
    flag: "isPropertyRoute" | "isBlogRoute",
  ): TSettings {
    if (!settings || typeof settings !== "object") return settings;
    const settingsRecord = settings as unknown as { navItems?: unknown[] };
    const navItems = settingsRecord.navItems;
    if (!Array.isArray(navItems)) return settings;
    settingsRecord.navItems = navItems
      .filter((item) => {
        if (!item || typeof item !== "object") return true;
        const href = (item as { href?: unknown }).href;
        return typeof href !== "string" || !isFlaggedHref(href, extra, flag);
      })
      .map((item) => {
        if (!item || typeof item !== "object") return item;
        const children = (item as { children?: unknown }).children;
        if (!Array.isArray(children)) return item;
        return {
          ...item,
          children: children.filter((child) => {
            if (!child || typeof child !== "object") return true;
            const href = (child as { href?: unknown }).href;
            return typeof href !== "string" || !isFlaggedHref(href, extra, flag);
          }),
        };
      });
    return settings;
  }

  function matchPath(path: string[] | undefined): TemplateRouteMatch | null {
    for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
      const route = routes[routeIndex]!;
      const params = matchRoute(path, route.path);
      if (params === null) continue;

      return {
        pattern: route.path,
        params,
        routeIndex,
      };
    }
    return null;
  }

  return {
    editorRoutes: routes.map((route) => ({
      path: route.path,
      label: routeLabel(route.path),
    })),

    isPropertyRoute(pattern) {
      return getRoute(pattern)?.isPropertyRoute ?? false;
    },

    isBlogRoute(pattern) {
      return getRoute(pattern)?.isBlogRoute ?? false;
    },

    resolveSettings(rawSettings) {
      return resolveSettings(rawSettings);
    },

    resolveContent(pattern, rawContent) {
      const route = getRoute(pattern);
      if (!route) {
        throw new Error(`Unknown template route: ${pattern}`);
      }
      return rawContent === null
        ? route.defaultContent
        : route.contentSchema.parse(rawContent);
    },

    editorPreviewMatch(pattern, rawSettings, rawProperties, rawBlogPosts) {
      const routeIndex = routes.findIndex((route) => route.path === pattern);
      if (routeIndex < 0) return null;

      const route = routes[routeIndex]!;
      const isDynamic = pattern.includes("[");

      if (!isDynamic) {
        return {
          pattern,
          params: {},
          routeIndex,
        };
      }

      if (!route.previewParams) {
        console.error(`Dynamic route "${pattern}" is missing previewParams.`);
        return null;
      }

      let settings: TSettings;
      try {
        settings = resolveSettings(rawSettings);
      } catch {
        return null;
      }

      const parsedProperties = WebsitePropertiesSchema.safeParse(rawProperties ?? []);
      if (!parsedProperties.success) return null;
      const parsedPosts = WebsiteBlogPostsSchema.safeParse(rawBlogPosts ?? []);
      if (!parsedPosts.success) return null;
      const params = route.previewParams(
        settings,
        orderWebsiteProperties(parsedProperties.data.filter((property) => property.isVisible)),
        orderWebsiteBlogPosts(parsedPosts.data.filter(isPublishedBlogPost)),
      );
      const segments = patternToPathSegments(pattern, params);
      if (segments === null) return null;

      const matched = matchPath(segments);
      if (!matched || matched.pattern !== pattern) return null;
      return matched;
    },

    match(path) {
      return matchPath(path);
    },

    render({
      match,
      site,
      rawContent,
      properties = [],
      blogPosts = [],
    }: TemplateRenderInput) {
      const route = routes[match.routeIndex];
      if (!route || route.path !== match.pattern) {
        throw new Error(
          `Template route match is out of sync (pattern=${match.pattern}, index=${match.routeIndex}).`,
        );
      }

      let settings: TSettings;
      try {
        settings = resolveSettings(site.settings);
        if (!site.propertiesEnabled) {
          settings = hideNavigation(
            settings,
            options.propertyNavigationHrefs,
            "isPropertyRoute",
          );
        }
        if (!site.blogPostsEnabled) {
          settings = hideNavigation(
            settings,
            options.blogNavigationHrefs,
            "isBlogRoute",
          );
        }
      } catch (error) {
        console.error("Invalid website settings JSON", {
          websiteId: site.id,
          template: site.template,
        });
        throw error;
      }

      let content: unknown;
      if (rawContent === null) {
        content = route.defaultContent;
      } else {
        try {
          content = route.contentSchema.parse(rawContent);
        } catch (error) {
          console.error("Invalid page content JSON", {
            websiteId: site.id,
            template: site.template,
            path: match.pattern,
          });
          throw error;
        }
      }

      return (
        <route.Page
          site={site}
          settings={settings}
          content={content}
          params={match.params}
          properties={
            site.propertiesEnabled
              ? orderWebsiteProperties(properties.filter((property) => property.isVisible))
              : []
          }
          blogPosts={
            site.blogPostsEnabled
              ? orderWebsiteBlogPosts(blogPosts.filter(isPublishedBlogPost))
              : []
          }
        />
      );
    },
  };
}
