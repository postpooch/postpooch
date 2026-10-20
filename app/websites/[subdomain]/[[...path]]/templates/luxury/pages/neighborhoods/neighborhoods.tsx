import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryNeighborhoodsContent } from "./schema";

export function LuxuryNeighborhoodsPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryNeighborhoodsContent, LuxurySettings>) {
  const communities = settings.catalog.communities;
  const heroImage = communities[0]?.image ?? settings.hero.image;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={`${settings.realtor.market} Communities`}
        subtitle={content.heroSubtitle}
        image={heroImage}
      />
      <section className="section-pad">
        <SectionHeading
          eyebrow={content.sectionEyebrow}
          title={content.sectionTitle}
          align="center"
        />
        <div className="community-index">
          {communities.map((c, i) => (
            <a
              key={c.slug}
              href={`/neighborhoods/${c.slug}`}
              className="community-index-card"
            >
              <img src={c.image} alt={c.name} />
              <div>
                <span>0{i + 1}</span>
                <h2>{c.name}</h2>
                <p>{c.tagline}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </LuxuryChrome>
  );
}
