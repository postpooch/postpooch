type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`page-hero ${compact ? "compact" : ""}`}
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.46)), url(${image})`,
      }}
    >
      <div className="page-hero-content">
        {eyebrow ? <p className="kicker light">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="page-hero-subtitle">{subtitle}</p> : null}
      </div>
      <span className="scroll-mark">Scroll ↓</span>
    </section>
  );
}
