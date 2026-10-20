import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { AreaIcon, ArrowUpRight, BedIcon, LeafIcon } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import { PropertyCard } from "../../components/property-card";
import { PropertyGallery } from "../../components/property-gallery";
import type { MilaSettings } from "../../settings";

import type { MilaPropertyContent } from "./schema";
import { toMilaProperty } from "../../../property-adapters";

export function MilaPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<MilaPropertyContent, MilaSettings>) {
  const { agent } = settings;
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toMilaProperty(source);

  const related = properties
    .filter(
      (p) =>
        p.slug !== property.slug &&
        (p.city === source.city || p.neighborhood === source.neighborhood),
    )
    .slice(0, 3);

  return (
    <MilaChrome site={site} settings={settings}>
      <section className="property-head shell">
        <div>
          <span className="eyebrow">
            {property.status} · {property.type}
          </span>
          <h1>{property.address}</h1>
          <p>
            {property.city} · {property.area}
          </p>
        </div>
        <div className="property-price">
          <span>{content.priceLabel}</span>
          <strong>{property.price}</strong>
          <a href="/contact" className="button button-dark">
            {content.ctaLabel} <ArrowUpRight />
          </a>
        </div>
      </section>
      <div className="shell">
        {property.images.length ? (
          <PropertyGallery images={property.images} address={property.address} />
        ) : null}
      </div>
      <section className="property-body section shell">
        <aside className="property-sidebar">
          <div className="fact-block">
            <span>
              <AreaIcon />
              Living
            </span>
            <strong>{property.living} m²</strong>
          </div>
          <div className="fact-block">
            <span>
              <BedIcon />
              Bedrooms
            </span>
            <strong>{property.bedrooms}</strong>
          </div>
          <div className="fact-block">
            <span>
              <LeafIcon />
              Energy label
            </span>
            <strong>{property.energy}</strong>
          </div>
          <div className="fact-block">
            <span>Year built</span>
            <strong>{property.year || "—"}</strong>
          </div>
        </aside>
        <article className="property-description">
          <span className="eyebrow">{content.aboutEyebrow}</span>
          <h2>{property.blurb}</h2>
          <p className="lead">{property.description}</p>
          {property.features.length ? (
            <>
          <h3>{content.featuresHeading}</h3>
          <ul>
            {property.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
            </>
          ) : null}
          <div className="agent-inline">
            <img src={agent.portrait} alt={agent.name} />
            <div>
              <span>{content.interestLabel}</span>
              <h3>{content.interestTitle}</h3>
              <a href={`tel:${agent.phoneHref}`}>{agent.phoneDisplay}</a>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </div>
          </div>
        </article>
      </section>
      {related.length > 0 && (
        <section className="section related shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">{content.relatedEyebrow}</span>
              <h2>{content.relatedTitle}</h2>
            </div>
            <a href="/aanbod" className="text-link">
              {content.relatedCta} <ArrowUpRight />
            </a>
          </div>
          <div className="listing-grid">
            {related.map(toMilaProperty).map((p) => (
              <PropertyCard property={p} key={p.slug} />
            ))}
          </div>
        </section>
      )}
    </MilaChrome>
  );
}
