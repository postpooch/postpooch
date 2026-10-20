import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneContactContent } from "./schema";

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function SloaneContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneContactContent, SloaneSettings>) {
  const { agent } = settings;

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
        <div className="contact-page-grid">
          <div className="contact-page-image">
            <img src={settings.images.agent} alt={agent.name} />
          </div>
          <div className="contact-page-copy">
            <div className="eyebrow">{content.copyEyebrow}</div>
            <h2>{content.copyTitle}</h2>
            <p>{content.copyBody}</p>
            <div className="contact-details">
              <div>
                <span>{content.phoneLabel}</span>
                <a href={`tel:${digits(agent.phone)}`}>{agent.phone}</a>
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
            <ContactForm title={content.formTitle} />
          </div>
        </div>
      </section>
    </SloaneChrome>
  );
}
