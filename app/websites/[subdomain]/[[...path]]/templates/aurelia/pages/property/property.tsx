import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { ContactForm } from "../../components/contact-form";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaPropertyContent } from "./schema";

export function AureliaPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<AureliaPropertyContent, AureliaSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toAureliaProperty(source);
  const related = properties
    .filter((item) => item.slug !== property.slug)
    .slice(0, 2)
    .map(toAureliaProperty);

  return (
    <AureliaChrome site={site} settings={settings}>
      <section
        className="property-detail-hero"
        style={{ backgroundImage: `url(${property.image})` }}
      >
        <div className="property-detail-heading">
          <div className="property-detail-heading-top">
            <span>
              {property.status} · {property.city}
            </span>
            <span className="property-detail-price">{property.price}</span>
          </div>
          <h1>{property.address}</h1>
        </div>
      </section>
      <section className="feature-row section-pad">
        <div>
          <strong>{property.beds}</strong>
          <span>Bedrooms</span>
        </div>
        <div>
          <strong>{property.baths}</strong>
          <span>Bathrooms</span>
        </div>
        <div>
          <strong>{property.sqft}</strong>
          <span>Square feet</span>
        </div>
        <div>
          <strong>{property.lot}</strong>
          <span>Lot size</span>
        </div>
      </section>
      <section className="section-pad section-space gallery-mosaic">
        <img src={property.image} alt="" />
        <div className="gallery-mosaic-right">
          {property.image2 ? <img src={property.image2} alt="" /> : null}
          {property.image3 ? <img src={property.image3} alt="" /> : null}
        </div>
      </section>
      <section className="section-pad section-space property-description">
        <div>
          <p className="kicker">{content.residenceKicker}</p>
          <h2>{content.residenceTitle}</h2>
        </div>
        <div className="prose">
          <p className="prose-large">{property.description}</p>
          <div className="facts-table">
            <div className="fact-row">
              <span>Year built</span>
              <span>{property.year}</span>
            </div>
            <div className="fact-row">
              <span>Lot</span>
              <span>{property.lot}</span>
            </div>
            <div className="fact-row">
              <span>Parking</span>
              <span>{property.garage}</span>
            </div>
            <div className="fact-row">
              <span>Status</span>
              <span>{property.status}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad section-space" style={{ background: "#1a1a17", color: "white" }}>
        <div className="contact-grid">
          <div>
            <p className="kicker light">{content.inquiryKicker}</p>
            <h2 className="section-title">{content.inquiryTitle}</h2>
            <p style={{ color: "#aaa79f", maxWidth: 420 }}>{content.inquiryBody}</p>
          </div>
          <ContactForm dark />
        </div>
      </section>
      {related.length ? (
        <section className="section-pad section-space">
          <div className="section-head">
            <div>
              <p className="kicker">{content.relatedKicker}</p>
              <h2 className="section-title">{content.relatedTitle}</h2>
            </div>
          </div>
          <PropertyGrid items={related} />
        </section>
      ) : null}
    </AureliaChrome>
  );
}
