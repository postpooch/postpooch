import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toValeArticle } from "../../../blog-post-adapters";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValeJournalPostContent } from "./schema";

export function ValeJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<ValeJournalPostContent, ValeSettings>) {
  const article = blogPosts
    .map(toValeArticle)
    .find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <ValeChrome site={site} settings={settings}>
      <article className="article-page">
        <header className="article-header page-pad">
          <p className="eyebrow">
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </header>
        {article.image ? (
          <div className="article-lead-image">
            <img src={article.image} alt="" />
          </div>
        ) : null}
        <div className="article-body page-pad">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <a href="/journal" className="text-link">
            {content.backLabel}
          </a>
        </div>
      </article>
    </ValeChrome>
  );
}
