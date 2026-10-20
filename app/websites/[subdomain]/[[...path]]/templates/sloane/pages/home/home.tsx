import { exclusiveListings } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toSloanePost } from "../../../blog-post-adapters";
import { toSloaneProperty } from "../../../property-adapters";
import { HeroSlideshow } from "../../components/hero-slideshow";
import { PropertyCard } from "../../components/property-card";
import { SectionTitle } from "../../components/section-title";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneHomeContent } from "./schema";

export function SloaneHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<SloaneHomeContent, SloaneSettings>) {
  const listings = exclusiveListings(properties).slice(0, 5).map(toSloaneProperty);
  const posts = blogPosts.map(toSloanePost).slice(0, 3);
  const review = settings.catalog.testimonials[0];
  const neighborhoods = settings.catalog.communities.slice(0, 6);
  const press = settings.catalog.press.slice(0, 4);
  const slides = [content.heroSlide1, content.heroSlide2, content.heroSlide3, content.heroSlide4];

  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="home-hero">
        <HeroSlideshow slides={slides} />
        <div className="scroll-note">{content.scrollNote}</div>
        <div className="home-hero-content">
          <div className="kicker">{content.heroKicker}</div>
          <h1>{content.heroTitle}</h1>
          <p>{content.heroSubtext}</p>
        </div>
      </section>

      <section className="statement-band">
        <div className="small">{content.statementKicker}</div>
        <h2>{content.statementTitle}</h2>
      </section>

      {listings.length ? (
        <section className="section-pad wide">
          <SectionTitle
            eyebrow={content.listingsEyebrow}
            title={content.listingsTitle}
            intro={content.listingsIntro}
          />
          <div className="property-grid">
            {listings.map((property, index) => (
              <PropertyCard key={property.slug} property={property} large={index === 0} />
            ))}
          </div>
          <a className="text-link" href="/properties/exclusive">
            {content.listingsCta} <span>↗</span>
          </a>
        </section>
      ) : null}

      <section className="section-pad dark-section">
        <div className="wide about-split">
          <div className="about-photo">
            <img src={settings.images.agent} alt={`${settings.agent.name}, luxury real estate advisor`} />
          </div>
          <div className="about-copy">
            <div className="eyebrow">{content.aboutEyebrow}</div>
            <h2>{content.aboutTitle}</h2>
            {content.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="text-link" href="/about">
              {content.aboutCta} <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="stats-band">
        {content.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {review ? (
        <section className="section-pad dark-section">
          <div className="wide testimonial-feature">
            <div>
              <div className="eyebrow">{content.testimonialEyebrow}</div>
              <blockquote>“{review.quote}”</blockquote>
              <cite>
                {review.name} · {review.type}
              </cite>
            </div>
            <div className="testimonial-side">
              <p>{content.testimonialSide}</p>
              <a className="text-link" href="/testimonials">
                {content.testimonialCta} <span>↗</span>
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad wide">
        <SectionTitle
          eyebrow={content.communitiesEyebrow}
          title={content.communitiesTitle}
          intro={content.communitiesIntro}
        />
        <div className="community-grid">
          {neighborhoods.map((community) => (
            <a href={`/communities/${community.slug}`} className="community-card" key={community.slug}>
              <img src={community.image} alt={community.name} />
              <div className="community-card-content">
                <h3>{community.name}</h3>
                <p>{community.blurb}</p>
              </div>
            </a>
          ))}
        </div>
        <a className="text-link" href="/communities">
          {content.communitiesCta} <span>↗</span>
        </a>
      </section>

      <section className="section-pad wide">
        <SectionTitle eyebrow={content.pressEyebrow} title={content.pressTitle} />
        <div>
          {press.map((item) => (
            <div className="press-row" key={item.title}>
              <span>{item.outlet}</span>
              <h3>{item.title}</h3>
              <span className="arrow">↗</span>
            </div>
          ))}
        </div>
        <a className="text-link" href="/press">
          {content.pressCta} <span>↗</span>
        </a>
      </section>

      {posts.length ? (
      <section className="section-pad wide">
        <SectionTitle eyebrow={content.journalEyebrow} title={content.journalTitle} />
        <div className="journal-grid">
          {posts.map((post) => (
            <a className="journal-card" href={`/journal/${post.slug}`} key={post.slug}>
              {post.image ? <img src={post.image} alt={post.title} /> : null}
              <div className="meta">
                {post.category} · {post.date}
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
      ) : null}

      <section className="newsletter-band">
        <div>
          <div className="eyebrow">{content.newsletterEyebrow}</div>
          <h2>{content.newsletterTitle}</h2>
          <p>{content.newsletterBody}</p>
        </div>
        <form className="newsletter-form">
          <input aria-label="Email address" type="email" placeholder="Email address" />
          <button type="button" className="solid-button">
            {content.newsletterCta}
          </button>
        </form>
      </section>
    </SloaneChrome>
  );
}
