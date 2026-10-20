import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { SectionHeading } from "../../components/ui";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineAboutContent } from "./schema";

export function NorthpineAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineAboutContent, NorthpineSettings>) {
  const { catalog, agent } = settings;

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <div className="two-col">
          <div>
            <SectionHeading kicker={content.approachKicker} title={content.approachTitle} />
            <p className="lead">{content.approachLead}</p>
            <p>{content.approachBodyOne}</p>
            <p>{content.approachBodyTwo}</p>
          </div>
          <div className="editorial-image">
            <img src={agent.portrait} alt={agent.name} />
          </div>
        </div>
      </section>
      <section className="stats-section light-stats">
        <div className="container wide">
          <SectionHeading
            kicker={content.differenceKicker}
            title={content.differenceTitle}
            center
          />
          <div className="stats-grid">
            {catalog.aboutDifference.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad container wide">
        <SectionHeading kicker={content.teamKicker} title={content.teamTitle} />
        <div className="team-grid">
          {catalog.team.map((member) => (
            <a href={`/agents/${member.slug}`} className="team-card" key={member.slug}>
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </a>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
