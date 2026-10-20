import type { TemplatePageProps } from "../../../types";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraNeighborhoodsContent } from "./schema";

export function MaraNeighborhoodsPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraNeighborhoodsContent, MaraSettings>) {
  const { neighborhoods } = settings.catalog;

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="journalHero">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p>{content.intro}</p>
      </section>
      <section className="neighborhoodGrid">
        {neighborhoods.map((n) => (
          <a
            className="neighborhoodCard"
            href={`/neighborhoods/${n.slug}`}
            key={n.slug}
          >
            <img src={n.image} alt={n.name} />
            <div>
              <p>{n.kicker}</p>
              <h2>{n.name}</h2>
            </div>
          </a>
        ))}
      </section>
    </MaraChrome>
  );
}
