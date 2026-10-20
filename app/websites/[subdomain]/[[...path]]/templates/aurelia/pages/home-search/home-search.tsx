import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import type { AureliaSettings } from "../../settings";

import type { AureliaHomeSearchContent } from "./schema";

export function AureliaHomeSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AureliaHomeSearchContent, AureliaSettings>) {
  const listings = properties.filter(isAvailableListing).map(toAureliaProperty);

  return (
    <AureliaChrome site={site} settings={settings} headerOnLight>
      <div className="search-shell section-pad">
        <div className="search-title">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h1>{content.title}</h1>
          </div>
          <p>{content.aside}</p>
        </div>
        <div className="search-map">
          <div className="search-results">
            {listings.map((property) => (
              <a className="mini-listing" href={`/properties/${property.slug}`} key={property.slug}>
                <img src={property.image} alt="" />
                <div>
                  <p>{property.status}</p>
                  <h3>{property.address}</h3>
                  <p>{property.city}</p>
                  <strong>{property.price}</strong>
                  <p>
                    {property.beds} beds · {property.baths} baths · {property.sqft} sq ft
                  </p>
                </div>
              </a>
            ))}
          </div>
          <div className="fake-map">
            <div className="map-road" />
            {listings.slice(0, 4).map((property, index) => (
              <div className={`map-pin pin${index + 1}`} key={property.slug}>
                <span>{property.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AureliaChrome>
  );
}
