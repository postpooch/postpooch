import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toAtelierPost } from "../../../blog-post-adapters";
import { toAtelierProperty } from "../../../property-adapters";
import {
  CommunityStrip,
  ContactBand,
  PropertyGrid,
  SectionHeading,
  Stats,
} from "../../components/blocks";
import { AtelierChrome } from "../../components/atelier-chrome";
import type { AtelierSettings } from "../../settings";

import type { AtelierHomeContent } from "./schema";

export function AtelierHomePage({
  site,
  settings,
  content,
  properties: websiteProperties,
  blogPosts,
}: TemplatePageProps<AtelierHomeContent, AtelierSettings>) {
  const { hero, agent, catalog } = settings;
  const properties = websiteProperties.filter(isAvailableListing).map(toAtelierProperty);
  const posts = blogPosts.map(toAtelierPost).slice(0, 3);

  return (
    <AtelierChrome site={site} settings={settings}>
      <section
        className="homeHero"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.12),rgba(8,8,7,.5)),url("${hero.image}")`,
        }}
      >
        <div className="homeHeroTop">
          <p className="kicker light">{hero.eyebrow}</p>
          <p className="heroIndex">{hero.indexLabel}</p>
        </div>
        <div className="homeHeroCopy">
          <h1>
            {hero.title}
            <br />
            <em>{hero.titleEmphasis}</em>
          </h1>
          <div className="heroLower">
            <p>{hero.subtitle}</p>
            <a href={hero.ctaHref} className="outlineButton lightButton">
              {hero.ctaLabel}
            </a>
          </div>
        </div>
        <div className="scrollCue">
          Scroll <span>↓</span>
        </div>
      </section>

      <section className="introStatement">
        <p className="kicker">{content.introEyebrow}</p>
        <h2>
          {content.introTitle} <em>{content.introTitleEmphasis}</em>{" "}
          {content.introTitleEnd}
        </h2>
        <div className="introColumns">
          <p>
            Led by {agent.name}, {settings.brand.siteName} advises buyers and
            sellers across Austin’s most distinctive neighborhoods and the Texas
            Hill Country.
          </p>
          <a className="textLink" href="/about">
            Meet {agent.firstName} <span>↗</span>
          </a>
        </div>
      </section>

      <Stats stats={settings.stats} />

      {properties.length ? (
      <section className="section shell">
        <SectionHeading
          eyebrow={content.collectionEyebrow}
          title={content.collectionTitle}
          copy={content.collectionCopy}
        />
        <PropertyGrid items={properties.slice(0, 4)} />
        <div className="centerAction">
          <a href="/properties" className="outlineButton">
            {content.collectionCta}
          </a>
        </div>
      </section>
      ) : null}

      <section className="portraitStory">
        <div
          className="portraitImage"
          style={{ backgroundImage: `url("${agent.headshot}")` }}
        />
        <div className="portraitCopy">
          <p className="kicker">{content.portraitEyebrow}</p>
          <h2>
            {content.portraitTitle}
            <br />
            <em>{content.portraitTitleEmphasis}</em>
          </h2>
          <p>{content.portraitText}</p>
          <blockquote>“{content.portraitQuote}”</blockquote>
          <a href="/about" className="textLink">
            {content.portraitCta} <span>↗</span>
          </a>
        </div>
      </section>

      <ContactBand />

      <section className="section shell">
        <SectionHeading
          eyebrow={content.communitiesEyebrow}
          title={content.communitiesTitle}
          copy={content.communitiesCopy}
        />
        <CommunityStrip communities={catalog.communities} />
      </section>

      {posts.length ? (
      <section className="journalPreview shell">
        <SectionHeading
          eyebrow={content.journalEyebrow}
          title={content.journalTitle}
        />
        <div className="journalGrid">
          {posts.map((article, index) => (
            <a
              href={`/journal/${article.slug}`}
              key={article.slug}
              className={`journalCard j${index + 1}`}
            >
              {article.image ? (
                <div
                  className="journalImage"
                  style={{ backgroundImage: `url("${article.image}")` }}
                />
              ) : null}
              <p className="kicker">
                {article.category} · {article.date}
              </p>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </a>
          ))}
        </div>
        <div className="centerAction">
          <a className="textLink" href="/journal">
            {content.journalCta} <span>↗</span>
          </a>
        </div>
      </section>
      ) : null}
    </AtelierChrome>
  );
}
