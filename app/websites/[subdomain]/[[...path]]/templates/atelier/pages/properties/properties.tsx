import type { TemplatePageProps } from "../../../types";
import { toAtelierProperty } from "../../../property-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import { ListingArchive } from "../../components/listing-archive";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierPropertiesContent } from "./schema";

export function AtelierPropertiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AtelierPropertiesContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <ListingArchive
        items={properties.map(toAtelierProperty)}
        filters={content.filters}
      />
    </AtelierChrome>
  );
}
