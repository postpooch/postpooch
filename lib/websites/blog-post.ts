import { z } from "zod";

/**
 * The portable blog-post contract used by storage, the editor, and every
 * website template. Template-specific presentation must be derived from this
 * shape rather than keeping dummy journal/insights copy in template settings.
 *
 * Persisted columns match `public.blog_posts`: id, created_at, title, subtitle, text.
 */
export const WebsiteBlogPostSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().max(200),
  subtitle: z.string().trim().max(280),
  text: z.string().trim().max(50_000),
  createdAt: z.string().min(1),
});

export type WebsiteBlogPost = z.infer<typeof WebsiteBlogPostSchema>;

export const WebsiteBlogPostsSchema = z
  .array(WebsiteBlogPostSchema)
  .max(250)
  .superRefine((posts, context) => {
    const ids = new Set<string>();
    posts.forEach((post, index) => {
      if (ids.has(post.id)) {
        context.addIssue({
          code: "custom",
          message: "Post IDs must be unique.",
          path: [index, "id"],
        });
      }
      ids.add(post.id);
    });
  });

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 8);
}

/** Stable public URL slug derived from title + id (no slug column in the table). */
export function blogPostSlug(post: Pick<WebsiteBlogPost, "id" | "title">): string {
  const base = slugifyTitle(post.title) || "post";
  return `${base}-${shortId(post.id)}`;
}

export function blogPostTitle(post: WebsiteBlogPost): string {
  return post.title || "Untitled";
}

export function blogPostExcerpt(post: WebsiteBlogPost, maxLength = 180): string {
  const source = post.subtitle || post.text.split(/\n+/)[0] || "";
  const trimmed = source.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function blogPostParagraphs(post: WebsiteBlogPost): string[] {
  const blocks = post.text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  if (blocks.length) return blocks;
  if (post.subtitle.trim()) return [post.subtitle];
  return [];
}

export function formatBlogPostDate(
  post: WebsiteBlogPost,
  locale = "en-US",
): string {
  const date = new Date(post.createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function estimateBlogPostReadTime(post: WebsiteBlogPost): string {
  const words = `${post.title} ${post.subtitle} ${post.text}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function isPublishedBlogPost(post: WebsiteBlogPost): boolean {
  return Boolean(post.title.trim());
}

export function orderWebsiteBlogPosts(
  posts: readonly WebsiteBlogPost[],
): WebsiteBlogPost[] {
  return [...posts].sort((left, right) => {
    const leftTime = Date.parse(left.createdAt) || 0;
    const rightTime = Date.parse(right.createdAt) || 0;
    return rightTime - leftTime;
  });
}

export function findWebsiteBlogPost(
  posts: readonly WebsiteBlogPost[],
  slug: string,
): WebsiteBlogPost | undefined {
  return posts.find((post) => blogPostSlug(post) === slug);
}

export function newWebsiteBlogPost(): WebsiteBlogPost {
  return {
    id: crypto.randomUUID(),
    title: "",
    subtitle: "",
    text: "",
    createdAt: new Date().toISOString(),
  };
}
