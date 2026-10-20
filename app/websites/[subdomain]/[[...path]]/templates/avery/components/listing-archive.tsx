"use client";

import { useMemo, useState } from "react";

import type { AveryProperty } from "../settings";

import { ListingGrid } from "./listing-card";

type AveryListingArchiveProps = {
  items: AveryProperty[];
};

export function AveryListingArchive({ items }: AveryListingArchiveProps) {
  const [filter, setFilter] = useState("All");
  const places = useMemo(() => {
    const names = new Set<string>();
    for (const item of items) {
      const place = item.city.split(",")[0]?.trim();
      if (place) names.add(place);
    }
    return ["All", ...names];
  }, [items]);

  const shown =
    filter === "All"
      ? items
      : items.filter((item) => item.city.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      {places.length > 2 ? (
        <div className="filters">
          {places.map((label) => (
            <button
              className={filter === label ? "filter-pill active" : "filter-pill"}
              key={label}
              type="button"
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      <ListingGrid items={shown} />
      {!shown.length ? <p>No homes match this selection.</p> : null}
    </>
  );
}
