import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toSloaneProperty } from "../../../property-adapters";
import { ContactForm } from "../../components/contact-form";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloanePropertyContent } from "./schema";

export function SloanePropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<SloanePropertyContent, SloaneSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  const property = source ? toSloaneProperty(source) : null;
  if (!source || !property) notFound();

  const gallery = source.images;

  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="property-detail-hero">
        <div className="property-gallery">
          {gallery.map((image, index) => (
            <img
              key={`${image}-${index}`}
              className={index === 0 ? "main" : undefined}
              src={image}
              alt={index === 0 ? property.address : `${property.address} view ${index + 1}`}
            />
          ))}
        </div>
      </section>
      <section className="section-pad wide">
        <div className="property-detail">
          <div>
            <div className="eyebrow">{property.status}</div>
            <h1>{property.address}</h1>
            <div className="address-line">{property.city}</div>
            <div className="property-price">{property.price}</div>
            <div className="spec-table">
              <div className="spec-row">
                <span>Bedrooms</span>
                <span>{property.beds}</span>
              </div>
              <div className="spec-row">
                <span>Bathrooms</span>
                <span>{property.baths}</span>
              </div>
              <div className="spec-row">
                <span>Interior</span>
                <span>{property.sqft} Sq Ft</span>
              </div>
              <div className="spec-row">
                <span>Lot</span>
                <span>{property.lot}</span>
              </div>
              <div className="spec-row">
                <span>Year built</span>
                <span>{property.year || "—"}</span>
              </div>
            </div>
          </div>
          <div className="property-description">
            <p className="lede">{property.summary}</p>
            <p>{property.description}</p>
            <p>{content.disclaimer}</p>
          </div>
        </div>
      </section>
      <section className="wide" style={{ paddingBottom: "100px" }}>
        <div className="eyebrow">{content.locationEyebrow}</div>
        <div className="map-placeholder" aria-label="Map placeholder">
          <div className="map-marker">{settings.agent.monogram}</div>
        </div>
      </section>
      <section className="section-pad dark-section">
        <div className="wide footer-cta-grid">
          <div>
            <div className="eyebrow">{content.showingEyebrow}</div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(42px,5vw,72px)",
                fontWeight: 400,
                lineHeight: 1,
                margin: 0,
              }}
            >
              {content.showingTitle}
            </h2>
            <p style={{ color: "#aaa69d" }}>{content.showingBody}</p>
          </div>
          <ContactForm title="" />
        </div>
      </section>
    </SloaneChrome>
  );
}
