import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { MilaChrome } from "../../components/mila-chrome";
import { ServiceDetail } from "../../components/service-detail";
import type { MilaSettings } from "../../settings";

import type { MilaDienstContent } from "./schema";

export function MilaDienstPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<MilaDienstContent, MilaSettings>) {
  const service = settings.catalog.services.find((item) => item.slug === params.slug);
  if (!service) notFound();

  return (
    <MilaChrome site={site} settings={settings}>
      <ServiceDetail
        service={service}
        agent={settings.agent}
        content={content}
      />
    </MilaChrome>
  );
}
