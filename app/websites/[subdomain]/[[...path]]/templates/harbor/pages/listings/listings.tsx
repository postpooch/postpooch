import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { ListingArchive } from "../../components/listing-archive";
import type { HarborSettings } from "../../settings";

import type { HarborListingsContent } from "./schema";
import { toHarborListing } from "../../../property-adapters";

export function HarborListingsPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<HarborListingsContent, HarborSettings>) {
  return (
    <HarborChrome site={site} settings={settings}>
      <section className="archive-hero shell">
        <p className="kicker">{content.heroKicker}</p>
        <h1>
          {content.heroTitleLine1}
          <br />
          <em>{content.heroTitleItalic}</em>
        </h1>
        <p>{content.heroBody}</p>
      </section>
      <ListingArchive listings={properties.map(toHarborListing)} />
    </HarborChrome>
  );
}
