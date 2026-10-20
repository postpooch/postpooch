import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalVideoContent } from "./schema";

export function CoastalVideoPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalVideoContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="section cream videoGrid">
        {settings.catalog.videos.map((title, index) => (
          <article key={title}>
            <div
              className={`videoPlaceholder vp${index % 4}`}
              style={{
                backgroundImage: `url(${content.thumbnails[index % content.thumbnails.length]})`,
              }}
            >
              <span className="playIcon" aria-hidden>
                ▶
              </span>
            </div>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
          </article>
        ))}
      </section>
    </CoastalChrome>
  );
}
