import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { ArdenChrome } from "../../components/arden-chrome";
import { IconBath, IconBed, IconLand, IconRuler } from "../../components/icons";
import { PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenPropertyContent } from "./schema";

export function ArdenPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<ArdenPropertyContent, ArdenSettings>) {
  const source = properties.find((property) => property.slug === params.slug);
  if (!source) notFound();
  const property = toArdenProperty(source);
  const related = properties
    .filter((item) => item.slug !== property.slug)
    .slice(0, 3)
    .map(toArdenProperty);

  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="propertyGallery">
        {(property.gallery.length ? property.gallery : [property.image]).map((image, index) => (
          <img
            key={`${image}-${index}`}
            className={index === 0 ? "main" : undefined}
            src={image}
            alt={index === 0 ? property.title : ""}
          />
        ))}
      </section>
      <section className="propertyHeader">
        <div>
          <p className="eyebrow">{property.status}</p>
          <h1>{property.title}</h1>
          <p>{property.location}</p>
        </div>
        <div>
          <p className="priceLarge">{property.price}</p>
          <div className="propertyStats" style={{ marginTop: 20 }}>
            {property.beds ? (
              <span>
                <IconBed />
                {property.beds} Beds
              </span>
            ) : null}
            {property.baths ? (
              <span>
                <IconBath />
                {property.baths} Baths
              </span>
            ) : null}
            {property.sqft ? (
              <span>
                <IconRuler />
                {property.sqft} Sq.Ft.
              </span>
            ) : null}
            {property.acres ? (
              <span>
                <IconLand />
                {property.acres} Acres
              </span>
            ) : null}
          </div>
        </div>
      </section>
      <section className="propertyDetails">
        <div className="propertyDetailsInner">
          <div>
            <p className="eyebrow">{content.descriptionEyebrow}</p>
            <h2>{content.descriptionTitle}</h2>
            {property.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div>
            <p className="eyebrow">{content.featuresEyebrow}</p>
            <div className="featureList">
              {property.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      {related.length ? (
      <section className="section">
        <SectionHeading eyebrow={content.relatedEyebrow} title={content.relatedTitle} />
        <PropertyGrid items={related} />
      </section>
      ) : null}
    </ArdenChrome>
  );
}
