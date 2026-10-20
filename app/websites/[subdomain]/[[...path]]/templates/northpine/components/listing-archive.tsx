"use client";

import { useMemo, useState } from "react";

import type { NorthpineProperty } from "../settings";
import { PropertyGrid } from "./ui";

type ListingArchiveProps = {
  items: NorthpineProperty[];
};

export function ListingArchive({ items }: ListingArchiveProps) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const needle = query.toLowerCase();
    if (!needle) return items;
    return items.filter((property) =>
      `${property.title}${property.city}${property.tag}`.toLowerCase().includes(needle),
    );
  }, [items, query]);

  return (
    <>
      <section className="listing-toolbar container wide">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, city or feature"
        />
        <select>
          <option>Price: High to Low</option>
          <option>Price: Low to High</option>
          <option>Newest</option>
        </select>
        <span>{shown.length} properties</span>
      </section>
      <section className="section-pad-sm container wide">
        <PropertyGrid items={shown} />
      </section>
    </>
  );
}
