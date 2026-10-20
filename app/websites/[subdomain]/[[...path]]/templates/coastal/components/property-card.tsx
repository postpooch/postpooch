import type { CoastalProperty } from "../settings";

export function PropertyCard({ property }: { property: CoastalProperty }) {
  return (
    <article className="propertyCard">
      <a
        href={`/listings/${property.slug}`}
        className="propertyImage"
        style={{ backgroundImage: `url(${property.image})` }}
      >
        <span className="propertyStatus">{property.status}</span>
      </a>
      <div className="propertyBody">
        <p className="propertyPrice">{property.price}</p>
        <h3>
          <a href={`/listings/${property.slug}`}>{property.address}</a>
        </h3>
        <p className="propertyCity">{property.city}</p>
        <div className="propertyMeta">
          <span>{property.beds} Beds</span>
          <span>{property.baths} Baths</span>
          <span>{property.sqft} Sq Ft</span>
        </div>
      </div>
    </article>
  );
}
