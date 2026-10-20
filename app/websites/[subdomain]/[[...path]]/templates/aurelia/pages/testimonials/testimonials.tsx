import type { TemplatePageProps } from "../../../types";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import type { AureliaSettings } from "../../settings";

import type { AureliaTestimonialsContent } from "./schema";

export function AureliaTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<AureliaTestimonialsContent, AureliaSettings>) {
  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad section-space">
        <div className="section-head">
          <div>
            <p className="kicker">{content.kicker}</p>
            <h2 className="section-title">{content.title}</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {settings.catalog.testimonials.map((item, index) => (
            <article className="testimonial-card" key={item.name}>
              <span>0{index + 1}</span>
              <blockquote>“{item.quote}”</blockquote>
              <p>{item.name}</p>
            </article>
          ))}
        </div>
      </section>
    </AureliaChrome>
  );
}
