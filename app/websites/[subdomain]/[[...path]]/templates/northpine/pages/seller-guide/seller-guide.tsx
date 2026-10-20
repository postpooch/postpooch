import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { firstGuide, GuideView } from "../../components/guide-view";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineGuideContent } from "./schema";

export function NorthpineSellerGuidePage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<NorthpineGuideContent, NorthpineSettings>) {
  const data = firstGuide(settings.catalog.sellerGuides, params.slug);
  if (!data) notFound();

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={data.title}
      subtitle={data.intro}
      image={settings.images.interior}
      current={data.title}
    >
      <GuideView
        path={`sellers/${data.slug}`}
        base="/sellers"
        steps={settings.catalog.sellerGuides}
        data={data}
        calloutTitle={content.calloutTitle}
        calloutBody={content.calloutBody}
        calloutLabel={content.calloutLabel}
        calloutHref={content.calloutHref}
      />
    </NorthpineInnerPage>
  );
}
