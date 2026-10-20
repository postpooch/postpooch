import type { TemplatePageProps } from "../../../types";
import { Reveal } from "../../components/reveal";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValeAboutContent } from "./schema";

export function ValeAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<ValeAboutContent, ValeSettings>) {
  return (
    <ValeChrome site={site} settings={settings}>
      <div className="about-page">
        <section className="about-hero page-pad">
          <div className="about-title">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>
              {content.titleLine1}
              <br />
              <em>{content.titleEmphasis}</em>
              <br />
              {content.titleLine3}
            </h1>
          </div>
          <div className="about-image">
            <img
              src={content.heroImage}
              alt="Real estate advisor in a bright workspace"
            />
          </div>
        </section>

        <section className="about-story page-pad">
          <Reveal>
            <p className="eyebrow">{content.storyEyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2>{content.storyTitle}</h2>
          </Reveal>
          <div className="story-columns">
            {content.storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="quote-band">
          <p>{content.quote}</p>
        </section>

        <section className="about-values page-pad">
          <div>
            <p className="eyebrow">{content.valuesEyebrow}</p>
            <h2>
              {content.valuesTitleLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < content.valuesTitleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          </div>
          <div className="values-list">
            {content.values.map((value, index) => (
              <p key={value}>
                <span>0{index + 1}</span>
                {value}
              </p>
            ))}
          </div>
        </section>

        <section className="markets page-pad">
          <p className="eyebrow">{content.marketsEyebrow}</p>
          <h2>{content.marketsTitle}</h2>
          <a href="/contact" className="text-link">
            {content.marketsCtaLabel} <span>↗</span>
          </a>
        </section>
      </div>
    </ValeChrome>
  );
}
