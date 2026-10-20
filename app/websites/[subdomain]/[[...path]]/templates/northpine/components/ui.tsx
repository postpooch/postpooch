import type { NorthpinePost, NorthpineProperty } from "../settings";

export function SectionHeading({
  kicker,
  title,
  text,
  center = false,
}: {
  kicker: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      <span className="eyebrow">{kicker}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function PageHero({
  title,
  subtitle,
  image,
  eyebrow = "NORTH GEORGIA REAL ESTATE",
}: {
  title: string;
  subtitle?: string;
  image: string;
  eyebrow?: string;
}) {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(18,22,19,.76),rgba(18,22,19,.20)),url(${image})`,
      }}
    >
      <div className="container page-hero-inner">
        <span className="eyebrow light">{eyebrow}</span>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  );
}

export function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="breadcrumb container">
      <a href="/">Home</a>
      <span>›</span>
      <span>{current}</span>
    </div>
  );
}

export function PropertyGrid({ items }: { items: NorthpineProperty[] }) {
  if (!items.length) return null;
  return (
    <div className="property-grid">
      {items.map((property) => (
        <a href={`/property/${property.slug}`} className="property-card" key={property.slug}>
          <div className="property-image">
            <img src={property.image} alt={property.title} />
            {property.status ? <span className="status">{property.status}</span> : null}
            <span className="property-arrow">↗</span>
          </div>
          <div className="property-meta">
            <div>
              <h3>{property.title}</h3>
              <p>{property.city}</p>
            </div>
            <strong>{property.price}</strong>
          </div>
          <div className="property-facts">
            <span>{property.beds} Beds</span>
            <span>{property.baths} Baths</span>
            <span>{property.sqft} Sq Ft</span>
          </div>
        </a>
      ))}
    </div>
  );
}

export function PostCard({
  post,
  title,
}: {
  post: NorthpinePost;
  title?: string;
}) {
  return (
    <a href={`/blog/${post.slug}`} className="post-card">
      {post.image ? <img src={post.image} alt={title ?? post.title} /> : null}
      <span className="eyebrow">{post.date}</span>
      <h3>{title ?? post.title}</h3>
      <p>{post.excerpt}</p>
      <em>Read article →</em>
    </a>
  );
}
