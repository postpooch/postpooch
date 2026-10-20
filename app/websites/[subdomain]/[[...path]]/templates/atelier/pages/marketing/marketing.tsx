import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero, Stats } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierMarketingContent } from "./schema";

export function AtelierMarketingPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierMarketingContent, AtelierSettings>) {
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
      <section className="pillarGrid shell">
        {content.pillars.map((pillar) => (
          <article key={pillar.number}>
            <span>{pillar.number}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>
      <Stats stats={settings.stats} />
      <section className="imagePair shell">
        <div style={{ backgroundImage: `url("${content.image1}")` }} />
        <div style={{ backgroundImage: `url("${content.image2}")` }} />
      </section>
    </AtelierChrome>
  );
}
