import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryBeforeAfterContent } from "./schema";

export function AveryBeforeAfterPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryBeforeAfterContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero kicker={content.heroKicker} title={content.heroTitle} sub={content.heroSub} />
      <section className="content-section shell">
        {settings.catalog.beforeAfterCases.map((item, index) => (
          <div className="before-row" key={item.title}>
            <div>
              <p className="eyebrow">Case study 0{index + 1}</p>
              <h2 style={{ fontSize: "52px" }}>{item.title}</h2>
              <p className="prose">{item.copy}</p>
            </div>
            <div className="ba-images">
              <div className="ba-image">
                <img
                  src={item.before}
                  alt=""
                  style={{ filter: "saturate(.55) brightness(.83)" }}
                />
                <span>Before</span>
              </div>
              <div className="ba-image">
                <img src={item.after} alt="" />
                <span>After</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </AveryChrome>
  );
}
