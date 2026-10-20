import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineCommunitiesContent } from "./schema";

export function NorthpineCommunitiesPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineCommunitiesContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <div className="community-index">
          {settings.catalog.communities.map((community) => (
            <a href={`/community/${community.slug}`} key={community.slug}>
              <img src={community.image} alt={community.name} />
              <div>
                <span className="eyebrow light">{content.kicker}</span>
                <h2>{community.name}</h2>
                <p>{community.description}</p>
                <em>{content.ctaLabel}</em>
              </div>
            </a>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
