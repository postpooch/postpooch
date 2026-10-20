import type { TemplatePageProps } from "../../../types";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneTestimonialsContent } from "./schema";

export function SloaneTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneTestimonialsContent, SloaneSettings>) {
  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad narrow">
        <div className="testimonials-list">
          {settings.catalog.testimonials.map((item) => (
            <article className="testimonial-row" key={item.name}>
              <blockquote>“{item.quote}”</blockquote>
              <cite>
                {item.name}
                <br />
                {item.type}
              </cite>
            </article>
          ))}
        </div>
      </section>
    </SloaneChrome>
  );
}
