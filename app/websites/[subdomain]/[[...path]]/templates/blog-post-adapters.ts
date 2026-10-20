import {
  blogPostExcerpt,
  blogPostParagraphs,
  blogPostSlug,
  blogPostTitle,
  estimateBlogPostReadTime,
  formatBlogPostDate,
  type WebsiteBlogPost,
} from "@/lib/websites/blog-post";

import type { ArdenPost } from "./arden/settings";
import type { AtelierPost } from "./atelier/settings";
import type { AureliaArticle } from "./aurelia/settings";
import type { AveryInsight } from "./avery/settings";
import type { CoastalPost } from "./coastal/settings";
import type { ElenaJournalEntry } from "./elena/settings";
import type { HarborPost } from "./harbor/settings";
import type { LuxuryPost } from "./luxury/settings";
import type { MaraArticle } from "./mara/settings";
import type { MilaArticle } from "./mila/settings";
import type { NathanInsight } from "./nathan/settings";
import type { NorthpinePost } from "./northpine/settings";
import type { RoweCatalogJournalEntry } from "./rowe/settings";
import type { SloanePost } from "./sloane/settings";
import type { ValeArticle } from "./vale/settings";

const CATEGORY = "Journal";

function paragraphs(post: WebsiteBlogPost): string[] {
  const blocks = blogPostParagraphs(post);
  if (blocks.length) return blocks;
  const excerpt = blogPostExcerpt(post);
  return excerpt ? [excerpt] : [blogPostTitle(post)];
}

export type ReyPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string[];
};

export type RowanPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string[];
};

export type VossJournalPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  body: string[];
};

export type ElenaJournalPost = ElenaJournalEntry & {
  slug: string;
  excerpt: string;
  body: string[];
};

export function toSloanePost(post: WebsiteBlogPost): SloanePost {
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    title: blogPostTitle(post),
    excerpt: blogPostExcerpt(post),
    image: "",
    date: formatBlogPostDate(post),
    body: paragraphs(post),
  };
}

export function toAveryInsight(post: WebsiteBlogPost): AveryInsight {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    date: formatBlogPostDate(post),
    category: CATEGORY,
    image: "",
    excerpt: blogPostExcerpt(post),
    body: paragraphs(post),
  };
}

export function toAureliaArticle(post: WebsiteBlogPost): AureliaArticle {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    date: formatBlogPostDate(post),
    category: CATEGORY,
    image: "",
    excerpt: blogPostExcerpt(post),
    body: paragraphs(post),
  };
}

export function toArdenPost(post: WebsiteBlogPost): ArdenPost {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    dek: blogPostExcerpt(post),
    date: formatBlogPostDate(post),
    image: "",
    category: CATEGORY,
    body: paragraphs(post),
  };
}

export function toCoastalPost(post: WebsiteBlogPost): CoastalPost {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    date: formatBlogPostDate(post),
    excerpt: blogPostExcerpt(post),
    image: "",
    body: paragraphs(post),
  };
}

export function toAtelierPost(post: WebsiteBlogPost): AtelierPost {
  const blocks = paragraphs(post);
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    date: formatBlogPostDate(post),
    category: CATEGORY,
    image: "",
    excerpt: blogPostExcerpt(post),
    quote: post.subtitle,
    body: [{ heading: "", paragraphs: blocks }],
  };
}

export function toNorthpinePost(post: WebsiteBlogPost): NorthpinePost {
  const blocks = paragraphs(post);
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    date: formatBlogPostDate(post),
    excerpt: blogPostExcerpt(post),
    image: "",
    lead: post.subtitle || blocks[0] || blogPostTitle(post),
    paragraphs: blocks,
    sections: [{ title: post.subtitle || blogPostTitle(post), body: post.text || blocks.join("\n\n") }],
  };
}

export function toValeArticle(post: WebsiteBlogPost): ValeArticle {
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    date: formatBlogPostDate(post),
    title: blogPostTitle(post),
    excerpt: blogPostExcerpt(post),
    image: "",
    body: paragraphs(post),
  };
}

export function toLuxuryPost(post: WebsiteBlogPost): LuxuryPost {
  const blocks = paragraphs(post);
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    title: blogPostTitle(post),
    excerpt: blogPostExcerpt(post),
    date: formatBlogPostDate(post),
    readTime: estimateBlogPostReadTime(post),
    image: "",
    body: [{ heading: post.subtitle || blogPostTitle(post), paragraphs: blocks }],
  };
}

export function toVossPost(post: WebsiteBlogPost): VossJournalPost {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    category: CATEGORY,
    date: formatBlogPostDate(post),
    image: "",
    excerpt: blogPostExcerpt(post),
    body: paragraphs(post),
  };
}

export function toHarborPost(post: WebsiteBlogPost): HarborPost {
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    date: formatBlogPostDate(post),
    title: blogPostTitle(post),
    dek: blogPostExcerpt(post),
    image: "",
    body: paragraphs(post),
  };
}

export function toMaraArticle(post: WebsiteBlogPost): MaraArticle {
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    date: formatBlogPostDate(post),
    title: blogPostTitle(post),
    excerpt: blogPostExcerpt(post),
    image: "",
    body: paragraphs(post),
  };
}

export function toRoweEntry(post: WebsiteBlogPost): RoweCatalogJournalEntry {
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    date: formatBlogPostDate(post),
    title: blogPostTitle(post),
    dek: blogPostExcerpt(post),
    image: "",
    body: paragraphs(post),
  };
}

export function toMilaArticle(post: WebsiteBlogPost): MilaArticle {
  const blocks = paragraphs(post);
  const sections: MilaArticle["sections"] = blocks.length
    ? (blocks.map((block, index) => [
        index === 0 ? post.subtitle || blogPostTitle(post) : `Note ${index + 1}`,
        block,
      ]) as MilaArticle["sections"])
    : ([[blogPostTitle(post), blogPostExcerpt(post) || blogPostTitle(post)]] as MilaArticle["sections"]);
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    date: formatBlogPostDate(post, "nl-NL"),
    title: blogPostTitle(post),
    intro: blogPostExcerpt(post),
    image: "",
    sections,
  };
}

export function toElenaPost(post: WebsiteBlogPost): ElenaJournalPost {
  return {
    slug: blogPostSlug(post),
    date: formatBlogPostDate(post),
    title: blogPostTitle(post),
    text: blogPostExcerpt(post) || post.text,
    excerpt: blogPostExcerpt(post),
    body: paragraphs(post),
  };
}

export function toNathanInsight(post: WebsiteBlogPost): NathanInsight {
  return {
    slug: blogPostSlug(post),
    category: CATEGORY,
    title: blogPostTitle(post),
    date: formatBlogPostDate(post),
    excerpt: blogPostExcerpt(post),
    image: "",
    body: paragraphs(post),
  };
}

export function toReyPost(post: WebsiteBlogPost): ReyPost {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    excerpt: blogPostExcerpt(post),
    date: formatBlogPostDate(post),
    body: paragraphs(post),
  };
}

export function toRowanPost(post: WebsiteBlogPost): RowanPost {
  return {
    slug: blogPostSlug(post),
    title: blogPostTitle(post),
    excerpt: blogPostExcerpt(post),
    date: formatBlogPostDate(post),
    body: paragraphs(post),
  };
}
