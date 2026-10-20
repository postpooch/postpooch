import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAveryInsight } from "../../../blog-post-adapters";
import { AveryChrome } from "../../components/avery-chrome";
import type { AverySettings } from "../../settings";

import type { AveryInsightContent } from "./schema";

export function AveryInsightPage({
  site,
  settings,
  content,
  params,
  blogPosts,
}: TemplatePageProps<AveryInsightContent, AverySettings>) {
  const article = blogPosts.map(toAveryInsight).find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <AveryChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="shell page-hero-inner">
          <p className="eyebrow">
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
          <p className="hero-sub">{article.excerpt}</p>
        </div>
      </section>
      {article.image ? (
        <div className="article-hero-image">
          <img src={article.image} alt="" />
        </div>
      ) : null}
      <article className="article-wrap">
        <p className="article-lede">{content.lede}</p>
        <div className="prose">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <p>
            For a conversation about how this applies to your home or search,{" "}
            <a href="/contact" className="text-link">
              {content.contactLabel} <span>↗</span>
            </a>
            .
          </p>
        </div>
      </article>
    </AveryChrome>
  );
}
