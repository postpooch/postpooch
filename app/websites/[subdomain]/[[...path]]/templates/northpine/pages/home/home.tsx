import { isSaleListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toNorthpinePost } from "../../../blog-post-adapters";
import { toNorthpineProperty } from "../../../property-adapters";
import { NorthpineChrome } from "../../components/northpine-chrome";
import { SiteHeader } from "../../components/site-header";
import { HomeSearchBand } from "../../components/search-forms";
import { PostCard, PropertyGrid, SectionHeading } from "../../components/ui";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineHomeContent } from "./schema";

export function NorthpineHomePage({
  site,
  settings,
  content,
  properties: websiteProperties,
  blogPosts,
}: TemplatePageProps<NorthpineHomeContent, NorthpineSettings>) {
  const { catalog, images, agent } = settings;
  const properties = websiteProperties.filter(isSaleListing).map(toNorthpineProperty);
  const testimonial = catalog.testimonials[0];
  const posts = blogPosts.map(toNorthpinePost).slice(0, 3);

  return (
    <NorthpineChrome site={site} settings={settings} overlay>
      <div className="hero-shell">
        <SiteHeader settings={settings} />
        <section
          className="hero"
          style={{
            backgroundImage: `linear-gradient(rgba(11,15,12,.28),rgba(11,15,12,.48)),url(${content.heroImage})`,
          }}
        >
          <div className="hero-content">
            <span className="eyebrow light">{content.heroEyebrow}</span>
            <h1>
              {content.heroTitle}
              <br />
              <i>{content.heroTitleEmphasis}</i>
            </h1>
            <p>{content.heroBody}</p>
            <div className="hero-actions">
              <a href={content.heroCtaHref} className="btn btn-light">
                {content.heroCtaLabel}
              </a>
              <a href={content.heroSecondaryHref} className="text-link light">
                {content.heroSecondaryLabel} <span>↗</span>
              </a>
            </div>
          </div>
          <div className="hero-scroll">
            {content.heroScrollLabel} <span>↓</span>
          </div>
        </section>
      </div>

      <section className="quick-actions">
        <a href={content.quickOneHref}>
          <span>{content.quickOneNumber}</span>
          <b>{content.quickOneTitle}</b>
          <em>{content.quickOneMeta}</em>
        </a>
        <a href={content.quickTwoHref}>
          <span>{content.quickTwoNumber}</span>
          <b>{content.quickTwoTitle}</b>
          <em>{content.quickTwoMeta}</em>
        </a>
        <a href={content.quickThreeHref}>
          <span>{content.quickThreeNumber}</span>
          <b>{content.quickThreeTitle}</b>
          <em>{content.quickThreeMeta}</em>
        </a>
      </section>

      <section className="split-intro container wide section-pad">
        <div className="portrait-wrap">
          <img src={agent.portrait} alt={agent.name} />
        </div>
        <div className="intro-copy">
          <SectionHeading kicker={content.introKicker} title={content.introTitle} />
          <p className="lead">{content.introLead}</p>
          <p>{content.introBody}</p>
          <a href={content.introCtaHref} className="text-link">
            {content.introCtaLabel} <span>↗</span>
          </a>
        </div>
      </section>

      <section className="stats-section">
        <div className="container wide">
          <SectionHeading
            kicker={content.statsKicker}
            title={content.statsTitle}
            text={content.statsText}
            center
          />
          <div className="stats-grid">
            {catalog.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="award-line">
            {catalog.awards.map((award) => (
              <span key={award}>{award}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="hometown-section">
        <div
          className="hometown-image"
          style={{ backgroundImage: `url(${images.hometown})` }}
        />
        <div className="hometown-copy">
          <SectionHeading kicker={content.hometownKicker} title={content.hometownTitle} />
          <p>{content.hometownBodyOne}</p>
          <p>{content.hometownBodyTwo}</p>
          <a href={content.hometownCtaHref} className="btn btn-dark">
            {content.hometownCtaLabel}
          </a>
        </div>
      </section>

      <section className="section-pad container wide">
        <SectionHeading
          kicker={content.communitiesKicker}
          title={content.communitiesTitle}
          text={content.communitiesText}
        />
        <div className="community-mosaic">
          {catalog.communities.slice(0, 6).map((community, index) => (
            <a
              href={`/community/${community.slug}`}
              className={`community-card c${index + 1}`}
              key={community.slug}
            >
              <img src={community.image} alt={community.name} />
              <div>
                <span>EXPLORE</span>
                <h3>{community.name}</h3>
              </div>
            </a>
          ))}
        </div>
        <div className="center-action">
          <a href="/communities" className="btn btn-outline">
            {content.communitiesCtaLabel}
          </a>
        </div>
      </section>

      <section className="map-story">
        <div className="map-art">
          <div className="map-lines" />
          {catalog.mapLabels.map((label) => (
            <span className={`map-label ${label.className}`} key={label.label}>
              {label.label}
            </span>
          ))}
        </div>
        <div className="map-copy">
          <span className="eyebrow light">{content.mapKicker}</span>
          <h2>{content.mapTitle}</h2>
          <p>{content.mapBody}</p>
          <a href={content.mapCtaHref} className="btn btn-light">
            {content.mapCtaLabel}
          </a>
        </div>
      </section>

      {testimonial ? (
        <section className="testimonial-home section-pad">
          <div className="container">
            <SectionHeading
              kicker={content.testimonialKicker}
              title={content.testimonialTitle}
              center
            />
            <div className="quote-mark">“</div>
            <blockquote>{testimonial.quote}</blockquote>
            <p className="quote-by">
              {testimonial.name} · {testimonial.detail}
            </p>
            <a href="/testimonials" className="text-link">
              {content.testimonialCtaLabel} <span>↗</span>
            </a>
          </div>
        </section>
      ) : null}

      <HomeSearchBand
        kicker={content.searchKicker}
        title={content.searchTitle}
        image={images.interior}
        areas={catalog.communities.slice(0, 4).map((community) => community.name)}
      />

      {properties.length ? (
        <section className="section-pad container wide">
          <SectionHeading
            kicker={content.featuredKicker}
            title={content.featuredTitle}
            text={content.featuredText}
          />
          <PropertyGrid items={properties.slice(0, 4)} />
          <div className="center-action">
            <a href="/homes-for-sale-featured" className="btn btn-outline">
              {content.featuredCtaLabel}
            </a>
          </div>
        </section>
      ) : null}

      <section className="experience">
        <div className="container wide">
          <SectionHeading
            kicker={content.experienceKicker}
            title={content.experienceTitle}
            center
          />
          <div className="experience-grid">
            {catalog.experiences.map((experience) => (
              <a href={experience.href} key={experience.title}>
                <img src={experience.image} alt={experience.title} />
                <span>{experience.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {posts.length ? (
      <section className="section-pad container wide">
        <SectionHeading kicker={content.journalKicker} title={content.journalTitle} />
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      ) : null}
    </NorthpineChrome>
  );
}
