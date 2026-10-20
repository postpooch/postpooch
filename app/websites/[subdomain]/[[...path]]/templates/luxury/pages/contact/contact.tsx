import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/forms";
import { LuxuryChrome } from "../../components/luxury-chrome";
import type { LuxurySettings } from "../../settings";

import type { LuxuryContactContent } from "./schema";

export function LuxuryContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryContactContent, LuxurySettings>) {
  const { realtor, brokerage } = settings;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <section className="contact-page">
        <div
          className="contact-image image-cover"
          style={{
            backgroundImage: `linear-gradient(rgba(8,14,12,.18), rgba(8,14,12,.42)), url(${realtor.lifestyleImage})`,
          }}
        >
          <div>
            <p className="eyebrow">{content.imageEyebrow}</p>
            <h1>{content.imageTitle}</h1>
          </div>
        </div>
        <div className="contact-content">
          <p className="eyebrow">{content.formEyebrow}</p>
          <h2>{content.formTitle}</h2>
          <p>{content.formIntro}</p>
          <ContactForm realtorName={realtor.name} />
          <div className="contact-details">
            <a href={`tel:${realtor.phone}`}>{realtor.phone}</a>
            <a href={`mailto:${realtor.email}`}>{realtor.email}</a>
            <span>
              {brokerage.addressLine1}
              <br />
              {brokerage.addressLine2}
            </span>
          </div>
        </div>
      </section>
    </LuxuryChrome>
  );
}
