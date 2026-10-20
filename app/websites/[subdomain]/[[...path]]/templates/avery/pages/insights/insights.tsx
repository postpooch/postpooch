import type { TemplatePageProps } from "../../../types";
import { toAveryInsight } from "../../../blog-post-adapters";
import { AveryChrome } from "../../components/avery-chrome";
import { NewsletterBlock } from "../../components/newsletter-form";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryInsightsContent } from "./schema";

export function AveryInsightsPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<AveryInsightsContent, AverySettings>) {
  const notes = blogPosts.map(toAveryInsight);

  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero kicker={content.heroKicker} title={content.heroTitle} sub={content.heroSub} />
      <section className="content-section shell">
        {notes.length ? (
          <div className="article-grid">
            {notes.map((item) => (
              <a className="article-card" href={`/insights/${item.slug}`} key={item.slug}>
                {item.image ? (
                  <div className="article-image">
                    <img src={item.image} alt="" />
                  </div>
                ) : null}
                <small>
                  {item.category} · {item.date}
                </small>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="muted">No posts published yet.</p>
        )}
      </section>
      <NewsletterBlock />
    </AveryChrome>
  );
}
