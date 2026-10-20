"use client";

import { useState } from "react";

import type { CoastalProperty } from "../settings";

import { PropertyCard } from "./property-card";
import { SearchBar } from "./search-bar";

type SearchResultsProps = {
  properties: readonly CoastalProperty[];
  countLabel: string;
  mapLabel: string;
};

export function SearchResults({
  properties,
  countLabel,
  mapLabel,
}: SearchResultsProps) {
  const [view, setView] = useState<"grid" | "map">("grid");

  return (
    <section className="searchPage section cream">
      <SearchBar />
      <div className="resultsToolbar">
        <span>
          {properties.length} {countLabel}
        </span>
        <div>
          <button
            type="button"
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            type="button"
            className={view === "map" ? "active" : ""}
            onClick={() => setView("map")}
          >
            Map
          </button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="propertyGrid">
          {properties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      ) : (
        <div className="mockMap">
          <div className="mapWater" />
          {properties.slice(0, 3).map((property, index) => (
            <span key={property.slug} className={`pin p${index + 1}`}>
              {property.price}
            </span>
          ))}
          <div className="mapLabel">{mapLabel}</div>
        </div>
      )}
    </section>
  );
}
