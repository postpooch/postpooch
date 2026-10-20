import type { TemplatePageProps } from "../../../types";
import { LoginCard } from "../../components/forms";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineLoginContent } from "./schema";

export function NorthpineLoginPage({
  site,
  settings,
  content,
}: TemplatePageProps<NorthpineLoginContent, NorthpineSettings>) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container">
        <LoginCard />
      </section>
    </NorthpineInnerPage>
  );
}
