import type { TemplatePageProps } from "../../../types";
import { toAtelierPost } from "../../../blog-post-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierJournalContent } from "./schema";

export function AtelierJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<AtelierJournalContent, AtelierSettings>) {
  const posts = blogPosts.map(toAtelierPost);

  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="journalArchive shell">
        {posts.length ? (
          posts.map((article, index) => (
            <a
              href={`/journal/${article.slug}`}
              className={`archiveCard ${index === 0 ? "featured" : ""}`}
              key={article.slug}
            >
              {article.image ? (
                <div
                  className="archiveImage"
                  style={{ backgroundImage: `url("${article.image}")` }}
                />
              ) : null}
              <div>
                <p className="kicker">
                  {article.category} · {article.date}
                </p>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <span className="textLink">
                  Read story <b>↗</b>
                </span>
              </div>
            </a>
          ))
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </AtelierChrome>
  );
}
