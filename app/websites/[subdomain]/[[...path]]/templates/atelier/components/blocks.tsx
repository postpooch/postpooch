import type { AtelierCommunity, AtelierProperty, AtelierSettings } from "../settings";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  align?: "left" | "center";
}) {
  return (
    <section
      className={`pageHero ${image ? "withImage" : ""} ${align === "center" ? "centered" : ""}`}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.2),rgba(8,8,7,.58)),url("${image}")`,
            }
          : undefined
      }
    >
      <div className="pageHeroInner">
        {eyebrow ? <p className="kicker light">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="heroSub">{subtitle}</p> : null}
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
      {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

export function PropertyCard({
  property,
  index = 0,
}: {
  property: AtelierProperty;
  index?: number;
}) {
  return (
    <a
      href={`/properties/${property.slug}`}
      className={`propertyCard ${index % 3 === 0 ? "large" : ""}`}
    >
      <div
        className="propertyImage"
        style={{ backgroundImage: `url("${property.image}")` }}
      >
        <span className="pill">{property.status}</span>
        <span className="cardArrow">↗</span>
      </div>
      <div className="propertyMeta">
        <div>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
        </div>
        <div className="price">{property.price}</div>
      </div>
      <div className="specs">
        {property.beds ? <span>{property.beds}</span> : null}
        {property.baths ? <span>{property.baths}</span> : null}
        {property.area ? <span>{property.area}</span> : null}
      </div>
    </a>
  );
}

export function PropertyGrid({ items }: { items: AtelierProperty[] }) {
  return (
    <div className="propertyGrid">
      {items.map((property, index) => (
        <PropertyCard property={property} index={index} key={property.slug} />
      ))}
    </div>
  );
}

export function CommunityStrip({ communities }: { communities: AtelierCommunity[] }) {
  return (
    <section className="communityStrip">
      {communities.slice(0, 4).map((community) => (
        <a
          href={`/communities/${community.slug}`}
          className="communityTile"
          key={community.slug}
          style={{
            backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.08),rgba(8,8,7,.62)),url("${community.image}")`,
          }}
        >
          <div>
            <p>{community.eyebrow}</p>
            <h3>{community.name}</h3>
            <span>Explore area ↗</span>
          </div>
        </a>
      ))}
    </section>
  );
}

export function Stats({ stats }: { stats: AtelierSettings["stats"] }) {
  return (
    <section className="stats">
      {stats.map((stat) => (
        <div key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}

export function ContactBand() {
  return (
    <section className="contactBand">
      <div>
        <p className="kicker light">A considered approach</p>
        <h2>Strategy before spectacle.</h2>
      </div>
      <div>
        <p>
          Every property and every move deserves its own plan. We pair market
          intelligence, design sensitivity, and decisive execution with a level of
          service built for long-term relationships.
        </p>
        <a className="outlineButton lightButton" href="/marketing">
          Our approach
        </a>
      </div>
    </section>
  );
}
