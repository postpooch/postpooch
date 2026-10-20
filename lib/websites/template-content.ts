import "server-only";

import type { Pool, PoolClient } from "pg";

import { getTemplateRouter } from "@/app/websites/[subdomain]/[[...path]]/templates/registry";
import { getDbPool } from "@/lib/db/client";

type PageRow = { path: string; content: unknown };

type Queryable = Pool | PoolClient;

function db(client?: PoolClient): Queryable {
  return client ?? getDbPool();
}

export async function getWebsiteTemplateSettings(
  websiteId: string,
  template: string,
  client?: PoolClient,
): Promise<unknown | null> {
  const result = await db(client).query<{ settings: unknown }>(
    `select settings
       from public.website_template_settings
      where website_id = $1 and template = $2
      limit 1`,
    [websiteId, template],
  );
  return result.rows[0]?.settings ?? null;
}

export async function upsertWebsiteTemplateSettings(
  client: PoolClient,
  websiteId: string,
  template: string,
  settings: unknown,
): Promise<void> {
  await client.query(
    `insert into public.website_template_settings (website_id, template, settings)
     values ($1, $2, $3::jsonb)
     on conflict (website_id, template)
     do update set settings = excluded.settings`,
    [websiteId, template, JSON.stringify(settings)],
  );
}

export async function getWebsitePagesForTemplate(
  websiteId: string,
  template: string,
  client?: PoolClient,
): Promise<PageRow[]> {
  const result = await db(client).query<PageRow>(
    `select path, content
       from public.pages
      where website_id = $1 and template = $2`,
    [websiteId, template],
  );
  return result.rows;
}

export async function upsertWebsitePage(
  client: PoolClient,
  websiteId: string,
  template: string,
  path: string,
  content: unknown,
): Promise<void> {
  await client.query(
    `insert into public.pages (website_id, template, path, content)
     values ($1, $2, $3, $4::jsonb)
     on conflict (website_id, template, path)
     do update set content = excluded.content`,
    [websiteId, template, path, JSON.stringify(content)],
  );
}

/**
 * Seeds default pages and settings for a template when the user has never
 * customized that template on this website. Existing template content is never
 * overwritten.
 */
export async function ensureWebsiteTemplateContent(
  client: PoolClient,
  websiteId: string,
  template: string,
): Promise<void> {
  const router = getTemplateRouter(template);
  if (!router) {
    throw new Error(`Unknown website template: ${template}`);
  }

  const settingsExist = await client.query(
    `select 1
       from public.website_template_settings
      where website_id = $1 and template = $2
      limit 1`,
    [websiteId, template],
  );
  if (settingsExist.rowCount === 0) {
    const defaultSettings = router.resolveSettings({});
    await upsertWebsiteTemplateSettings(client, websiteId, template, defaultSettings);
  }

  const pagesExist = await client.query(
    `select 1
       from public.pages
      where website_id = $1 and template = $2
      limit 1`,
    [websiteId, template],
  );
  if (pagesExist.rowCount === 0) {
    const defaultPages = router.editorRoutes.map((route) => ({
      path: route.path,
      content: router.resolveContent(route.path, null),
    }));
    await client.query(
      `insert into public.pages (website_id, template, path, content)
       select $1, $2, page.path, page.content
         from jsonb_to_recordset($3::jsonb) as page(path text, content jsonb)`,
      [websiteId, template, JSON.stringify(defaultPages)],
    );
  }
}
