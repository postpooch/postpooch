import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { firstStep, StepPage } from "../../components/step-page";
import type { CoastalSettings } from "../../settings";

import type { CoastalGuideContent } from "../buy/schema";

export function CoastalSellPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<CoastalGuideContent, CoastalSettings>) {
  const data = firstStep(settings.catalog.sellerSteps, params.slug);
  if (!data) notFound();

  return (
    <CoastalChrome site={site} settings={settings}>
      <StepPage
        section="Selling"
        base="sell"
        steps={settings.catalog.sellerSteps}
        current={data.slug}
        image={content.heroImage}
        processTitle={content.processTitle}
        processBody={content.processBody}
        quote={content.quote}
        focusTitle={content.focusTitle}
        focusItems={content.focusItems}
      />
    </CoastalChrome>
  );
}
