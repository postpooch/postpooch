import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { SearchPanel } from "../../components/search-forms";
import type { NorthpineSettings } from "../../settings";
import { toNorthpineProperty } from "../../../property-adapters";

import type { NorthpineSearchContent } from "./schema";

export function NorthpineSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NorthpineSearchContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <SearchPanel properties={properties.map(toNorthpineProperty)} />
    </NorthpineInnerPage>
  );
}
