import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { LeadForm } from "../../components/lead-form";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalContactContent } from "./schema";

export function CoastalContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalContactContent, CoastalSettings>) {
  const { agent } = settings;

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="contactLayout section white">
        <div className="contactCopy">
          <p className="eyebrow">{content.kicker}</p>
          <h2>{content.heading}</h2>
          <p className="largeCopy">{content.body}</p>
          <div className="contactDetails">
            <p>{agent.phone}</p>
            <p>{agent.email}</p>
            <p>{agent.address}</p>
            <p>{agent.license}</p>
          </div>
        </div>
        <div className="contactFormPanel">
          <LeadForm />
        </div>
      </section>
    </CoastalChrome>
  );
}
