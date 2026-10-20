import type { TemplatePageProps } from "../../../types";
import { toValeArticle } from "../../../blog-post-adapters";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValeJournalContent } from "./schema";

export function ValeJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<ValeJournalContent, ValeSettings>) {
  const articles = blogPosts.map(toValeArticle);

  return (
    <ValeChrome site={site} settings={settings}>
      <div className="interior-page page-pad journal-page">
        <header className="page-intro">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="intro-copy">{content.introCopy}</p>
        </header>
        {articles.length ? (
          <div className="journal-grid">
            {articles.map((article) => (
              <a
                href={`/journal/${article.slug}`}
                className="journal-card"
                key={article.slug}
              >
                {article.image ? (
                  <img src={article.image} alt="" />
                ) : null}
                <div>
                  <small>
                    {article.category} · {article.date}
                  </small>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                  <span>{content.readLabel}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p>No posts published yet.</p>
        )}
      </div>
    </ValeChrome>
  );
}
