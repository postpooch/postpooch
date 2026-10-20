import type { AureliaProperty } from "../settings";

type PropertyGridProps = {
  items: readonly AureliaProperty[];
  limit?: number;
};

export function PropertyGrid({ items, limit }: PropertyGridProps) {
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <div className="property-grid">
      {shown.map((property, index) => (
        <a
          href={`/properties/${property.slug}`}
          className={`property-card ${index === 0 && shown.length > 3 ? "property-card-wide" : ""}`}
          key={property.slug}
        >
          <div className="property-image-wrap">
            <img src={property.image} alt="" className="property-image" />
            <span className="property-status">{property.status}</span>
            <span className="property-arrow">↗</span>
          </div>
          <div className="property-copy">
            <div>
              <h3>{property.address}</h3>
              <p>{property.city}</p>
            </div>
            <p className="property-price">{property.price}</p>
            <p className="property-meta">
              {property.beds} Beds &nbsp;·&nbsp; {property.baths} Baths &nbsp;·&nbsp; {property.sqft} Sq Ft
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
