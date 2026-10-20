import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import { PageHero, SectionHeading, SplitEditorial } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryMarketingContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxuryMarketingPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<LuxuryMarketingContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="marketing-intro section-pad">
        <SectionHeading
          eyebrow={content.introEyebrow}
          title={content.introTitle}
        />
        <div className="two-column-prose">
          {content.introParagraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <SplitEditorial
        image={content.networkImage}
        eyebrow={content.networkEyebrow}
        title={content.networkTitle}
      >
        {content.networkParagraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SplitEditorial>
      <section className="section-pad">
        <SectionHeading
          eyebrow={content.campaignEyebrow}
          title={content.campaignTitle}
          align="center"
        />
        <div className="pillar-grid">
          {content.pillars.map((pillar, i) => (
            <article key={pillar.title}>
              <span>0{i + 1}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="dark-section section-pad">
        <SectionHeading
          eyebrow={content.resultsEyebrow}
          title={content.resultsTitle}
          text={content.resultsText}
          align="center"
        />
        <div className="stats-grid light">
          {settings.results.slice(0, 3).map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>
      {properties.some(isSoldListing) ? <section className="section-pad">
        <SectionHeading eyebrow={content.salesEyebrow} title={content.salesTitle} />
        <div className="property-grid">
          {properties.filter(isSoldListing).slice(0, 3).map(toLuxuryProperty).map((p) => (
            <PropertyCard key={p.slug} property={p} sold />
          ))}
        </div>
      </section> : null}
    </LuxuryChrome>
  );
}
