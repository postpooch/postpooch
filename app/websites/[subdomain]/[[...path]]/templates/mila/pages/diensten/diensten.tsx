import type { TemplatePageProps } from "../../../types";
import { ArrowUpRight } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaDienstenContent } from "./schema";

export function MilaDienstenPage({
  site,
  settings,
  content,
}: TemplatePageProps<MilaDienstenContent, MilaSettings>) {
  const { services } = settings.catalog;

  return (
    <MilaChrome site={site} settings={settings}>
      <section className="page-title shell">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p className="lead">{content.lead}</p>
      </section>
      <section className="service-index shell section">
        {services.map((service) => (
          <a
            href={`/diensten/${service.slug}`}
            className="service-index-card"
            key={service.slug}
          >
            <div className="service-index-img">
              <img src={service.image} alt="" />
              <span>{service.number}</span>
            </div>
            <div className="service-index-copy">
              <small>{service.eyebrow}</small>
              <h2>{service.title}</h2>
              <p>{service.short}</p>
              <b>
                {content.cardCta} <ArrowUpRight />
              </b>
            </div>
          </a>
        ))}
      </section>
    </MilaChrome>
  );
}
