import type { TemplatePageProps } from "../../../types";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloanePressContent } from "./schema";

export function SloanePressPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloanePressContent, SloaneSettings>) {
  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad narrow">
        <div>
          {settings.catalog.press.map((item) => (
            <a href="#" className="press-row" key={item.title}>
              <span>{item.outlet}</span>
              <h3>{item.title}</h3>
              <span className="arrow">↗</span>
            </a>
          ))}
        </div>
      </section>
    </SloaneChrome>
  );
}
