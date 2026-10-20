import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { ListingGrid } from "../../components/listing-card";
import { SearchBar } from "../../components/search-bar";
import { averyActiveProperties } from "../../listings";
import type { AverySettings } from "../../settings";

import type { AverySearchContent } from "./schema";

export function AverySearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AverySearchContent, AverySettings>) {
  const listings = averyActiveProperties(properties);
  const pins = listings.slice(0, 4);
  const positions = [
    { left: "18%", top: "28%" },
    { left: "48%", top: "57%" },
    { left: "72%", top: "35%" },
    { left: "61%", top: "73%" },
  ];

  return (
    <AveryChrome site={site} settings={settings}>
      <section className="search-panel">
        <div className="shell">
          <p className="eyebrow">{content.kicker}</p>
          <SearchBar placeholder={content.placeholder} />
          <div className="fake-map">
            <div className="map-grid" />
            {pins.map((item, index) => (
              <span className="map-dot" key={item.slug} style={positions[index]}>
                {item.price}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="content-section shell light-listings">
        <div className="section-title">
          <div>
            <p className="eyebrow">{content.resultsKicker}</p>
            <h2>{content.resultsTitle}</h2>
          </div>
          <p>{content.resultsNote}</p>
        </div>
        <ListingGrid items={listings.slice(0, 4)} />
      </section>
    </AveryChrome>
  );
}
