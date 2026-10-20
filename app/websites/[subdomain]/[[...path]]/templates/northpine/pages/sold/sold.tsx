import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { ListingArchive } from "../../components/listing-archive";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";
import { toNorthpineProperty } from "../../../property-adapters";

import type { NorthpineSoldContent } from "./schema";

export function NorthpineSoldPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NorthpineSoldContent, NorthpineSettings>) {
  const sold = properties.filter(isSoldListing).map(toNorthpineProperty);

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <ListingArchive items={sold} />
    </NorthpineInnerPage>
  );
}
