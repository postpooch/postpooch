import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanContactContent } from "./schema";

export function NathanContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<NathanContactContent, NathanSettings>) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="contact-page section-pad page-top">
        <div className="contact-intro">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            {content.titleLine2}
          </h1>
          <p>{content.deck}</p>
          <div className="contact-direct">
            <span>{content.directLabel}</span>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <a href={telHref}>{agent.phone}</a>
            <p>{agent.market}</p>
          </div>
        </div>
        <div className="contact-form-wrap">
          <ContactForm
            successTitle={content.formSuccessTitle}
            successBody={content.formSuccessBody}
            submitLabel={content.formSubmitLabel}
            formNote={content.formNote}
          />
        </div>
      </section>
    </NathanChrome>
  );
}
