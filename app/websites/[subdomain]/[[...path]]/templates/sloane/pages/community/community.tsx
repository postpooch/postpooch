import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toSloaneProperty } from "../../../property-adapters";
import { PropertyGrid } from "../../components/property-grid";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneCommunityContent } from "./schema";

export function SloaneCommunityPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<SloaneCommunityContent, SloaneSettings>) {
  const community = settings.catalog.communities.find((item) => item.slug === params.slug);
  if (!community) notFound();

  const related = propertiesInPlace(properties, community.name)
    .map(toSloaneProperty)
    .slice(0, 5);

  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="community-hero">
        <img src={community.image} alt={community.name} />
        <div className="community-hero-content">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{community.name}</h1>
        </div>
      </section>
      <section className="section-pad wide">
        <div className="community-intro">
          <h2>{community.name}, through a local lens.</h2>
          <p>
            {community.blurb}
            {content.introSuffix}
          </p>
        </div>
      </section>
      <section className="wide" style={{ paddingBottom: "90px" }}>
        <div className="eyebrow">{content.highlightsEyebrow}</div>
        <div className="highlight-list">
          {community.highlights.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
      <section className="wide" style={{ paddingBottom: "100px" }}>
        <div className="eyebrow">{content.mapEyebrow}</div>
        <div className="map-placeholder">
          <div className="map-marker">{settings.agent.monogram}</div>
        </div>
      </section>
      {related.length ? (
        <section className="section-pad wide">
          <div className="section-title">
            <div className="eyebrow">{content.listingsEyebrow}</div>
            <h2>
              {community.name}
              {content.listingsTitleSuffix}
            </h2>
            <p>{content.listingsIntro}</p>
          </div>
          <PropertyGrid properties={related} showFilters={false} />
        </section>
      ) : null}
    </SloaneChrome>
  );
}
