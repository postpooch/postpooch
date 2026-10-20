"use client";

import { useMemo, useState } from "react";

import type { SloaneProperty } from "../settings";

import { PropertyCard } from "./property-card";

type SearchPanelProps = {
  properties: readonly SloaneProperty[];
};

export function SearchPanel({ properties }: SearchPanelProps) {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("All");
  const [beds, setBeds] = useState("Any");

  const filtered = useMemo(
    () =>
      properties.filter((property) => {
        const loc = `${property.address} ${property.city}`
          .toLowerCase()
          .includes(location.toLowerCase());
        const stat = status === "All" || property.status === status;
        const bed = beds === "Any" || property.beds >= Number(beds);
        return loc && stat && bed;
      }),
    [beds, location, properties, status],
  );

  return (
    <div className="search-page-shell">
      <div className="search-panel">
        <label>
          <span>Location</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Neighborhood or address"
          />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>For Sale</option>
            <option>For Lease</option>
            <option>Sold</option>
          </select>
        </label>
        <label>
          <span>Minimum beds</span>
          <select value={beds} onChange={(event) => setBeds(event.target.value)}>
            <option>Any</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </label>
        <label>
          <span>Price range</span>
          <select>
            <option>Any price</option>
            <option>$2M – $5M</option>
            <option>$5M – $10M</option>
            <option>$10M+</option>
          </select>
        </label>
        <button className="solid-button" type="button">
          Search
        </button>
      </div>
      <div className="search-results-head">
        <span>{filtered.length} curated results</span>
      </div>
      <div className="property-grid search-results">
        {filtered.map((property) => (
          <PropertyCard property={property} key={property.slug} />
        ))}
      </div>
    </div>
  );
}
