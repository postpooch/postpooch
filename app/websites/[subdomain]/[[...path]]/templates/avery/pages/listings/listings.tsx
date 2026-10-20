import { isSaleListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAveryProperty } from "../../../property-adapters";
import { AveryChrome } from "../../components/avery-chrome";
import { AveryListingArchive } from "../../components/listing-archive";
import { PageHero } from "../../components/page-hero";
import { averyActiveProperties, averySoldProperties } from "../../listings";
import type { AverySettings } from "../../settings";

import type { AveryListingsContent } from "./schema";

export function AveryListingsPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AveryListingsContent, AverySettings>) {
  const items =
    content.filter === "sold"
      ? averySoldProperties(properties)
      : content.filter === "sale"
        ? properties.filter(isSaleListing).map(toAveryProperty)
        : averyActiveProperties(properties);
  const heroImage = content.heroImage || (content.filter === "sold" ? settings.catalog.images.city3 : undefined);

  return (
    <AveryChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        sub={content.heroSub}
        image={heroImage}
      />
      <section className="content-section shell light-listings">
        {content.noteTitle ? (
          <div className="section-title">
            <div>
              {content.noteKicker ? <p className="eyebrow">{content.noteKicker}</p> : null}
              <h2>{content.noteTitle}</h2>
            </div>
            {content.note ? <p>{content.note}</p> : null}
          </div>
        ) : null}
        <AveryListingArchive items={items} />
      </section>
    </AveryChrome>
  );
}
