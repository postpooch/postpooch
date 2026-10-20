import type { TemplatePageProps } from "../../../types";
import { LuxuryChrome } from "../../components/luxury-chrome";
import type { LuxurySettings } from "../../settings";

import type { LuxuryPrivacyContent } from "./schema";

export function LuxuryPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryPrivacyContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <article className="legal-page section-pad">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>
          <strong>Template notice:</strong> {content.notice}
        </p>
        <h2>{content.collectedHeading}</h2>
        <p>{content.collectedText}</p>
        <h2>{content.usedHeading}</h2>
        <p>{content.usedText}</p>
        <h2>{content.contactHeading}</h2>
        <p>Questions may be directed to {settings.realtor.email}.</p>
      </article>
    </LuxuryChrome>
  );
}
