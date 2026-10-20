import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toMilaArticle } from "../../../blog-post-adapters";
import { toMilaProperty } from "../../../property-adapters";
import { ArrowRight, ArrowUpRight, QuoteIcon } from "../../components/icons";
import { MilaChrome } from "../../components/mila-chrome";
import { PropertyCard } from "../../components/property-card";
import type { MilaSettings } from "../../settings";

import type { MilaHomeContent } from "./schema";

export function MilaHomePage({
  site,
  settings,
  content,
  properties: websiteProperties,
  blogPosts,
}: TemplatePageProps<MilaHomeContent, MilaSettings>) {
  const { agent, catalog } = settings;
  const { services, areas } = catalog;
  const properties = websiteProperties.filter(isAvailableListing).map(toMilaProperty);
  const articles = blogPosts.map(toMilaArticle).slice(0, 3);

  return (
    <MilaChrome site={site} settings={settings}>
      <section className="home-hero shell">
        <div className="hero-copy">
          <span className="eyebrow">{content.heroEyebrow}</span>
          <h1>
            {content.heroTitleLine1}
            <br />
            <em>{content.heroTitleEmphasis}</em>
          </h1>
          <p>{content.heroBody}</p>
          <div className="hero-actions">
            <a href={content.heroCtaHref} className="button button-dark">
              {content.heroCtaLabel} <ArrowUpRight />
            </a>
            <a href={content.heroSecondaryHref} className="text-link">
              {content.heroSecondaryLabel} <ArrowRight />
            </a>
          </div>
          <div className="hero-proof">
            <div>
              <strong>{agent.rating}</strong>
              <span>average rating</span>
            </div>
            <div>
              <strong>{agent.experience}</strong>
              <span>years experience</span>
            </div>
            <div>
              <strong>{agent.homes}</strong>
              <span>homes guided</span>
            </div>
          </div>
        </div>
        <div className="hero-collage" aria-label="Atmospheric home imagery">
          <div className="collage-tall">
            <img src={content.heroCollageTall} alt="Modern home among greenery" />
          </div>
          <div className="collage-small top">
            <img src={content.heroCollageTop} alt="Warm interior" />
          </div>
          <div className="collage-small bottom">
            <img src={content.heroCollageBottom} alt="Light-filled house" />
          </div>
          <div className="hero-stamp">
            <span>{content.heroStampLabel}</span>
            <small>
              {content.heroStampSub.split("\n").map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </small>
          </div>
        </div>
      </section>

      <section className="service-paths section shell">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">{content.servicesEyebrow}</span>
            <h2>{content.servicesTitle}</h2>
          </div>
          <p>{content.servicesIntro}</p>
        </div>
        <div className="service-rows">
          {services.map((service) => (
            <a
              href={`/diensten/${service.slug}`}
              className="service-row"
              key={service.slug}
            >
              <span className="service-number">{service.number}</span>
              <div>
                <small>{service.eyebrow}</small>
                <h3>{service.title}</h3>
              </div>
              <p>{service.short}</p>
              <span className="circle-arrow">
                <ArrowUpRight />
              </span>
            </a>
          ))}
        </div>
      </section>

      {properties.length ? <section className="featured-section section">
        <div className="shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow light">{content.featuredEyebrow}</span>
              <h2 className="light-text">{content.featuredTitle}</h2>
            </div>
            <a href="/aanbod" className="text-link light-link">
              {content.featuredCtaLabel} <ArrowUpRight />
            </a>
          </div>
          <div className="featured-grid">
            {properties.slice(0, 3).map((property, i) => (
              <PropertyCard property={property} large={i === 0} key={property.slug} />
            ))}
          </div>
        </div>
      </section> : null}

      <section className="agent-home section shell">
        <div className="agent-photo-wrap">
          <img src={agent.portrait} alt={`Portrait of ${agent.name}`} />
          <span className="agent-caption">
            {agent.name}
            <br />
            <small>{agent.role}</small>
          </span>
        </div>
        <div className="agent-copy">
          <span className="eyebrow">{content.agentEyebrow}</span>
          <h2>{content.agentTitle}</h2>
          <p className="lead">{content.agentLead}</p>
          <div className="agent-values">
            {content.agentValues.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
          <a href="/over-mila" className="button button-outline">
            {content.agentCtaLabel} <ArrowUpRight />
          </a>
        </div>
      </section>

      <section className="region-home section shell">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">{content.regionsEyebrow}</span>
            <h2>{content.regionsTitle}</h2>
          </div>
          <p>{content.regionsIntro}</p>
        </div>
        <div className="region-grid">
          {areas.map((area, i) => (
            <a
              key={area.slug}
              href={`/regios/${area.slug}`}
              className={`region-card region-${i + 1}`}
            >
              <img src={area.image} alt={area.city} />
              <div>
                <small>{area.label}</small>
                <h3>{area.city}</h3>
                <span>
                  <ArrowUpRight />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="testimonial section">
        <div className="shell testimonial-inner">
          <QuoteIcon />
          <blockquote>{content.testimonialQuote}</blockquote>
          <div className="testimonial-meta">
            <strong>{content.testimonialName}</strong>
            <span>{content.testimonialMeta}</span>
          </div>
        </div>
      </section>

      {articles.length ? (
      <section className="journal-home section shell">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">{content.journalEyebrow}</span>
            <h2>{content.journalTitle}</h2>
          </div>
          <a href="/insights" className="text-link">
            {content.journalCtaLabel} <ArrowUpRight />
          </a>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <a
              href={`/insights/${article.slug}`}
              className="article-card"
              key={article.slug}
            >
              {article.image ? (
                <div className="article-image">
                  <img src={article.image} alt="" />
                </div>
              ) : null}
              <span>
                {article.category} · {article.date}
              </span>
              <h3>{article.title}</h3>
              <p>{article.intro}</p>
              <b>
                Read more <ArrowRight />
              </b>
            </a>
          ))}
        </div>
      </section>
      ) : null}
    </MilaChrome>
  );
}
