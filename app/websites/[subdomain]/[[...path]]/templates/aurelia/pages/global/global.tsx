import { worldwideListings } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import type { AureliaSettings } from "../../settings";

import type { AureliaGlobalContent } from "./schema";

export function AureliaGlobalPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AureliaGlobalContent, AureliaSettings>) {
  const items = worldwideListings(properties).map(toAureliaProperty);

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
        <div className="listing-intro">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h2 className="section-title">{content.title}</h2>
          </div>
          <p>{content.note}</p>
        </div>
        {items.length ? (
          <div className="global-grid">
            {items.map((item) => (
              <a className="global-card" href={`/properties/${item.slug}`} key={item.slug}>
                {item.image ? <img src={item.image} alt="" /> : null}
                <h3>{item.address}</h3>
                <p>{item.city}</p>
                <p>{item.price}</p>
              </a>
            ))}
          </div>
        ) : (
          <p>No properties to display yet.</p>
        )}
      </section>
    </AureliaChrome>
  );
}
