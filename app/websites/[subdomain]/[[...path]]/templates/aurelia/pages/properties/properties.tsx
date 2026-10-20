import { isSaleListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaPropertiesContent } from "./schema";

export function AureliaPropertiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AureliaPropertiesContent, AureliaSettings>) {
  const items = properties.filter(isSaleListing).map(toAureliaProperty);
  const neighborhoods = Array.from(
    new Set(properties.map((property) => property.neighborhood || property.city).filter(Boolean)),
  );

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
        <div className="listing-intro">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h2 className="section-title">{content.title}</h2>
          </div>
          <p>{content.note}</p>
        </div>
        {neighborhoods.length ? (
          <div className="filter-bar">
            <span>{items.length} residences</span>
            <span>{neighborhoods.slice(0, 6).join(" · ")}</span>
          </div>
        ) : null}
        <PropertyGrid items={items} />
      </section>
    </AureliaChrome>
  );
}
