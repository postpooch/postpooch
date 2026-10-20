import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanNeighborhoodsContent } from "./schema";

export function NathanNeighborhoodsPage({
  site,
  settings,
  content,
}: TemplatePageProps<NathanNeighborhoodsContent, NathanSettings>) {
  return (
    <NathanChrome site={site} settings={settings}>
      <section className="page-hero section-pad page-top">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>
          {content.titleLine1}
          <br />
          <span>{content.titleEmphasis}</span>
        </h1>
        <p className="page-deck">{content.deck}</p>
      </section>
      <section className="neighborhood-directory section-pad">
        {settings.catalog.neighborhoods.map((n, i) => (
          <article key={n.name} className="directory-row">
            <div className="directory-image">
              <img src={n.image} alt={`${n.name} luxury real estate`} />
            </div>
            <span className="directory-no">0{i + 1}</span>
            <div>
              <h2>{n.name}</h2>
              <p>{n.note}</p>
            </div>
            <strong>
              {n.count} {content.countSuffix}
            </strong>
          </article>
        ))}
      </section>
      <section className="neighborhood-quote section-pad">
        <p className="eyebrow light-text">{content.quoteEyebrow}</p>
        <h2>{content.quoteTitle}</h2>
        <a className="pill light" href={content.quoteCtaHref}>
          {content.quoteCtaLabel} <span>↗</span>
        </a>
      </section>
    </NathanChrome>
  );
}
