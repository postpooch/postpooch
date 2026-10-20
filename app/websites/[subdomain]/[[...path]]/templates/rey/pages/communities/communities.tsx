import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { CommunityCard, PageHero } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyCommunitiesContent } from "./schema";

export function ReyCommunitiesPage({
  site,
  settings,
  content,
}: TemplatePageProps<ReyCommunitiesContent, ReySettings>) {
  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <section className="editorial-intro">
        <h2>
          {content.introTitleLine1}
          <br />
          {content.introTitleLine2}
          <br />
          <em>{content.introTitleEmphasis}</em>
        </h2>
        <div className="editorial-intro__copy">
          <p>{content.introBodyOne}</p>
          <p>{content.introBodyTwo}</p>
        </div>
      </section>
      <div className="community-index">
        {settings.catalog.communities.map((community, index) => (
          <CommunityCard
            key={community.slug}
            community={community}
            index={index}
          />
        ))}
      </div>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
