import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { PageHero } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyTestimonialsContent } from "./schema";

export function ReyTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<ReyTestimonialsContent, ReySettings>) {
  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <div className="testimonials-grid">
        {settings.catalog.testimonials.map((item) => (
          <article className="testimonial-card" key={item.title}>
            <div>
              <span className="eyebrow">{content.cardEyebrow}</span>
              <h2>{item.title}</h2>
              <blockquote>“{item.quote}”</blockquote>
            </div>
            <div className="testimonial-author">
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
          </article>
        ))}
      </div>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
