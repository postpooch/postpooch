import type { TemplatePageProps } from "../../../types";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PageHero } from "../../components/page-hero";
import { ValuationForm } from "../../components/valuation-form";
import type { CoastalSettings } from "../../settings";

import type { CoastalValuationContent } from "./schema";

export function CoastalValuationPage({
  site,
  settings,
  content,
}: TemplatePageProps<CoastalValuationContent, CoastalSettings>) {
  return (
    <CoastalChrome site={site} settings={settings}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} image={content.heroImage}>
        <p>{content.heroBody}</p>
      </PageHero>
      <ValuationForm
        continueLabel={content.continueLabel}
        submitLabel={content.submitLabel}
      />
    </CoastalChrome>
  );
}
