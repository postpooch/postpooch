import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraSellerConsultationContent } from "./schema";

export function MaraSellerConsultationPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraSellerConsultationContent, MaraSettings>) {
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
