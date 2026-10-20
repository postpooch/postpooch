import type { TemplatePageProps } from "../../../types";
import { toAveryInsight } from "../../../blog-post-adapters";
import { AveryChrome } from "../../components/avery-chrome";
import { ListingGrid } from "../../components/listing-card";
import { NewsletterBlock } from "../../components/newsletter-form";
import { SectionTitle } from "../../components/page-hero";
import { averyActiveProperties } from "../../listings";
import type { AverySettings } from "../../settings";

import type { AveryHomeContent } from "./schema";

export function AveryHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<AveryHomeContent, AverySettings>) {
  const { agent, catalog } = settings;
  const featured = averyActiveProperties(properties);
  const shown = featured.filter((item) => item.featured);
  const listings = (shown.length ? shown : featured).slice(0, 4);
  const notes = blogPosts.map(toAveryInsight).slice(0, 4);
  const portrait = content.introPortrait || catalog.images.agent;
  const editorialImage = content.editorialImage || catalog.images.city2;

  return (
    <AveryChrome site={site} settings={settings}>
      <section
        className="home-hero image-cover"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.06),rgba(8,8,7,.55)),url('${catalog.images.hero}')`,
        }}
      >
        <div className="hero-rail">
          <span>Manhattan</span>
          <span>Brooklyn</span>
          <span>New York City</span>
        </div>
        <div className="home-hero-content shell">
          <p className="eyebrow light-text">{agent.eyebrow}</p>
          <h1>
            {content.heroLine}
            <br />
            <em>{content.heroEmphasis}</em>
            {content.heroRest}
          </h1>
          <div className="hero-bottom">
            <p>{content.heroBody}</p>
            <div className="hero-links">
              {site.propertiesEnabled ? (
                <>
                  <a href="/properties">{content.listingsCtaLabel}</a>
                  <a href="/properties/sold">{content.soldCtaLabel}</a>
                </>
              ) : null}
              <a href="/insights">{content.insightsCtaLabel}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-section shell">
        <div className="intro-number">01</div>
        <div className="intro-portrait">
          <img src={portrait} alt="" />
        </div>
        <div className="intro-copy">
          <p className="eyebrow">{content.introKicker}</p>
          <h2 style={{ whiteSpace: "pre-line" }}>{content.introTitle}</h2>
          {content.introBody.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <a className="text-link" href="/about">
            {content.introCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>

      {listings.length ? (
        <section className="dark-section">
          <div className="shell">
            <SectionTitle
              eyebrow={content.portfolioKicker}
              title={content.portfolioTitle}
              copy={content.portfolioCopy}
              link="/properties"
            />
          </div>
          <div className="shell">
            <ListingGrid items={listings} />
          </div>
        </section>
      ) : null}

      <section className="stats shell">
        {catalog.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="editorial-split">
        <div
          className="editorial-image image-cover"
          style={{ backgroundImage: `url('${editorialImage}')` }}
        />
        <div className="editorial-copy">
          <p className="eyebrow">{content.editorialKicker}</p>
          <h2 style={{ whiteSpace: "pre-line" }}>{content.editorialTitle}</h2>
          <p>{content.editorialBody}</p>
          <a className="button outline-button" href="/neighborhoods">
            {content.editorialCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>

      {notes.length ? (
      <section className="insights-home shell">
        <SectionTitle
          eyebrow={content.insightsKicker}
          title={content.insightsTitle}
          link="/insights"
        />
        <div className="insight-list">
          {notes.map((item, index) => (
            <a key={item.slug} href={`/insights/${item.slug}`} className="insight-row">
              <span className="insight-num">0{index + 1}</span>
              <div>
                <small>
                  {item.category} · {item.date}
                </small>
                <h3>{item.title}</h3>
              </div>
              <p>{item.excerpt}</p>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
      ) : null}
      <NewsletterBlock />
    </AveryChrome>
  );
}
