import type { TemplatePageProps } from "../../../types";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweAboutContent } from "./schema";

export function RoweAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<RoweAboutContent, RoweSettings>) {
  return (
    <RoweChrome site={site} settings={settings}>
      <section className="about-hero">
        <div>
          <div className="page-hero-label">{content.label}</div>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
        </div>
        <div className="about-hero-image">
          <img src={content.heroImage} alt={content.heroImageAlt} />
        </div>
      </section>
      <section className="about-story section-pad">
        <div className="section-label">{content.storyLabel}</div>
        <div>
          <h2>{content.storyTitle}</h2>
          <p>{content.storyBody1}</p>
          <p>{content.storyBody2}</p>
          <div className="about-values">
            {content.values.map((value) => (
              <div key={value.number}>
                <span>{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </div>
            ))}
          </div>
          <a className="text-arrow" href={content.ctaHref}>
            {content.ctaLabel} <span>↗</span>
          </a>
        </div>
      </section>
    </RoweChrome>
  );
}
