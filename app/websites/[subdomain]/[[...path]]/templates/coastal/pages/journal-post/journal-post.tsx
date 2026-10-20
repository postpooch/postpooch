import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import type { TemplatePageProps } from "../../../types";
import { toCoastalPost } from "../../../blog-post-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalJournalPostContent } from "./schema";

function renderBodyBlock(block: string, key: number): ReactNode {
  if (block.startsWith("## ")) return <h2 key={key}>{block.slice(3)}</h2>;
  if (block.startsWith("> ")) return <blockquote key={key}>{block.slice(2)}</blockquote>;
  return <p key={key}>{block}</p>;
}

export function CoastalJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<CoastalJournalPostContent, CoastalSettings>) {
  const post = blogPosts.map(toCoastalPost).find((item) => item.slug === params.slug);
  if (!post) notFound();
  const body = post.body.length ? post.body : content.defaultBody;

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={post.date} title={post.title} image={post.image || undefined} />
      <article className="articlePage">
        <p className="lede">{post.excerpt}</p>
        {body.map((block, index) => renderBodyBlock(block, index))}
        <a className="button buttonDark" href="/contact">
          {content.ctaLabel}
        </a>
      </article>
    </CoastalChrome>
  );
}
