import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierCommunitiesContent } from "./schema";

export function AtelierCommunitiesPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierCommunitiesContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="communityIndex shell">
        {settings.catalog.communities.map((community, index) => (
          <a
            key={community.slug}
            href={`/communities/${community.slug}`}
            className="communityIndexCard"
          >
            <div
              className="communityIndexImage"
              style={{ backgroundImage: `url("${community.image}")` }}
            />
            <div>
              <p className="kicker">
                0{index + 1} · {community.eyebrow}
              </p>
              <h2>{community.name}</h2>
              <p>{community.blurb}</p>
              <span className="textLink">
                Explore neighborhood <b>↗</b>
              </span>
            </div>
          </a>
        ))}
      </section>
    </AtelierChrome>
  );
}
