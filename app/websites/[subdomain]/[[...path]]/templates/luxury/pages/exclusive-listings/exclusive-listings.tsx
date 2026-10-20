import { exclusiveListings } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryListingsContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxuryListingsPage({
  site,
  settings,
  content,
  properties: websiteProperties,
}: TemplatePageProps<LuxuryListingsContent, LuxurySettings>) {
  const properties = exclusiveListings(websiteProperties).map(toLuxuryProperty);
  const heroImage = properties[0]?.image ?? settings.hero.image;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={`A curated collection of homes in ${settings.realtor.market} and beyond.`}
        image={heroImage}
      />
      <section className="section-pad">
        <SectionHeading
          eyebrow={content.sectionEyebrow}
          title={content.sectionTitle}
          text={content.sectionText}
        />
        <div className="property-grid">
          {properties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
        {!properties.length ? (
          <div className="empty-state">
            <h2>No exclusive listings yet.</h2>
            <p>Homes marked featured or currently for sale will appear here.</p>
          </div>
        ) : null}
      </section>
    </LuxuryChrome>
  );
}
