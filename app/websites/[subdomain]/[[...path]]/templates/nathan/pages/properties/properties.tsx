import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import { PropertyGrid } from "../../components/property-grid";
import type { NathanSettings } from "../../settings";

import type { NathanPropertiesContent } from "./schema";
import { toNathanProperty } from "../../../property-adapters";

export function NathanPropertiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NathanPropertiesContent, NathanSettings>) {
  return (
    <NathanChrome site={site} settings={settings}>
      <section className="listing-page section-pad page-top">
        <div className="listing-title">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.deck}</p>
        </div>
        <PropertyGrid properties={properties.map(toNathanProperty)} />
      </section>
    </NathanChrome>
  );
}
