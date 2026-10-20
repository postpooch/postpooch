import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toMaraArticle } from "../../../blog-post-adapters";
import { toMaraProperty } from "../../../property-adapters";
import { Arrow } from "../../components/icons";
import { MaraChrome } from "../../components/mara-chrome";
import { PropertyCard } from "../../components/property-card";
import type { MaraSettings } from "../../settings";

import type { MaraHomeContent } from "./schema";

export function MaraHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<MaraHomeContent, MaraSettings>) {
  const { catalog } = settings;
  const featured = properties.filter(isAvailableListing).slice(0, 3).map(toMaraProperty);
  const neighborhoodPreview = catalog.neighborhoods.slice(0, 4);
  const journalPreview = blogPosts.map(toMaraArticle).slice(0, 3);
  const testimonial = catalog.testimonials[0];

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="homeHero">
        <img src={content.heroImage} alt="Contemporary luxury residence" />
        <div className="homeHeroShade" />
        <div className="homeHeroContent">
          <p className="eyebrow light">{content.heroEyebrow}</p>
          <h1>
            {content.heroTitleLine1}
            <br />
            {content.heroTitleLine2Before}
            <em>{content.heroTitleEmphasis}</em>
          </h1>
          <p>{content.heroSubtext}</p>
          <div className="heroActions">
            <a href="/properties" className="button lightButton">
              {content.heroCtaPrimary} <Arrow />
            </a>
            <a href="/contact" className="textLink light">
              {content.heroCtaSecondary} <span>→</span>
            </a>
          </div>
        </div>
        <div className="heroSideNote">
          <span>{content.heroSideNoteNumber}</span>
          <p>
            {content.heroSideNote.split("\n").map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="manifesto section">
        <div>
          <p className="eyebrow">{content.manifestoEyebrow}</p>
        </div>
        <div>
          <h2>
            {content.manifestoTitleLine1}
            <br />
            {content.manifestoTitleLine2}
          </h2>
          <p>{content.manifestoBody}</p>
          <a className="textLink" href="/about">
            {content.manifestoCta} <span>→</span>
          </a>
        </div>
      </section>

      {featured.length ? <section className="featured section wide">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">{content.featuredEyebrow}</p>
            <h2>{content.featuredTitle}</h2>
          </div>
          <a href="/properties" className="textLink">
            {content.featuredCta} <span>→</span>
          </a>
        </div>
        <div className="propertyGrid homeGrid">
          {featured.map((property, i) => (
            <PropertyCard
              property={property}
              key={property.slug}
              large={i === 0}
            />
          ))}
        </div>
      </section> : null}

      <section className="darkStory">
        <div className="darkStoryImage">
          <img src={content.darkStoryImage} alt="Warm modern interior" />
        </div>
        <div className="darkStoryCopy">
          <p className="eyebrow light">{content.darkStoryEyebrow}</p>
          <h2>
            {content.darkStoryTitleLine1}
            <br />
            <em>{content.darkStoryTitleEmphasis}</em>
            {content.darkStoryTitleAfter}
          </h2>
          <p>{content.darkStoryBody}</p>
          <div className="twoLinks">
            <a href="/buy">
              For buyers <Arrow />
            </a>
            <a href="/sell">
              For sellers <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="neighborhoodPreview section wide">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">{content.neighborhoodEyebrow}</p>
            <h2>{content.neighborhoodTitle}</h2>
          </div>
          <a href="/neighborhoods" className="textLink">
            {content.neighborhoodCta} <span>→</span>
          </a>
        </div>
        <div className="neighborhoodStrip">
          {neighborhoodPreview.map((n, i) => (
            <a
              href={`/neighborhoods/${n.slug}`}
              className="neighborhoodTile"
              key={n.slug}
            >
              <img src={n.image} alt={n.name} />
              <div>
                <span>0{i + 1}</span>
                <h3>{n.name}</h3>
                <p>{n.kicker}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {testimonial ? (
        <section className="testimonialFeature section">
          <p className="eyebrow">{content.testimonialEyebrow}</p>
          <blockquote>{testimonial.quote}</blockquote>
          <p className="attribution">
            {testimonial.name} · {testimonial.type}
          </p>
          <a href="/reviews" className="textLink">
            {content.testimonialCta} <span>→</span>
          </a>
        </section>
      ) : null}

      {journalPreview.length ? (
      <section className="journalPreview section wide">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">{content.journalEyebrow}</p>
            <h2>{content.journalTitle}</h2>
          </div>
          <a href="/journal" className="textLink">
            {content.journalCta} <span>→</span>
          </a>
        </div>
        <div className="articleGrid">
          {journalPreview.map((article) => (
            <a
              href={`/journal/${article.slug}`}
              className="articleCard"
              key={article.slug}
            >
              {article.image ? <img src={article.image} alt="" /> : null}
              <p>
                {article.category} · {article.date}
              </p>
              <h3>{article.title}</h3>
              <span>Read note →</span>
            </a>
          ))}
        </div>
      </section>
      ) : null}

      <section className="closingImage">
        <img src={content.closingImage} alt="Minimal dining room" />
        <div>
          <p className="eyebrow light">{content.closingEyebrow}</p>
          <h2>{content.closingTitle}</h2>
          <a href="/contact" className="button lightButton">
            {content.closingCta} <Arrow />
          </a>
        </div>
      </section>
    </MaraChrome>
  );
}
