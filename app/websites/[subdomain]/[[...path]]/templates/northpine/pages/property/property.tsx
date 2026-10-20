import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { MortgageCard } from "../../components/mortgage-card";
import { NorthpineChrome } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";
import { toNorthpineProperty } from "../../../property-adapters";

import type { NorthpinePropertyContent } from "./schema";

export function NorthpinePropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<NorthpinePropertyContent, NorthpineSettings>) {
  const source = properties.find((property) => property.slug === params.slug);
  if (!source) notFound();
  const property = toNorthpineProperty(source);
  const gallery = source.images;

  return (
    <NorthpineChrome site={site} settings={settings}>
      <section className="property-hero">
        <img src={property.image} alt={property.title} />
        <div className="property-hero-overlay">
          <span>
            {property.status} · {property.tag}
          </span>
          <h1>{property.title}</h1>
          <p>{property.city}</p>
        </div>
      </section>
      <section className="property-summary container wide">
        <div>
          <strong>{property.price}</strong>
          <span>{content.priceLabel}</span>
        </div>
        <div>
          <strong>{property.beds}</strong>
          <span>{content.bedsLabel}</span>
        </div>
        <div>
          <strong>{property.baths}</strong>
          <span>{content.bathsLabel}</span>
        </div>
        <div>
          <strong>{property.sqft}</strong>
          <span>{content.areaLabel}</span>
        </div>
        <a href={content.ctaHref} className="btn btn-dark">
          {content.ctaLabel}
        </a>
      </section>
      <section className="section-pad container wide">
        <div className="property-detail-grid">
          <article>
            <span className="eyebrow">{content.aboutEyebrow}</span>
            <h2>{content.aboutTitle}</h2>
            <p className="lead">{property.description}</p>
            {source.features.length ? (
              <>
                <h3>{content.highlightsHeading}</h3>
                <div className="feature-columns">
                  <ul>
                    {source.features.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {source.features.slice(4, 8).length ? (
                    <ul>
                      {source.features.slice(4, 8).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </>
            ) : null}
          </article>
          <MortgageCard priceLabel={property.price} />
        </div>
      </section>
      {gallery.length ? (
        <section className="gallery-strip">
          {gallery.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt={`${property.title} view`} />
          ))}
        </section>
      ) : null}
    </NorthpineChrome>
  );
}
