"use client";

import { useMemo, useState } from "react";

import type { SloaneProperty } from "../settings";

import { PropertyCard } from "./property-card";

type PropertyGridProps = {
  properties: readonly SloaneProperty[];
  initial?: string;
  showFilters?: boolean;
};

const tabs = ["All", "For Sale", "For Lease", "Sold"];

function matchesTab(status: string, filter: string): boolean {
  if (filter === "All") return true;
  if (filter === "For Sale") {
    return ["For Sale", "Coming Soon", "Pending", "Off Market"].includes(status);
  }
  if (filter === "For Lease") {
    return status === "For Lease" || status === "For Rent";
  }
  if (filter === "Sold") {
    return status === "Sold" || status === "Rented";
  }
  return status === filter;
}

export function PropertyGrid({
  properties,
  initial = "All",
  showFilters = true,
}: PropertyGridProps) {
  const [filter, setFilter] = useState(initial);
  const shown = useMemo(
    () => properties.filter((property) => matchesTab(property.status, filter)),
    [filter, properties],
  );

  return (
    <div>
      {showFilters ? (
        <div className="filter-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={filter === tab ? "active" : ""}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : null}
      <div className="property-grid">
        {shown.map((property, index) => (
          <PropertyCard
            property={property}
            large={index === 0 && shown.length > 4}
            key={property.slug}
          />
        ))}
      </div>
      {!shown.length ? <p>No properties match this selection.</p> : null}
    </div>
  );
}
