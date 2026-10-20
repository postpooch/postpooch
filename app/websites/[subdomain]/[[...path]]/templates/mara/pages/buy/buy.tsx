import type { TemplatePageProps } from "../../../types";
import { MaraChrome } from "../../components/mara-chrome";
import { ServicePage } from "../../components/service-page";
import type { MaraSettings } from "../../settings";

import type { MaraBuyContent } from "./schema";

export function MaraBuyPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraBuyContent, MaraSettings>) {
  return (
    <MaraChrome site={site} settings={settings}>
      <ServicePage content={content} />
    </MaraChrome>
  );
}
