import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toHarborPost } from "../../../blog-post-adapters";
import { toHarborListing } from "../../../property-adapters";
import { HarborChrome } from "../../components/harbor-chrome";
import { ListingCard } from "../../components/listing-card";
import { TestimonialStrip } from "../../components/testimonial-strip";
import type { HarborSettings } from "../../settings";

import type { HarborHomeContent } from "./schema";

export function HarborHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<HarborHomeContent, HarborSettings>) {
  const { catalog } = settings;
  const featured = properties.filter(isAvailableListing).slice(0, 4).map(toHarborListing);
  const posts = blogPosts.map(toHarborPost).slice(0, 3);

  return (
    <HarborChrome site={site} settings={settings}>
      <section className="home-hero">
        <div className="hero-photo">
          <img src={content.heroImage} alt={content.heroImageAlt} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-copy shell">
          <p className="kicker light">{content.heroKicker}</p>
          <h1>
            {content.heroTitleLine1}
            <br />
            <em>{content.heroTitleItalic}</em>
          </h1>
          <p>{content.heroBody}</p>
          <div className="hero-actions">
            <a className="button button-light" href="/sell">
              {content.heroCtaSell} <span>↗</span>
            </a>
            <a className="button button-ghost" href="/buy">
              {content.heroCtaBuy} <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-side-note">
          <span>{content.heroSideNoteNumber}</span>
          <p>
            {content.heroSideNote.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="intro section-pad shell">
        <div className="intro-number">
          {content.introYears}
          <span>{content.introYearsSuffix}</span>
          <small>{content.introYearsLabel}</small>
        </div>
        <div className="intro-copy">
          <p className="kicker">{content.introKicker}</p>
          <h2>
            {content.introTitleBefore} <em>{content.introTitleItalic}</em>
          </h2>
          <p>{content.introBody}</p>
          <a className="text-link" href="/about">
            {content.introCta} <span>↗</span>
          </a>
        </div>
      </section>

      <section className="feature-split">
        <div className="feature-image">
          <img src={content.sellImage} alt={content.sellImageAlt} />
        </div>
        <div className="feature-copy dark-panel">
          <p className="kicker muted">{content.sellKicker}</p>
          <h2>
            {content.sellTitleBefore} <em>{content.sellTitleItalic}</em>
          </h2>
          <p>{content.sellBody}</p>
          <a href="/sell" className="button button-light">
            {content.sellCta} <span>↗</span>
          </a>
          <a href="/marketing" className="text-link light-link">
            {content.sellMarketingCta} <span>↗</span>
          </a>
        </div>
      </section>

      {featured.length ? <section className="listings-section section-pad shell">
        <div className="section-head split">
          <div>
            <p className="kicker">{content.listingsKicker}</p>
            <h2>
              {content.listingsTitleBefore}{" "}
              <em>{content.listingsTitleItalic}</em>
            </h2>
          </div>
          <a className="text-link" href="/listings">
            {content.listingsCta} <span>↗</span>
          </a>
        </div>
        <div className="listing-grid home-grid">
          {featured.map((l, i) => (
            <ListingCard key={l.slug} listing={l} large={i === 0} />
          ))}
        </div>
      </section> : null}

      <TestimonialStrip testimonials={catalog.testimonials} />

      <section className="buy-section section-pad shell">
        <div className="buy-copy">
          <p className="kicker">{content.buyKicker}</p>
          <h2>
            {content.buyTitleLine1}
            <br />
            {content.buyTitleBefore} <em>{content.buyTitleItalic}</em>
          </h2>
          <p>{content.buyBody}</p>
          <a className="button button-dark" href="/buy">
            {content.buyCta} <span>↗</span>
          </a>
        </div>
        <div className="buy-image-stack">
          <img
            className="buy-main"
            src={content.buyMainImage}
            alt={content.buyMainImageAlt}
          />
          <img
            className="buy-small"
            src={content.buySmallImage}
            alt={content.buySmallImageAlt}
          />
        </div>
      </section>

      <section className="neighbourhood-section dark-panel section-pad">
        <div className="shell">
          <div className="section-head split">
            <div>
              <p className="kicker muted">{content.neighbourhoodKicker}</p>
              <h2>
                {content.neighbourhoodTitleLine1}
                <br />
                <em>{content.neighbourhoodTitleItalic}</em>
              </h2>
            </div>
            <p>{content.neighbourhoodBody}</p>
          </div>
          <div className="neighbourhood-list">
            {catalog.neighbourhoods.map((n, i) => (
              <a href="/contact" key={n}>
                <span>0{i + 1}</span>
                <strong>{n}</strong>
                <b>↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      {posts.length ? (
      <section className="journal-preview section-pad shell">
        <div className="section-head split">
          <div>
            <p className="kicker">{content.journalKicker}</p>
            <h2>
              {content.journalTitleBefore}{" "}
              <em>{content.journalTitleItalic}</em>
            </h2>
          </div>
          <a href="/journal" className="text-link">
            {content.journalCta} <span>↗</span>
          </a>
        </div>
        <div className="post-grid">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="post-card"
            >
              {post.image ? <img src={post.image} alt="" /> : null}
              <p className="kicker">
                {post.category} · {post.date}
              </p>
              <h3>{post.title}</h3>
              <p>{post.dek}</p>
              <span className="text-link">{content.journalReadLabel}</span>
            </a>
          ))}
        </div>
      </section>
      ) : null}
    </HarborChrome>
  );
}
