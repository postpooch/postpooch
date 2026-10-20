import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { PageHero } from "../../components/page-hero";
import type { HarborSettings } from "../../settings";

import type { HarborMarketingContent } from "./schema";

export function HarborMarketingPage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborMarketingContent, HarborSettings>) {
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
      <section className="process section-pad shell">
        <div className="section-head split">
          <div>
            <p className="kicker">{content.campaignKicker}</p>
            <h2>
              {content.campaignTitleLine1}
              <br />
              <em>{content.campaignTitleItalic}</em>
            </h2>
          </div>
          <p>{content.campaignIntro}</p>
        </div>
        <div className="process-list">
          {content.pillars.map((pillar) => (
            <article key={pillar.n}>
              <span>{pillar.n}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="visual-grid section-pad">
        <img
          className="wide"
          src={content.visualWide}
          alt={content.visualWideAlt}
        />
        <img src={content.visualSide} alt={content.visualSideAlt} />
        <div className="visual-quote dark-panel">
          <span>{content.visualQuoteLabel}</span>
          <h2>
            {content.visualQuoteTitleBefore}{" "}
            <em>{content.visualQuoteTitleItalic}</em>
          </h2>
          <p>{content.visualQuoteBody}</p>
        </div>
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
