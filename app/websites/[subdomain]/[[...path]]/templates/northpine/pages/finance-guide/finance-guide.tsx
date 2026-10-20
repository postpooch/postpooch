import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { firstGuide, GuideView } from "../../components/guide-view";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineGuideContent } from "../seller-guide/schema";

export function NorthpineFinanceGuidePage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<NorthpineGuideContent, NorthpineSettings>) {
  const data = firstGuide(settings.catalog.financeGuides, params.slug);
  if (!data) notFound();

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={data.title}
      subtitle={data.intro}
      image={settings.images.downtown}
      current={data.title}
    >
      <GuideView
        path={`financing-options/${data.slug}`}
        base="/financing-options"
        steps={settings.catalog.financeGuides}
        data={data}
        calloutTitle={content.calloutTitle}
        calloutBody={content.calloutBody}
        calloutLabel={content.calloutLabel}
        calloutHref={content.calloutHref}
      />
    </NorthpineInnerPage>
  );
}
