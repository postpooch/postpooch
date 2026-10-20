import { notFound } from "next/navigation";

import {
  formatPropertyArea,
  formatPropertyPrice,
  propertyLocation,
  propertyStatusLabel,
  propertyTitle,
} from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { ElenaChrome } from "../../components/elena-chrome";
import type { ElenaSettings } from "../../settings";

import type { ElenaResidenceContent } from "./schema";

export function ElenaResidencePage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<ElenaResidenceContent, ElenaSettings>) {
  const listing = properties.find((item) => item.slug === params.slug);
  if (!listing) notFound();

  const facts = [
    listing.bedrooms !== null ? { label: "Bedrooms", value: String(listing.bedrooms) } : null,
    listing.bathrooms !== null ? { label: "Bathrooms", value: String(listing.bathrooms) } : null,
    formatPropertyArea(listing)
      ? { label: "Interior", value: formatPropertyArea(listing) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <ElenaChrome site={site} settings={settings}>
      <main>
        <article className="residence-article section-shell">
          {listing.images[0] ? (
            <div
              className="residence-hero"
              style={{ backgroundImage: `url('${listing.images[0]}')` }}
              role="img"
              aria-label={propertyTitle(listing)}
            />
          ) : null}
          <p className="residence-kicker">
            {propertyStatusLabel(listing.status)}
            {propertyLocation(listing) ? ` · ${propertyLocation(listing)}` : ""}
          </p>
          <div className="residence-meta">
            <div>
              <h1>{propertyTitle(listing)}</h1>
              {listing.address && listing.address !== propertyTitle(listing) ? (
                <p className="residence-address">{listing.address}</p>
              ) : null}
            </div>
            <strong className="residence-price">{formatPropertyPrice(listing)}</strong>
          </div>
          {facts.length ? (
            <div className="residence-facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
          {listing.description ? (
            <div className="residence-body">
              {listing.description
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
            </div>
          ) : null}
          {listing.images.slice(1).length ? (
            <div className="residence-gallery">
              {listing.images.slice(1).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${propertyTitle(listing)} view ${index + 2}`}
                />
              ))}
            </div>
          ) : null}
          <div className="residence-actions">
            <a className="underlined-link" href="/#residences">
              {content.backLabel}
            </a>
            <a className="underlined-link" href="/#contact">
              {content.inquiryLabel}
            </a>
          </div>
        </article>
      </main>
    </ElenaChrome>
  );
}
