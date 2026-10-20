import type { TemplatePageProps } from "../../../types";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweServicesContent } from "./schema";

export function RoweServicesPage({
  site,
  settings,
  content,
}: TemplatePageProps<RoweServicesContent, RoweSettings>) {
  return (
    <RoweChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="page-hero-label">{content.label}</div>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p>{content.deck}</p>
      </section>
      <section className="services-index section-pad">
        {settings.catalog.services.map((service) => (
          <a
            className="service-index-card"
            href={`/services/${service.slug}`}
            key={service.slug}
          >
            <div className="service-card-top">
              <span>{service.number}</span>
              <span>{content.cardExploreLabel}</span>
            </div>
            <div className="service-card-image">
              <img src={service.image} alt="Luxury residential architecture" />
            </div>
            <div className="service-card-copy">
              <h2>{service.title}</h2>
              <p>{service.short}</p>
            </div>
          </a>
        ))}
      </section>
      <section className="editorial-cta section-pad">
        <div className="section-label">{content.ctaLabel}</div>
        <h2>{content.ctaTitle}</h2>
        <a href={content.ctaHref} className="round-link dark-round">
          {content.ctaButtonLabel} <span>↗</span>
        </a>
      </section>
    </RoweChrome>
  );
}
