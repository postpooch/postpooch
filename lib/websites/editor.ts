import "server-only";

import type { PoolClient } from "pg";

import { getTemplateRouter } from "@/app/websites/[subdomain]/[[...path]]/templates/registry";
import { getDbPool } from "@/lib/db/client";
import type { WebsiteBlogPost } from "@/lib/websites/blog-post";
import { getWebsiteBlogPosts } from "@/lib/websites/blog-post-store";
import type { WebsiteProperty } from "@/lib/websites/property";
import { getWebsiteProperties } from "@/lib/websites/property-store";
import {
  ensureWebsiteTemplateContent,
  getWebsitePagesForTemplate,
  getWebsiteTemplateSettings,
} from "@/lib/websites/template-content";

export type WebsiteEditorPage = {
  path: string;
  label: string;
  content: Record<string, unknown>;
};

export type WebsiteEditorDocument = {
  id: string;
  subdomain: string;
  template: string;
  settings: Record<string, unknown>;
  propertiesEnabled: boolean;
  blogPostsEnabled: boolean;
  properties: WebsiteProperty[];
  blogPosts: WebsiteBlogPost[];
  pages: WebsiteEditorPage[];
};

type WebsiteRow = {
  id: string;
  subdomain: string | null;
  template: string | null;
  properties_enabled: boolean;
  blog_posts_enabled: boolean;
};

function asObject(value: unknown, context: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${context} must resolve to an object.`);
  }
  return value as Record<string, unknown>;
}

export async function getWebsiteEditorForProfile(
  profileId: string,
): Promise<WebsiteEditorDocument | null> {
  const result = await getDbPool().query<WebsiteRow>(
    `select id, subdomain, template, properties_enabled, blog_posts_enabled
       from public.websites
      where profile_id = $1
      order by created_at asc
      limit 1
      for update`,
    [profileId],
  );
  const website = result.rows[0];
  if (!website?.template || !website.subdomain) return null;

  const router = getTemplateRouter(website.template);
  if (!router) return null;

  let savedPages = await getWebsitePagesForTemplate(website.id, website.template);
  let rawSettings = await getWebsiteTemplateSettings(website.id, website.template);

  if (rawSettings === null || savedPages.length === 0) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      await ensureWebsiteTemplateContent(client, website.id, website.template);
      await client.query("commit");
      savedPages = await getWebsitePagesForTemplate(website.id, website.template, client);
      rawSettings = await getWebsiteTemplateSettings(website.id, website.template, client);
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  const [properties, blogPosts] = await Promise.all([
    getWebsiteProperties(website.id, { includeHidden: true }),
    getWebsiteBlogPosts(website.id, { includeDrafts: true }),
  ]);
  const savedPagesByPath = new Map(savedPages.map((page) => [page.path, page.content]));

  let settings: Record<string, unknown>;
  try {
    settings = asObject(router.resolveSettings(rawSettings ?? {}), "Website settings");
  } catch (error) {
    console.error("Invalid saved website settings; opening template defaults", {
      websiteId: website.id,
      template: website.template,
      error,
    });
    settings = asObject(router.resolveSettings({}), "Default website settings");
  }

  const pages = router.editorRoutes.map((route) => {
    let content: Record<string, unknown>;
    try {
      content = asObject(
        router.resolveContent(route.path, savedPagesByPath.get(route.path) ?? null),
        `Content for ${route.path}`,
      );
    } catch (error) {
      console.error("Invalid saved page content; opening template defaults", {
        websiteId: website.id,
        template: website.template,
        path: route.path,
        error,
      });
      content = asObject(
        router.resolveContent(route.path, null),
        `Default content for ${route.path}`,
      );
    }
    return { ...route, content };
  });

  return {
    id: website.id,
    subdomain: website.subdomain,
    template: website.template,
    settings,
    propertiesEnabled: website.properties_enabled,
    blogPostsEnabled: website.blog_posts_enabled,
    properties,
    blogPosts,
    pages,
  };
}

export async function findOwnedWebsite(
  client: PoolClient,
  websiteId: string,
  profileId: string,
): Promise<WebsiteRow | null> {
  const result = await client.query<WebsiteRow>(
    `select id, subdomain, template, properties_enabled, blog_posts_enabled
       from public.websites
      where id = $1 and profile_id = $2
      limit 1`,
    [websiteId, profileId],
  );
  return result.rows[0] ?? null;
}
