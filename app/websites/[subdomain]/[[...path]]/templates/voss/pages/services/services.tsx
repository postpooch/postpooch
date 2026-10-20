import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossServicesContent } from "./schema";

export function VossServicesPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossServicesContent, VossSettings>) {
  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero services-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="page-hero__intro">{content.intro}</p>
        </section>
        <section className="services-list">
          {settings.catalog.services.map((s) => (
            <article key={s.n} className="service-row">
              <span>{s.n}</span>
              <h2>{s.title}</h2>
              <p>{s.copy}</p>
            </article>
          ))}
        </section>
        <section className="service-method section-pad">
          <div>
            <p className="eyebrow">{content.methodEyebrow}</p>
            <h2>
              {content.methodTitleLine1}
              <br />
              {content.methodTitleLine2}
              <br />
              <em>{content.methodTitleEmphasis}</em>
            </h2>
          </div>
          <div className="service-method__steps">
            {content.methodSteps.map((step) => (
              <div key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="service-links section-pad section-pad--topless">
          {content.links.map((link) => (
            <a key={link.href} href={link.href}>
              <span>{link.label}</span>
              <b>{link.cta}</b>
            </a>
          ))}
        </section>
      </main>
    </VossChrome>
  );
}
