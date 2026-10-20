import { describe, expect, it } from "vitest";

import {
  WebsiteBlogPostSchema,
  WebsiteBlogPostsSchema,
  blogPostExcerpt,
  blogPostSlug,
  blogPostTitle,
  findWebsiteBlogPost,
  formatBlogPostDate,
  isPublishedBlogPost,
  orderWebsiteBlogPosts,
  type WebsiteBlogPost,
} from "./blog-post";

function post(overrides: Partial<WebsiteBlogPost> = {}): WebsiteBlogPost {
  return WebsiteBlogPostSchema.parse({
    id: "00000000-0000-4000-8000-000000000001",
    title: "How to read a hillside lot",
    subtitle: "What actually matters before you write an offer.",
    text: "First paragraph.\n\nSecond paragraph.",
    createdAt: "2026-03-12T16:00:00.000Z",
    ...overrides,
  });
}

describe("website blog post contract", () => {
  it("builds a stable unique slug from the title and id", () => {
    const value = post();
    expect(blogPostSlug(value)).toBe("how-to-read-a-hillside-lot-00000000");
    expect(blogPostTitle(value)).toBe("How to read a hillside lot");
    expect(blogPostExcerpt(value)).toBe("What actually matters before you write an offer.");
    expect(formatBlogPostDate(value)).toMatch(/March 12, 2026/);
  });

  it("treats untitled posts as drafts", () => {
    expect(isPublishedBlogPost(post({ title: "" }))).toBe(false);
    expect(isPublishedBlogPost(post())).toBe(true);
  });

  it("rejects duplicate post ids", () => {
    const first = post();
    const second = post({
      id: "00000000-0000-4000-8000-000000000001",
      title: "Another title",
    });
    expect(WebsiteBlogPostsSchema.safeParse([first, second]).success).toBe(false);
  });

  it("orders newest posts first and finds them by public slug", () => {
    const older = post({
      id: "00000000-0000-4000-8000-000000000001",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    const newer = post({
      id: "00000000-0000-4000-8000-000000000002",
      title: "A later note",
      createdAt: "2026-04-01T00:00:00.000Z",
    });
    const ordered = orderWebsiteBlogPosts([older, newer]);
    expect(ordered.map((item) => item.id)).toEqual([newer.id, older.id]);
    expect(findWebsiteBlogPost(ordered, blogPostSlug(newer))?.id).toBe(newer.id);
  });
});
