import type { TemplatePageProps } from "../../../types";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import type { AureliaSettings } from "../../settings";

import type { AureliaPressContent } from "./schema";

export function AureliaPressPage({
  site,
  settings,
  content,
}: TemplatePageProps<AureliaPressContent, AureliaSettings>) {
  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad section-space">
        <div className="section-head">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h2 className="section-title">{content.title}</h2>
          </div>
        </div>
        <div className="filter-bar">
          <select defaultValue="all">
            <option value="all">All coverage</option>
            <option>Features</option>
            <option>Interviews</option>
          </select>
          <select defaultValue="new">
            <option value="new">Newest first</option>
            <option>Oldest first</option>
          </select>
          <button type="button">Apply</button>
        </div>
        <div className="press-list">
          {settings.catalog.press.map((item) => (
            <article className="press-item" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div>
                <span>{item.outlet}</span>
                <p>{item.date}</p>
              </div>
              <b>↗</b>
            </article>
          ))}
        </div>
      </section>
    </AureliaChrome>
  );
}
