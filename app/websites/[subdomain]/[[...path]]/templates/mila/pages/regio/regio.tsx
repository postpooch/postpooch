import { propertiesInPlace } from "@/lib/websites/property";
import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { AreaDetail } from "../../components/area-detail";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaRegioContent } from "./schema";
import { toMilaProperty } from "../../../property-adapters";

export function MilaRegioPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<MilaRegioContent, MilaSettings>) {
  const area = settings.catalog.areas.find((item) => item.slug === params.slug);
  if (!area) notFound();

  return (
    <MilaChrome site={site} settings={settings}>
      <AreaDetail
        area={area}
        properties={propertiesInPlace(properties, area.city).map(toMilaProperty)}
        content={content}
      />
    </MilaChrome>
  );
}
