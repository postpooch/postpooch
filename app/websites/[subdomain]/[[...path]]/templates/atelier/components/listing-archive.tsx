"use client";

import { useMemo, useState } from "react";

import type { AtelierProperty } from "../settings";

import { PropertyGrid } from "./blocks";

type ListingArchiveProps = {
  items: AtelierProperty[];
  filters?: string[];
};

export function ListingArchive({ items, filters }: ListingArchiveProps) {
  const [filter, setFilter] = useState("All");
  const tabs = useMemo(() => {
    const fromData = Array.from(new Set(items.map((item) => item.status)));
    const preferred = filters?.length ? ["All", ...filters.filter((item) => item !== "All")] : ["All", ...fromData];
    return preferred.filter((tab, index) => preferred.indexOf(tab) === index);
  }, [filters, items]);

  const shown = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((item) => {
      if (filter.toLowerCase() === "for sale") {
        return item.status === "For Sale" || item.status === "Pending";
      }
      if (filter.toLowerCase() === "private") {
        return item.status === "Off Market" || item.status === "Coming Soon";
      }
      return item.status.toLowerCase() === filter.toLowerCase();
    });
  }, [filter, items]);

  return (
    <>
      <section className="filterBar shell">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={filter === tab ? "active" : undefined}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
        <span>{shown.length} homes</span>
      </section>
      <section className="section shell noTop">
        {shown.length ? <PropertyGrid items={shown} /> : <p>No properties match this selection.</p>}
      </section>
    </>
  );
}
