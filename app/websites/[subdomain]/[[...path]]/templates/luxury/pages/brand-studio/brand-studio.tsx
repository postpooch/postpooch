import type { TemplatePageProps } from "../../../types";
import { BrandStudio } from "../../components/brand-studio";
import { LuxuryChrome } from "../../components/luxury-chrome";
import type { LuxurySettings } from "../../settings";

import type { LuxuryBrandStudioContent } from "./schema";

export function LuxuryBrandStudioPage({
  site,
  settings,
}: TemplatePageProps<LuxuryBrandStudioContent, LuxurySettings>) {
  return (
    <LuxuryChrome site={site} settings={settings}>
      <BrandStudio
        initialName={settings.realtor.name}
        initialTitle={settings.realtor.title}
        initialMarket={settings.realtor.market}
        initialInk={settings.brand.colors.ink}
        initialPaper={settings.brand.colors.paper}
        initialAccent={settings.brand.colors.accent}
        initialDisplay={settings.brand.typography.display}
        heroImage={settings.hero.image}
      />
    </LuxuryChrome>
  );
}
