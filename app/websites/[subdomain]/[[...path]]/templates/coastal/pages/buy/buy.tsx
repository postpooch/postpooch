import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { firstStep, StepPage } from "../../components/step-page";
import type { CoastalSettings } from "../../settings";

import type { CoastalGuideContent } from "./schema";

export function CoastalBuyPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<CoastalGuideContent, CoastalSettings>) {
  const data = firstStep(settings.catalog.buyerSteps, params.slug);
  if (!data) notFound();

  return (
    <CoastalChrome site={site} settings={settings}>
      <StepPage
        section="Buying"
        base="buy"
        steps={settings.catalog.buyerSteps}
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
