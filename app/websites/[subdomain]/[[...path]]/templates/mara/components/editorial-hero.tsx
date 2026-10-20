type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  image?: string;
  align?: "bottom" | "center";
};

export function EditorialHero({
  eyebrow,
  title,
  copy,
  image,
  align = "bottom",
}: EditorialHeroProps) {
  return (
    <section
      className={`editorialHero ${image ? "withImage" : ""} ${align}`}
    >
      {image ? <img src={image} alt="" /> : null}
      <div className="heroShade" />
      <div className="editorialHeroInner">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        {copy ? <p className="heroCopy">{copy}</p> : null}
      </div>
    </section>
  );
}
