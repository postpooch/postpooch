import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import type { TemplatePageProps } from "../../../types";
import { toHarborPost } from "../../../blog-post-adapters";
import { HarborChrome } from "../../components/harbor-chrome";
import type { HarborSettings } from "../../settings";

import type { HarborJournalPostContent } from "./schema";

function renderBodyBlock(block: string, key: number): ReactNode {
  if (block.startsWith("## ")) {
    return <h2 key={key}>{block.slice(3)}</h2>;
  }
  if (block.startsWith("> ")) {
    return <blockquote key={key}>{block.slice(2)}</blockquote>;
  }
  if (block.startsWith("dropcap:")) {
    return (
      <p key={key} className="dropcap">
        {block.slice("dropcap:".length)}
      </p>
    );
  }
  return <p key={key}>{block}</p>;
}

export function HarborJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<HarborJournalPostContent, HarborSettings>) {
  const post = blogPosts.map(toHarborPost).find((item) => item.slug === params.slug);
  if (!post) notFound();

  const body = post.body?.length ? post.body : content.defaultBody;
  const ctaLabel = content.ctaLabel.replace(
    "Avery",
    settings.agent.firstName,
  );

  return (
    <HarborChrome site={site} settings={settings}>
      <article className="article-page">
        <header className="article-header shell">
          <p className="kicker">
            {post.category} · {post.date}
          </p>
          <h1>{post.title}</h1>
          <p>{post.dek}</p>
        </header>
        {post.image ? (
        <div className="article-image">
          <img src={post.image} alt={content.imageAlt} />
        </div>
        ) : null}
        <div className="article-body">
          {body.map((block, i) => renderBodyBlock(block, i))}
          <div className="article-cta">
            <h3>{content.ctaTitle}</h3>
            <a className="button button-dark" href="/contact">
              {ctaLabel}
            </a>
          </div>
        </div>
      </article>
    </HarborChrome>
  );
}
