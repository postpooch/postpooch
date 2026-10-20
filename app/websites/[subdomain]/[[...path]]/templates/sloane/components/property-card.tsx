import type { SloaneProperty } from "../settings";

type PropertyCardProps = {
  property: SloaneProperty;
  large?: boolean;
};

export function PropertyCard({ property, large = false }: PropertyCardProps) {
  return (
    <article className={`property-card ${large ? "large" : ""}`}>
      <a href={`/properties/${property.slug}`} className="property-image-wrap">
        <img className="property-image" src={property.image} alt={`${property.address} property`} />
        <span className="property-status">{property.status}</span>
      </a>
      <div className="property-meta">
        <div className="property-topline">
          <div>
            <h3>{property.address}</h3>
            <p>{property.city}</p>
          </div>
          <strong>{property.price}</strong>
        </div>
        <div className="property-specs">
          <span>{property.beds} Beds</span>
          <span>{property.baths} Baths</span>
          <span>{property.sqft} Sq Ft</span>
        </div>
        <a className="text-link" href={`/properties/${property.slug}`}>
          View property <span>↗</span>
        </a>
      </div>
    </article>
  );
}
