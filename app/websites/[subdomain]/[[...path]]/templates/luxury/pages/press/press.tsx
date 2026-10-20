import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryPressContent } from "./schema";

export function LuxuryPressPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryPressContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="press-logos section-pad">
        {content.logos.map((logo) => (
          <span key={logo}>{logo}</span>
        ))}
      </section>
      <section className="section-pad press-list">
        <SectionHeading eyebrow={content.listEyebrow} title={content.listTitle} />
        {settings.catalog.press.map((item) => (
          <article key={`${item.publication}-${item.title}`}>
            <div>
              <p className="eyebrow">{item.publication}</p>
              <h2>{item.title}</h2>
            </div>
            <span>{item.year}</span>
            <button type="button" aria-label={`Read ${item.title}`}>
              ↗
            </button>
          </article>
        ))}
      </section>
    </LuxuryChrome>
  );
}
