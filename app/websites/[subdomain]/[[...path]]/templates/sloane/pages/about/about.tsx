import type { TemplatePageProps } from "../../../types";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneAboutContent } from "./schema";

export function SloaneAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneAboutContent, SloaneSettings>) {
  const review = settings.catalog.testimonials[2] ?? settings.catalog.testimonials[0];

  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad wide">
        <div className="about-split">
          <div className="about-photo">
            <img src={settings.images.agent} alt={settings.agent.name} />
          </div>
          <div className="about-copy">
            <div className="eyebrow">{content.backgroundEyebrow}</div>
            <h2>{content.backgroundTitle}</h2>
            {content.backgroundParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="text-link" href="/contact">
              {content.backgroundCta} <span>↗</span>
            </a>
          </div>
        </div>
      </section>
      <section className="stats-band">
        {content.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>
      {review ? (
        <section className="section-pad dark-section">
          <div className="wide testimonial-feature">
            <div>
              <div className="eyebrow">{content.testimonialEyebrow}</div>
              <blockquote>“{review.quote}”</blockquote>
              <cite>
                {review.name} · {review.type}
              </cite>
            </div>
            <div className="testimonial-side">
              <p>{content.testimonialSide}</p>
              <a className="text-link" href="/testimonials">
                {content.testimonialCta} <span>↗</span>
              </a>
            </div>
          </div>
        </section>
      ) : null}
      <section className="section-pad wide">
        <div className="about-split">
          <div className="about-copy">
            <div className="eyebrow">{content.povEyebrow}</div>
            <h2>{content.povTitle}</h2>
            <p>{content.povBody}</p>
            <a className="text-link" href="/resources">
              {content.povCta} <span>↗</span>
            </a>
          </div>
          <div className="about-photo">
            <img src={settings.images.interior} alt="Refined residential interior" />
          </div>
        </div>
      </section>
    </SloaneChrome>
  );
}
