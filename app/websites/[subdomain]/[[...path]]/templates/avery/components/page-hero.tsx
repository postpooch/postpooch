type PageHeroProps = {
  kicker: string;
  title: string;
  sub?: string;
  image?: string;
  tall?: boolean;
};

export function PageHero({ kicker, title, sub, image, tall = false }: PageHeroProps) {
  return (
    <section
      className={`page-hero ${tall ? "tall" : ""} ${image ? "has-image" : ""}`}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(180deg,rgba(12,12,10,.16),rgba(12,12,10,.52)),url('${image}')`,
            }
          : undefined
      }
    >
      <div className="shell page-hero-inner">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {sub ? <p className="hero-sub">{sub}</p> : null}
      </div>
    </section>
  );
}

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  link?: string;
  linkLabel?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  copy,
  link,
  linkLabel = "View all",
}: SectionTitleProps) {
  return (
    <div className="section-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {copy ? <p>{copy}</p> : null}
      {link ? (
        <a className="text-link" href={link}>
          {linkLabel} <span>↗</span>
        </a>
      ) : null}
    </div>
  );
}
