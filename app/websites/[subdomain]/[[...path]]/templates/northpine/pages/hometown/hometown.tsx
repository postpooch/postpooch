import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineHometownContent } from "./schema";

export function NorthpineHometownPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineHometownContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container article">
        <p className="lead">{content.lead}</p>
        <p>{content.bodyOne}</p>
        <p>{content.bodyTwo}</p>
        <div className="article-image">
          <img src={settings.images.lake} alt="Lake and mountains" />
        </div>
        <h2>{content.sectionTitle}</h2>
        <p>{content.sectionBody}</p>
      </section>
    </NorthpineInnerPage>
  );
}
