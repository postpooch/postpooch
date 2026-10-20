import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossPropertyContent } from "./schema";
import { toVossProperty } from "../../../property-adapters";

export function VossPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<VossPropertyContent, VossSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toVossProperty(source);

  return (
    <VossChrome site={site} settings={settings} transparentHeader>
      <main>
        <section className="property-hero">
          <img
            src={property.image}
            alt={`${property.address} exterior or interior`}
          />
          <div className="property-hero__shade" />
          <div className="property-hero__copy">
            <p className="eyebrow eyebrow--light">
              {property.status} · {property.neighborhood}
            </p>
            <h1>{property.address}</h1>
            <div>
              <span>{property.price}</span>
            <span>
              {[
                property.beds ? `${property.beds} Bedrooms` : "",
                property.baths ? `${property.baths} Baths` : "",
                property.sqft,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            </div>
          </div>
        </section>
        <section className="property-story section-pad">
          <div>
            <p className="eyebrow">{content.residenceEyebrow}</p>
            <h2>
              {content.storyTitleLine1}
              <br />
              <em>{content.storyTitleEmphasis}</em>
            </h2>
          </div>
          <div className="property-story__copy">
            <p>{property.summary}</p>
            <a href={content.showingCtaHref} className="line-link">
              {content.showingCtaLabel} <span>↗</span>
            </a>
          </div>
        </section>
        <section className="property-gallery section-pad section-pad--topless">
          {property.gallery.map((img, i) => (
            <div className={`gallery-item gallery-item--${i + 1}`} key={img}>
              <img
                src={img}
                alt={`${property.address} detail ${i + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </section>
        {property.details.length ? (
        <section className="property-details section-pad">
          <div>
            <p className="eyebrow">{content.detailsEyebrow}</p>
            <h2>
              {property.type}
              <br />
              <em>{property.neighborhood}</em>
            </h2>
          </div>
          <ul>
            {property.details.map((d) => (
              <li key={d}>
                <span>↳</span>
                {d}
              </li>
            ))}
          </ul>
        </section>
        ) : null}
        <section className="property-disclaimer section-pad section-pad--topless">
          <p>{content.disclaimer}</p>
        </section>
      </main>
    </VossChrome>
  );
}
