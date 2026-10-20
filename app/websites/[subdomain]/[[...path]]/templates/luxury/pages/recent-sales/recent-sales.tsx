import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxurySalesContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxurySalesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<LuxurySalesContent, LuxurySettings>) {
  const recentSales = properties
    .filter(isSoldListing)
    .map(toLuxuryProperty);
  const heroImage = recentSales[0]?.image ?? settings.hero.image;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={heroImage}
      />
      <section className="section-pad">
        <SectionHeading
          eyebrow={content.sectionEyebrow}
          title={content.sectionTitle}
          text={content.sectionText}
        />
        <div className="property-grid">
          {recentSales.map((p) => (
            <PropertyCard key={p.slug} property={p} sold />
          ))}
        </div>
      </section>
    </LuxuryChrome>
  );
}
