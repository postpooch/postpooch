import type { TemplatePageProps } from "../../../types";
import { toCoastalProperty } from "../../../property-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { SearchResults } from "../../components/search-results";
import type { CoastalSettings } from "../../settings";

import type { CoastalSearchContent } from "./schema";

export function CoastalSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<CoastalSearchContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <SearchResults
        properties={properties.map(toCoastalProperty)}
        countLabel={content.countLabel}
        mapLabel={content.mapLabel}
      />
    </CoastalChrome>
  );
}
