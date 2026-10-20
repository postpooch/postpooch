import "server-only";

import type { PoolClient } from "pg";

import { getDbPool } from "@/lib/db/client";
import {
  WebsiteBlogPostsSchema,
  type WebsiteBlogPost,
} from "@/lib/websites/blog-post";

type BlogPostRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  text: string | null;
  created_at: string;
};

const BLOG_POST_COLUMNS = `
  id,
  coalesce(title, '') as title,
  coalesce(subtitle, '') as subtitle,
  coalesce(text, '') as text,
  created_at::text as created_at
`;

function rowToBlogPost(row: BlogPostRow): WebsiteBlogPost {
  const created = new Date(row.created_at);
  return WebsiteBlogPostsSchema.element.parse({
    id: row.id,
    title: row.title ?? "",
    subtitle: row.subtitle ?? "",
    text: row.text ?? "",
    createdAt: Number.isNaN(created.getTime()) ? new Date().toISOString() : created.toISOString(),
  });
}

export async function getWebsiteBlogPosts(
  websiteId: string,
  options: { includeDrafts?: boolean } = {},
): Promise<WebsiteBlogPost[]> {
  const result = await getDbPool().query<BlogPostRow>(
    `select ${BLOG_POST_COLUMNS}
       from public.blog_posts
      where website_id = $1
        and ($2::boolean or coalesce(title, '') <> '')
      order by created_at desc`,
    [websiteId, options.includeDrafts ?? false],
  );
  return result.rows.map(rowToBlogPost);
}

export async function replaceWebsiteBlogPosts(
  client: PoolClient,
  websiteId: string,
  input: unknown,
): Promise<WebsiteBlogPost[]> {
  const posts = WebsiteBlogPostsSchema.parse(input);
  const ids = posts.map((post) => post.id);

  if (ids.length) {
    await client.query(
      `delete from public.blog_posts
        where website_id = $1 and not (id = any($2::uuid[]))`,
      [websiteId, ids],
    );
  } else {
    await client.query("delete from public.blog_posts where website_id = $1", [websiteId]);
  }

  for (const post of posts) {
    const result = await client.query(
      `insert into public.blog_posts (
         id, website_id, title, subtitle, text, created_at
       ) values (
         $1, $2, $3, $4, $5, $6::timestamptz
       )
       on conflict (id) do update set
         title = excluded.title,
         subtitle = excluded.subtitle,
         text = excluded.text,
         created_at = excluded.created_at
       where public.blog_posts.website_id = excluded.website_id`,
      [post.id, websiteId, post.title, post.subtitle, post.text, post.createdAt],
    );
    if (result.rowCount !== 1) {
      throw new Error("A post identifier belongs to another website.");
    }
  }

  return posts;
}
