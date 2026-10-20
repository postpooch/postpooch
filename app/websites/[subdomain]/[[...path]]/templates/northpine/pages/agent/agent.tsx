import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineAgentContent } from "./schema";

export function NorthpineAgentPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<NorthpineAgentContent, NorthpineSettings>) {
  const member =
    settings.catalog.team.find((item) => item.slug === params.slug) ??
    settings.catalog.team[0];
  if (!member) notFound();

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={`Meet ${member.name}`}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
      eyebrow={content.heroEyebrow}
      current={member.name}
    >
      <section className="section-pad container wide">
        <div className="agent-profile">
          <img src={member.image} alt={member.name} />
          <div>
            <span className="eyebrow">{content.roleEyebrow}</span>
            <h2>{member.name}</h2>
            <p className="lead">“{member.quote}”</p>
            <p>{member.bio}</p>
            <p>{member.approach}</p>
            <div className="agent-contact">
              <span>{settings.agent.phone}</span>
              <span>{settings.agent.email}</span>
            </div>
            <a href={content.ctaHref} className="btn btn-dark">
              {content.ctaLabel}
            </a>
          </div>
        </div>
      </section>
      <section className="bio-band">
        <div className="container">
          <h2>{content.bioTitle}</h2>
          <p>{content.bioBody}</p>
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
