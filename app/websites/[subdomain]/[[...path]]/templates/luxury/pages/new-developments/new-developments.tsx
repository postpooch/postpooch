import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PageHero, SectionHeading } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryDevelopmentsContent } from "./schema";

export function LuxuryDevelopmentsPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryDevelopmentsContent, LuxurySettings>) {
  const developments = settings.catalog.developments;
  const heroImage = developments[0]?.image ?? settings.hero.image;

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
        {developments.map((d, i) => (
          <article
            className={`development-row ${i % 2 ? "reverse" : ""}`}
            key={d.slug}
          >
            <a href={`/new-developments/${d.slug}`}>
              <img src={d.image} alt={d.name} />
            </a>
            <div>
              <p className="eyebrow">
                {d.status} · {d.location}
              </p>
              <h2>{d.name}</h2>
              <p>{d.summary}</p>
              <div className="button-row">
                <a className="button" href={`/new-developments/${d.slug}`}>
                  Learn More
                </a>
                <a className="text-link" href="/contact">
                  Request Info
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </LuxuryChrome>
  );
}
