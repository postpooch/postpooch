import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierVideosContent } from "./schema";

export function AtelierVideosPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierVideosContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="videoGrid shell">
        {settings.catalog.videos.map((video) => (
          <article key={video.title}>
            <div
              className="videoThumb"
              style={{ backgroundImage: `url("${video.image}")` }}
            >
              <span className="play">▶</span>
            </div>
            <p className="kicker">{video.category}</p>
            <h2>{video.title}</h2>
          </article>
        ))}
      </section>
    </AtelierChrome>
  );
}
