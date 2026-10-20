import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpinePartnersContent } from "./schema";

export function NorthpinePartnersPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpinePartnersContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <p className="lead resource-intro">{content.intro}</p>
        <div className="partner-columns">
          {settings.catalog.partnerGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => (
                <article key={item.name}>
                  <b>{item.name}</b>
                  <span>{item.phone}</span>
                  <small>{item.note}</small>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
