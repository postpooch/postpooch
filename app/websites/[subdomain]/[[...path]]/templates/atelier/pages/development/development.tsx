import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import type { AtelierSettings } from "../../settings";

import type { AtelierDevelopmentContent } from "./schema";

export function AtelierDevelopmentPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<AtelierDevelopmentContent, AtelierSettings>) {
  const development = settings.catalog.developments.find(
    (item) => item.slug === params.slug,
  );
  if (!development) notFound();

  return (
    <AtelierChrome site={site} settings={settings}>
      <section
        className="developmentHero"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.1),rgba(8,8,7,.5)),url("${development.image}")`,
        }}
      >
        <div>
          <p className="kicker light">New development · {development.location}</p>
          <h1>{development.name}</h1>
        </div>
      </section>
      <section className="splitEditorial shell">
        <div>
          <p className="kicker">{content.splitEyebrow}</p>
          <h2>{content.splitTitle}</h2>
        </div>
        <div className="prose">
          <p>{development.text}</p>
          {content.extraParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a href="/contact" className="outlineButton">
            {content.ctaLabel}
          </a>
        </div>
      </section>
      <section className="detailMetrics shell">
        {development.metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>
      <section className="imagePair shell">
        <div style={{ backgroundImage: `url("${development.image2}")` }} />
        <div style={{ backgroundImage: `url("${development.image3}")` }} />
      </section>
    </AtelierChrome>
  );
}
