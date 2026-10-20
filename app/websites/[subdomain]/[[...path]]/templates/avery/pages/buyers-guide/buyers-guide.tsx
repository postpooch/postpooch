import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryBuyersGuideContent } from "./schema";

export function AveryBuyersGuidePage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryBuyersGuideContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        sub={content.heroSub}
        image={content.heroImage}
      />
      <section className="content-section shell">
        <div className="section-title">
          <div>
            <p className="eyebrow">{content.processKicker}</p>
            <h2>{content.processTitle}</h2>
          </div>
          <p>{content.processNote}</p>
        </div>
        <div className="guide-steps">
          {settings.catalog.buyerSteps.map((step, index) => (
            <div className="guide-step" key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
