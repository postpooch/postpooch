import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/forms";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import type { LuxurySettings } from "../../settings";

import type { LuxuryPropertyContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxuryPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<LuxuryPropertyContent, LuxurySettings>) {
  const source = properties.find((property) => property.slug === params.slug);
  if (!source) notFound();
  const property = toLuxuryProperty(source);

  return (
    <LuxuryChrome site={site} settings={settings}>
      <section className="property-detail-hero">
        <img src={property.image} alt={property.name} />
        <div className="property-detail-title">
          <p className="eyebrow">{property.status}</p>
          <h1>{property.name}</h1>
          <p>{property.address}</p>
        </div>
      </section>
      <section className="property-facts">
        <strong>{property.price}</strong>
        {property.beds ? <span>{property.beds} Bedrooms</span> : null}
        {property.baths ? <span>{property.baths} Bathrooms</span> : null}
        {property.sqft ? <span>{property.sqft} Sq. Ft.</span> : null}
        {property.acres ? <span>{property.acres} Acres</span> : null}
      </section>
      <section className="property-overview section-pad">
        <div>
          <p className="eyebrow">{content.overviewEyebrow}</p>
          <h2>{content.overviewTitle}</h2>
        </div>
        <div>
          <p>{property.description}</p>
        </div>
      </section>
      <section className="property-gallery">
        {property.gallery.map((image, index) => (
          <img
            key={`${image}-${index}`}
            className={index === 0 ? "wide" : ""}
            src={image}
            alt={`${property.name} view ${index + 1}`}
          />
        ))}
      </section>
      <section className="property-inquiry dark-section section-pad">
        <div>
          <p className="eyebrow">{content.inquiryEyebrow}</p>
          <h2>{content.inquiryTitle}</h2>
          <p>
            Contact {settings.realtor.name} to arrange a private showing or
            receive additional property details.
          </p>
        </div>
        <ContactForm dark compact realtorName={settings.realtor.name} />
      </section>
      {properties.some((p) => p.slug !== params.slug) ? (
      <section className="section-pad">
        <h2 className="center-title">{content.relatedTitle}</h2>
        <div className="property-grid">
          {properties
            .filter((p) => p.slug !== params.slug)
            .slice(0, 3)
            .map(toLuxuryProperty)
            .map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
        </div>
      </section>
      ) : null}
    </LuxuryChrome>
  );
}
