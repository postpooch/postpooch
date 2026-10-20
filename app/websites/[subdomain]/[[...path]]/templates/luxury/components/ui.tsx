import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading align-${align}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function Button({
  href,
  children,
  light = false,
  outline = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
  outline?: boolean;
}) {
  return (
    <a
      className={`button ${light ? "button-light" : ""} ${outline ? "button-outline" : ""}`}
      href={href}
    >
      {children}
    </a>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  compact?: boolean;
}) {
  return (
    <section
      className={`page-hero image-cover ${compact ? "compact" : ""}`}
      style={{
        backgroundImage: `linear-gradient(var(--overlay), var(--overlay)), url(${image})`,
      }}
    >
      <div className="page-hero-content">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export function SplitEditorial({
  image,
  eyebrow,
  title,
  children,
  reverse = false,
  action,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  reverse?: boolean;
  action?: ReactNode;
}) {
  return (
    <section className={`split-editorial ${reverse ? "reverse" : ""}`}>
      <div
        className="split-image image-cover"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="split-copy">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
        <div className="prose">{children}</div>
        {action}
      </div>
    </section>
  );
}
