import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierDevelopmentsContent } from "./schema";

export function AtelierDevelopmentsPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierDevelopmentsContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="developmentList shell">
        {settings.catalog.developments.map((development, index) => (
          <article key={development.slug} className="developmentRow">
            <div
              className="developmentImage"
              style={{ backgroundImage: `url("${development.image}")` }}
            />
            <div>
              <p className="kicker">
                0{index + 1} · {development.location}
              </p>
              <h2>{development.name}</h2>
              <p>{development.text}</p>
              <a className="textLink" href={`/developments/${development.slug}`}>
                Explore development <span>↗</span>
              </a>
            </div>
          </article>
        ))}
      </section>
    </AtelierChrome>
  );
}
