import type { TemplatePageProps } from "../../../types";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { ContactForm } from "../../components/contact-form";
import type { AureliaSettings } from "../../settings";

import type { AureliaContactContent } from "./schema";

export function AureliaContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<AureliaContactContent, AureliaSettings>) {
  const { agent } = settings;

  return (
    <AureliaChrome site={site} settings={settings}>
      <div className="contact-page section-pad">
        <section className="contact-grid">
          <div>
            <p className="kicker light">{content.kicker}</p>
            <h1>{content.title}</h1>
            <p style={{ color: "#aaa79f", maxWidth: 450 }}>{content.body}</p>
            <div className="contact-details">
              <p>{agent.phone}</p>
              <p>{agent.email}</p>
              <p>{agent.address}</p>
              <p>{agent.license}</p>
            </div>
          </div>
          <ContactForm dark />
        </section>
      </div>
    </AureliaChrome>
  );
}
