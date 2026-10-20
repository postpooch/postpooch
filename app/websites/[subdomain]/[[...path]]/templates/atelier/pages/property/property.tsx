import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAtelierProperty } from "../../../property-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PropertyGrid } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierPropertyContent } from "./schema";

export function AtelierPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<AtelierPropertyContent, AtelierSettings>) {
  const source = properties.find((property) => property.slug === params.slug);
  if (!source) notFound();
  const property = toAtelierProperty(source);

  return (
    <AtelierChrome site={site} settings={settings}>
      <section className="propertyDetailHero">
        <div
          className="galleryMain"
          style={{ backgroundImage: `url("${property.image}")` }}
        />
        <div className="gallerySide">
          {property.image2 ? (
            <div style={{ backgroundImage: `url("${property.image2}")` }} />
          ) : null}
          {property.image3 ? (
            <div style={{ backgroundImage: `url("${property.image3}")` }} />
          ) : null}
        </div>
        <button className="galleryButton" type="button">
          {content.galleryLabel} · {source.images.length || 1}
        </button>
      </section>
      <section className="propertyTitle shell">
        <div>
          <p className="kicker">
            {property.status} · {property.location}
          </p>
          <h1>{property.title}</h1>
        </div>
        <div>
          <h2>{property.price}</h2>
          <p>
            {[property.beds, property.baths, property.area]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </section>
      <section className="propertyBody shell">
        <div className="propertyNarrative">
          <p className="kicker">{content.narrativeEyebrow}</p>
          <h2>{content.narrativeTitle}</h2>
          <p>{property.description}</p>
        </div>
        <aside className="propertyFacts">
          <h3>{content.factsTitle}</h3>
          <dl>
            <div>
              <dt>Bedrooms</dt>
              <dd>{property.beds || "—"}</dd>
            </div>
            <div>
              <dt>Bathrooms</dt>
              <dd>{property.baths || "—"}</dd>
            </div>
            <div>
              <dt>Living area</dt>
              <dd>{property.area || "—"}</dd>
            </div>
            <div>
              <dt>Property type</dt>
              <dd>{source.propertyType || content.factsType}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{property.status}</dd>
            </div>
          </dl>
          <a href="/contact" className="darkButton blockButton">
            {content.tourCta}
          </a>
        </aside>
      </section>
      {property.image2 ? (
        <section className="propertyPanorama" style={{ backgroundImage: `url("${property.image2}")` }} />
      ) : null}
      {properties.some((item) => item.slug !== params.slug) ? (
      <section className="section shell">
        <div className="sectionHeading">
          <p className="kicker">{content.relatedEyebrow}</p>
          <h2>{content.relatedTitle}</h2>
        </div>
        <PropertyGrid
          items={properties
            .filter((item) => item.slug !== params.slug)
            .slice(0, 3)
            .map(toAtelierProperty)}
        />
      </section>
      ) : null}
    </AtelierChrome>
  );
}
