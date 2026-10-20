import type { TemplatePageProps } from "../../../types";
import { PropertyCard } from "../../components/property-card";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RowePropertiesContent } from "./schema";
import { toRoweProperty } from "../../../property-adapters";

export function RowePropertiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<RowePropertiesContent, RoweSettings>) {
  return (
    <RoweChrome site={site} settings={settings}>
      <section className="page-hero property-page-hero">
        <div className="page-hero-label">{content.label}</div>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p>{content.deck}</p>
      </section>
      <section className="properties-list section-pad">
        {properties.map(toRoweProperty).map((property, index) => (
          <PropertyCard
            key={property.slug}
            property={property}
            featured={index === 0}
          />
        ))}
      </section>
      <section className="offmarket-cta section-pad">
        <div>
          <span>{content.offmarketLabel}</span>
          <h2>{content.offmarketTitle}</h2>
        </div>
        <a href={content.offmarketCtaHref} className="text-arrow light">
          {content.offmarketCtaLabel} <span>↗</span>
        </a>
      </section>
    </RoweChrome>
  );
}
