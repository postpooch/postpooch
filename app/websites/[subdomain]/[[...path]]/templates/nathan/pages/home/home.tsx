import {
  formatPropertyPrice,
  isAvailableListing,
  isSoldListing,
  propertyTitle,
} from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toNathanInsight } from "../../../blog-post-adapters";
import { toNathanProperty } from "../../../property-adapters";
import { NathanChrome } from "../../components/nathan-chrome";
import type { NathanSettings } from "../../settings";

import type { NathanHomeContent } from "./schema";

export function NathanHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<NathanHomeContent, NathanSettings>) {
  const { agent, catalog } = settings;
  const adaptedProperties = properties.filter(isAvailableListing).map(toNathanProperty);
  const heroProperty = adaptedProperties[0];
  const featured = adaptedProperties.slice(0, 3);
  const neighborhoodPreview = catalog.neighborhoods.slice(0, 4);
  const soldPreview = properties.filter(isSoldListing).slice(0, 3).map((property) => ({ price: formatPropertyPrice(property), label: propertyTitle(property), year: property.yearBuilt ? String(property.yearBuilt) : "" }));
  const pressPreview = catalog.press.slice(0, 4);
  const articles = blogPosts.map(toNathanInsight).slice(0, 3);

  return (
    <NathanChrome site={site} settings={settings}>
      <section className="home-hero">
        <div className="hero-number">{content.heroNumber}</div>
        <div className="hero-title-wrap">
          <p className="eyebrow light-text">{content.heroEyebrow}</p>
          <h1>
            {content.heroTitleLine1}
            <br />
            <span>{content.heroTitleEmphasis}</span>
          </h1>
          <p className="hero-deck">{content.heroDeck}</p>
          <div className="hero-actions">
            <a className="pill light" href={content.heroPrimaryCtaHref}>
              {content.heroPrimaryCtaLabel} <span>↗</span>
            </a>
            <a className="text-link light-text" href={content.heroSecondaryCtaHref}>
              {content.heroSecondaryCtaLabel}
            </a>
          </div>
        </div>
        <div className="hero-image-frame">
          <img
            src={heroProperty?.image ?? content.manifestoImage}
            alt="Modern luxury waterfront residence"
          />
          <div className="image-caption">
            <span>{content.heroImageCaptionLeft}</span>
            <span>{content.heroImageCaptionRight}</span>
          </div>
        </div>
        <div className="vertical-word">{agent.verticalWord}</div>
      </section>

      <section className="intro section-pad">
        <div className="section-index">{content.introIndex}</div>
        <div className="intro-copy">
          <p className="eyebrow">{content.introEyebrow}</p>
          <h2>{content.introTitle}</h2>
        </div>
        <div className="intro-aside">
          <p>{content.introAside}</p>
          <a className="text-link" href={content.introCtaHref}>
            {content.introCtaLabel}
          </a>
        </div>
      </section>

      <section className="stat-band">
        {content.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {featured.length ? <section className="featured section-pad">
        <div className="section-head">
          <div>
            <p className="eyebrow">{content.featuredEyebrow}</p>
            <h2>
              {content.featuredTitleLine1}
              <br />
              {content.featuredTitleLine2}
            </h2>
          </div>
          <a className="pill outline" href="/properties">
            {content.featuredCtaLabel} <span>↗</span>
          </a>
        </div>
        <div className="featured-stack">
          {featured.map((p, i) => (
            <a
              key={p.slug}
              href={`/properties/${p.slug}`}
              className="feature-row"
            >
              <span className="feature-no">0{i + 1}</span>
              <div className="feature-thumb">
                <img src={p.image} alt="" />
              </div>
              <div className="feature-name">
                <h3>{p.address}</h3>
                <p>
                  {p.neighborhood} · {p.beds} beds · {p.sqft} sq ft
                </p>
              </div>
              <div className="feature-price">{p.price}</div>
              <span className="feature-go">↗</span>
            </a>
          ))}
        </div>
      </section> : null}

      <section className="manifesto">
        <div className="manifesto-image">
          <img src={content.manifestoImage} alt="Luxury real estate advisor portrait" />
        </div>
        <div className="manifesto-copy">
          <p className="eyebrow light-text">{content.manifestoEyebrow}</p>
          <blockquote>{content.manifestoQuote}</blockquote>
          <p>{content.manifestoBody}</p>
          <a className="pill light" href={content.manifestoCtaHref}>
            {content.manifestoCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>

      <section className="neighborhood-preview section-pad">
        <div className="section-head">
          <div>
            <p className="eyebrow">{content.neighborhoodsEyebrow}</p>
            <h2>
              {content.neighborhoodsTitleLine1}
              <br />
              {content.neighborhoodsTitleLine2}
            </h2>
          </div>
          <p className="head-note">{content.neighborhoodsNote}</p>
        </div>
        <div className="neighborhood-strip">
          {neighborhoodPreview.map((n, i) => (
            <a href="/neighborhoods" className="n-card" key={n.name}>
              <img src={n.image} alt={`${n.name} real estate`} />
              <div>
                <span>0{i + 1}</span>
                <h3>{n.name}</h3>
                <p>{n.note}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {soldPreview.length ? <section className="results-home">
        <div className="results-title section-pad">
          <p className="eyebrow light-text">{content.resultsEyebrow}</p>
          <h2>{content.resultsTitle}</h2>
        </div>
        <div className="results-list section-pad">
          {soldPreview.map((item) => (
            <div className="result-line" key={item.label}>
              <strong>{item.price}</strong>
              <span>{item.label}</span>
              <em>{item.year}</em>
            </div>
          ))}
          <a className="text-link light-text" href="/sold">
            {content.resultsCtaLabel}
          </a>
        </div>
      </section> : null}

      {articles.length ? (
      <section className="insights-home section-pad">
        <div className="section-head">
          <div>
            <p className="eyebrow">{content.insightsEyebrow}</p>
            <h2>
              {content.insightsTitleLine1}
              <br />
              {content.insightsTitleLine2}
            </h2>
          </div>
          <a className="pill outline" href="/insights">
            {content.insightsCtaLabel} <span>↗</span>
          </a>
        </div>
        <div className="journal-grid">
          {articles.map((article, index) => (
            <a
              href={`/insights/${article.slug}`}
              key={article.slug}
              className={`journal-card j${index + 1}`}
            >
              {article.image ? (
                <div className="journal-image">
                  <img src={article.image} alt="" />
                </div>
              ) : null}
              <p className="eyebrow">
                {article.category} · {article.date}
              </p>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
      ) : null}

      <section className="press-ticker">
        <p>{content.pressTickerLabel}</p>
        {pressPreview.map((item) => (
          <span key={item.outlet}>{item.outlet}</span>
        ))}
      </section>
    </NathanChrome>
  );
}
