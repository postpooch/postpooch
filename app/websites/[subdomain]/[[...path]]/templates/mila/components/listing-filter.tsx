"use client";

import { useMemo, useState } from "react";

import type { MilaProperty } from "../settings";

import { PropertyCard } from "./property-card";

type ListingFilterProps = {
  properties: MilaProperty[];
};

export function ListingFilter({ properties }: ListingFilterProps) {
  const [city, setCity] = useState("All");
  const [availability, setAvailability] = useState("Current");
  const cities = ["All", ...Array.from(new Set(properties.map((p) => p.city)))];

  const visible = useMemo(
    () =>
      properties.filter((p) => {
        const cityOk = city === "All" || p.city === city;
        const available = !["Sold", "Rented"].includes(p.status);
        const stateOk =
          availability === "All" ||
          (availability === "Current" ? available : !available);
        return cityOk && stateOk;
      }),
    [city, availability, properties],
  );

  return (
    <>
      <div className="listing-toolbar">
        <div className="filter-group">
          <span>Area</span>
          <div className="filter-pills">
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={city === c ? "active" : ""}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group compact">
          <span>Status</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option>Current</option>
            <option>Sold</option>
            <option>All</option>
          </select>
        </div>
        <strong className="result-count">{visible.length} homes</strong>
      </div>
      <div className="listing-grid">
        {visible.map((p) => (
          <PropertyCard property={p} key={p.slug} />
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <h3>No homes in this selection.</h3>
          <p>Adjust your filter or sign up as a home seeker.</p>
        </div>
      )}
    </>
  );
}
