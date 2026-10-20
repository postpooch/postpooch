import type { TemplatePageProps } from "../../../types";
import { PropertyExplorer } from "../../components/property-explorer";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossPropertiesContent } from "./schema";
import { toVossProperty } from "../../../property-adapters";

export function VossPropertiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<VossPropertiesContent, VossSettings>) {
  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero page-hero--archive">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="page-hero__intro">{content.intro}</p>
        </section>
        <section className="archive-wrap section-pad section-pad--topless">
          <PropertyExplorer properties={properties.map(toVossProperty)} />
        </section>
      </main>
    </VossChrome>
  );
}
