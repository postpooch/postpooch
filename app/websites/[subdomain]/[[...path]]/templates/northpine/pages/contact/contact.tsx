import type { TemplatePageProps } from "../../../types";
import { LeadForm } from "../../components/forms";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineContactContent } from "./schema";

export function NorthpineContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineContactContent, NorthpineSettings>) {
  const { agent } = settings;

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <div className="contact-page-grid">
          <div>
            <span className="eyebrow">{content.kicker}</span>
            <h2>{agent.name}</h2>
            <p className="lead">{content.role}</p>
            <p>
              {agent.phone}
              <br />
              {agent.email}
              <br />
              {agent.address}
            </p>
            <div className="office-image">
              <img src={agent.portrait} alt={agent.name} />
            </div>
          </div>
          <LeadForm title={content.formTitle} />
        </div>
      </section>
      <section className="office-map">
        <div className="map-lines" />
        <span className="pin office-pin">
          {content.mapLabel.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </span>
      </section>
    </NorthpineInnerPage>
  );
}
