import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossAboutContent } from "./schema";

export function VossAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossAboutContent, VossSettings>) {
  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="about-hero section-pad">
          <div className="about-hero__copy">
            <p className="eyebrow">{content.heroEyebrow}</p>
            <h1>
              {content.heroTitleLine1}
              <br />
              <em>{content.heroTitleEmphasis}</em>
            </h1>
            <p>{content.heroDeck}</p>
          </div>
          <div className="about-hero__portrait">
            <img
              src={content.portraitImage}
              alt="Real estate professional in a meeting"
            />
            <span>{content.portraitLabel}</span>
          </div>
        </section>
        <section className="about-story section-pad section-pad--topless">
          <div className="about-story__label">
            <p className="eyebrow">{content.approachEyebrow}</p>
          </div>
          <div className="about-story__body">
            <p className="lead-serif">{content.leadSerif}</p>
            <div className="two-col-copy">
              {content.storyColumns.map((column) => (
                <p key={column.slice(0, 40)}>{column}</p>
              ))}
            </div>
          </div>
        </section>
        <section className="about-values">
          {content.values.map((value) => (
            <div key={value.number}>
              <span>{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </div>
          ))}
        </section>
        <section className="press-strip section-pad">
          <p className="eyebrow">{content.pressEyebrow}</p>
          <div>
            {content.pressNames.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <p className="disclaimer">{content.pressDisclaimer}</p>
        </section>
        <section className="about-closing section-pad">
          <p className="eyebrow">{content.closingEyebrow}</p>
          <blockquote>{content.closingQuote}</blockquote>
          <a href={content.closingCtaHref} className="line-link">
            {content.closingCtaLabel} <span>↗</span>
          </a>
        </section>
      </main>
    </VossChrome>
  );
}
