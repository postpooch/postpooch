import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpinePublicServicesContent } from "./schema";

export function NorthpinePublicServicesPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpinePublicServicesContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container">
        <div className="resource-grid">
          {settings.catalog.publicServices.map((service) => (
            <article key={service.title}>
              <h3>{service.title}</h3>
              {service.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </NorthpineInnerPage>
  );
}
