import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanPrivacyContent } from "./schema";

export function NathanPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<NathanPrivacyContent, NathanSettings>) {
  return (
    <NathanChrome site={site} settings={settings}>
      <section className="legal-page section-pad page-top">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        {content.sections.map((section) => (
          <div key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </section>
    </NathanChrome>
  );
}
