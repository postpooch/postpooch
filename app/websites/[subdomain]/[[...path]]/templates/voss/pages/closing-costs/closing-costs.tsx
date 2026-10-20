import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossClosingCostsContent } from "./schema";

export function VossClosingCostsPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossClosingCostsContent, VossSettings>) {
  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero guide-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="page-hero__intro">{content.intro}</p>
        </section>
        <section className="guide-grid section-pad section-pad--topless">
          {content.columns.map((column) => (
            <article key={column.label}>
              <span>{column.label}</span>
              <h2>{column.title}</h2>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <section className="guide-warning section-pad">
          <p className="eyebrow">{content.warningEyebrow}</p>
          <h2>{content.warningTitle}</h2>
          <p>{content.warningBody}</p>
          <a href={content.warningCtaHref} className="line-link">
            {content.warningCtaLabel} <span>↗</span>
          </a>
        </section>
      </main>
    </VossChrome>
  );
}
