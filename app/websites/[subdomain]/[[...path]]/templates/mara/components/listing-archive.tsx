"use client";

import { useMemo, useState } from "react";

import type { MaraProperty } from "../settings";

import { PropertyCard } from "./property-card";

type MaraListingArchiveProps = {
  items: MaraProperty[];
  toolbarSuffix: string;
};

export function MaraListingArchive({ items, toolbarSuffix }: MaraListingArchiveProps) {
  const [filter, setFilter] = useState("All");
  const shown = useMemo(
    () =>
      items.filter((property) => {
        const sold = property.status === "Sold" || property.status === "Rented";
        if (filter === "Sold") return sold;
        if (filter === "Available") return !sold;
        return true;
      }),
    [filter, items],
  );

  return (
    <section className="section editorialList">
      <div className="listingToolbar">
        <span>
          {shown.length} {toolbarSuffix}
        </span>
        <div>
          {["All", "Available", "Sold"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={filter === tab ? "active" : undefined}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {shown.length ? (
        <div className="propertyGrid">
          {shown.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      ) : (
        <p>No properties match this selection.</p>
      )}
    </section>
  );
}
