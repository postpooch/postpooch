import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryNeighborhoodsContent } from "./schema";

export function AveryNeighborhoodsPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryNeighborhoodsContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero kicker={content.heroKicker} title={content.heroTitle} sub={content.heroSub} />
      <section className="content-section shell">
        <div className="neighborhood-grid">
          {settings.catalog.neighborhoods.map((item) => (
            <a
              href={`/neighborhoods/${item.slug}`}
              className="neighborhood-card"
              key={item.slug}
            >
              <img src={item.image} alt="" />
              <div className="nc-copy">
                <small>{item.coords}</small>
                <h3>{item.name}</h3>
                <p>{item.intro}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
