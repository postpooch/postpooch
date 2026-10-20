import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toMilaArticle } from "../../../blog-post-adapters";
import { ArrowUpRight } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaInsightContent } from "./schema";

export function MilaInsightPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<MilaInsightContent, MilaSettings>) {
  const article = blogPosts.map(toMilaArticle).find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <MilaChrome site={site} settings={settings}>
      <article className="article-page">
        <header className="article-hero shell">
          <span className="eyebrow">
            {article.category} · {article.date}
          </span>
          <h1>{article.title}</h1>
          <p className="lead">{article.intro}</p>
        </header>
        {article.image ? (
          <div className="article-feature shell">
            <img src={article.image} alt="" />
          </div>
        ) : null}
        <div className="article-content shell">
          <aside>
            <span>{content.tocLabel}</span>
            {article.sections.map((section, index) => (
              <a href={`#deel-${index + 1}`} key={`${section[0]}-${index}`}>
                {String(index + 1).padStart(2, "0")} — {section[0]}
              </a>
            ))}
          </aside>
          <div className="article-prose">
            {article.sections.map((section, index) => (
              <section id={`deel-${index + 1}`} key={`${section[0]}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section[0]}</h2>
                <p>{section[1]}</p>
              </section>
            ))}
            <div className="article-cta">
              <h3>{content.ctaTitle}</h3>
              <p>{content.ctaBody}</p>
              <a href="/contact" className="button button-dark">
                {content.ctaLabel} <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </article>
    </MilaChrome>
  );
}
