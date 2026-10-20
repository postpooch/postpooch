import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAtelierProperty } from "../../../property-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero, PropertyGrid, Stats } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierSalesContent } from "./schema";

export function AtelierSalesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AtelierSalesContent, AtelierSettings>) {
  const sold = properties.filter(isSoldListing).map(toAtelierProperty);

  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <Stats stats={settings.stats} />
      <section className="section shell">
        <PropertyGrid items={sold} />
      </section>
    </AtelierChrome>
  );
}
