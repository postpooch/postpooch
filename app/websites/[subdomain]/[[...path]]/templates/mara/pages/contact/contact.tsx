import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraContactContent } from "./schema";

export function MaraContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraContactContent, MaraSettings>) {
  const { agent } = settings;
  const telHref = `tel:${agent.phone.replace(/\s+/g, "")}`;

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="contactPage">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
          <div className="contactDetails">
            <a href={telHref}>{agent.phone}</a>
            <a href={`mailto:${agent.email}`}>{agent.email}</a>
            <span>{agent.office}</span>
            <span>{agent.city}</span>
          </div>
        </div>
        <div>
          <ContactForm compact />
        </div>
      </section>
    </MaraChrome>
  );
}
