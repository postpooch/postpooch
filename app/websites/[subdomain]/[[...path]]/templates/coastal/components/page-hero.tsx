import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  image?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, image, children }: PageHeroProps) {
  return (
    <section
      className={`pageHero ${image ? "withImage" : ""}`}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(9,10,11,.74), rgba(9,10,11,.20)), url(${image})`,
            }
          : undefined
      }
    >
      <div className="pageHeroInner">
        <p className="eyebrow light">{eyebrow || "Vale Coastal Estates"}</p>
        <h1>{title}</h1>
        {children}
        <a href="/" className="backHome">
          ← Home
        </a>
      </div>
    </section>
  );
}
