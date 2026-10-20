import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { PageHero } from "../../components/page-hero";
import { TestimonialStrip } from "../../components/testimonial-strip";
import type { HarborSettings } from "../../settings";

import type { HarborAboutContent } from "./schema";

export function HarborAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborAboutContent, HarborSettings>) {
  return (
    <HarborChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        italic={content.heroItalic}
        text={content.heroText}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
        cta={content.heroCta}
      />
      <section className="editorial-section section-pad shell two-col-copy">
        <div>
          <p className="kicker">{content.styleKicker}</p>
          <h2>
            {content.styleTitleBefore} <em>{content.styleTitleItalic}</em>
          </h2>
        </div>
        <div>
          <p>{content.styleBody1}</p>
          <p>{content.styleBody2}</p>
          <a href="/reviews" className="text-link">
            {content.styleCta} <span>↗</span>
          </a>
        </div>
      </section>
      <section className="stats dark-panel section-pad">
        <div className="shell stats-grid">
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="image-text section-pad shell">
        <img src={content.whyImage} alt={content.whyImageAlt} />
        <div>
          <p className="kicker">{content.whyKicker}</p>
          <h2>
            {content.whyTitleBefore} <em>{content.whyTitleItalic}</em>
          </h2>
          <p>{content.whyBody1}</p>
          <p>{content.whyBody2}</p>
          <a href="/contact" className="button button-dark">
            {content.whyCta} <span>↗</span>
          </a>
        </div>
      </section>
      <TestimonialStrip testimonials={settings.catalog.testimonials} />
    </HarborChrome>
  );
}
