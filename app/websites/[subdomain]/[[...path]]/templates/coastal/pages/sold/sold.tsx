import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toCoastalProperty } from "../../../property-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyCard } from "../../components/property-card";
import type { CoastalSettings } from "../../settings";

import type { CoastalSoldContent } from "./schema";

export function CoastalSoldPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<CoastalSoldContent, CoastalSettings>) {
  const list = properties.filter(isSoldListing).map(toCoastalProperty);

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="section cream">
        <div className="propertyGrid">
          {list.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      </section>
    </CoastalChrome>
  );
}
