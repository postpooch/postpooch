import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { ArrowLink, PageHero } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyTeamContent } from "./schema";

export function ReyTeamPage({
  site,
  settings,
  content,
}: TemplatePageProps<ReyTeamContent, ReySettings>) {
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
          <em>{content.introTitleEmphasis}</em>
        </h2>
        <div className="editorial-intro__copy">
          <p>{content.introBodyOne}</p>
          <p>{content.introBodyTwo}</p>
        </div>
      </section>
      <section className="section section--white">
        <div className="team-grid">
          {settings.catalog.team.map((member) => (
            <article className="team-card" key={member.slug}>
              <div
                className="team-card__image image-hover"
                style={{ backgroundImage: `url("${member.image}")` }}
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <ArrowLink href={`/team/${member.slug}`}>
                {content.profileCtaLabel}
              </ArrowLink>
            </article>
          ))}
        </div>
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
