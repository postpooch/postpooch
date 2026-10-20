import type { TemplatePageProps } from "../../../types";
import { Checklist } from "../../components/forms";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineMovingContent } from "./schema";

export function NorthpineMovingPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineMovingContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <Checklist sections={settings.catalog.movingSections} />
    </NorthpineInnerPage>
  );
}
