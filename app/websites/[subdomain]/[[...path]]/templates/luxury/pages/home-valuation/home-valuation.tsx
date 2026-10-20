import type { TemplatePageProps } from "../../../types";
import { ValuationForm } from "../../components/forms";
import { LuxuryChrome } from "../../components/luxury-chrome";
import type { LuxurySettings } from "../../settings";

import type { LuxuryValuationContent } from "./schema";

export function LuxuryValuationPage({
  site,
  settings,
  content,
}: TemplatePageProps<LuxuryValuationContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <section
        className="valuation-page image-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(8,14,12,.58), rgba(8,14,12,.58)), url(${content.backgroundImage})`,
        }}
      >
        <ValuationForm />
      </section>
    </LuxuryChrome>
  );
}
