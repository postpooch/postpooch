import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossContactContent } from "./schema";

export function VossContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossContactContent, VossSettings>) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <VossChrome site={site} settings={settings} showFooter={false}>
      <main className="contact-page">
        <section className="contact-grid section-pad">
          <div className="contact-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>
              {content.titleLine1}
              <br />
              <em>{content.titleEmphasis}</em>
            </h1>
            <p>{content.deck}</p>
            <div className="contact-meta">
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
              <a href={telHref}>{agent.phone}</a>
              <span>{agent.location}</span>
            </div>
          </div>
          <div className="contact-form-wrap">
            <ContactForm firstName={agent.firstName} />
          </div>
        </section>
        <div className="contact-image">
          <img src={content.image} alt={content.imageAlt} />
          <div>
            <span>{agent.logoName}</span>
            <span>{content.imageCaptionRight}</span>
          </div>
        </div>
      </main>
    </VossChrome>
  );
}
