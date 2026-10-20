import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { toAtelierProperty } from "../../../property-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PropertyGrid } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierCommunityContent } from "./schema";

export function AtelierCommunityPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<AtelierCommunityContent, AtelierSettings>) {
  const community = settings.catalog.communities.find(
    (item) => item.slug === params.slug,
  );
  if (!community) notFound();
  const nearby = propertiesInPlace(properties, community.name)
    .slice(0, 3)
    .map(toAtelierProperty);

  return (
    <AtelierChrome site={site} settings={settings}>
      <section
        className="communityHero"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.12),rgba(8,8,7,.48)),url("${community.image}")`,
        }}
      >
        <div>
          <p className="kicker light">{content.kicker}</p>
          <h1>{community.name}</h1>
          <p>{community.eyebrow}</p>
        </div>
      </section>
      <section className="splitEditorial shell">
        <div>
          <p className="kicker">Welcome to {community.name}</p>
          <h2>{community.blurb}</h2>
        </div>
        <div className="prose">
          <p>{community.intro}</p>
          <p>{content.extraParagraph}</p>
        </div>
      </section>
      <section className="loveSection">
        <div
          className="loveImage"
          style={{ backgroundImage: `url("${community.image}")` }}
        />
        <div className="loveCopy">
          <p className="kicker light">{content.loveEyebrow}</p>
          <h2>{content.loveTitle}</h2>
          <ul>
            {community.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>
      {nearby.length ? (
      <section className="section shell">
        <div className="sectionHeading">
          <p className="kicker">Homes in & around {community.name}</p>
          <h2>{content.listingsTitle}</h2>
        </div>
        <PropertyGrid items={nearby} />
        <div className="centerAction">
          <a href="/search" className="outlineButton">
            {content.searchCta}
          </a>
        </div>
      </section>
      ) : null}
    </AtelierChrome>
  );
}
