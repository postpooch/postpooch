import type { TemplatePageProps } from "../../../types";
import { toAureliaArticle } from "../../../blog-post-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { JournalGrid } from "../../components/journal-grid";
import { PageHero } from "../../components/page-hero";
import type { AureliaSettings } from "../../settings";

import type { AureliaJournalContent } from "./schema";

export function AureliaJournalPage({
  site,
  settings,
  content,
  blogPosts,
}: TemplatePageProps<AureliaJournalContent, AureliaSettings>) {
  const articles = blogPosts.map(toAureliaArticle);

  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad section-space">
        {articles.length ? (
          <JournalGrid items={articles} />
        ) : (
          <p>No posts published yet.</p>
        )}
      </section>
    </AureliaChrome>
  );
}
