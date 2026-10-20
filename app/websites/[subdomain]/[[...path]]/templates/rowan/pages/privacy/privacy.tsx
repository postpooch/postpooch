import type { TemplatePageProps } from "../../../types";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanPrivacyContent } from "./schema";

export function RowanPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<RowanPrivacyContent, RowanSettings>) {
  const { agent } = settings;

  return (
    <RowanChrome site={site} settings={settings} darkHeader>
      <section className="legal-hero">
        <div className="shell">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.updatedNote}</p>
        </div>
      </section>
      <section className="legal-content section-pad">
        <div className="shell legal-content__inner">
          <aside>
            <p>{content.aside}</p>
            <a className="text-link" href={`mailto:${agent.email}`}>
              Contact {agent.name} ↗
            </a>
          </aside>
          <article>
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </article>
        </div>
      </section>
    </RowanChrome>
  );
}
