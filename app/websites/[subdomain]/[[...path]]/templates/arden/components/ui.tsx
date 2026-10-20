import type { ReactNode } from "react";

import type { ArdenProperty } from "../settings";

import { IconArrow, IconBath, IconBed, IconLand, IconPlay, IconRuler } from "./icons";

export function Hero({
  image,
  eyebrow,
  title,
  subtitle,
  align = "center",
  height = "large",
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  height?: "medium" | "large";
}) {
  return (
    <section
      className={`hero hero-${height} hero-${align}`}
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.42)),url(${image})`,
      }}
    >
      <div className="heroInner">
        {eyebrow ? <p className="eyebrow lightText">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={`sectionHeading ${center ? "center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

export function PropertyCard({ property }: { property: ArdenProperty }) {
  return (
    <a href={`/properties/${property.slug}`} className="propertyCard">
      <div className="propertyImage">
        <img src={property.image} alt={property.title} />
        <span className="statusBadge">{property.status}</span>
      </div>
      <div className="propertyInfo">
        <p className="price">{property.price}</p>
        <h3>{property.title}</h3>
        <p className="muted">{property.location}</p>
        <div className="propertyStats">
          {property.beds ? (
            <span>
              <IconBed />
              {property.beds} Beds
            </span>
          ) : null}
          {property.baths ? (
            <span>
              <IconBath />
              {property.baths} Baths
            </span>
          ) : null}
          {property.sqft ? (
            <span>
              <IconRuler />
              {property.sqft} Sq.Ft.
            </span>
          ) : null}
          {property.acres ? (
            <span>
              <IconLand />
              {property.acres} Acres
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}

export function PropertyGrid({ items }: { items: readonly ArdenProperty[] }) {
  if (!items.length) {
    return <div className="emptyState">No properties available at this time.</div>;
  }
  return (
    <div className="propertyGrid">
      {items.map((property) => (
        <PropertyCard property={property} key={property.slug} />
      ))}
    </div>
  );
}

export function SplitFeature({
  image,
  eyebrow,
  title,
  children,
  href,
  label,
  reverse = false,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  href?: string;
  label?: string;
  reverse?: boolean;
}) {
  return (
    <section className={`splitFeature ${reverse ? "reverse" : ""}`}>
      <div className="splitImage">
        <img src={image} alt="" />
      </div>
      <div className="splitCopy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        <div className="richCopy">{children}</div>
        {href && label ? (
          <a className="textLink" href={href}>
            {label}
            <IconArrow />
          </a>
        ) : null}
      </div>
    </section>
  );
}

export function EditorialCta({
  image,
  title,
  copy,
  href,
  label,
}: {
  image: string;
  title: string;
  copy: string;
  href: string;
  label: string;
}) {
  return (
    <a href={href} className="editorialCta">
      <img src={image} alt="" />
      <div>
        <p className="eyebrow lightText">Discover</p>
        <h3>{title}</h3>
        <p>{copy}</p>
        <span>
          {label} <IconArrow />
        </span>
      </div>
    </a>
  );
}

export function FilmCard({
  image,
  title,
  copy,
}: {
  image: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="filmCard">
      <div className="filmImage">
        <img src={image} alt="" />
        <span className="playButton">
          <IconPlay />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
}) {
  return (
    <section className="pageIntro">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {copy ? <p>{copy}</p> : null}
    </section>
  );
}
