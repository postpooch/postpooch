import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toSloaneProperty } from "../../../property-adapters";
import { PropertyGrid } from "../../components/property-grid";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneListingsContent } from "../properties/schema";

export function SloaneSoldPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<SloaneListingsContent, SloaneSettings>) {
  const listings = properties.filter(isSoldListing).map(toSloaneProperty);

  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad wide">
        <PropertyGrid properties={listings} showFilters={false} />
      </section>
    </SloaneChrome>
  );
}
