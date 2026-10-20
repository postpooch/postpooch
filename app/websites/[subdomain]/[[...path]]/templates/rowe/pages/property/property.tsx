import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RowePropertyContent } from "./schema";
import { toRoweProperty } from "../../../property-adapters";

export function RowePropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<RowePropertyContent, RoweSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toRoweProperty(source);

  return (
    <RoweChrome site={site} settings={settings}>
      <section className="listing-hero">
        <img src={property.image} alt={content.imageAlt} />
        <div className="listing-overlay">
          <div>
            <span>{property.status}</span>
            <span>{property.location}</span>
          </div>
          <h1>{property.name}</h1>
          <div className="listing-price">{property.price}</div>
        </div>
      </section>
      <section className="listing-intro section-pad">
        <div className="listing-specs">
          <span>{property.beds}</span>
          <span>{property.baths}</span>
          <span>{property.area}</span>
        </div>
        <div>
          <h2>{property.summary}</h2>
          {property.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className="text-arrow" href={content.showingCtaHref}>
            {content.showingCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>
      <section className="listing-gallery section-pad">
        {property.image2 ? (
          <img className="wide" src={property.image2} alt={content.interiorAlt} />
        ) : null}
        {property.image3 ? (
          <img src={property.image3} alt={content.architectureAlt} />
        ) : null}
        {property.details.length ? (
        <div className="listing-details">
          <span>{content.detailsLabel}</span>
          {property.details.map((detail) => (
            <div key={detail}>{detail}</div>
          ))}
        </div>
        ) : null}
      </section>
      <section className="listing-disclaimer section-pad">
        <span>{content.disclaimerLabel}</span>
        <p>{content.disclaimerBody}</p>
      </section>
    </RoweChrome>
  );
}
