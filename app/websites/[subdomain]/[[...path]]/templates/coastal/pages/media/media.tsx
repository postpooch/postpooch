import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalMediaContent } from "./schema";

export function CoastalMediaPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalMediaContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="section cream mediaGrid">
        {settings.catalog.mediaItems.map((item, index) => (
          <article key={item.title}>
            <div className={`mediaVisual mv${index % 3}`}>
              <span>{item.source}</span>
            </div>
            <p className="eyebrow">{item.type}</p>
            <h3>{item.title}</h3>
            <a href="/video">{content.ctaLabel}</a>
          </article>
        ))}
      </section>
    </CoastalChrome>
  );
}
