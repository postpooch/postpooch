import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { ArrowLink, PageHero } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyAboutContent } from "./schema";

export function ReyAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<ReyAboutContent, ReySettings>) {
  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        image={content.heroImage}
      />
      <section className="editorial-intro">
        <h2>
          {content.introTitleLine1}
          <br />
          {content.introTitleLine2}
          <br />
          <em>{content.introTitleEmphasis}</em>
        </h2>
        <div className="editorial-intro__copy">
          <p>{content.introBodyOne}</p>
          <p>{content.introBodyTwo}</p>
          <ArrowLink href={content.introCtaHref}>{content.introCtaLabel}</ArrowLink>
        </div>
      </section>
      <div className="editorial-image-row">
        <div
          className="editorial-image"
          style={{ backgroundImage: `url("${content.imageLarge}")` }}
        />
        <div
          className="editorial-image editorial-image--small"
          style={{ backgroundImage: `url("${content.imageSmall}")` }}
        />
      </div>
      <section className="timeline">
        <div className="timeline-head">
          <span className="eyebrow">{content.timelineEyebrow}</span>
          <h2>
            {content.timelineTitleLine1}
            <br />
            <em>{content.timelineTitleEmphasis}</em>
          </h2>
        </div>
        {content.timeline.map((item) => (
          <div className="timeline-row" key={item.year}>
            <div className="timeline-year">{item.year}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </section>
      <section className="quote-section">
        <div className="quote-mark">“</div>
        <div className="quote-copy">
          <blockquote>{content.quote}</blockquote>
          <div className="quote-by">
            <strong>{content.quoteName}</strong>
            <span>{content.quoteRole}</span>
          </div>
        </div>
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
