import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryTestimonialsContent } from "./schema";

export function AveryTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryTestimonialsContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        sub={content.heroSub}
        image={content.heroImage}
      />
      <section className="content-section shell">
        <div className="quote-grid">
          {settings.catalog.testimonials.map((item) => (
            <div className="quote-card" key={item.initials}>
              <span className="quote-mark">“</span>
              <blockquote>{item.quote}</blockquote>
              <small>
                {item.initials} · {item.role}
              </small>
            </div>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
