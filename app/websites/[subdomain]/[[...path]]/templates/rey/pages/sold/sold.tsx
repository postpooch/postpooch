import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { PageHero } from "../../components/ui";
import { toReyProperty } from "../../../property-adapters";
import type { ReySettings } from "../../settings";

import type { ReySoldContent } from "./schema";

export function ReySoldPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ReySoldContent, ReySettings>) {
  const sold = properties.filter(isSoldListing).map(toReyProperty);

  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <section className="section section--white">
        {sold.length ? (
          <div className="property-grid">
            {sold.map((property, index) => (
              <a
                className="property-card"
                key={property.slug}
                href={`/properties/${property.slug}`}
              >
                <div
                  className="property-card__image image-hover"
                  style={{
                    backgroundImage: `linear-gradient(180deg,transparent 55%,rgba(0,0,0,.55)),url("${property.image}")`,
                  }}
                >
                  <span className="card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="property-card__view">View residence ↗</span>
                </div>
                <div className="property-card__meta">
                  <div>
                    <h3>{property.address}</h3>
                    <p>{property.city}</p>
                  </div>
                  <strong>{content.soldLabel}</strong>
                </div>
                <div className="property-card__facts">
                  {[
                    property.beds ? `${property.beds} beds` : "",
                    property.baths ? `${property.baths} baths` : "",
                    property.sqft !== "—" ? `${property.sqft} sq ft` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ") || content.soldLabel}
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
