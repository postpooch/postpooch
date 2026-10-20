import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { ArrowLink } from "../../components/ui";
import { toReyProperty } from "../../../property-adapters";
import type { ReySettings } from "../../settings";

import type { ReyPropertyContent } from "./schema";

export function ReyPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<ReyPropertyContent, ReySettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toReyProperty(source);
  const hero = property.gallery[0] ?? property.image;

  return (
    <ReyChrome site={site} settings={settings}>
      <section
        className="listing-hero"
        style={{ backgroundImage: `url("${hero}")` }}
      >
        <div className="listing-hero__copy">
          <div>
            <span className="eyebrow eyebrow--light">
              {property.status || content.statusPrefix} · {property.city}
            </span>
            <h1>{property.address}</h1>
          </div>
          <div className="listing-hero__price">{property.price}</div>
        </div>
      </section>
      <div className="listing-facts">
        <div className="listing-fact">
          <strong>{property.beds}</strong>
          <span>{content.bedsLabel}</span>
        </div>
        <div className="listing-fact">
          <strong>{property.baths}</strong>
          <span>{content.bathsLabel}</span>
        </div>
        <div className="listing-fact">
          <strong>{property.sqft}</strong>
          <span>{content.interiorLabel}</span>
        </div>
        <div className="listing-fact">
          <strong>{property.lot || "—"}</strong>
          <span>{content.lotLabel}</span>
        </div>
      </div>
      <section className="listing-copy">
        <div>
          <span className="eyebrow">{content.copyEyebrow}</span>
          <h2>{content.copyTitle}</h2>
        </div>
        <div>
          {property.description.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <ArrowLink href={content.showingCtaHref}>
            {content.showingCtaLabel}
          </ArrowLink>
        </div>
      </section>
      <div className="gallery-grid">
        {property.gallery.map((image, index) => (
          <div
            key={`${image}-${index}`}
            style={{ backgroundImage: `url("${image}")` }}
            aria-label={`${property.address} gallery image ${index + 1}`}
          />
        ))}
      </div>
      <section className="quote-section">
        <div className="quote-mark">↗</div>
        <div className="quote-copy">
          <blockquote>{content.inquiryQuote}</blockquote>
          <div className="quote-by">
            <strong>{property.address}</strong>
            <span>{property.city}</span>
          </div>
        </div>
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
