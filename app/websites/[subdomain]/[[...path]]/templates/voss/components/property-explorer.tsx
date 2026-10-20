"use client";

import { useMemo, useState } from "react";

import type { VossProperty } from "../settings";

import { PropertyCard } from "./property-card";

type PropertyExplorerProps = {
  properties: VossProperty[];
};

export function PropertyExplorer({ properties }: PropertyExplorerProps) {
  const [filter, setFilter] = useState("All");
  const neighborhoods = useMemo(
    () =>
      Array.from(new Set(properties.map((p) => p.neighborhood).filter(Boolean))),
    [properties],
  );
  const statuses = useMemo(
    () => Array.from(new Set(properties.map((p) => p.status))),
    [properties],
  );
  const filters = ["All", ...neighborhoods, ...statuses.filter((status) => status !== "For Sale")];

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (filter === "All") return true;
        return p.neighborhood === filter || p.status === filter;
      }),
    [filter, properties],
  );

  return (
    <div>
      <div className="filter-bar">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={filter === item ? "active" : ""}
          >
            {item}
          </button>
        ))}
        <span>{filtered.length} residences</span>
      </div>
      <div className="property-grid property-grid--archive">
        {filtered.map((p, i) => (
          <PropertyCard property={p} index={i} key={p.slug} />
        ))}
      </div>
      {!filtered.length ? (
        <p>No residences match this selection.</p>
      ) : null}
    </div>
  );
}
