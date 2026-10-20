import type { RoweCatalogProperty } from "../settings";

type PropertyCardProps = {
  property: RoweCatalogProperty;
  featured?: boolean;
};

export function PropertyCard({
  property,
  featured = false,
}: PropertyCardProps) {
  return (
    <a
      className={`property-card ${featured ? "featured" : ""}`}
      href={`/properties/${property.slug}`}
    >
      <div className="property-image-wrap">
        <img
          src={property.image}
          alt="Architecture placeholder for demo listing"
        />
        <div className="image-badge">{property.status}</div>
        <div className="image-index">View residence ↗</div>
      </div>
      <div className="property-meta">
        <div>
          <h3>{property.name}</h3>
          <p>{property.location}</p>
        </div>
        <div className="property-price">
          <span>{property.price}</span>
          <small>
            {property.beds} · {property.baths} · {property.area}
          </small>
        </div>
      </div>
    </a>
  );
}
