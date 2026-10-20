import type { TemplatePageProps } from "../../../types";
import { toAtelierProperty } from "../../../property-adapters";
import { AtelierChrome } from "../../components/atelier-chrome";
import {
  ContactBand,
  PageHero,
  PropertyGrid,
  Stats,
} from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierAboutContent } from "./schema";

export function AtelierAboutPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AtelierAboutContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="splitEditorial shell">
        <div>
          <p className="kicker">{content.splitEyebrow}</p>
          <h2>{content.splitTitle}</h2>
        </div>
        <div className="prose">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section
        className="fullBleedImage"
        style={{ backgroundImage: `url("${content.bleedImage}")` }}
      >
        <div className="imageCaption">{content.bleedCaption}</div>
      </section>
      <Stats stats={settings.stats} />
      <section className="quoteSection shell">
        <blockquote>“{content.quote}”</blockquote>
        <span>— {settings.agent.name}</span>
      </section>
      <ContactBand />
      {properties.length ? (
      <section className="section shell">
        <div className="sectionHeading">
          <p className="kicker">{content.featuredEyebrow}</p>
          <h2>{content.featuredTitle}</h2>
        </div>
        <PropertyGrid items={properties.map(toAtelierProperty).slice(0, 3)} />
        <div className="centerAction">
          <a href="/properties" className="outlineButton">
            {content.featuredCta}
          </a>
        </div>
      </section>
      ) : null}
    </AtelierChrome>
  );
}
