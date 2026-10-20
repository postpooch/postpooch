import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalMapContent } from "./schema";

export function CoastalMapPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalMapContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="mapShowcase">
        <div className="coastMap">
          <span className="coastline one" />
          <span className="coastline two" />
          {settings.catalog.communities.map((community, index) => (
            <a
              key={community.slug}
              href={`/communities/${community.slug}`}
              className={`mapPoint m${index + 1}`}
            >
              <i /> {community.name}
            </a>
          ))}
        </div>
        <div className="mapCommunityList">
          <p className="eyebrow">{content.listEyebrow}</p>
          <h2>{content.listTitle}</h2>
          {settings.catalog.communities.map((community) => (
            <a href={`/communities/${community.slug}`} key={community.slug}>
              {community.name}
              <span>→</span>
            </a>
          ))}
        </div>
      </section>
    </CoastalChrome>
  );
}
