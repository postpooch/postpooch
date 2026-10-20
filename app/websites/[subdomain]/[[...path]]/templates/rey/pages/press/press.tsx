import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { PageHero } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyPressContent } from "./schema";

export function ReyPressPage({
  site,
  settings,
  content,
}: TemplatePageProps<ReyPressContent, ReySettings>) {
  return (
    <ReyChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} />
      <section className="press-list">
        {settings.catalog.press.map((item) => (
          <article className="press-item" key={item.title}>
            <div className="press-source">{item.source}</div>
            <h3>{item.title}</h3>
            <div className="press-year">{item.year}</div>
          </article>
        ))}
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
