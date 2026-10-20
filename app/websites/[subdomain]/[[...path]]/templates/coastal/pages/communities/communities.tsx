import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalCommunitiesContent } from "./schema";

export function CoastalCommunitiesPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalCommunitiesContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <section className="communityIndex">
        {settings.catalog.communities.map((community, index) => (
          <a
            href={`/communities/${community.slug}`}
            key={community.slug}
            className="communityIndexCard"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.64), rgba(0,0,0,.16)), url(${community.image})`,
            }}
          >
            <span>0{index + 1}</span>
            <div>
              <p>{community.eyebrow}</p>
              <h2>{community.name}</h2>
              <em>{content.exploreLabel}</em>
            </div>
          </a>
        ))}
      </section>
    </CoastalChrome>
  );
}
