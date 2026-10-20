import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAureliaArticle } from "../../../blog-post-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import type { AureliaSettings } from "../../settings";

import type { AureliaJournalPostContent } from "./schema";

export function AureliaJournalPostPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<AureliaJournalPostContent, AureliaSettings>) {
  const article = blogPosts.map(toAureliaArticle).find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <AureliaChrome site={site} settings={settings} headerOnLight>
      <section className="article-hero section-pad">
        <div>
          <p className="kicker">
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
        </div>
        <p>{article.excerpt}</p>
      </section>
      {article.image ? <img className="article-image" src={article.image} alt="" /> : null}
      <article className="article-body section-pad">
        {article.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <a href={content.backHref} className="text-button">
          {content.backLabel} <span>←</span>
        </a>
      </article>
    </AureliaChrome>
  );
}
