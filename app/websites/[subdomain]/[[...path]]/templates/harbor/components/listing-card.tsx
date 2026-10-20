import type { HarborListing } from "../settings";

type ListingCardProps = {
  listing: HarborListing;
  large?: boolean;
};

export function ListingCard({ listing, large = false }: ListingCardProps) {
  return (
    <a
      href={`/listings/${listing.slug}`}
      className={`listing-card ${large ? "large" : ""}`}
    >
      <div className="listing-image-wrap">
        <img src={listing.image} alt={listing.alt} className="listing-image" />
        <span className="status-pill">{listing.status}</span>
        <span className="image-arrow">↗</span>
      </div>
      <div className="listing-meta">
        <div>
          <p className="kicker">{listing.neighbourhood}</p>
          <h3>{listing.address}</h3>
        </div>
        <div className="listing-price">
          <strong>{listing.price}</strong>
          <span>
            {listing.beds} beds · {listing.baths} baths
          </span>
        </div>
      </div>
    </a>
  );
}
