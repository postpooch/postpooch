import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAveryProperty } from "../../../property-adapters";
import { AveryChrome } from "../../components/avery-chrome";
import type { AverySettings } from "../../settings";

import type { AveryPropertyContent } from "./schema";

export function AveryPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<AveryPropertyContent, AverySettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toAveryProperty(source);
  const neighborhood = property.city.split(",")[0] || property.city;
  const details = source.features;

  return (
    <AveryChrome site={site} settings={settings}>
      <section className="property-gallery">
        {source.images.map((image, index) => (
          <div key={`${image}-${index}`}>
            <img src={image} alt="" />
          </div>
        ))}
      </section>
      <section className="property-summary shell">
        <div>
          <p className="eyebrow">{property.status}</p>
          <h1>{property.address}</h1>
          <p>{property.city}</p>
          <div className="property-facts">
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
          </div>
        </div>
        <aside>
          <p className="price">{property.price}</p>
          <p className="prose">{property.blurb}</p>
          <a href="/contact" className="button dark-button">
            {content.inquiryLabel} <span>↗</span>
          </a>
        </aside>
      </section>
      <section className="content-section shell two-col">
        <div>
          <p className="eyebrow">{content.residenceKicker}</p>
          <h2>{content.residenceTitle}</h2>
        </div>
        <div className="prose">
          {(property.description ? [property.description] : content.residenceBody).map(
            (paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ),
          )}
        </div>
      </section>
      {details.length ? (
      <section className="content-section shell">
        <p className="eyebrow">Features &amp; amenities</p>
        <div className="amenities">
          <div>
            <h3>Details</h3>
            <ul>
              {details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      ) : null}
      <section className="editorial-split">
        <div
          className="editorial-image image-cover"
          style={{ backgroundImage: `url('${settings.catalog.images.city1}')` }}
        />
        <div className="editorial-copy">
          <p className="eyebrow">{content.neighborhoodKicker}</p>
          <h2>{neighborhood}</h2>
          <p>{content.neighborhoodBody}</p>
          <a href="/neighborhoods" className="button outline-button">
            {content.neighborhoodCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>
    </AveryChrome>
  );
}
