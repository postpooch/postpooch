import { exclusiveListings, propertiesInPlace } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaGatedCommunitiesContent } from "./schema";

export function AureliaGatedCommunitiesPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AureliaGatedCommunitiesContent, AureliaSettings>) {
  const matched = settings.catalog.communities.flatMap((community) =>
    propertiesInPlace(properties, community.name),
  );
  const unique = matched.filter(
    (property, index) => matched.findIndex((item) => item.id === property.id) === index,
  );
  const source = unique.length ? unique : exclusiveListings(properties);
  const items = source.slice(0, 6).map(toAureliaProperty);

  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad section-space">
        <div className="content-two-col">
          <div>
            <p className="eyebrow-line">{content.noteKicker}</p>
          </div>
          <div>
            <p className="prose-large">{content.lead}</p>
            <p style={{ color: "#5d5953", maxWidth: 720 }}>{content.body}</p>
          </div>
        </div>
        {items.length ? <PropertyGrid items={items} /> : <p>No properties to display yet.</p>}
      </section>
    </AureliaChrome>
  );
}
