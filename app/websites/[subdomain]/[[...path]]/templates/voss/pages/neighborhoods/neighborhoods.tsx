import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossNeighborhoodsContent } from "./schema";

export function VossNeighborhoodsPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossNeighborhoodsContent, VossSettings>) {
  const email = settings.agent.email;

  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero page-hero--neighborhoods">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="page-hero__intro">{content.intro}</p>
        </section>
        <section className="neighborhood-editorial section-pad section-pad--topless">
          {settings.catalog.neighborhoods.map((n, i) => (
            <article className="neighborhood-feature" key={n.slug}>
              <div className="neighborhood-feature__image">
                <img
                  src={n.image}
                  alt={`${n.name} streetscape`}
                  loading="lazy"
                />
                <span>0{i + 1}</span>
              </div>
              <div className="neighborhood-feature__copy">
                <p className="eyebrow">{n.kicker}</p>
                <h2>{n.name}</h2>
                <p>{n.text}</p>
                <a href={`mailto:${email}`} className="line-link">
                  {content.askPrefix} {n.name} <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </section>
      </main>
    </VossChrome>
  );
}
