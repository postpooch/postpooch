import type { TemplatePageProps } from "../../../types";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneResourcesContent } from "./schema";

export function SloaneResourcesPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneResourcesContent, SloaneSettings>) {
  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad wide">
        <div className="resource-grid">
          {content.cards.map((card) => (
            <a className="resource-card" href={card.href} key={card.title}>
              <div className="num">{card.num}</div>
              <div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="text-link">
                  {content.cta} <span>↗</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </SloaneChrome>
  );
}
