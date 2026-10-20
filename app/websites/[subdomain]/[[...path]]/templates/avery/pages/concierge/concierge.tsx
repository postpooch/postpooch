import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryConciergeContent } from "./schema";

export function AveryConciergePage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryConciergeContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        sub={content.heroSub}
        image={content.heroImage}
      />
      <section className="service-hero">
        <div className="shell two-col">
          <div>
            <p className="eyebrow">{content.leadKicker}</p>
            <h2>{content.leadTitle}</h2>
          </div>
          <div className="prose">
            {content.leadBody.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <a href="/contact" className="button dark-button">
              {content.ctaLabel} <span>↗</span>
            </a>
          </div>
        </div>
      </section>
      <section className="content-section shell">
        <p className="eyebrow">{content.stepsKicker}</p>
        <div className="service-steps">
          {settings.catalog.conciergeSteps.map((step) => (
            <div className="service-step" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
