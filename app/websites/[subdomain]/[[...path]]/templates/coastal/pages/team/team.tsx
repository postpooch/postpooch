import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { SectionHeading } from "../../components/section-heading";
import type { CoastalSettings } from "../../settings";

import type { CoastalTeamContent } from "./schema";

export function CoastalTeamPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalTeamContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="section cream">
        <SectionHeading
          eyebrow={content.headingEyebrow}
          title={content.headingTitle}
          text={content.headingText}
        />
        <div className="teamGrid">
          {settings.catalog.team.map((member) => (
            <article className="teamCard" key={member.name}>
              <div
                className="teamPhoto"
                style={{ backgroundImage: `url(${member.image})` }}
              />
              <h3>{member.name}</h3>
              <p>{member.title}</p>
              <a href={`mailto:${settings.agent.email}`}>{content.connectLabel}</a>
            </article>
          ))}
        </div>
      </section>
    </CoastalChrome>
  );
}
