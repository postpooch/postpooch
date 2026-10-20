import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { SectionHeading } from "../../components/section-heading";
import type { CoastalSettings } from "../../settings";

import type { CoastalAboutContent } from "./schema";

export function CoastalAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalAboutContent, CoastalSettings>) {
  const { agent, catalog } = settings;

  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <section className="section white bioLayout">
        <div
          className="bioPortrait"
          style={{ backgroundImage: `url(${catalog.images.portrait})` }}
        />
        <div className="bioCopy">
          <SectionHeading eyebrow={agent.title} title={content.heading} />
          <p className="largeCopy">{agent.longBio}</p>
          <p>{content.bodyOne}</p>
          <p>{content.bodyTwo}</p>
          <div className="statGrid">
            {catalog.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <a href="/contact" className="button buttonDark">
            {content.ctaLabel}
          </a>
        </div>
      </section>
      <section className="videoStrip section ink">
        <SectionHeading eyebrow={content.filmsEyebrow} title={content.filmsTitle} />
        <div className="videoThumbs">
          {content.films.map((film, index) => (
            <div
              key={film.title}
              style={{ backgroundImage: `url(${content.filmImages[index] ?? content.heroImage})` }}
            >
              <span>{film.n}</span>
              <b>{film.title}</b>
            </div>
          ))}
        </div>
      </section>
    </CoastalChrome>
  );
}
