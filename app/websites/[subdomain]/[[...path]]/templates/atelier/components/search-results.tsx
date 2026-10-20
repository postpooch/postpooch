"use client";

import { useMemo, useState } from "react";

import type { AtelierProperty } from "../settings";

type SearchResultsProps = {
  listings: AtelierProperty[];
  heading: string;
  locationLabel: string;
  mapTitle: string;
  mapNote: string;
};

export function SearchResults({
  listings,
  heading,
  locationLabel,
  mapTitle,
  mapNote,
}: SearchResultsProps) {
  const [filter, setFilter] = useState("All");
  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(listings.map((item) => item.status)))],
    [listings],
  );
  const shown = filter === "All" ? listings : listings.filter((item) => item.status === filter);

  return (
    <section className="searchPage">
      <div className="searchControls">
        <div className="searchInput">
          {locationLabel} <span>⌕</span>
        </div>
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={filter === status ? "active" : undefined}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="searchSplit">
        <div className="resultList">
          <div className="resultHeader">
            <div>
              <p className="kicker">Curated search</p>
              <h1>{heading}</h1>
            </div>
            <span>{shown.length} results</span>
          </div>
          <div className="miniGrid">
            {shown.map((property) => (
              <a
                key={property.slug}
                href={`/properties/${property.slug}`}
                className="miniCard"
              >
                <div style={{ backgroundImage: `url("${property.image}")` }} />
                <h3>{property.price}</h3>
                <p>{property.title}</p>
                <span>
                  {[property.beds, property.baths].filter(Boolean).join(" · ")}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="mapMock">
          <div className="mapGrid" />
          <div className="mapLabel">
            {mapTitle}
            <br />
            <span>{mapNote}</span>
          </div>
          {shown.slice(0, 4).map((property, index) => (
            <div key={property.slug} className={`mapPin pin${index + 1}`}>
              {property.price}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
