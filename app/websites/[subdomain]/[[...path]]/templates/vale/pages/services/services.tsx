import type { TemplatePageProps } from "../../../types";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValeServicesContent } from "./schema";

export function ValeServicesPage({
  site,
  settings,
  content,
}: TemplatePageProps<ValeServicesContent, ValeSettings>) {
  const { services } = settings.catalog;

  return (
    <ValeChrome site={site} settings={settings}>
      <div className="interior-page page-pad services-page">
        <header className="page-intro services-intro">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="intro-copy">{content.introCopy}</p>
        </header>

        <section className="service-accordion">
          {services.map((service) => (
            <details key={service.number} open={service.number === "01"}>
              <summary>
                <span>{service.number}</span>
                <h2>{service.title}</h2>
                <b>+</b>
              </summary>
              <div className="service-content">
                <p>{service.text}</p>
                <a href="/contact" className="text-link">
                  {content.discussCtaLabel} <span>↗</span>
                </a>
              </div>
            </details>
          ))}
        </section>

        <section className="service-image">
          <img src={content.image} alt="Warm minimal living space" />
          <div>
            <p>{content.imageCaption}</p>
            <span>{content.imageNote}</span>
          </div>
        </section>
      </div>
    </ValeChrome>
  );
}
