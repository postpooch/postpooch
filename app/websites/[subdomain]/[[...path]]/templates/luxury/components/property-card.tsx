import type { LuxuryProperty } from "../settings";

type PropertyCardProps = {
  property: LuxuryProperty;
  sold?: boolean;
};

export function PropertyCard({ property, sold = false }: PropertyCardProps) {
  const href = `/properties/${property.slug}`;
  return (
    <article className="property-card">
      <a className="property-image-wrap" href={href}>
        <img src={property.image} alt={property.name} />
        <span className="property-status">{sold ? "Sold" : property.status}</span>
        <span className="property-view">View Property</span>
      </a>
      <div className="property-copy">
        <p className="property-price">{property.price}</p>
        <h3>
          <a href={href}>{property.name}</a>
        </h3>
        <p>{property.address}</p>
        <div className="property-meta">
          {property.beds ? <span>{property.beds} Beds</span> : null}
          {property.baths ? <span>{property.baths} Baths</span> : null}
          {property.sqft ? <span>{property.sqft} Sq. Ft.</span> : null}
        </div>
      </div>
    </article>
  );
}
