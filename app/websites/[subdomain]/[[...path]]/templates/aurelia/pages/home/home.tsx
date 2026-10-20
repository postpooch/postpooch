import { exclusiveListings, isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAureliaArticle } from "../../../blog-post-adapters";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaHomeContent } from "./schema";

export function AureliaHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<AureliaHomeContent, AureliaSettings>) {
  const { agent, catalog } = settings;
  const source = exclusiveListings(properties);
  const shown = (source.length ? source : properties.filter(isAvailableListing))
    .slice(0, 4)
    .map(toAureliaProperty);
  const communityPreview = catalog.communities.slice(0, 3);
  const articles = blogPosts.map(toAureliaArticle);
  const lead = articles[0];
  const journalList = articles.slice(1, 5);

  return (
    <AureliaChrome site={site} settings={settings}>
      <section
        className="home-hero"
        style={{ backgroundImage: `url(${catalog.images.hero})` }}
      >
        <div className="home-hero-content">
          <div>
            <p className="kicker light">{agent.eyebrow}</p>
            <h1 className="display">{agent.heroTitle}</h1>
          </div>
          <div className="hero-side">
            <p>{agent.heroSubtitle}</p>
            <a className="text-button" href={content.heroCtaHref}>
              {content.heroCtaLabel} <span>→</span>
            </a>
          </div>
        </div>
        <span className="scroll-cue">{content.scrollCue}</span>
      </section>

      <section className="intro">
        <img className="intro-portrait" src={content.introPortrait} alt="" />
        <div className="intro-copy">
          <p className="kicker">{content.introKicker}</p>
          <h2>{content.introTitle}</h2>
          {content.introBody.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <div className="intro-signature">{agent.name}</div>
          <a className="text-button" href={content.introCtaHref}>
            {content.introCtaLabel} <span>→</span>
          </a>
        </div>
      </section>

      <section className="stats-band section-pad">
        {catalog.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {shown.length ? (
        <section className="properties-section section-pad section-space">
          <div className="section-head">
            <div className="section-head-copy">
              <p className="kicker">{content.portfolioKicker}</p>
              <h2 className="section-title">{content.portfolioTitle}</h2>
            </div>
            <a href="/properties" className="circle-link">
              <span>{content.portfolioCtaLabel}</span>
              <span>↗</span>
            </a>
          </div>
          <PropertyGrid items={shown} />
        </section>
      ) : null}

      <section className="quote-section section-pad">
        <p className="kicker">{content.quoteKicker}</p>
        <blockquote>{content.quote}</blockquote>
        <cite>{content.quoteCite}</cite>
      </section>

      {communityPreview.length ? (
        <section className="community-feature section-pad section-space">
          <div className="section-head">
            <div>
              <p className="kicker light">{content.communitiesKicker}</p>
              <h2 className="section-title">{content.communitiesTitle}</h2>
            </div>
            <p>{content.communitiesNote}</p>
          </div>
          <div className="community-strip">
            {communityPreview.map((community) => (
              <a key={community.slug} href={`/communities/${community.slug}`}>
                <img src={community.image} alt="" />
                <div className="community-strip-copy">
                  <h3>{community.name}</h3>
                  <span>Explore community →</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {lead ? (
        <section className="journal-home section-pad section-space">
          <div className="section-head">
            <div>
              <p className="kicker">{content.journalKicker}</p>
              <h2 className="section-title">{content.journalTitle}</h2>
            </div>
            <a href="/journal" className="text-button">
              {content.journalCtaLabel} <span>→</span>
            </a>
          </div>
          <div className="journal-home-grid">
            <a href={`/journal/${lead.slug}`} className="journal-lead">
              {lead.image ? <img src={lead.image} alt="" /> : null}
              <p className="kicker" style={{ marginTop: 18 }}>
                {lead.category}
              </p>
              <h3>{lead.title}</h3>
              <p>{lead.excerpt}</p>
            </a>
            <div className="journal-list">
              {journalList.map((article, index) => (
                <article key={article.slug}>
                  <span>0{index + 2}</span>
                  <a href={`/journal/${article.slug}`}>
                    <h4>{article.title}</h4>
                    <span>{article.date}</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </AureliaChrome>
  );
}
