import type { TemplatePageProps } from "../../../types";
import { toMilaArticle } from "../../../blog-post-adapters";
import { ArrowRight } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaInsightsContent } from "./schema";

export function MilaInsightsPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<MilaInsightsContent, MilaSettings>) {
  const articles = blogPosts.map(toMilaArticle);

  return (
    <MilaChrome site={site} settings={settings}>
      <section className="page-title shell">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p className="lead">{content.lead}</p>
      </section>
      <section className="journal-index section shell">
        {articles.length ? (
          articles.map((article, index) => (
            <a
              href={`/insights/${article.slug}`}
              className={`journal-row journal-${index + 1}`}
              key={article.slug}
            >
              {article.image ? (
                <div className="journal-img">
                  <img src={article.image} alt="" />
                </div>
              ) : null}
              <div className="journal-copy">
                <span>
                  {article.category} · {article.date}
                </span>
                <h2>{article.title}</h2>
                <p>{article.intro}</p>
                <b>
                  {content.cardCta} <ArrowRight />
                </b>
              </div>
            </a>
          ))
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </MilaChrome>
  );
}
