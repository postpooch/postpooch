import type { TemplatePageProps } from "../../../types";
import { AveryChrome } from "../../components/avery-chrome";
import { PageHero } from "../../components/page-hero";
import type { AverySettings } from "../../settings";

import type { AveryResourcesContent } from "./schema";

export function AveryResourcesPage({
  site,
  settings,
  content,
}: TemplatePageProps<AveryResourcesContent, AverySettings>) {
  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero kicker={content.heroKicker} title={content.heroTitle} sub={content.heroSub} />
      <section className="content-section shell">
        <div className="resource-grid">
          {settings.catalog.resources.map((item) => (
            <div className="resource-card" key={item.title}>
              <div>
                <p className="eyebrow">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <span className="text-link">
                {content.openLabel} <b>↗</b>
              </span>
            </div>
          ))}
        </div>
      </section>
    </AveryChrome>
  );
}
