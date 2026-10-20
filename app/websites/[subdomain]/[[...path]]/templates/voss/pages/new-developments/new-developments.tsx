import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossNewDevelopmentsContent } from "./schema";

export function VossNewDevelopmentsPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossNewDevelopmentsContent, VossSettings>) {
  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero development-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="page-hero__intro">{content.intro}</p>
        </section>
        <section className="development-lead section-pad section-pad--topless">
          <div>
            <p className="eyebrow">{content.buyersEyebrow}</p>
            <h2>{content.buyersTitle}</h2>
          </div>
          <p>{content.buyersBody}</p>
        </section>
        <section className="development-grid section-pad section-pad--topless">
          {settings.catalog.developments.map((p, i) => (
            <article key={p.name} className="development-card">
              <div>
                <img
                  src={p.image}
                  alt={`${p.name} architectural concept`}
                  loading="lazy"
                />
                <span>0{i + 1}</span>
              </div>
              <p className="eyebrow">
                {p.area} · {p.stage}
              </p>
              <h2>{p.name}</h2>
              <p className="demo-tag">{content.demoTag}</p>
            </article>
          ))}
        </section>
        <section className="developer-panel section-pad">
          <div>
            <p className="eyebrow eyebrow--light">{content.developersEyebrow}</p>
            <h2>
              {content.developersTitleLine1}
              <br />
              <em>{content.developersTitleEmphasis}</em>
            </h2>
          </div>
          <div>
            <p>{content.developersBody}</p>
            <a
              href={content.developersCtaHref}
              className="line-link line-link--light"
            >
              {content.developersCtaLabel} <span>↗</span>
            </a>
          </div>
        </section>
      </main>
    </VossChrome>
  );
}
