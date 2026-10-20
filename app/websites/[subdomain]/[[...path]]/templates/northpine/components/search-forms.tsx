"use client";

import { useState } from "react";

import type { NorthpineProperty } from "../settings";
import { PropertyGrid } from "./ui";

type SearchPanelProps = {
  map?: boolean;
  properties: NorthpineProperty[];
};

export function SearchPanel({ map = false, properties }: SearchPanelProps) {
  const [searched, setSearched] = useState(false);

  return (
    <>
      <section className="section-pad container wide">
        <div className={map ? "map-search-layout" : "advanced-search-card"}>
          {map ? (
            <div className="fake-map">
              <div className="map-lines" />
              <span className="pin p1">$1.5M</span>
              <span className="pin p2">$985K</span>
              <span className="pin p3">$1.8M</span>
              <span className="pin p4">$849K</span>
              <span className="map-label l1">BLUE RIDGE</span>
              <span className="map-label l3">ASKA</span>
            </div>
          ) : null}
          <form
            className="advanced-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSearched(true);
            }}
          >
            <h2>Refine your search</h2>
            <label>
              Location
              <input placeholder="City, community or ZIP" />
            </label>
            <div className="field-row">
              <label>
                Minimum price
                <select>
                  <option>No minimum</option>
                  <option>$500,000</option>
                  <option>$750,000</option>
                  <option>$1,000,000</option>
                </select>
              </label>
              <label>
                Maximum price
                <select>
                  <option>No maximum</option>
                  <option>$1,000,000</option>
                  <option>$2,000,000</option>
                  <option>$3,000,000+</option>
                </select>
              </label>
            </div>
            <div className="field-row">
              <label>
                Beds
                <select>
                  <option>Any</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                </select>
              </label>
              <label>
                Baths
                <select>
                  <option>Any</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                </select>
              </label>
            </div>
            <fieldset>
              <legend>Property type</legend>
              {["House", "Cabin", "Land", "Lakefront", "Riverfront", "Commercial"].map((type) => (
                <label className="check" key={type}>
                  <input type="checkbox" /> {type}
                </label>
              ))}
            </fieldset>
            <button className="btn btn-dark" type="submit">
              Search Properties
            </button>
            {searched ? (
              <div className="search-success">Search ready — showing sample matches below.</div>
            ) : null}
          </form>
        </div>
      </section>
      {searched ? (
        <section className="section-pad-sm container wide">
          <PropertyGrid items={properties.slice(0, 3)} />
        </section>
      ) : null}
    </>
  );
}

export function HomeSearchBand({
  kicker,
  title,
  image,
  areas,
}: {
  kicker: string;
  title: string;
  image: string;
  areas: string[];
}) {
  return (
    <section
      className="search-band"
      style={{
        backgroundImage: `linear-gradient(rgba(20,24,21,.78),rgba(20,24,21,.78)),url(${image})`,
      }}
    >
      <div className="container wide">
        <span className="eyebrow light">{kicker}</span>
        <h2>{title}</h2>
        <form onSubmit={(event) => event.preventDefault()} className="search-form">
          <select>
            <option>Any Area</option>
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
          <input placeholder="Min. Price" />
          <input placeholder="Max. Price" />
          <select>
            <option>Beds</option>
            <option>2+</option>
            <option>3+</option>
            <option>4+</option>
          </select>
          <button className="btn btn-light" type="submit">
            Search Homes
          </button>
        </form>
      </div>
    </section>
  );
}
