import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { LeadForm } from "../../components/lead-form";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanListingContent } from "./schema";
import { toRowanListing } from "../../../property-adapters";

export function RowanListingPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<RowanListingContent, RowanSettings>) {
  const listings = properties.map(toRowanListing);
  const source = properties.find((item) => item.slug === params.slug);
  const listing = listings.find((item) => item.slug === params.slug);
  if (!source || !listing) notFound();

  const index = listings.findIndex((item) => item.slug === params.slug);
  const nextListing = listings[(index + 1) % listings.length]!;

  return (
    <RowanChrome site={site} settings={settings} darkHeader>
      <section className="listing-hero">
        <img src={listing.image} alt={`${listing.address} property`} />
        <div className="listing-hero__scrim" />
        <div className="shell listing-hero__content">
          <div>
            <p className="eyebrow eyebrow--light">
              {listing.status} · {listing.type}
            </p>
            <h1>{listing.address}</h1>
            <p className="listing-hero__location">({listing.location})</p>
          </div>
          <strong>{listing.price}</strong>
        </div>
      </section>

      <section className="listing-overview section-pad">
        <div className="shell listing-overview__grid">
          <div className="listing-overview__intro">
            <p className="eyebrow">{content.overviewEyebrow}</p>
            <h2>{listing.intro}</h2>
          </div>
          <div className="listing-overview__facts">
            <div>
              <span>Bedrooms</span>
              <strong>{listing.beds}</strong>
            </div>
            <div>
              <span>Bathrooms</span>
              <strong>{listing.baths}</strong>
            </div>
            <div>
              <span>Interior</span>
              <strong>{listing.sqft} sq ft</strong>
            </div>
            <div>
              <span>Land</span>
              <strong>{listing.acres} acres</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="listing-gallery shell">
        {source.images.length ? (
          source.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={index === 0 ? "listing-gallery__large" : "listing-gallery__small"}
            >
              <img src={image} alt={`${listing.address} view ${index + 1}`} />
            </div>
          ))
        ) : (
          <div className="listing-gallery__large">
            <img src={listing.image} alt={`${listing.address} property`} />
          </div>
        )}
      </section>

      {source.description || listing.intro ? (
      <section className="listing-detail section-pad">
        <div className="shell listing-detail__grid">
          <div>
            <p className="eyebrow">{content.detailEyebrow}</p>
            <h2>{content.detailTitle}</h2>
          </div>
          <div className="listing-detail__copy">
            {source.description ? (
              source.description
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)
            ) : (
              <p>{listing.intro}</p>
            )}
          </div>
        </div>
      </section>
      ) : null}

      <section className="listing-inquiry">
        <div className="shell listing-inquiry__grid section-pad">
          <div>
            <p className="eyebrow eyebrow--light">{content.inquiryEyebrow}</p>
            <h2>
              {content.inquiryTitlePrefix} {listing.address} in person.
            </h2>
            <p>{content.inquiryIntro}</p>
          </div>
          <LeadForm />
        </div>
      </section>

      {listings.length > 1 ? (
      <section className="listing-next">
        <a href={`/listings/${nextListing.slug}`}>
          <span className="eyebrow eyebrow--light">{content.nextEyebrow}</span>
          <strong>{nextListing.address}</strong>
          <span>↗</span>
        </a>
      </section>
      ) : null}
    </RowanChrome>
  );
}
