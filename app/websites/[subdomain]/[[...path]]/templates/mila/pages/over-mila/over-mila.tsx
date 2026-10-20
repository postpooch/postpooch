import type { TemplatePageProps } from "../../../types";
import { ArrowUpRight, QuoteIcon } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaOverMilaContent } from "./schema";

export function MilaOverMilaPage({
  site,
  settings,
  content,
}: TemplatePageProps<MilaOverMilaContent, MilaSettings>) {
  const { agent } = settings;

  return (
    <MilaChrome site={site} settings={settings}>
      <section className="about-hero shell">
        <div className="about-copy">
          <span className="eyebrow">{content.heroEyebrow}</span>
          <h1>
            {content.heroTitleLine1}
            <br />
            <em>{content.heroTitleEmphasis}</em>
          </h1>
          <p className="lead">{content.heroLead}</p>
        </div>
        <div className="about-photo">
          <img src={agent.portrait} alt={`Demo portrait of ${agent.name}`} />
          <div className="photo-note">
            <strong>{agent.experience} years</strong>
            <span>{content.photoNoteSuffix}</span>
          </div>
        </div>
      </section>
      <section className="about-story section shell">
        <div>
          <span className="eyebrow">{content.storyEyebrow}</span>
        </div>
        <div>
          <h2>{content.storyTitle}</h2>
          {content.storyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="values-band section">
        <div className="shell values-grid">
          {content.values.map((value) => (
            <div key={value.number}>
              <span>{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-quote section shell">
        <QuoteIcon />
        <blockquote>{content.quote}</blockquote>
        <div>
          <strong>{agent.name}</strong>
          <span>{agent.role}</span>
        </div>
      </section>
      <section className="about-cta shell section">
        <div>
          <span className="eyebrow">{content.ctaEyebrow}</span>
          <h2>{content.ctaTitle}</h2>
        </div>
        <a href="/contact" className="button button-dark">
          {content.ctaLabel} <ArrowUpRight />
        </a>
      </section>
    </MilaChrome>
  );
}
