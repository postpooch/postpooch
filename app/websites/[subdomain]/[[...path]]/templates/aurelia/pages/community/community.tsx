import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaCommunityContent } from "./schema";

export function AureliaCommunityPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<AureliaCommunityContent, AureliaSettings>) {
  const community = settings.catalog.communities.find((item) => item.slug === params.slug);
  if (!community) notFound();
  const nearby = propertiesInPlace(properties, community.name)
    .slice(0, 3)
    .map(toAureliaProperty);

  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={community.name}
        subtitle={community.tagline}
        image={community.image}
      />
      <section className="community-overview section-pad section-space">
        <div className="content-two-col">
          <div>
            <p className="kicker light">{content.glanceKicker}</p>
            <h2 className="section-title">{community.name}</h2>
          </div>
          <div>
            <p className="prose-large">{community.intro}</p>
          </div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">
            <strong>{community.population}</strong>
            <span>Population</span>
          </div>
          <div className="overview-stat">
            <strong>{community.medianAge}</strong>
            <span>Median age</span>
          </div>
          <div className="overview-stat">
            <strong>{community.avgIncome}</strong>
            <span>Avg. individual income</span>
          </div>
          <div className="overview-stat">
            <strong>{community.walk}</strong>
            <span>Walk score</span>
          </div>
        </div>
      </section>
      <section className="section-pad section-space community-details-grid">
        <img className="community-detail-image" src={content.livingImage} alt="" />
        <div>
          <p className="kicker">
            {content.livingKickerPrefix} {community.name}
          </p>
          <h2 className="section-title">{content.livingTitle}</h2>
          <p style={{ marginTop: 30, color: "#595650" }}>
            {`${content.livingBodyPrefix} ${community.name}${content.livingBodySuffix}`}
          </p>
          <div className="detail-list">
            {community.details.map((detail, index) => (
              <div key={detail}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{detail}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
      {nearby.length ? (
        <section className="section-pad section-space" style={{ background: "#efebe4" }}>
          <div className="section-head">
            <div>
              <p className="kicker">
                {content.homesKickerSuffix} {community.name}
              </p>
              <h2 className="section-title">{content.homesTitle}</h2>
            </div>
          </div>
          <PropertyGrid items={nearby} />
        </section>
      ) : null}
    </AureliaChrome>
  );
}
