import type { MilaDienstContent } from "../pages/dienst/schema";
import type { MilaService, MilaSettings } from "../settings";

import { ArrowRight, ArrowUpRight } from "./icons";

type ServiceDetailProps = {
  service: MilaService;
  agent: MilaSettings["agent"];
  content: MilaDienstContent;
};

export function ServiceDetail({ service, agent, content }: ServiceDetailProps) {
  return (
    <>
      <section className="inner-hero shell">
        <div className="inner-hero-copy">
          <span className="eyebrow">{service.eyebrow}</span>
          <h1>{service.title}</h1>
          <p className="lead">{service.intro}</p>
          <div className="hero-actions">
            <a href="/contact" className="button button-dark">
              {content.ctaLabel} <ArrowUpRight />
            </a>
            <a href={`tel:${agent.phoneHref}`} className="text-link">
              {content.callPrefix} {agent.phoneDisplay} <ArrowRight />
            </a>
          </div>
        </div>
        <div className="inner-hero-image">
          <img src={service.image} alt="Home interior" />
          <span className="image-index">{service.number}</span>
        </div>
      </section>
      <section className="process-section section shell">
        <div className="section-intro">
          <span className="eyebrow">{content.processEyebrow}</span>
          <h2>{content.processTitle}</h2>
          <p>{content.processIntro}</p>
        </div>
        <div className="process-list">
          {service.steps.map((step, i) => (
            <article className="process-row" key={step[0]}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{step[0]}</h3>
              <p>{step[1]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="split-quote section">
        <div className="shell split-quote-grid">
          <div>
            <span className="eyebrow light">{content.quoteEyebrow}</span>
            <h2>{content.quoteTitle}</h2>
          </div>
          <div>
            <p>{content.quoteBody}</p>
            <a href={content.quoteCtaHref} className="button button-light">
              {content.quoteCtaLabel} <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
