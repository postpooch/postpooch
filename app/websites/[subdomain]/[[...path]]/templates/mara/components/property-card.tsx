import type { MaraProperty } from "../settings";

type PropertyCardProps = {
  property: MaraProperty;
  large?: boolean;
};

export function PropertyCard({ property, large = false }: PropertyCardProps) {
  return (
    <a
      href={`/properties/${property.slug}`}
      className={`propertyCard ${large ? "large" : ""}`}
    >
      <div className="media">
        <img src={property.image} alt={property.address} />
        <span className="status">{property.status}</span>
      </div>
      <div className="propertyMeta">
        <div>
          <p>{property.neighborhood}</p>
          <h3>{property.address}</h3>
        </div>
        <strong>{property.price}</strong>
      </div>
      <div className="propertySpecs">
        <span>{property.beds} beds</span>
        <span>{property.baths} baths</span>
        <span>{property.sqft}</span>
      </div>
    </a>
  );
}
