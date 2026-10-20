import type { TemplatePageProps } from "../../../types";
import { toMaraProperty } from "../../../property-adapters";
import { EditorialHero } from "../../components/editorial-hero";
import { MaraListingArchive } from "../../components/listing-archive";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraPropertiesContent } from "./schema";

export function MaraPropertiesPage({
  site,
  settings,
  content,
  properties: websiteProperties,
}: TemplatePageProps<MaraPropertiesContent, MaraSettings>) {
  const properties = websiteProperties.map(toMaraProperty);

  return (
    <MaraChrome site={site} settings={settings}>
      <EditorialHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        copy={content.heroCopy}
        image={content.heroImage}
      />
      <MaraListingArchive items={properties} toolbarSuffix={content.toolbarSuffix} />
    </MaraChrome>
  );
}
