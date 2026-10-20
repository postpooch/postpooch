import type { RowanListing } from "../settings";

type ListingCardProps = {
  listing: RowanListing;
  compact?: boolean;
};

export function ListingCard({ listing, compact = false }: ListingCardProps) {
  return (
    <article
      className={`listing-card ${compact ? "listing-card--compact" : ""}`}
    >
      <a
        className="listing-card__image"
        href={`/listings/${listing.slug}`}
        aria-label={`View ${listing.address}`}
      >
        <img src={listing.image} alt={`${listing.address} property`} />
        <span>{listing.status}</span>
      </a>
      <div className="listing-card__body">
        <div>
          <p className="listing-card__location">{listing.location}</p>
          <h3>
            <a href={`/listings/${listing.slug}`}>{listing.address}</a>
          </h3>
        </div>
        <p className="listing-card__price">{listing.price}</p>
      </div>
      <div className="listing-card__facts">
        <span>{listing.beds} beds</span>
        <span>{listing.baths} baths</span>
        <span>{listing.sqft} sq ft</span>
      </div>
    </article>
  );
}
