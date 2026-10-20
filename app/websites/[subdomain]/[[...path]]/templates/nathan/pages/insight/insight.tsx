import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toNathanInsight } from "../../../blog-post-adapters";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanInsightContent } from "./schema";

export function NathanInsightPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<NathanInsightContent, NathanSettings>) {
  const article = blogPosts
    .map(toNathanInsight)
    .find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <NathanChrome site={site} settings={settings}>
      <article className="insight-detail page-top">
        <header className="insight-header section-pad">
          <p className="eyebrow">
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </header>
        {article.image ? (
          <div className="insight-image">
            <img src={article.image} alt="" />
          </div>
        ) : null}
        <div className="insight-body section-pad">
          <aside>
            <span>{content.asideLabel}</span>
            <p>
              {content.authorPrefix} {settings.agent.fullName}
            </p>
          </aside>
          <div>
            {article.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <a className="text-link" href={content.ctaHref}>
              {content.ctaLabel}
            </a>
          </div>
        </div>
        <div className="insight-back section-pad">
          <a href={content.backHref}>{content.backLabel}</a>
        </div>
      </article>
    </NathanChrome>
  );
}
