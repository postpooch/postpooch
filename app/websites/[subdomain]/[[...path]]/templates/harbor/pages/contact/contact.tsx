import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { LeadForm } from "../../components/lead-form";
import type { HarborSettings } from "../../settings";

import type { HarborContactContent } from "./schema";

export function HarborContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborContactContent, HarborSettings>) {
  const { agent } = settings;

  return (
    <HarborChrome site={site} settings={settings}>
      <section className="contact-page shell">
        <div className="contact-copy">
          <p className="kicker">{content.kicker}</p>
          <h1>
            {content.titleBefore} <em>{content.titleItalic}</em>
          </h1>
          <p>{content.body}</p>
          <div className="contact-details">
            <a href={`tel:${agent.phoneHref}`}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <span>{agent.area}, Ontario</span>
          </div>
        </div>
        <div className="contact-form-wrap">
          <LeadForm />
        </div>
      </section>
    </HarborChrome>
  );
}
