import type { TemplatePageProps } from "../../../types";
import { ListingCard } from "../../components/listing-card";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanListingsContent } from "./schema";
import { toRowanListing } from "../../../property-adapters";

export function RowanListingsPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<RowanListingsContent, RowanSettings>) {
  const listings = properties.map(toRowanListing);

  return (
    <RowanChrome site={site} settings={settings} darkHeader>
      <section className="listings-hero">
        <div className="shell listings-hero__inner">
          <p className="eyebrow eyebrow--light">{content.eyebrow}</p>
          <h1>
            {content.title} <em>{content.titleEmphasis}</em>
          </h1>
          <div className="listings-hero__meta">
            <p>{content.meta}</p>
            <span>{String(listings.length).padStart(2, "0")} residences</span>
          </div>
        </div>
      </section>

      <section className="listings-index section-pad">
        <div className="shell listings-index__grid">
          {listings.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>
    </RowanChrome>
  );
}
