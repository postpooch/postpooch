import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraBuyerConsultationContent } from "./schema";

export function MaraBuyerConsultationPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraBuyerConsultationContent, MaraSettings>) {
  return (
    <MaraChrome site={site} settings={settings}>
      <section className="consultationPage">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="lead">{content.lead}</p>
          <p>{content.body}</p>
        </div>
        <div className="consultationPanel">
          <ContactForm compact />
        </div>
      </section>
    </MaraChrome>
  );
}
