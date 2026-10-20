import type { TemplatePageProps } from "../../../types";
import { MaraChrome } from "../../components/mara-chrome";
import { ServicePage } from "../../components/service-page";
import type { MaraSettings } from "../../settings";

import type { MaraSellContent } from "./schema";

export function MaraSellPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraSellContent, MaraSettings>) {
  return (
    <MaraChrome site={site} settings={settings}>
      <ServicePage content={content} />
    </MaraChrome>
  );
}
