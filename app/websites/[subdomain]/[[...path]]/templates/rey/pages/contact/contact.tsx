import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { ReyChrome } from "../../components/rey-chrome";
import type { ReySettings } from "../../settings";

import type { ReyContactContent } from "./schema";

export function ReyContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<ReyContactContent, ReySettings>) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\D/g, "")}`;

  return (
    <ReyChrome site={site} settings={settings}>
      <section className="contact-page">
        <div
          className="contact-page__image"
          style={{ backgroundImage: `url("${content.image}")` }}
        />
        <div className="contact-page__copy">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.deck}</p>
          <ContactForm submitLabel={content.submitLabel} />
        </div>
      </section>
      <section className="contact-details">
        <div>
          <span>{content.officeLabel}</span>
          <p>{agent.address}</p>
        </div>
        <div>
          <span>{content.directLabel}</span>
          <a href={telHref}>{agent.phone}</a>
        </div>
        <div>
          <span>{content.emailLabel}</span>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      </section>
    </ReyChrome>
  );
}
