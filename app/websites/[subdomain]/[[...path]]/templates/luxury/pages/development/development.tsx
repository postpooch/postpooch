import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/forms";
import { LuxuryChrome } from "../../components/luxury-chrome";
import type { LuxurySettings } from "../../settings";

import type { LuxuryDevelopmentContent } from "./schema";

export function LuxuryDevelopmentPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<LuxuryDevelopmentContent, LuxurySettings>) {
  const item = settings.catalog.developments.find((d) => d.slug === params.slug);
  if (!item) notFound();

  return (
    <LuxuryChrome site={site} settings={settings}>
      <section
        className="development-detail-hero image-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(8,14,12,.22), rgba(8,14,12,.56)), url(${item.image})`,
        }}
      >
        <div>
          <p className="eyebrow">{item.status}</p>
          <h1>{item.name}</h1>
          <p>{item.location}</p>
        </div>
      </section>
      <section className="development-lede section-pad">
        <p className="eyebrow">{content.visionEyebrow}</p>
        <h2>{item.summary}</h2>
      </section>
      {item.sections.map((section, i) => (
        <section
          className={`development-section ${i % 2 ? "reverse" : ""}`}
          key={section.title}
        >
          <img src={section.image} alt={section.title} />
          <div>
            <p className="eyebrow">0{i + 1}</p>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </div>
        </section>
      ))}
      <section className="property-inquiry dark-section section-pad">
        <div>
          <p className="eyebrow">{content.inquiryEyebrow}</p>
          <h2>{content.inquiryTitle}</h2>
          <p>{content.inquiryText}</p>
        </div>
        <ContactForm dark compact realtorName={settings.realtor.name} />
      </section>
    </LuxuryChrome>
  );
}
