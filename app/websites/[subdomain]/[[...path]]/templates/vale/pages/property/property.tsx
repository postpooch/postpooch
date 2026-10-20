import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { InquiryForm } from "../../components/inquiry-form";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValePropertyContent } from "./schema";
import { toValeProperty } from "../../../property-adapters";

export function ValePropertyPage({
  site,
  settings,
  content,
  params,
  properties: websiteProperties,
}: TemplatePageProps<ValePropertyContent, ValeSettings>) {
  const properties = websiteProperties.map(toValeProperty);
  const property = properties.find((item) => item.slug === params.slug);
  if (!property) notFound();

  const index = properties.findIndex((item) => item.slug === params.slug);
  const next = properties[(index + 1) % properties.length]!;
  const frames = property.gallery.length ? property.gallery : [property.image];
  const [hero, ...rest] = frames;

  return (
    <ValeChrome site={site} settings={settings}>
      <article className="property-detail">
        <header className="detail-hero">
          <img src={hero} alt={`${property.title} exterior`} />
          <div className="detail-overlay">
            <p>{property.status}</p>
            <h1>{property.title}</h1>
            <span>{property.location}</span>
          </div>
        </header>

        <section className="detail-summary page-pad">
          <div>
            <p className="eyebrow">{content.summaryEyebrow}</p>
            <h2>{property.intro}</h2>
          </div>
          <div className="facts">
            <p>
              <span>Price</span>
              {property.price}
            </p>
            <p>
              <span>Bedrooms</span>
              {property.beds}
            </p>
            <p>
              <span>Bathrooms</span>
              {property.baths}
            </p>
            <p>
              <span>Interior</span>
              {property.sqft}
            </p>
          </div>
        </section>

        <section className="detail-gallery page-pad">
          {rest[0] ? <img src={rest[0]} alt={`${property.title} interior`} /> : null}
          <div className="gallery-split">
            <p>{property.details}</p>
            {rest[1] ? <img src={rest[1]} alt={`${property.title} detail`} /> : null}
          </div>
        </section>

        <section className="property-inquiry page-pad">
          <div>
            <p className="eyebrow">{content.inquiryEyebrow}</p>
            <h2>
              {content.inquiryTitlePrefix}
              <br />
              {property.title}?
            </h2>
            <p>{content.inquiryBody}</p>
          </div>
          <InquiryForm compact />
        </section>

        {properties.length > 1 ? (
        <a href={`/properties/${next.slug}`} className="next-project">
          <span>{content.nextLabel}</span>
          <h2>{next.title}</h2>
          <b>↗</b>
        </a>
        ) : null}
      </article>
    </ValeChrome>
  );
}
