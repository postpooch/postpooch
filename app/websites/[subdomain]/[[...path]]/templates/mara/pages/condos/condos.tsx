import type { TemplatePageProps } from "../../../types";
import { EditorialHero } from "../../components/editorial-hero";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraCondosContent } from "./schema";

export function MaraCondosPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraCondosContent, MaraSettings>) {
  const { condos } = settings.catalog;

  return (
    <MaraChrome site={site} settings={settings}>
      <EditorialHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        copy={content.heroCopy}
        image={content.heroImage}
      />
      <section className="section">
        <div className="pageIntro">
          <p className="eyebrow">{content.introEyebrow}</p>
          <h2>{content.introTitle}</h2>
          <p>{content.introBody}</p>
        </div>
        <div className="neighborhoodGrid">
          {condos.map((c) => (
            <a href={`/condos/${c.slug}`} className="neighborhoodCard" key={c.slug}>
              <img src={c.image} alt={c.name} />
              <div>
                <p>{c.area}</p>
                <h2>{c.name}</h2>
              </div>
            </a>
          ))}
        </div>
      </section>
    </MaraChrome>
  );
}
