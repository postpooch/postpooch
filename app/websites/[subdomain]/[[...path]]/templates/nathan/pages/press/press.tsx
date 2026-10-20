import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanPressContent } from "./schema";
import { toNathanProperty } from "../../../property-adapters";

export function NathanPressPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NathanPressContent, NathanSettings>) {
  const catalogProperties = properties.map(toNathanProperty);
  const featureImage =
    catalogProperties[content.featurePropertyIndex]?.image ??
    catalogProperties[0]?.image;

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="press-hero section-pad page-top">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
        </div>
        <p>{content.deck}</p>
      </section>
      <section className="press-feature">
        <div className="press-feature-image">
          <img src={featureImage} alt="Luxury penthouse overlooking New York" />
        </div>
        <div className="press-feature-copy">
          <p className="eyebrow">{content.featureEyebrow}</p>
          <h2>{content.featureTitle}</h2>
          <p>{content.featureBody}</p>
          <span>{content.featureMeta}</span>
        </div>
      </section>
      <section className="press-list section-pad">
        {settings.catalog.press.map((item, i) => (
          <article key={item.title}>
            <span>0{i + 1}</span>
            <strong>{item.outlet}</strong>
            <h3>{item.title}</h3>
            <time>{item.date}</time>
            <em>↗</em>
          </article>
        ))}
      </section>
      <section className="media-inquiry section-pad">
        <p className="eyebrow light-text">{content.mediaEyebrow}</p>
        <h2>{content.mediaTitle}</h2>
        <a className="pill light" href={content.mediaCtaHref}>
          {content.mediaCtaLabel} <span>↗</span>
        </a>
      </section>
    </NathanChrome>
  );
}
