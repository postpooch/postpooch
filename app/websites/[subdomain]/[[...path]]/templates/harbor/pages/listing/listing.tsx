import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import type { HarborSettings } from "../../settings";

import type { HarborListingContent } from "./schema";
import { toHarborListing } from "../../../property-adapters";

export function HarborListingPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<HarborListingContent, HarborSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  const listing = source ? toHarborListing(source) : null;
  if (!source || !listing) notFound();

  const gallery = source.images;

  return (
    <HarborChrome site={site} settings={settings}>
      <section className="property-hero">
        <img src={listing.image} alt={listing.alt} />
        <div className="property-overlay" />
        <div className="property-title shell">
          <p className="kicker light">
            {listing.status} · {listing.neighbourhood}
          </p>
          <h1>{listing.address}</h1>
          <div>
            <strong>{listing.price}</strong>
            <span>
              {listing.beds} beds · {listing.baths} baths
            </span>
          </div>
        </div>
      </section>
      <section className="property-intro shell section-pad">
        <div>
          <p className="kicker">{listing.eyebrow}</p>
          <h2>
            {content.introTitleBefore} <em>{content.introTitleItalic}</em>
          </h2>
        </div>
        <div>
          <p>{listing.blurb}</p>
          <a className="button button-dark" href="/contact">
            {content.askCta}
          </a>
        </div>
      </section>
      {gallery.length ? (
        <section className="property-gallery">
          {gallery.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt={`${listing.address} view ${index + 1}`} />
          ))}
        </section>
      ) : null}
      <section className="property-facts shell section-pad">
        <div>
          <span>{content.factPropertyTypeLabel}</span>
          <strong>{source.propertyType || listing.eyebrow}</strong>
        </div>
        <div>
          <span>{content.factBedsLabel}</span>
          <strong>{listing.beds}</strong>
        </div>
        <div>
          <span>{content.factBathsLabel}</span>
          <strong>{listing.baths}</strong>
        </div>
        <div>
          <span>{content.factNeighbourhoodLabel}</span>
          <strong>{listing.neighbourhood}</strong>
        </div>
      </section>
    </HarborChrome>
  );
}
