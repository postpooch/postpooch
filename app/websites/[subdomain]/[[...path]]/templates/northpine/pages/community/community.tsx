import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { PropertyGrid, SectionHeading } from "../../components/ui";
import type { NorthpineSettings } from "../../settings";
import { toNorthpineProperty } from "../../../property-adapters";

import type { NorthpineCommunityContent } from "./schema";

export function NorthpineCommunityPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<NorthpineCommunityContent, NorthpineSettings>) {
  const community = settings.catalog.communities.find((item) => item.slug === params.slug);
  if (!community) notFound();
  const nearby = propertiesInPlace(properties, community.name)
    .slice(0, 3)
    .map(toNorthpineProperty);

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={community.name}
      subtitle={community.description}
      image={community.image}
      current={community.name}
    >
      <section className="section-pad container wide">
        <div className="two-col community-story">
          <div>
            <SectionHeading
              kicker={content.overviewKicker}
              title={`${content.overviewTitlePrefix} ${community.name}`}
            />
            <p className="lead">{content.lead}</p>
            <p>
              {community.name} {content.bodyOne}
            </p>
            <p>{content.bodyTwo}</p>
            <a href={content.ctaHref} className="btn btn-dark">
              {content.ctaLabel}
            </a>
          </div>
          <div className="community-facts">
            <h3>{content.factsTitle}</h3>
            <div>
              <span>Best for</span>
              <b>{community.bestFor}</b>
            </div>
            <div>
              <span>Property mix</span>
              <b>{community.propertyMix}</b>
            </div>
            <div>
              <span>Outdoor access</span>
              <b>{community.outdoorAccess}</b>
            </div>
            <div>
              <span>Market feel</span>
              <b>{community.marketFeel}</b>
            </div>
          </div>
        </div>
      </section>
      {nearby.length ? (
      <section className="section-pad-sm container wide">
        <SectionHeading
          kicker={content.nearbyKicker}
          title={`${content.nearbyTitlePrefix} ${community.name}`}
        />
        <PropertyGrid items={nearby} />
      </section>
      ) : null}
    </NorthpineInnerPage>
  );
}
