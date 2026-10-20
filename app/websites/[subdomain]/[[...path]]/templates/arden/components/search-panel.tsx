"use client";

import { useMemo, useState } from "react";

import type { ArdenProperty } from "../settings";

export function SearchPanel({ properties }: { properties: readonly ArdenProperty[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      properties.filter((property) =>
        `${property.title} ${property.location}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [properties, query],
  );

  return (
    <section className="searchShell">
      <div className="searchTop">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search address, town, or property"
        />
        <select defaultValue="sale">
          <option value="sale">For Sale</option>
          <option value="lease">For Lease</option>
        </select>
        <select defaultValue="">
          <option value="">Any Price</option>
        </select>
        <select defaultValue="">
          <option value="">All Beds</option>
        </select>
      </div>
      <div className="searchLayout">
        <div className="searchList">
          {filtered.map((property) => (
            <a href={`/properties/${property.slug}`} className="searchCard" key={property.slug}>
              <img src={property.image} alt="" />
              <div>
                <strong>{property.price}</strong>
                <h3>{property.title}</h3>
                <small>{property.location}</small>
              </div>
            </a>
          ))}
        </div>
        <div className="mapMock">
          <span className="mapLabel">Interactive map placeholder for MLS integration</span>
        </div>
      </div>
    </section>
  );
}
