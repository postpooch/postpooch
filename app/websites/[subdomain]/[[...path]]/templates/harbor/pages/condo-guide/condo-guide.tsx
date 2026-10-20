import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import type { HarborSettings } from "../../settings";

import type { HarborCondoGuideContent } from "./schema";

export function HarborCondoGuidePage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborCondoGuideContent, HarborSettings>) {
  return (
    <HarborChrome site={site} settings={settings}>
      <section className="page-hero condo-hero">
        <div className="page-hero-copy">
          <p className="kicker">{content.heroKicker}</p>
          <h1>
            {content.heroTitleBefore} <em>{content.heroTitleItalic}</em>
          </h1>
          <p className="lead">{content.heroLead}</p>
          <a href="/contact" className="button button-dark">
            {content.heroCta}
          </a>
        </div>
        <div className="page-hero-image">
          <img src={content.heroImage} alt={content.heroImageAlt} />
        </div>
      </section>
      <section className="building-list shell section-pad">
        <div className="section-head split">
          <div>
            <p className="kicker">{content.listKicker}</p>
            <h2>
              {content.listTitleBefore} <em>{content.listTitleItalic}</em>
            </h2>
          </div>
          <p>{content.listIntro}</p>
        </div>
        {settings.catalog.buildings.map((b, i) => (
          <a href="/contact" key={b.name}>
            <span>0{i + 1}</span>
            <strong>{b.name}</strong>
            <em>{b.area}</em>
            <small>{b.note}</small>
            <b>↗</b>
          </a>
        ))}
      </section>
    </HarborChrome>
  );
}
