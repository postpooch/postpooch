import type { TemplatePageProps } from "../../../types";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import type { AureliaSettings } from "../../settings";

import type { AureliaAllianceContent } from "./schema";

export function AureliaAlliancePage({
  site,
  settings,
  content,
}: TemplatePageProps<AureliaAllianceContent, AureliaSettings>) {
  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="section-pad section-space content-two-col">
        <div>
          <p className="eyebrow-line">{content.noteKicker}</p>
        </div>
        <div className="prose">
          <p className="prose-large">{content.lead}</p>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="network-band section-pad section-space">
        <p className="kicker light">{content.citiesKicker}</p>
        <div className="network-cities">
          {settings.catalog.networkCities.map((city, index) => (
            <div key={city}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{city}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="section-pad section-space">
        <div className="section-head">
          <div>
            <p className="kicker">{content.closeKicker}</p>
            <h2 className="section-title">{content.closeTitle}</h2>
          </div>
          <a href="/contact" className="circle-link">
            <span>{content.closeCtaLabel}</span>
            <span>↗</span>
          </a>
        </div>
      </section>
    </AureliaChrome>
  );
}
