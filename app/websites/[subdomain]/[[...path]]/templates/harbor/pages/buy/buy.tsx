import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { ListingCard } from "../../components/listing-card";
import { PageHero } from "../../components/page-hero";
import { Process } from "../../components/process";
import { TestimonialStrip } from "../../components/testimonial-strip";
import type { HarborSettings } from "../../settings";

import type { HarborBuyContent } from "./schema";
import { toHarborListing } from "../../../property-adapters";

export function HarborBuyPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<HarborBuyContent, HarborSettings>) {
  const active = properties
    .filter((property) => !["sold", "rented", "off_market"].includes(property.status))
    .slice(0, 3)
    .map(toHarborListing);

  return (
    <HarborChrome site={site} settings={settings}>
      <PageHero
        kicker={content.heroKicker}
        title={content.heroTitle}
        italic={content.heroItalic}
        text={content.heroText}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
        cta={content.heroCta}
      />
      <Process
        title={content.processTitle}
        italic={content.processItalic}
        items={settings.catalog.processBuy}
      />
      <section className="editorial-section section-pad shell two-col-copy">
        <div>
          <p className="kicker">{content.localKicker}</p>
          <h2>
            {content.localTitleBefore} <em>{content.localTitleItalic}</em>
          </h2>
        </div>
        <div>
          <p>{content.localBody1}</p>
          <p>{content.localBody2}</p>
          <a className="text-link" href="/condo-guide">
            {content.localCta} <span>↗</span>
          </a>
        </div>
      </section>
      {active.length ? <section className="listings-section section-pad shell">
        <div className="section-head split">
          <div>
            <p className="kicker">{content.listingsKicker}</p>
            <h2>
              {content.listingsTitleBefore}{" "}
              <em>{content.listingsTitleItalic}</em>
            </h2>
          </div>
          <a href="/listings" className="text-link">
            {content.listingsCta}
          </a>
        </div>
        <div className="listing-grid">
          {active.map((l) => (
            <ListingCard listing={l} key={l.slug} />
          ))}
        </div>
      </section> : null}
      <TestimonialStrip testimonials={settings.catalog.testimonials} />
    </HarborChrome>
  );
}
