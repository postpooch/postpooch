import type { ReactNode } from "react";

import type { ReyCommunity, ReyProperty } from "../settings";

export function ArrowLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <a className={`arrow-link ${light ? "arrow-link--light" : ""}`} href={href}>
      {children}
      <span>↗</span>
    </a>
  );
}

export function PropertyCard({
  property,
  index,
}: {
  property: ReyProperty;
  index?: number;
}) {
  return (
    <a className="property-card" href={`/properties/${property.slug}`}>
      <div
        className="property-card__image image-hover"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,.52)), url("${property.image}")`,
        }}
      >
        {typeof index === "number" ? (
          <span className="card-index">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <span className="property-card__view">View residence ↗</span>
      </div>
      <div className="property-card__meta">
        <div>
          <h3>{property.address}</h3>
          <p>{property.city}</p>
        </div>
        <strong>{property.price}</strong>
      </div>
      <div className="property-card__facts">
        {property.beds} BD <span>/</span> {property.baths} BA <span>/</span>{" "}
        {property.sqft} SQ FT
      </div>
    </a>
  );
}

export function CommunityCard({
  community,
  index,
}: {
  community: ReyCommunity;
  index?: number;
}) {
  return (
    <a
      href={`/communities/${community.slug}`}
      className="community-card image-hover"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.48)), url("${community.image}")`,
      }}
    >
      {typeof index === "number" ? (
        <span className="card-index card-index--light">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      <div className="community-card__copy">
        <span>Explore</span>
        <h3>{community.name}</h3>
        <p>{community.tagline}</p>
      </div>
    </a>
  );
}

export function PageHero({
  eyebrow,
  title,
  image,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  image?: string;
  align?: "left" | "center";
}) {
  return (
    <section
      className={`page-hero page-hero--${align}`}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.4)), url("${image}")`,
            }
          : undefined
      }
    >
      <div className="page-hero__content">
        <span className="eyebrow eyebrow--light">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
    </section>
  );
}
