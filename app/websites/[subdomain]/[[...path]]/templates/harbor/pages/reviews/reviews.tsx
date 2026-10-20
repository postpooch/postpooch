import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import type { HarborSettings } from "../../settings";

import type { HarborReviewsContent } from "./schema";

export function HarborReviewsPage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborReviewsContent, HarborSettings>) {
  return (
    <HarborChrome site={site} settings={settings}>
      <section className="archive-hero shell">
        <p className="kicker">{content.heroKicker}</p>
        <h1>
          {content.heroTitleBefore} <em>{content.heroTitleItalic}</em>
        </h1>
        <p>{content.heroBody}</p>
      </section>
      <section className="review-wall shell section-pad">
        {settings.catalog.testimonials.map((t, i) => (
          <article key={t.name}>
            <span>0{i + 1}</span>
            <blockquote>“{t.quote}”</blockquote>
            <div>
              <strong>{t.name}</strong>
              <small>{t.role}</small>
            </div>
          </article>
        ))}
      </section>
      <section className="soft-cta section-pad shell">
        <div>
          <p className="kicker">{content.softKicker}</p>
          <h2>
            {content.softTitleBefore} <em>{content.softTitleItalic}</em>
          </h2>
        </div>
        <div>
          <p>{content.softBody}</p>
          <a href="/contact" className="button button-dark">
            {content.softCta}
          </a>
        </div>
      </section>
    </HarborChrome>
  );
}
