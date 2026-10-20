import type { TemplatePageProps } from "../../../types";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaPrivacyContent } from "./schema";

export function MilaPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<MilaPrivacyContent, MilaSettings>) {
  return (
    <MilaChrome site={site} settings={settings}>
      <section className="legal shell">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="lead">{content.lead}</p>
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </section>
    </MilaChrome>
  );
}
