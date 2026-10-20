import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import { PageHero, SectionHeading, SplitEditorial } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryAboutContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxuryAboutPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<LuxuryAboutContent, LuxurySettings>) {
  const { realtor, results } = settings;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={`Representing ${realtor.market}'s Finest`}
        subtitle={content.heroSubtitle}
        image={realtor.lifestyleImage}
      />
      <SplitEditorial
        image={realtor.headshot}
        eyebrow={realtor.title.toUpperCase()}
        title={realtor.name}
      >
        {realtor.longBio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </SplitEditorial>
      <section className="quote-band">
        <blockquote>“{content.quote}”</blockquote>
      </section>
      <SplitEditorial
        reverse
        image="https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/26/26f07b1c37483f7b7b9e191f84d4be9fc055bd36d6941a5cdc4b9d146704dee4.avif"
        eyebrow={content.experienceEyebrow}
        title={content.experienceTitle.replace("{name}", realtor.name)}
      >
        {content.experienceParagraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SplitEditorial>
      <section className="section-pad results-section">
        <SectionHeading
          eyebrow={content.resultsEyebrow}
          title={content.resultsTitle}
          align="center"
        />
        <div className="stats-grid">
          {results.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
      {properties.length ? <section className="section-pad">
        <SectionHeading
          eyebrow={content.featuredEyebrow}
          title={content.featuredTitle}
        />
        <div className="property-grid">
          {properties.slice(0, 3).map(toLuxuryProperty).map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      </section> : null}
    </LuxuryChrome>
  );
}
