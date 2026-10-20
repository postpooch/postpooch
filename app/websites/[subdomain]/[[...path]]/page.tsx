import { notFound } from "next/navigation";

import { getDbPool } from "@/lib/db/client";
import { getWebsiteBlogPosts } from "@/lib/websites/blog-post-store";
import { getWebsiteProperties } from "@/lib/websites/property-store";
import {
  getWebsiteTemplateSettings,
} from "@/lib/websites/template-content";

import { getTemplateRouter } from "./templates/registry";
import type { WebsiteSite } from "./templates/types";

type TenantWebsitePageProps = {
  params: Promise<{
    subdomain: string;
    path?: string[];
  }>;
};

type WebsiteRow = {
  id: string;
  profile_id: string;
  subdomain: string | null;
  template: string | null;
  properties_enabled: boolean;
  blog_posts_enabled: boolean;
};

type PageContentRow = {
  content: unknown;
};

/**
 * Tenant catch-all entry point.
 *
 * 1. Query #1 — subdomain → website (identity, template, settings)
 * 2. Template registry → router
 * 3. router.match(path) → canonical pages.path pattern
 * 4. Query #2 — website + pattern → one pages.content row (or none)
 * 5. router.render — validate + render
 */
export default async function TenantWebsitePage({
  params,
}: TenantWebsitePageProps) {
  const { subdomain, path } = await params;

  const normalized = subdomain.trim().toLowerCase();
  if (!normalized) {
    notFound();
  }

  const websiteResult = await getDbPool().query<WebsiteRow>(
    `
      select
        id,
        profile_id,
        subdomain,
        template,
        properties_enabled,
        blog_posts_enabled
      from public.websites
      where lower(subdomain) = $1
      limit 1
    `,
    [normalized],
  );

  const row = websiteResult.rows[0];
  if (!row?.subdomain || !row.template) {
    notFound();
  }

  const site: WebsiteSite = {
    id: row.id,
    profileId: row.profile_id,
    subdomain: row.subdomain,
    template: row.template,
    propertiesEnabled: row.properties_enabled,
    blogPostsEnabled: row.blog_posts_enabled,
    settings: null,
  };

  const router = getTemplateRouter(site.template);
  if (!router) {
    notFound();
  }

  const match = router.match(path);
  if (!match) {
    notFound();
  }

  if (!site.propertiesEnabled && router.isPropertyRoute(match.pattern)) {
    notFound();
  }

  if (!site.blogPostsEnabled && router.isBlogRoute(match.pattern)) {
    notFound();
  }

  const [pageResult, templateSettings, properties, blogPosts] = await Promise.all([
    getDbPool().query<PageContentRow>(
      `
        select content
        from public.pages
        where website_id = $1
          and template = $2
          and path = $3
        limit 1
      `,
      [site.id, site.template, match.pattern],
    ),
    getWebsiteTemplateSettings(site.id, site.template),
    site.propertiesEnabled ? getWebsiteProperties(site.id) : Promise.resolve([]),
    site.blogPostsEnabled ? getWebsiteBlogPosts(site.id) : Promise.resolve([]),
  ]);

  site.settings = templateSettings ?? {};

  const pageRow = pageResult.rows[0];
  const rawContent = pageRow ? pageRow.content : null;

  return router.render({
    match,
    site,
    rawContent,
    properties,
    blogPosts,
  });
}
