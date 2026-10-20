import type { TemplatePageProps } from "../../../types";
import { toMaraArticle } from "../../../blog-post-adapters";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraJournalContent } from "./schema";

export function MaraJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<MaraJournalContent, MaraSettings>) {
  const articles = blogPosts.map(toMaraArticle);

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="journalHero">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>
          {content.titleLine1}
          <br />& <em>{content.titleEmphasis}</em>
        </h1>
        <p>{content.intro}</p>
      </section>
      <section className="section">
        {articles.length ? (
          <div className="journalList">
            {articles.map((article) => (
              <a href={`/journal/${article.slug}`} className="journalItem" key={article.slug}>
                {article.image ? <img src={article.image} alt="" /> : null}
                <div className="articleInfo">
                  <p>
                    {article.category} · {article.date}
                  </p>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                  <span className="textLink">
                    Read article <span>→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </MaraChrome>
  );
}
