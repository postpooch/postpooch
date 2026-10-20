import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierTeamContent } from "./schema";

export function AtelierTeamPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierTeamContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="teamGrid shell">
        {settings.catalog.team.map((member, index) => (
          <article key={member.slug} className="teamMember">
            <div
              className="teamPhoto"
              style={{ backgroundImage: `url("${member.image}")` }}
            />
            <p className="kicker">0{index + 1}</p>
            <h2>{member.name}</h2>
            <p>{member.role}</p>
          </article>
        ))}
      </section>
    </AtelierChrome>
  );
}
