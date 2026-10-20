import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { SearchPanel } from "../../components/search-forms";
import type { NorthpineSettings } from "../../settings";
import { toNorthpineProperty } from "../../../property-adapters";

import type { NorthpineMapSearchContent } from "./schema";

export function NorthpineMapSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NorthpineMapSearchContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <SearchPanel map properties={properties.map(toNorthpineProperty)} />
    </NorthpineInnerPage>
  );
}
