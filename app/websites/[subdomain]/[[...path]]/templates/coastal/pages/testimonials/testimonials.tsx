import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalTestimonialsContent } from "./schema";

export function CoastalTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalTestimonialsContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage} />
      <section className="section cream testimonialGrid">
        {settings.catalog.testimonials.map((item, index) => (
          <article key={item.name} className="testimonialCard">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <blockquote>“{item.quote}”</blockquote>
            <p>{item.name}</p>
          </article>
        ))}
      </section>
    </CoastalChrome>
  );
}
