import type { TemplatePageProps } from "../../../types";
import { ListingFilter } from "../../components/listing-filter";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaAanbodContent } from "./schema";
import { toMilaProperty } from "../../../property-adapters";

export function MilaAanbodPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<MilaAanbodContent, MilaSettings>) {
  return (
    <MilaChrome site={site} settings={settings}>
      <section className="page-title shell compact-title">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>
          {content.titleLine1}
          <br />
          <em>{content.titleEmphasis}</em>
        </h1>
        <p className="lead">{content.lead}</p>
      </section>
      <section className="shell section listings-section">
        <ListingFilter properties={properties.map(toMilaProperty)} />
      </section>
    </MilaChrome>
  );
}
