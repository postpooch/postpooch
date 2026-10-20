import type { TemplatePageProps } from "../../../types";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneTeamContent } from "./schema";

export function SloaneTeamPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneTeamContent, SloaneSettings>) {
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
        <div className="team-list">
          {settings.catalog.team.map((member) => (
            <article className="team-member" key={member.name}>
              <div className="team-photo">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-copy">
                <div className="role">{member.role}</div>
                <h2>{member.name}</h2>
                <p>{member.text}</p>
                <div className="details">{member.details}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SloaneChrome>
  );
}
