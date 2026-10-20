import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { ListingCard } from "../../components/listing-card";
import { PageHero } from "../../components/page-hero";
import { Process } from "../../components/process";
import { TestimonialStrip } from "../../components/testimonial-strip";
import type { HarborSettings } from "../../settings";

import type { HarborSellContent } from "./schema";
import { toHarborListing } from "../../../property-adapters";

export function HarborSellPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<HarborSellContent, HarborSettings>) {
  const sold = properties
    .filter((property) => ["sold", "rented"].includes(property.status))
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
        items={settings.catalog.processSell}
      />
      <section className="feature-split reverse">
        <div className="feature-image">
          <img
            src={content.presentationImage}
            alt={content.presentationImageAlt}
          />
        </div>
        <div className="feature-copy dark-panel">
          <p className="kicker muted">{content.presentationKicker}</p>
          <h2>
            {content.presentationTitleBefore}{" "}
            <em>{content.presentationTitleItalic}</em>
          </h2>
          <p>{content.presentationBody}</p>
          <a className="button button-light" href="/marketing">
            {content.presentationCta} <span>↗</span>
          </a>
        </div>
      </section>
      {sold.length ? <section className="listings-section section-pad shell">
        <div className="section-head split">
          <div>
            <p className="kicker">{content.salesKicker}</p>
            <h2>
              {content.salesTitleBefore} <em>{content.salesTitleItalic}</em>
            </h2>
          </div>
          <a href="/listings" className="text-link">
            {content.salesCta}
          </a>
        </div>
        <div className="listing-grid">
          {sold.map((l) => (
            <ListingCard listing={l} key={l.slug} />
          ))}
        </div>
      </section> : null}
      <TestimonialStrip testimonials={settings.catalog.testimonials} />
      <section className="soft-cta section-pad shell">
        <div>
          <p className="kicker">{content.softKicker}</p>
          <h2>
            {content.softTitleBefore} <em>{content.softTitleItalic}</em>
          </h2>
        </div>
        <div>
          <p>{content.softBody}</p>
          <a className="button button-dark" href="/home-value">
            {content.softCta}
          </a>
        </div>
      </section>
    </HarborChrome>
  );
}
