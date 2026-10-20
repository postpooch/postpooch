import type { VossProperty } from "../settings";

type PropertyCardProps = {
  property: VossProperty;
  index: number;
};

export function PropertyCard({ property, index }: PropertyCardProps) {
  return (
    <a href={`/properties/${property.slug}`} className="property-card">
      <div className="property-card__image-wrap">
        <img
          className="property-card__image"
          src={property.image}
          alt={`${property.address} residence`}
          loading="lazy"
        />
        <span className="property-card__status">{property.status}</span>
        <span className="property-card__number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="property-card__body">
        <div>
          <p className="property-card__neighborhood">{property.neighborhood}</p>
          <h3>{property.address}</h3>
        </div>
        <div className="property-card__meta">
          <span>{property.price}</span>
              <span>
                {[
                  property.beds ? `${property.beds} bd` : "",
                  property.baths ? `${property.baths} ba` : "",
                  property.sqft,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
        </div>
      </div>
    </a>
  );
}
