import type { TemplatePageProps } from "../../../types";
import { ArrowUpRight } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaRegiosContent } from "./schema";

export function MilaRegiosPage({
  site,
  settings,
  content,
}: TemplatePageProps<MilaRegiosContent, MilaSettings>) {
  const { areas } = settings.catalog;

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
      <section className="area-index shell section">
        {areas.map((area, i) => (
          <a
            href={`/regios/${area.slug}`}
            className="area-index-card"
            key={area.slug}
          >
            <div className="area-index-number">0{i + 1}</div>
            <div className="area-index-image">
              <img src={area.image} alt={area.city} />
            </div>
            <div className="area-index-copy">
              <small>{area.label}</small>
              <h2>{area.city}</h2>
              <p>{area.intro}</p>
              <b>
                {content.cardCtaPrefix} {area.city} <ArrowUpRight />
              </b>
            </div>
          </a>
        ))}
      </section>
    </MilaChrome>
  );
}
