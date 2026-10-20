import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toCoastalProperty } from "../../../property-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyCard } from "../../components/property-card";
import type { CoastalSettings } from "../../settings";

import type { CoastalCommunityContent } from "./schema";

export function CoastalCommunityPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<CoastalCommunityContent, CoastalSettings>) {
  const community = settings.catalog.communities.find((item) => item.slug === params.slug);
  if (!community) notFound();
  const nearby = propertiesInPlace(properties, community.name)
    .slice(0, 3)
    .map(toCoastalProperty);

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={community.name} image={community.image}>
        <p>{community.eyebrow}</p>
      </PageHero>
      <section className="section white communityStory">
        <div>
          <p className="eyebrow">Explore {community.name}</p>
          <h2>{content.storyTitle}</h2>
        </div>
        <p className="largeCopy">{community.intro}</p>
      </section>
      <section className="section cream highlightGrid">
        {community.highlights.map((group) => (
          <div className="highlightCard" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        ))}
      </section>
      {nearby.length ? (
        <section className="section white">
          <p className="eyebrow">{content.homesKicker}</p>
          <h2 className="smallSectionTitle">
            {content.homesTitlePrefix} {community.name}
          </h2>
          <div className="propertyGrid">
            {nearby.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </section>
      ) : null}
    </CoastalChrome>
  );
}
