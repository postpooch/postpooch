import type { TemplatePageProps } from "../../../types";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraPrivacyContent } from "./schema";

export function MaraPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraPrivacyContent, MaraSettings>) {
  return (
    <MaraChrome site={site} settings={settings}>
      <section className="section privacy">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <h2>{content.checklistTitle}</h2>
        <ul>
          {content.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </MaraChrome>
  );
}
