import type { TemplatePageProps } from "../../../types";
import { toAtelierProperty } from "../../../property-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import { SearchResults } from "../../components/search-results";
import type { AtelierSettings } from "../../settings";

import type { AtelierSearchContent } from "./schema";

export function AtelierSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AtelierSearchContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <SearchResults
        listings={properties.map(toAtelierProperty)}
        heading={content.heading}
        locationLabel={content.locationLabel}
        mapTitle={content.mapTitle}
        mapNote={content.mapNote}
      />
    </AtelierChrome>
  );
}
