"use client";

import { useMemo, useState } from "react";

import type { HarborListing } from "../settings";

import { ListingCard } from "./listing-card";

const STATUS_ORDER = [
  "For Sale",
  "Coming Soon",
  "Pending",
  "For Rent",
  "Rented",
  "Sold",
  "Off Market",
] as const;

type ListingArchiveProps = {
  listings: HarborListing[];
};

export function ListingArchive({ listings }: ListingArchiveProps) {
  const [filter, setFilter] = useState("All");
  const tabs = useMemo(() => {
    const present = new Set(listings.map((listing) => listing.status));
    return ["All", ...STATUS_ORDER.filter((status) => present.has(status))];
  }, [listings]);
  const filtered =
    filter === "All"
      ? listings
      : listings.filter((listing) => listing.status === filter);

  return (
    <section className="listing-archive shell section-pad">
      <div className="filter-row">
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
      <div className="listing-grid">
        {filtered.map((listing) => (
          <ListingCard listing={listing} key={listing.slug} />
        ))}
      </div>
      {!filtered.length ? <p>No listings match this selection.</p> : null}
    </section>
  );
}
