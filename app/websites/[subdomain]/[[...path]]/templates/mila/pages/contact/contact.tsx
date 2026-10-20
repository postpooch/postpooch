import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaContactContent } from "./schema";

export function MilaContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<MilaContactContent, MilaSettings>) {
  const { agent } = settings;

  return (
    <MilaChrome site={site} settings={settings}>
      <section className="contact-page shell">
        <div className="contact-intro">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="lead">{content.lead}</p>
          <div className="contact-direct">
            <div>
              <span>{content.phoneLabel}</span>
              <a href={`tel:${agent.phoneHref}`}>{agent.phoneDisplay}</a>
            </div>
            <div>
              <span>{content.emailLabel}</span>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </div>
            <div>
              <span>{content.officeLabel}</span>
              <p>{agent.address}</p>
            </div>
          </div>
        </div>
        <div className="contact-form-wrap">
          <span className="form-kicker">{content.formKicker}</span>
          <ContactForm />
        </div>
      </section>
    </MilaChrome>
  );
}
