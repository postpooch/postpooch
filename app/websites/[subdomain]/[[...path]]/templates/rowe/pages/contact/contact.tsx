import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweContactContent } from "./schema";

export function RoweContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<RoweContactContent, RoweSettings>) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <RoweChrome site={site} settings={settings}>
      <section className="contact-page">
        <div className="contact-intro">
          <div className="page-hero-label">{content.label}</div>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p>{content.deck}</p>
          <div className="contact-direct">
            <span>{content.directLabel}</span>
            <a href={telHref}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </div>
        </div>
        <div className="contact-form-wrap">
          <ContactForm
            intents={content.intents}
            intentLabel={content.intentLabel}
            messagePlaceholder={content.messagePlaceholder}
            submitLabel={content.submitLabel}
            successNote={content.successNote}
          />
        </div>
      </section>
    </RoweChrome>
  );
}
