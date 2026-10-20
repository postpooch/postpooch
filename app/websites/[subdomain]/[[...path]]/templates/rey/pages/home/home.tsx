import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { ContactBand } from "../../components/site-footer";
import { ReyChrome } from "../../components/rey-chrome";
import { ArrowLink, CommunityCard, PropertyCard } from "../../components/ui";
import { toReyProperty } from "../../../property-adapters";
import type { ReySettings } from "../../settings";

import type { ReyHomeContent } from "./schema";

export function ReyHomePage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ReyHomeContent, ReySettings>) {
  const { agent, catalog } = settings;
  const featured = properties.filter(isAvailableListing).slice(0, 4).map(toReyProperty);
  const communityPreview = catalog.communities.slice(0, 3);
  const teamPreview = catalog.team.slice(1, 4);
  const pressNames = catalog.press.map((item) => item.source);
  const marquee = [...pressNames, ...pressNames];

  return (
    <ReyChrome site={site} settings={settings} overlay>
      <section
        className="hero"
        style={{ backgroundImage: `url("${content.heroImage}")` }}
      >
        <div className="hero__content">
          <span className="eyebrow eyebrow--light">{agent.eyebrow}</span>
          <h1>
            {content.heroTitleLine1}
            <br />
            <em>{content.heroTitleEmphasis}</em>
          </h1>
          <div className="hero__meta">
            <ArrowLink href={content.heroCtaHref} light>
              {content.heroCtaLabel}
            </ArrowLink>
            <p>{agent.tagline}</p>
          </div>
        </div>
        <div className="scroll-mark">Scroll</div>
      </section>

      <section className="about-split">
        <div
          className="about-split__image"
          style={{ backgroundImage: `url("${content.aboutImage}")` }}
        />
        <div className="about-split__copy">
          <span className="eyebrow">{content.aboutEyebrow}</span>
          <h2>
            {content.aboutTitleLine1}
            <br />
            <em>{content.aboutTitleEmphasis}</em>
          </h2>
          <p>{content.aboutBody}</p>
          <div className="stat-line">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <ArrowLink href={content.aboutCtaHref}>{content.aboutCtaLabel}</ArrowLink>
        </div>
      </section>

      {featured.length ? (
      <section className="section section--white">
        <div className="section-head">
          <div>
            <span className="eyebrow">{content.propertiesEyebrow}</span>
          </div>
          <div className="section-head__right">
            <h2>
              {content.propertiesTitleLine1}
              <br />
              <em>{content.propertiesTitleEmphasis}</em>
            </h2>
            <p>{content.propertiesDeck}</p>
            <ArrowLink href={content.propertiesCtaHref}>
              {content.propertiesCtaLabel}
            </ArrowLink>
          </div>
        </div>
        {featured.length ? (
          <div className="property-grid">
            {featured.map((property, index) => (
              <PropertyCard
                key={property.slug}
                property={property}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </section>
      ) : null}

      <section className="quote-section">
        <div className="quote-mark">“</div>
        <div className="quote-copy">
          <blockquote>{content.quote}</blockquote>
          <div className="quote-by">
            <strong>{content.quoteName}</strong>
            <span>{content.quoteRole}</span>
          </div>
        </div>
      </section>

      <section className="section section--dark section--tight">
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--light">
              {content.communitiesEyebrow}
            </span>
          </div>
          <div className="section-head__right">
            <h2>
              {content.communitiesTitleLine1}
              <br />
              <em>{content.communitiesTitleEmphasis}</em>
            </h2>
            <p>{content.communitiesDeck}</p>
            <ArrowLink href={content.communitiesCtaHref} light>
              {content.communitiesCtaLabel}
            </ArrowLink>
          </div>
        </div>
      </section>
      <div className="community-strip">
        {communityPreview.map((community, index) => (
          <CommunityCard
            key={community.slug}
            community={community}
            index={index}
          />
        ))}
      </div>

      <section className="team-feature">
        <div
          className="team-feature__image"
          style={{ backgroundImage: `url("${content.teamImage}")` }}
        />
        <div className="team-feature__copy">
          <span className="eyebrow eyebrow--light">{content.teamEyebrow}</span>
          <h2>
            {content.teamTitleLine1}
            <br />
            <em>{content.teamTitleEmphasis}</em>
          </h2>
          <p>{content.teamBody}</p>
          {teamPreview.length ? (
            <div className="mini-team">
              {teamPreview.map((member) => (
                <span
                  key={member.slug}
                  style={{ backgroundImage: `url("${member.image}")` }}
                />
              ))}
            </div>
          ) : null}
          <ArrowLink href={content.teamCtaHref} light>
            {content.teamCtaLabel}
          </ArrowLink>
        </div>
      </section>

      {marquee.length ? (
        <div className="press-marquee">
          <div className="press-marquee__inner">
            {marquee.flatMap((name, index) => [
              <span key={`${name}-${index}`}>{name}</span>,
              <b key={`${name}-dash-${index}`}>—</b>,
            ])}
          </div>
        </div>
      ) : null}

      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
