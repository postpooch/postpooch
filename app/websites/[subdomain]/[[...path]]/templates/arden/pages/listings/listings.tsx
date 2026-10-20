import {
  isLeaseListing,
  isSaleListing,
  isSoldListing,
  worldwideListings,
} from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { images } from "../../catalog-defaults";
import { ArdenChrome } from "../../components/arden-chrome";
import { Hero, PageIntro, PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenProperty, ArdenSettings } from "../../settings";

import type { ArdenListingsContent } from "./schema";

function ListingFrame({
  site,
  settings,
  content,
  items,
  withHero = false,
}: TemplatePageProps<ArdenListingsContent, ArdenSettings> & {
  items: ArdenProperty[];
  withHero?: boolean;
}) {
  return (
    <ArdenChrome site={site} settings={settings}>
      {withHero ? (
        <Hero
          height="medium"
          image={images.modern}
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.intro}
        />
      ) : (
        <PageIntro eyebrow={content.eyebrow} title={content.title} copy={content.intro} />
      )}
      <section className="section" style={withHero ? undefined : { paddingTop: 20 }}>
        {withHero ? (
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
        ) : null}
        {items.length ? (
          <PropertyGrid items={items} />
        ) : (
          <div className="emptyState">{content.empty ?? "No properties to display."}</div>
        )}
      </section>
      {content.noteTitle ? (
        <section className="section">
          <SectionHeading
            center
            eyebrow={content.noteEyebrow}
            title={content.noteTitle}
            copy={content.noteCopy}
          />
        </section>
      ) : null}
    </ArdenChrome>
  );
}

export function ArdenSalePage(props: TemplatePageProps<ArdenListingsContent, ArdenSettings>) {
  const items = props.properties.filter(isSaleListing).map(toArdenProperty);
  return <ListingFrame {...props} items={items} />;
}

export function ArdenSoldPage(props: TemplatePageProps<ArdenListingsContent, ArdenSettings>) {
  const items = props.properties.filter(isSoldListing).map(toArdenProperty);
  return <ListingFrame {...props} items={items} />;
}

export function ArdenLeasePage(props: TemplatePageProps<ArdenListingsContent, ArdenSettings>) {
  const items = props.properties.filter(isLeaseListing).map(toArdenProperty);
  return <ListingFrame {...props} items={items} />;
}

export function ArdenWorldwidePage(props: TemplatePageProps<ArdenListingsContent, ArdenSettings>) {
  return (
    <ListingFrame
      {...props}
      items={worldwideListings(props.properties).map(toArdenProperty)}
      withHero
    />
  );
}
