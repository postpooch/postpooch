import type { TemplatePageProps } from "../../../types";
import { LeadForm } from "../../components/forms";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import { SectionHeading } from "../../components/ui";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineLeadContent } from "./schema";

export function NorthpineLeadPage({
  site,
  settings,
  content,
  kind,
}: TemplatePageProps<NorthpineLeadContent, NorthpineSettings> & {
  kind: "worth" | "dream" | "relocate";
}) {
  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      image={content.heroImage}
    >
      <section className="section-pad container wide">
        <div className="lead-page">
          <div>
            <SectionHeading kicker={content.kicker} title={content.title} />
            <p className="lead">{content.lead}</p>
            <p>{content.body}</p>
          </div>
          <LeadForm kind={kind} title={content.formTitle} />
        </div>
      </section>
    </NorthpineInnerPage>
  );
}

export function NorthpineHomeWorthPage(
  props: TemplatePageProps<NorthpineLeadContent, NorthpineSettings>,
) {
  return <NorthpineLeadPage {...props} kind="worth" />;
}
