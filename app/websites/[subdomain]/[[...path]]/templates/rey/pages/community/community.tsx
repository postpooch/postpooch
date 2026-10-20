import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { ArrowLink, PropertyCard } from "../../components/ui";
import { toReyProperty } from "../../../property-adapters";
import type { ReySettings } from "../../settings";

import type { ReyCommunityContent } from "./schema";

export function ReyCommunityPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<ReyCommunityContent, ReySettings>) {
  const community = settings.catalog.communities.find(
    (item) => item.slug === params.slug,
  );
  if (!community) notFound();

  const nearby = propertiesInPlace(properties, community.name)
    .slice(0, 4)
    .map(toReyProperty);

  return (
    <ReyChrome site={site} settings={settings}>
      <section
        className="community-detail-hero"
        style={{ backgroundImage: `url("${community.image}")` }}
      >
        <div className="community-detail-hero__copy">
          <span className="eyebrow eyebrow--light">{content.heroEyebrow}</span>
          <h1>{community.name}</h1>
          <p>{community.tagline}</p>
        </div>
      </section>
      <div className="community-stats">
        {community.stats.map((stat) => (
          <div className="community-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <section className="community-guide">
        <div className="community-guide__intro">
          <h2>
            {content.livingTitlePrefix}
            <br />
            <em>{community.name}.</em>
          </h2>
          <div>
            <p>{community.intro}</p>
            <p>{content.livingBody}</p>
            <ArrowLink href={content.askCtaHref}>
              {content.askCtaPrefix} {community.name}
            </ArrowLink>
          </div>
        </div>
        <div className="guide-sections">
          {content.guides.map((block) => (
            <div className="guide-block" key={block.title}>
              <span className="eyebrow">{block.eyebrow}</span>
              <h3>{block.title}</h3>
              <p>{block.body}</p>
            </div>
          ))}
        </div>
      </section>
      {nearby.length ? (
        <section className="section section--white">
          <div className="section-head">
            <div>
              <span className="eyebrow">{content.nearbyEyebrow}</span>
            </div>
            <div className="section-head__right">
              <h2>
                {content.nearbyTitlePrefix}
                <br />
                <em>{community.name}.</em>
              </h2>
            </div>
          </div>
          <div className="property-grid">
            {nearby.map((property, index) => (
              <PropertyCard
                key={property.slug}
                property={property}
                index={index}
              />
            ))}
          </div>
        </section>
      ) : null}
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
