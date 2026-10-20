import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { ContactForm } from "../../components/contact-form";
import type { AverySettings } from "../../settings";

import type { AveryContactContent } from "./schema";

export function AveryContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryContactContent, AverySettings>) {
  const { agent } = settings;

  return (
    <AveryChrome site={site} settings={settings}>
      <section className="contact-page">
        <div className="contact-image">
          <img src={content.portrait} alt="" />
        </div>
        <div className="contact-copy">
          <p className="eyebrow">{content.kicker}</p>
          <h1>{content.title}</h1>
          <p className="prose">{content.body}</p>
          <ContactForm />
          <div style={{ marginTop: "55px", fontSize: "12px", lineHeight: 1.8 }}>
            <strong>{agent.name}</strong>
            <br />
            {agent.phone}
            <br />
            {agent.email}
            <br />
            {agent.address}
          </div>
        </div>
      </section>
    </AveryChrome>
  );
}
