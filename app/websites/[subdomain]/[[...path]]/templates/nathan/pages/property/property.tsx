import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanPropertyContent } from "./schema";
import { toNathanProperty } from "../../../property-adapters";

export function NathanPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<NathanPropertyContent, NathanSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toNathanProperty(source);

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="property-detail-hero">
        <img
          src={property.image}
          alt={`${property.address} exterior or main living space`}
        />
        <div className="property-detail-overlay section-pad">
          <p>{property.status}</p>
          <h1>{property.address}</h1>
          <div>
            <strong>{property.price}</strong>
            <span>
              {property.neighborhood} · {property.type}
            </span>
          </div>
        </div>
      </section>
      <section className="property-detail-meta section-pad">
        <div className="detail-specs">
          <span>
            <b>{property.beds}</b> Bedrooms
          </span>
          <span>
            <b>{property.baths}</b> Bathrooms
          </span>
          <span>
            <b>{property.sqft}</b> Interior sq ft
          </span>
        </div>
        <a
          className="pill dark"
          href={`/contact?property=${property.slug}`}
        >
          {content.showingCtaLabel} <span>↗</span>
        </a>
      </section>
      <section className="property-editorial section-pad">
        <p className="eyebrow">{content.residenceEyebrow}</p>
        <h2>{property.blurb}</h2>
        <p>{property.description}</p>
      </section>
      {property.image2 || property.image3 ? (
      <section className="property-gallery section-pad">
        {property.image2 ? (
          <img src={property.image2} alt={`${property.address} interior`} />
        ) : null}
        {property.image3 ? (
          <img src={property.image3} alt={`${property.address} detail`} />
        ) : null}
      </section>
      ) : null}
      <section className="property-facts section-pad">
        <div>
          <p className="eyebrow">{content.typeEyebrow}</p>
          <strong>{property.type}</strong>
        </div>
        <div>
          <p className="eyebrow">{content.locationEyebrow}</p>
          <strong>{property.neighborhood}</strong>
        </div>
        <div>
          <p className="eyebrow">{content.representationEyebrow}</p>
          <strong>{settings.agent.brokerageName}</strong>
        </div>
      </section>
      <section className="next-property section-pad">
        <p className="eyebrow">{content.continueEyebrow}</p>
        <a href={content.backHref}>
          {content.backLabel} <span>↗</span>
        </a>
      </section>
    </NathanChrome>
  );
}
