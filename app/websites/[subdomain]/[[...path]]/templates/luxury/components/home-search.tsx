"use client";

import { useMemo, useState } from "react";

import type { LuxuryProperty } from "../settings";

import { PropertyCard } from "./property-card";

type HomeSearchProps = {
  properties: LuxuryProperty[];
};

export function HomeSearch({ properties }: HomeSearchProps) {
  const [query, setQuery] = useState("");
  const [minBeds, setMinBeds] = useState("0");
  const [status, setStatus] = useState("All");
  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(properties.map((p) => p.status)))],
    [properties],
  );

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        const text = `${p.name} ${p.address}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          p.beds >= Number(minBeds) &&
          (status === "All" || p.status === status)
        );
      }),
    [properties, query, minBeds, status],
  );

  return (
    <>
      <div className="search-toolbar">
        <input
          aria-label="Search by location or keyword"
          placeholder="Location or keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={minBeds} onChange={(e) => setMinBeds(e.target.value)}>
          <option value="0">Any beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
          <option value="5">5+ beds</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setMinBeds("0");
            setStatus("All");
          }}
        >
          Reset
        </button>
      </div>
      <div className="search-summary">
        <span>{filtered.length} properties</span>
        <span>Newest</span>
      </div>
      <div className="property-grid">
        {filtered.map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h2>No properties match those filters.</h2>
          <p>Try a broader location or fewer bedrooms.</p>
        </div>
      )}
    </>
  );
}
