import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toCoastalProperty } from "../../../property-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import type { CoastalSettings } from "../../settings";

import type { CoastalListingContent } from "./schema";

export function CoastalListingPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<CoastalListingContent, CoastalSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const listing = toCoastalProperty(source);
  const gallery = source.images;

  return (
    <CoastalChrome site={site} settings={settings}>
      <section
        className="listingHero"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.55), transparent 55%), url(${listing.image})`,
        }}
      >
        <div>
          <p>{listing.status}</p>
          <h1>{listing.address}</h1>
          <span>{listing.city}</span>
        </div>
      </section>
      <section className="listingSummary">
        <div>
          <p className="eyebrow">{content.offeredKicker}</p>
          <h2>{listing.price}</h2>
        </div>
        <div className="listingFacts">
          {listing.beds ? (
            <span>
              <b>{listing.beds}</b>Beds
            </span>
          ) : null}
          {listing.baths ? (
            <span>
              <b>{listing.baths}</b>Baths
            </span>
          ) : null}
          {listing.sqft && listing.sqft !== "—" ? (
            <span>
              <b>{listing.sqft}</b>Sq Ft
            </span>
          ) : null}
        </div>
      </section>
      <section className="section white listingCopy">
        <div>
          <p className="eyebrow">{content.residenceKicker}</p>
          <h2>{content.introTitle}</h2>
        </div>
        <div>
          <p className="largeCopy">{listing.blurb}</p>
          <a href="/contact" className="button buttonDark">
            {content.ctaLabel}
          </a>
        </div>
      </section>
      {gallery.length ? (
        <section className="galleryMosaic">
          {gallery.map((image) => (
            <div key={image} style={{ backgroundImage: `url(${image})` }} />
          ))}
        </section>
      ) : null}
    </CoastalChrome>
  );
}
