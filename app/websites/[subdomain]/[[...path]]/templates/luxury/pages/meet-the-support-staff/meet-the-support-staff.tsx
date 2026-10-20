import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryTeamContent } from "./schema";

export function LuxuryTeamPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryTeamContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="team-intro section-pad">
        <SectionHeading
          eyebrow={content.introEyebrow}
          title={`Built around ${settings.realtor.name}.`}
          text={content.introText}
          align="center"
        />
      </section>
      <section className="team-grid section-pad-topless">
        {settings.catalog.team.map((member) => (
          <article key={member.slug} className="team-card">
            <img src={member.image} alt={member.name} />
            <div>
              <p className="eyebrow">{member.role}</p>
              <h2>{member.name}</h2>
              <p>{member.bio}</p>
              <a className="text-link" href={`mailto:${settings.realtor.email}`}>
                Get in Touch
              </a>
            </div>
          </article>
        ))}
      </section>
    </LuxuryChrome>
  );
}
