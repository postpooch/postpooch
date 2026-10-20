import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierPressContent } from "./schema";

export function AtelierPressPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierPressContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="pressLogos shell">
        {settings.catalog.pressLogos.map((logo) => (
          <div key={logo}>{logo}</div>
        ))}
      </section>
      <section className="pressList shell">
        {settings.catalog.press.map((item) => (
          <article key={`${item.year}-${item.title}`}>
            <span>{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.publication}</p>
          </article>
        ))}
      </section>
    </AtelierChrome>
  );
}
