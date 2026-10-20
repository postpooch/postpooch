import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanAboutContent } from "./schema";
import { toNathanProperty } from "../../../property-adapters";

export function NathanAboutPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NathanAboutContent, NathanSettings>) {
  const { agent } = settings;
  const catalogProperties = properties.map(toNathanProperty);
  const leftImage =
    catalogProperties[content.pairImageLeftIndex]?.image ??
    catalogProperties[0]?.image;
  const rightImage =
    catalogProperties[content.pairImageRightIndex]?.image ??
    catalogProperties[1]?.image;

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="page-hero about-hero section-pad">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>
          {content.titleLine1}
          <br />
          <span>{content.titleEmphasis}</span>
        </h1>
        <div className="about-hero-grid">
          <p className="big-lede">{content.bigLede}</p>
          <p>{content.heroAside}</p>
        </div>
      </section>
      <section className="about-portrait">
        <img src={content.portraitImage} alt={`${agent.fullName}, luxury real estate advisor`} />
        <div className="about-portrait-label">{content.portraitLabel}</div>
      </section>
      <section className="about-story section-pad">
        <div className="section-index">{content.storyIndex}</div>
        <h2>
          {content.storyTitleLine1}
          <br />
          {content.storyTitleLine2}
        </h2>
        <div className="story-columns">
          {content.storyColumns.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="principles section-pad">
        <p className="eyebrow">{content.principlesEyebrow}</p>
        <div className="principle-grid">
          {content.principles.map((principle) => (
            <article key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>
      {leftImage || rightImage ? (
      <section className="about-image-pair section-pad">
        {leftImage ? (
        <div>
          <img src={leftImage} alt="" />
        </div>
        ) : null}
        {rightImage ? (
        <div>
          <img src={rightImage} alt="" />
        </div>
        ) : null}
      </section>
      ) : null}
      <section className="credentials section-pad">
        <p className="eyebrow">{content.credentialsEyebrow}</p>
        <div className="credentials-grid">
          {content.credentials.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
          {content.includeEmailCredential && (
            <div>
              <strong>{agent.email}</strong>
              <span>Direct inquiries</span>
            </div>
          )}
        </div>
        <a className="pill dark" href={content.ctaHref}>
          {content.ctaLabel} <span>↗</span>
        </a>
      </section>
    </NathanChrome>
  );
}
