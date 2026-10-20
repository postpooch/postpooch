import type { TemplatePageProps } from "../../../types";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { CommunityGrid } from "../../components/community-grid";
import { PageHero } from "../../components/page-hero";
import type { AureliaSettings } from "../../settings";

import type { AureliaCommunitiesContent } from "./schema";

export function AureliaCommunitiesPage({
  site,
  settings,
  content,
}: TemplatePageProps<AureliaCommunitiesContent, AureliaSettings>) {
  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad section-space">
        <div className="section-head">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h2 className="section-title">{content.title}</h2>
          </div>
          <p>{content.note}</p>
        </div>
        <CommunityGrid items={settings.catalog.communities} />
      </section>
    </AureliaChrome>
  );
}
