import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneGuideContent } from "./schema";

export function SloaneGuidePage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneGuideContent, SloaneSettings>) {
  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="section-pad wide">
        <div className="resource-page-grid">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h1>{content.title}</h1>
          </div>
          <div className="copy">
            <p>{content.intro}</p>
            <div className="resource-steps">
              {content.steps.map((step) => (
                <div className="resource-step" key={step.num}>
                  <span>{step.num}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="guide-box">
              <div className="guide-title">{content.guideTitle}</div>
              <p>{content.guideBody}</p>
              <ContactForm compact title={content.formTitle} />
            </div>
          </div>
        </div>
      </section>
    </SloaneChrome>
  );
}
