import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import type { TemplatePageProps } from "../../../types";
import { toMaraArticle } from "../../../blog-post-adapters";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraJournalPostContent } from "./schema";

function renderBodyBlock(block: string, key: number): ReactNode {
  if (block.startsWith("## ")) {
    return <h2 key={key}>{block.slice(3)}</h2>;
  }
  if (block.startsWith("> ")) {
    return <blockquote key={key}>{block.slice(2)}</blockquote>;
  }
  return <p key={key}>{block}</p>;
}

export function MaraJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<MaraJournalPostContent, MaraSettings>) {
  const article = blogPosts
    .map(toMaraArticle)
    .find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <MaraChrome site={site} settings={settings}>
      <article className="articlePage">
        <header className="articleHeader">
          <p>
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </header>
        {article.image ? (
        <div className="articleLeadImage">
          <img src={article.image} alt="" />
        </div>
        ) : null}
        <div className="articleBody">
          {article.body.map((block, i) => renderBodyBlock(block, i))}
          <p>
            <a className="textLink" href="/contact">
              {content.contactCta} <span>→</span>
            </a>
          </p>
        </div>
      </article>
    </MaraChrome>
  );
}
