import type { TemplatePageProps } from "../../../types";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneCommunitiesContent } from "./schema";

export function SloaneCommunitiesPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneCommunitiesContent, SloaneSettings>) {
  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad wide">
        <div className="community-grid">
          {settings.catalog.communities.map((community) => (
            <a href={`/communities/${community.slug}`} className="community-card" key={community.slug}>
              <img src={community.image} alt={community.name} />
              <div className="community-card-content">
                <h3>{community.name}</h3>
                <p>{community.blurb}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </SloaneChrome>
  );
}
