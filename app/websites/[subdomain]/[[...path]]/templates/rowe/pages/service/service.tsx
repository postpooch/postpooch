import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweServiceContent } from "./schema";

export function RoweServicePage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<RoweServiceContent, RoweSettings>) {
  const service = settings.catalog.services.find(
    (item) => item.slug === params.slug,
  );
  if (!service) notFound();

  const others = settings.catalog.services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <RoweChrome site={site} settings={settings}>
      <section className="detail-hero">
        <div className="detail-title">
          <div className="page-hero-label">
            {content.labelPrefix} {service.number}
          </div>
          <h1>{service.title}</h1>
          <p>{service.intro}</p>
        </div>
        <div className="detail-image">
          <img src={service.image} alt={content.imageAlt} />
        </div>
      </section>
      <section className="service-facts section-pad">
        <div>
          <span>{content.formatLabel}</span>
          <p>{service.format}</p>
        </div>
        <div>
          <span>{content.durationLabel}</span>
          <p>{service.duration}</p>
        </div>
        <div>
          <span>{content.bestForLabel}</span>
          <p>{service.bestFor}</p>
        </div>
        <div>
          <span>{content.feeLabel}</span>
          <p>{service.fee}</p>
        </div>
      </section>
      <section className="service-body section-pad">
        <div className="section-label">{content.bodyLabel}</div>
        <div className="body-copy">
          {service.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h2>{content.includesTitle}</h2>
          <ul>
            {service.includes.map((item) => (
              <li key={item}>
                <span>↗</span>
                {item}
              </li>
            ))}
          </ul>
          <blockquote>{service.note}</blockquote>
          <a href={content.ctaHref} className="text-arrow">
            {content.ctaLabel} <span>↗</span>
          </a>
        </div>
      </section>
      <section className="other-services section-pad">
        <div className="section-label">{content.otherLabel}</div>
        <div>
          {others.map((item) => (
            <a href={`/services/${item.slug}`} key={item.slug}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
    </RoweChrome>
  );
}
