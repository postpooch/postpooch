import { ContactForm } from "./contact-form";
import { EditorialHero } from "./editorial-hero";
import { Arrow } from "./icons";

export type ServiceBlock = {
  number: string;
  title: string;
  copy: string;
};

export type ServicePageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroCopy: string;
  heroImage: string;
  approachEyebrow: string;
  approachTitle: string;
  approachBody: string;
  blocks: ServiceBlock[];
  quote: string;
  quoteAttribution: string;
  nextEyebrow: string;
  nextTitle: string;
  nextBody: string;
  nextImage: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  formTitle: string;
};

type ServicePageProps = {
  content: ServicePageContent;
};

/**
 * Shared buy/sell layout driven entirely by content props.
 */
export function ServicePage({ content }: ServicePageProps) {
  return (
    <>
      <EditorialHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        copy={content.heroCopy}
        image={content.heroImage}
      />
      <section className="introSplit section">
        <p className="eyebrow">{content.approachEyebrow}</p>
        <div>
          <h2>{content.approachTitle}</h2>
          <p>{content.approachBody}</p>
        </div>
      </section>
      <section className="process section">
        {content.blocks.map((block) => (
          <article key={block.number}>
            <span>{block.number}</span>
            <h3>{block.title}</h3>
            <p>{block.copy}</p>
          </article>
        ))}
      </section>
      <section className="quoteBand">
        <blockquote>“{content.quote}”</blockquote>
        <span>— {content.quoteAttribution}</span>
      </section>
      <section className="splitMedia section">
        <div className="splitImage">
          <img src={content.nextImage} alt="Luxury interior" />
        </div>
        <div className="splitCopy">
          <p className="eyebrow">{content.nextEyebrow}</p>
          <h2>{content.nextTitle}</h2>
          <p>{content.nextBody}</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a className="button dark" href={content.primaryCtaHref}>
              {content.primaryCtaLabel} <Arrow />
            </a>
            {content.secondaryCtaLabel && content.secondaryCtaHref ? (
              <a className="button" href={content.secondaryCtaHref}>
                {content.secondaryCtaLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
      <section className="formSection section">
        <ContactForm title={content.formTitle} />
      </section>
    </>
  );
}
