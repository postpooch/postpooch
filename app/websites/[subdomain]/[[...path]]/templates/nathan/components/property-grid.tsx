"use client";

import { useMemo, useState } from "react";

import type { NathanProperty } from "../settings";

type PropertyGridProps = {
  properties: NathanProperty[];
};

export function PropertyGrid({ properties }: PropertyGridProps) {
  const [filter, setFilter] = useState("All");
  const filters = useMemo(
    () => ["All", ...new Set(properties.map((p) => p.neighborhood))],
    [properties],
  );
  const visible = useMemo(
    () =>
      filter === "All"
        ? properties
        : properties.filter((p) => p.neighborhood === filter),
    [filter, properties],
  );

  return (
    <>
      <div className="filter-row" aria-label="Property filters">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="property-grid">
        {visible.map((property, index) => (
          <a
            href={`/properties/${property.slug}`}
            className={`property-card ${index % 3 === 0 ? "wide" : ""}`}
            key={property.slug}
          >
            <div className="property-image">
              <img
                src={property.image}
                alt={`${property.address} luxury property`}
              />
              <span className="property-status">{property.status}</span>
              <span className="property-arrow">↗</span>
            </div>
            <div className="property-copy">
              <div>
                <h3>{property.address}</h3>
                <p>
                  {property.neighborhood} · {property.type}
                </p>
              </div>
              <div className="property-price">{property.price}</div>
            </div>
            <div className="property-specs">
              <span>{property.beds} BD</span>
              <span>{property.baths} BA</span>
              <span>{property.sqft} SF</span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
