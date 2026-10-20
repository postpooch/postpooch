import type { TemplatePageProps } from "../../../types";
import { HomeSearch } from "../../components/home-search";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryHomeSearchContent } from "./schema";
import { toLuxuryProperty } from "../../../property-adapters";

export function LuxuryHomeSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<LuxuryHomeSearchContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad search-page">
        <HomeSearch properties={properties.map(toLuxuryProperty)} />
      </section>
    </LuxuryChrome>
  );
}
