import { isSaleListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { ListingArchive } from "../../components/listing-archive";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";
import { toNorthpineProperty } from "../../../property-adapters";

import type { NorthpineListingsContent } from "./schema";

export function NorthpineListingsPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NorthpineListingsContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <ListingArchive items={properties.filter(isSaleListing).map(toNorthpineProperty)} />
    </NorthpineInnerPage>
  );
}
