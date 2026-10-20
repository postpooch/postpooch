import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { PageHero, PropertyCard } from "../../components/ui";
import { toReyProperty } from "../../../property-adapters";
import type { ReySettings } from "../../settings";

import type { ReyPropertiesContent } from "./schema";

export function ReyPropertiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ReyPropertiesContent, ReySettings>) {
  const listings = properties.map(toReyProperty);

  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <section className="section section--white">
        <div className="section-head">
          <div>
            <span className="eyebrow">{content.eyebrow}</span>
          </div>
          <div className="section-head__right">
            <h2>
              {content.titleLine1}
              <br />
              <em>{content.titleEmphasis}</em>
            </h2>
            <p>{content.deck}</p>
          </div>
        </div>
        {listings.length ? (
          <div className="property-grid">
            {listings.map((property, index) => (
              <PropertyCard
                key={property.slug}
                property={property}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
