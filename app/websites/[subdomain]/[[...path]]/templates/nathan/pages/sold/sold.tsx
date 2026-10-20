import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanSoldContent } from "./schema";
import { formatPropertyPrice, propertyTitle } from "@/lib/websites/property";

export function NathanSoldPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<NathanSoldContent, NathanSettings>) {
  const sold = properties.filter(isSoldListing);
  const ledger = sold.map((property) => ({
      price: formatPropertyPrice(property),
      label: propertyTitle(property),
      year: property.yearBuilt ? String(property.yearBuilt) : "",
      image: property.images[0] ?? "",
    }));
  const featuredSold = sold[0];

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="results-hero section-pad page-top">
        <p className="eyebrow light-text">{content.eyebrow}</p>
        <h1>
          {content.titleLine1}
          <br />
          <span>{content.titleEmphasis}</span>
        </h1>
        <p>{content.deck}</p>
      </section>
      {featuredSold ? (
      <section className="case-study section-pad">
        <div className="case-label">
          <span>{content.caseLabel}</span>
          <p>{propertyTitle(featuredSold)}</p>
        </div>
        <div className="case-number">{formatPropertyPrice(featuredSold)}</div>
        <div className="case-copy">
          <h2>{propertyTitle(featuredSold)}</h2>
          <p>{featuredSold.description || content.caseBody}</p>
        </div>
      </section>
      ) : null}
      <section className="sales-ledger section-pad">
        <p className="eyebrow">{content.ledgerEyebrow}</p>
        {ledger.map((item, i) => (
          <div className="ledger-row" key={`${item.label}-${item.year}`}>
            <span>0{i + 1}</span>
            <strong>{item.price}</strong>
            <p>{item.label}</p>
            <em>{item.year}</em>
          </div>
        ))}
      </section>
      <section className="testimonial-dark section-pad">
        <blockquote>{content.testimonialQuote}</blockquote>
        <p>{content.testimonialAttribution}</p>
        <a className="pill light" href={content.ctaHref}>
          {content.ctaLabel} <span>↗</span>
        </a>
      </section>
    </NathanChrome>
  );
}
