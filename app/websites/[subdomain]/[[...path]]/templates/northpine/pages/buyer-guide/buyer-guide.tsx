import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { firstGuide, GuideView } from "../../components/guide-view";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineGuideContent } from "../seller-guide/schema";

export function NorthpineBuyerGuidePage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<NorthpineGuideContent, NorthpineSettings>) {
  const data = firstGuide(settings.catalog.buyerGuides, params.slug);
  if (!data) notFound();

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={data.title}
      subtitle={data.intro}
      image={settings.images.cabin}
      current={data.title}
    >
      <GuideView
        path={`buyers/${data.slug}`}
        base="/buyers"
        steps={settings.catalog.buyerGuides}
        data={data}
        calloutTitle={content.calloutTitle}
        calloutBody={content.calloutBody}
        calloutLabel={content.calloutLabel}
        calloutHref={content.calloutHref}
      />
    </NorthpineInnerPage>
  );
}
