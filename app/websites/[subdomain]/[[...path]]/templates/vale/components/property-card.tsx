import type { ValeProperty } from "../settings";

type PropertyCardProps = {
  property: ValeProperty;
  index?: number;
};

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  return (
    <a href={`/properties/${property.slug}`} className="property-card">
      <div className="property-image-wrap">
        <img
          src={property.image}
          alt={`${property.title} exterior`}
          className="property-image"
        />
        <span className="property-status">{property.status}</span>
        <span className="view-tag">View property ↗</span>
      </div>
      <div className="property-card-meta">
        <div>
          <small>0{index + 1}</small>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
        </div>
        <div className="property-price">
          <p>{property.price}</p>
          <p>
            {property.beds} · {property.baths}
          </p>
        </div>
      </div>
    </a>
  );
}
