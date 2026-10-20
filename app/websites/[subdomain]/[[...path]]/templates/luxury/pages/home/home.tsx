import { exclusiveListings, isSaleListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toLuxuryPost } from "../../../blog-post-adapters";
import { toLuxuryProperty } from "../../../property-adapters";
import { LuxuryChrome } from "../../components/luxury-chrome";
import { PropertyCard } from "../../components/property-card";
import { Button, Eyebrow, SectionHeading, SplitEditorial } from "../../components/ui";
import type { LuxurySettings } from "../../settings";

import type { LuxuryHomeContent } from "./schema";

export function LuxuryHomePage({
  site,
  settings,
  content,
  properties: websiteProperties,
  blogPosts,
}: TemplatePageProps<LuxuryHomeContent, LuxurySettings>) {
  const { hero, realtor, results, callsToAction, catalog } = settings;
  const { communities } = catalog;
  const inventory = exclusiveListings(websiteProperties).slice(0, 4).map(toLuxuryProperty);
  const featuredSource =
    exclusiveListings(websiteProperties)[0] ??
    websiteProperties.find(isSaleListing) ??
    websiteProperties[0];
  const featured = featuredSource ? toLuxuryProperty(featuredSource) : null;
  const posts = blogPosts.map(toLuxuryPost).slice(0, 3);

  return (
    <LuxuryChrome site={site} settings={settings}>
      <section
        className="home-hero image-cover"
        style={{
          backgroundImage: `linear-gradient(var(--overlay), var(--overlay)), url(${hero.image})`,
        }}
      >
        <div className="hero-content">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1>
            {hero.title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{hero.subtitle}</p>
          <Button href="/exclusive-listings" light>
            Explore Properties
          </Button>
        </div>
        <div className="scroll-cue">
          <span>SCROLL</span>
          <i />
        </div>
      </section>

      <section className="intro-statement section-pad">
        <Eyebrow>{content.introEyebrow}</Eyebrow>
        <h2>
          {content.introTitle.split("\n").map((line, index, lines) => (
            <span key={line}>
              {line}
              {index < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        <p>{realtor.shortBio}</p>
      </section>

      <SplitEditorial
        image={realtor.headshot}
        eyebrow="MEET YOUR ADVISOR"
        title={realtor.name}
        action={<Button href="/about">Discover the Story</Button>}
      >
        <p>{realtor.longBio[0]}</p>
        <p>{realtor.longBio[1]}</p>
      </SplitEditorial>

      <section className="results-section section-pad">
        <SectionHeading
          eyebrow={content.resultsEyebrow}
          title={content.resultsTitle}
          text={content.resultsText}
          align="center"
        />
        <div className="stats-grid">
          {results.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {inventory.length ? <section className="section-pad inventory-section">
        <SectionHeading
          eyebrow={content.inventoryEyebrow}
          title={`A curated collection of ${realtor.market} homes.`}
          text={content.inventoryText}
        />
        <div className="property-grid featured">
          {inventory.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
        <div className="section-action">
          <Button href="/exclusive-listings">View All Properties</Button>
        </div>
      </section> : null}

      {featured && (
        <section
          className="feature-sale image-cover"
          style={{
            backgroundImage: `linear-gradient(rgba(8,14,12,.25), rgba(8,14,12,.65)), url(${featured.image})`,
          }}
        >
          <div>
            <Eyebrow>FEATURED RESIDENCE</Eyebrow>
            <h2>{featured.name}</h2>
            <p>{featured.description}</p>
            <a className="text-link light" href={`/properties/${featured.slug}`}>
              Explore the Property
            </a>
          </div>
        </section>
      )}

      <section className="section-pad communities-section">
        <SectionHeading
          eyebrow={content.communitiesEyebrow}
          title={content.communitiesTitle}
          text={content.communitiesText}
          align="center"
        />
        <div className="community-grid">
          {communities.slice(0, 6).map((community) => (
            <a
              className="community-card image-cover"
              href={`/neighborhoods/${community.slug}`}
              key={community.slug}
              style={{
                backgroundImage: `linear-gradient(rgba(5,8,7,.15), rgba(5,8,7,.58)), url(${community.image})`,
              }}
            >
              <span>{community.name}</span>
              <small>{community.tagline}</small>
            </a>
          ))}
        </div>
        <div className="section-action">
          <Button href="/neighborhoods">Explore All Communities</Button>
        </div>
      </section>

      {posts.length ? (
      <section className="journal-preview section-pad">
        <SectionHeading
          eyebrow={content.journalEyebrow}
          title={content.journalTitle}
        />
        <div className="post-grid">
          {posts.map((post) => (
            <article key={post.slug}>
              {post.image ? (
                <a href={`/blog/${post.slug}`}>
                  <img src={post.image} alt={post.title} />
                </a>
              ) : null}
              <p className="eyebrow">{post.category}</p>
              <h3>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h3>
              <p>{post.excerpt}</p>
              <a className="text-link" href={`/blog/${post.slug}`}>
                Read More
              </a>
            </article>
          ))}
        </div>
      </section>
      ) : null}

      <section className="newsletter">
        <div>
          <Eyebrow>{content.newsletterEyebrow}</Eyebrow>
          <h2>{callsToAction.newsletterTitle}</h2>
          <p>{callsToAction.newsletterText}</p>
        </div>
        <form>
          <input
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
          />
          <button type="submit">Sign Up</button>
        </form>
      </section>
    </LuxuryChrome>
  );
}
