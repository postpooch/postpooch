type PageHeroProps = {
  kicker: string;
  title: string;
  italic?: string;
  text: string;
  image: string;
  imageAlt: string;
  cta?: string;
  href?: string;
};

export function PageHero({
  kicker,
  title,
  italic,
  text,
  image,
  imageAlt,
  cta = "Start a conversation",
  href = "/contact",
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <p className="kicker">{kicker}</p>
        <h1>
          {title} {italic ? <em>{italic}</em> : null}
        </h1>
        <p className="lead">{text}</p>
        <a className="button button-dark" href={href}>
          {cta} <span>↗</span>
        </a>
      </div>
      <div className="page-hero-image">
        <img src={image} alt={imageAlt} />
      </div>
    </section>
  );
}
