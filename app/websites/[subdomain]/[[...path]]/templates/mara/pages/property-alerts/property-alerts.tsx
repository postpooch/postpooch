import type { TemplatePageProps } from "../../../types";
import { EditorialHero } from "../../components/editorial-hero";
import { MaraChrome } from "../../components/mara-chrome";
import { SearchBriefForm } from "../../components/search-brief-form";
import type { MaraSettings } from "../../settings";

import type { MaraPropertyAlertsContent } from "./schema";

export function MaraPropertyAlertsPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraPropertyAlertsContent, MaraSettings>) {
  return (
    <MaraChrome site={site} settings={settings}>
      <EditorialHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        copy={content.heroCopy}
        image={content.heroImage}
      />
      <section className="introSplit section">
        <p className="eyebrow">{content.introEyebrow}</p>
        <div>
          <h2>{content.introTitle}</h2>
          <p>{content.introBody}</p>
        </div>
      </section>
      <section className="formSection section">
        <p className="eyebrow">{content.formEyebrow}</p>
        <SearchBriefForm />
      </section>
    </MaraChrome>
  );
}
