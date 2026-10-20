import { isLeaseListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaLeasesContent } from "./schema";

export function AureliaLeasesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AureliaLeasesContent, AureliaSettings>) {
  const items = properties.filter(isLeaseListing).map(toAureliaProperty);

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
        <div className="section-head">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h2 className="section-title">{content.title}</h2>
          </div>
          <p>{content.note}</p>
        </div>
        {items.length ? <PropertyGrid items={items} /> : <p>No leases to display yet.</p>}
      </section>
    </AureliaChrome>
  );
}
