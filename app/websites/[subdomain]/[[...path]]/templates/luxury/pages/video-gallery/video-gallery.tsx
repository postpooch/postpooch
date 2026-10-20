import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryVideoGalleryContent } from "./schema";

export function LuxuryVideoGalleryPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryVideoGalleryContent, LuxurySettings>) {
  const videos = settings.catalog.videos;
  const heroImage = videos[0]?.image ?? settings.hero.image;

  return (
    <LuxuryChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={heroImage}
      />
      <section className="section-pad">
        <SectionHeading
          eyebrow={content.sectionEyebrow}
          title={content.sectionTitle}
        />
        <div className="video-grid">
          {videos.map((v) => (
            <article key={v.title}>
              <div>
                <img src={v.image} alt={v.title} />
                <button type="button" aria-label={`Play ${v.title}`}>
                  ▶
                </button>
                <span>{v.duration}</span>
              </div>
              <h2>{v.title}</h2>
              <p>{v.description}</p>
            </article>
          ))}
        </div>
      </section>
    </LuxuryChrome>
  );
}
