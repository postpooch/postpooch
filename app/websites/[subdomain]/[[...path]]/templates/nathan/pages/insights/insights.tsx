import type { TemplatePageProps } from "../../../types";
import { toNathanInsight } from "../../../blog-post-adapters";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanInsightsContent } from "./schema";

export function NathanInsightsPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<NathanInsightsContent, NathanSettings>) {
  const articles = blogPosts.map(toNathanInsight);

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="insights-page section-pad page-top">
        <div className="listing-title">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.deck}</p>
        </div>
        {articles.length ? (
          <div className="article-list">
            {articles.map((article, index) => (
              <a
                href={`/insights/${article.slug}`}
                key={article.slug}
                className="article-row"
              >
                <span className="article-no">0{index + 1}</span>
                {article.image ? (
                  <div className="article-thumb">
                    <img src={article.image} alt="" />
                  </div>
                ) : null}
                <div className="article-info">
                  <p className="eyebrow">
                    {article.category} · {article.date}
                  </p>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                </div>
                <span className="article-arrow">↗</span>
              </a>
            ))}
          </div>
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </NathanChrome>
  );
}
