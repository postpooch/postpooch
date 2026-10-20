import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import type { CoastalSettings } from "../../settings";

import type { CoastalPrivacyContent } from "./schema";

export function CoastalPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalPrivacyContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} />
      <article className="articlePage">
        <p>{content.intro}</p>
        <h2>{content.noteTitle}</h2>
        <p>{content.noteBody}</p>
      </article>
    </CoastalChrome>
  );
}
