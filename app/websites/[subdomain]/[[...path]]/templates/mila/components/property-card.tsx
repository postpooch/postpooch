import type { MilaProperty } from "../settings";

import { AreaIcon, ArrowUpRight, BedIcon } from "./icons";

type PropertyCardProps = {
  property: MilaProperty;
  large?: boolean;
};

export function PropertyCard({ property, large = false }: PropertyCardProps) {
  const statusClass = `status-${property.status.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <article className={`property-card ${large ? "large" : ""}`}>
      <a
        href={`/aanbod/${property.slug}`}
        className="property-image-wrap"
        aria-label={`View ${property.address}`}
      >
        <img
          src={property.hero}
          alt={`${property.address}, ${property.city}`}
          className="property-image"
        />
        <span className={`status-pill ${statusClass}`}>{property.status}</span>
        <span className="image-arrow">
          <ArrowUpRight />
        </span>
      </a>
      <div className="property-info">
        <div className="property-meta-top">
          <span>
            {property.city} · {property.area}
          </span>
          <strong>{property.price}</strong>
        </div>
        <h3>
          <a href={`/aanbod/${property.slug}`}>{property.address}</a>
        </h3>
        <p>{property.blurb}</p>
        <div className="property-facts">
          <span>
            <AreaIcon /> {property.living} m²
          </span>
          <span>
            <BedIcon /> {property.bedrooms} beds
          </span>
          <span>Label {property.energy}</span>
        </div>
      </div>
    </article>
  );
}
