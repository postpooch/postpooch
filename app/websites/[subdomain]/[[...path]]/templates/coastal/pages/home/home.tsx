import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toCoastalProperty } from "../../../property-adapters";
import { CoastalChrome } from "../../components/coastal-chrome";
import { PropertyCard } from "../../components/property-card";
import { SearchBar } from "../../components/search-bar";
import { SectionHeading } from "../../components/section-heading";
import type { CoastalSettings } from "../../settings";

import type { CoastalHomeContent } from "./schema";

export function CoastalHomePage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<CoastalHomeContent, CoastalSettings>) {
  const { agent, catalog } = settings;
  const featured = properties
    .filter(isAvailableListing)
    .map(toCoastalProperty)
    .slice(0, 6);
  const review = catalog.testimonials[0];

  return (
    <CoastalChrome site={site} settings={settings}>
      <section className="homeHero">
        <div className="heroSlides" aria-hidden>
          <div className="heroSlide s1" style={{ backgroundImage: `url(${content.heroSlide1})` }} />
          <div className="heroSlide s2" style={{ backgroundImage: `url(${content.heroSlide2})` }} />
          <div className="heroSlide s3" style={{ backgroundImage: `url(${content.heroSlide3})` }} />
        </div>
        <div className="heroOverlay" />
        <div className="homeHeroContent">
          <p className="eyebrow light">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p>{agent.shortBio}</p>
          <div className="heroActions">
            <a className="button buttonLight" href={content.heroCtaHref}>
              {content.heroCtaLabel}
            </a>
            <a className="textLink light" href={content.heroSecondaryHref}>
              {content.heroSecondaryLabel}
            </a>
          </div>
        </div>
        {site.propertiesEnabled ? (
          <div className="heroSearch">
            <SearchBar />
          </div>
        ) : null}
        <div className="heroIndex">
          01 <span /> 03
        </div>
      </section>

      {featured.length ? (
        <section className="section cream featuredSection">
          <SectionHeading
            eyebrow={content.featuredEyebrow}
            title={content.featuredTitle}
            text={content.featuredText}
          />
          <div className="propertyGrid">
            {featured.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
          <div className="centerAction">
            <a href="/listings" className="button buttonDark">
              {content.featuredCta}
            </a>
          </div>
        </section>
      ) : null}

      <section className="gatewayGrid">
        <a
          href="/communities"
          className="gatewayCard community"
          style={{ backgroundImage: `url(${content.gatewayCommunityImage})` }}
        >
          <span>{content.gatewayCommunityKicker}</span>
          <b>{content.gatewayCommunityTitle}</b>
          <em>{content.gatewayCommunityCta}</em>
        </a>
        <a
          href="/map"
          className="gatewayCard map"
          style={{ backgroundImage: `url(${content.gatewayMapImage})` }}
        >
          <span>{content.gatewayMapKicker}</span>
          <b>{content.gatewayMapTitle}</b>
          <em>{content.gatewayMapCta}</em>
        </a>
        <a
          href="/valuation"
          className="gatewayCard valuation"
          style={{ backgroundImage: `url(${content.gatewayValuationImage})` }}
        >
          <span>{content.gatewayValuationKicker}</span>
          <b>{content.gatewayValuationTitle}</b>
          <em>{content.gatewayValuationCta}</em>
        </a>
      </section>

      <section className="mediaFeature">
        <div
          className="mediaPortrait"
          style={{ backgroundImage: `url(${content.mediaPortrait})` }}
        />
        <div className="mediaPanel">
          <p className="eyebrow light">{content.mediaEyebrow}</p>
          <h2>{content.mediaTitle}</h2>
          <p>{content.mediaBody}</p>
          <div className="logoRail">
            {content.mediaLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
          <a href="/media" className="button buttonOutline">
            {content.mediaCta}
          </a>
        </div>
      </section>

      <section className="agentIntro section white">
        <div className="agentIntroCopy">
          <SectionHeading
            eyebrow={content.introEyebrow}
            title={`${agent.firstName} ${agent.lastName}`}
          />
          <p className="largeCopy">{agent.longBio}</p>
          <div className="statGrid">
            {catalog.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="inlineActions">
            <a className="button buttonDark" href="/about">
              Read More
            </a>
            <a className="textLink" href="/team">
              Meet the Team →
            </a>
          </div>
        </div>
        <div
          className="agentIntroImage"
          style={{ backgroundImage: `url(${catalog.images.portrait})` }}
        />
      </section>

      <section className="communitiesSection section ink">
        <SectionHeading
          eyebrow={content.communitiesEyebrow}
          title={content.communitiesTitle}
          text={content.communitiesText}
        />
        <div className="communityCards">
          {catalog.communities.map((community) => (
            <a
              key={community.slug}
              href={`/communities/${community.slug}`}
              className="communityCard"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.6), transparent 60%), url(${community.image})`,
              }}
            >
              <span>{community.eyebrow}</span>
              <h3>{community.name}</h3>
              <em>Explore →</em>
            </a>
          ))}
        </div>
      </section>

      {review ? (
        <section className="reviewSection section cream">
          <SectionHeading
            eyebrow={content.reviewsEyebrow}
            title={content.reviewsTitle}
            align="center"
          />
          <div className="reviewFeature">
            <blockquote>“{review.quote}”</blockquote>
            <p>{review.name}</p>
          </div>
          <a className="textLink centered" href="/testimonials">
            {content.reviewsCta}
          </a>
        </section>
      ) : null}

      <section className="socialBand">
        <div className="socialCopy">
          <p className="eyebrow light">{content.socialEyebrow}</p>
          <h2>{agent.instagram}</h2>
          <p>{content.socialBody}</p>
        </div>
        <div className="socialGrid">
          <div style={{ backgroundImage: `url(${content.social1})` }} />
          <div style={{ backgroundImage: `url(${content.social2})` }} />
          <div style={{ backgroundImage: `url(${content.social3})` }} />
          <div style={{ backgroundImage: `url(${content.social4})` }} />
        </div>
      </section>
    </CoastalChrome>
  );
}
