import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineSitemapContent } from "./schema";

export function NorthpineSitemapPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineSitemapContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <div className="resource-grid">
          {settings.catalog.sitemapGroups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <p key={link.href}>
                  <a href={link.href}>{link.label} →</a>
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
