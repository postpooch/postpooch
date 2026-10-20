import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toRoweEntry } from "../../../blog-post-adapters";
import { toRoweProperty } from "../../../property-adapters";
import { PropertyCard } from "../../components/property-card";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RoweHomeContent } from "./schema";

export function RoweHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<RoweHomeContent, RoweSettings>) {
  const { catalog, agent } = settings;
  const featured = properties.filter(isAvailableListing).map(toRoweProperty);
  const journalPreview = blogPosts.map(toRoweEntry).slice(0, 3);

  return (
    <RoweChrome site={site} settings={settings}>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            {content.heroEyebrowLeft} <span>—</span> {content.heroEyebrowRight}
          </div>
          <h1>
            {content.heroTitleLine1}
            <br />
            with <em>{content.heroTitleEmphasis}</em>
          </h1>
          <div className="hero-bottom-copy">
            <p>{content.heroDeck}</p>
            <a className="round-link" href={content.heroCtaHref}>
              {content.heroCtaLine1}
              <br />
              {content.heroCtaLine2} <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src={content.heroImage} alt={content.heroImageAlt} />
          <div className="hero-image-caption">
            <span>{content.heroCaptionLeft}</span>
            <span>{content.heroCaptionRight}</span>
          </div>
        </div>
        <div className="vertical-note">{agent.verticalNote}</div>
      </section>

      <section className="ticker" aria-label="Practice areas">
        <div>
          {content.tickerItems.map((item, index) => (
            <span key={`${item}-${index}`}>
              {item} <i>•</i>{" "}
            </span>
          ))}
        </div>
      </section>

      <section className="manifesto section-pad">
        <div className="section-label">{content.manifestoLabel}</div>
        <div className="manifesto-copy">
          <h2>{content.manifestoTitle}</h2>
          <div className="manifesto-lower">
            <p>{content.manifestoBody}</p>
            <a className="text-arrow" href={content.manifestoCtaHref}>
              {content.manifestoCtaLabel} <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {featured.length ? <section className="featured-section section-pad">
        <div className="section-heading">
          <div className="section-label">{content.featuredLabel}</div>
          <div>
            <h2>
              {content.featuredTitleLine1}
              <br />
              <em>{content.featuredTitleEmphasis}</em>
            </h2>
            <a className="text-arrow" href={content.featuredCtaHref}>
              {content.featuredCtaLabel} <span>↗</span>
            </a>
          </div>
        </div>
        <div className="property-grid home-grid">
          {featured[0] ? (
            <PropertyCard property={featured[0]} featured />
          ) : null}
          <div className="property-stack">
            {featured[1] ? <PropertyCard property={featured[1]} /> : null}
            {featured[2] ? <PropertyCard property={featured[2]} /> : null}
          </div>
        </div>
      </section> : null}

      <section className="services-home section-pad">
        <div className="section-heading light-heading">
          <div className="section-label">{content.servicesLabel}</div>
          <div>
            <h2>
              {content.servicesTitleLine1}
              <br />
              {content.servicesTitleLine2}
            </h2>
            <p>{content.servicesDeck}</p>
          </div>
        </div>
        <div className="service-list">
          {catalog.services.map((service) => (
            <a
              href={`/services/${service.slug}`}
              className="service-row"
              key={service.slug}
            >
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.short}</p>
              <b>↗</b>
            </a>
          ))}
        </div>
        <a
          className="text-arrow light services-all"
          href={content.servicesCtaHref}
        >
          {content.servicesCtaLabel} <span>↗</span>
        </a>
      </section>

      <section className="quote-section section-pad">
        <div className="quote-mark">“</div>
        <blockquote>{content.quote}</blockquote>
        <div className="quote-credit">
          <span>{content.quoteCreditLeft}</span>
          <span>{content.quoteCreditRight}</span>
        </div>
      </section>

      <section className="about-home section-pad">
        <div className="about-image">
          <img src={content.aboutImage} alt={content.aboutImageAlt} />
          <div className="about-image-note">
            {content.aboutImageNoteLine1}
            <br />
            {content.aboutImageNoteLine2}
          </div>
        </div>
        <div className="about-copy">
          <div className="section-label">{content.aboutLabel}</div>
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutBody1}</p>
          <p>{content.aboutBody2}</p>
          <a className="text-arrow" href={content.aboutCtaHref}>
            {content.aboutCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>

      <section className="stats section-pad">
        {content.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {journalPreview.length ? (
      <section className="journal-home section-pad">
        <div className="section-heading">
          <div className="section-label">{content.journalLabel}</div>
          <div>
            <h2>
              {content.journalTitleLine1}
              <br />
              {content.journalTitleLine2}
            </h2>
            <a className="text-arrow" href={content.journalCtaHref}>
              {content.journalCtaLabel} <span>↗</span>
            </a>
          </div>
        </div>
        <div className="journal-grid">
          {journalPreview.map((item) => (
            <a
              href={`/journal/${item.slug}`}
              key={item.slug}
              className="journal-card"
            >
              {item.image ? (
                <img src={item.image} alt="" />
              ) : null}
              <div className="journal-meta">
                <span>{item.category}</span>
                <span>{item.date}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.dek}</p>
            </a>
          ))}
        </div>
      </section>
      ) : null}
    </RoweChrome>
  );
}
