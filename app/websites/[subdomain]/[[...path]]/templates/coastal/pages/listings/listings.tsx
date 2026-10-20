import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toCoastalProperty } from "../../../property-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyCard } from "../../components/property-card";
import { SearchBar } from "../../components/search-bar";
import type { CoastalSettings } from "../../settings";

import type { CoastalListingsContent } from "./schema";

export function CoastalListingsPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<CoastalListingsContent, CoastalSettings>) {
  const list = properties.filter(isAvailableListing).map(toCoastalProperty);

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage}>
        <p>{content.heroBody}</p>
      </PageHero>
      <section className="section cream">
        <div className="inlineSearch">
          <SearchBar />
        </div>
        <div className="propertyGrid">
          {list.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      </section>
    </CoastalChrome>
  );
}
