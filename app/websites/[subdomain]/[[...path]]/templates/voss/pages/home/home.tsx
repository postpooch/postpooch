import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { PropertyCard } from "../../components/property-card";
import { SiteMenu } from "../../components/site-menu";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossHomeContent } from "./schema";
import { toVossProperty } from "../../../property-adapters";

export function VossHomePage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<VossHomeContent, VossSettings>) {
  const { catalog, agent, navItems } = settings;
  const featured = properties.filter(isAvailableListing).slice(0, 4).map(toVossProperty);

  return (
    <VossChrome site={site} settings={settings} showHeader={false}>
      <main>
        <section className="hero">
          <SiteMenu
            transparent
            logoName={agent.logoName}
            logoSub={agent.logoSub}
            agentName={agent.fullName}
            market={agent.market}
            email={agent.email}
            phone={agent.phone}
            instagram={agent.instagram}
            consultationLabel={agent.consultationLabel}
            menuAside="Private representation for buyers and sellers who value clarity, discretion and a point of view."
            navItems={navItems}
          />
          <img
            className="hero__image"
            src={content.heroImage}
            alt="Manhattan architecture"
          />
          <div className="hero__shade" />
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">{content.heroEyebrow}</p>
            <h1>
              {content.heroTitleLine1}
              <br />
              <em>{content.heroTitleEmphasis}</em>
            </h1>
            <div className="hero__lower">
              <p>{content.heroDeck}</p>
              <a href={content.heroCtaHref} className="line-link line-link--light">
                {content.heroCtaLabel} <span>↗</span>
              </a>
            </div>
          </div>
          <div className="hero__index">
            <span>{content.heroIndexLeft || agent.monogram}</span>
            <span>{content.heroIndexRight}</span>
          </div>
        </section>

        <section className="intro section-pad">
          <div className="intro__side">
            <p className="eyebrow">{content.introEyebrow}</p>
            <span className="vertical-rule" />
          </div>
          <div className="intro__content">
            <h2>
              {content.introTitleLine1}
              <br />
              <em>{content.introTitleEmphasis}</em>
            </h2>
            <div className="intro__text">
              <p>{content.introBody}</p>
              <a href={content.introCtaHref} className="line-link">
                {content.introCtaLabel} <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {featured.length ? <section className="featured section-pad section-pad--topless">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{content.featuredEyebrow}</p>
              <h2>{content.featuredTitle}</h2>
            </div>
            <a className="line-link" href={content.featuredCtaHref}>
              {content.featuredCtaLabel} <span>↗</span>
            </a>
          </div>
          <div className="property-grid">
            {featured.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </div>
        </section> : null}

        <section className="manifesto">
          <div className="manifesto__word">{content.manifestoWord}</div>
          <div className="manifesto__image">
            <img
              src={content.manifestoImage}
              alt="Refined apartment interior"
            />
          </div>
          <div className="manifesto__copy">
            <p className="eyebrow eyebrow--light">{content.manifestoEyebrow}</p>
            <h2>
              {content.manifestoTitleLine1}
              <br />
              {content.manifestoTitleLine2}
            </h2>
            <p>{content.manifestoBody}</p>
            <a
              href={content.manifestoCtaHref}
              className="line-link line-link--light"
            >
              {content.manifestoCtaLabel} <span>↗</span>
            </a>
          </div>
        </section>

        <section className="numbers section-pad">
          <div className="numbers__intro">
            <p className="eyebrow">{content.numbersEyebrow}</p>
            <h2>
              {content.numbersTitleLine1}
              <br />
              <em>{content.numbersTitleEmphasis}</em>
            </h2>
          </div>
          <div className="number-grid">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="disclaimer">{content.statsDisclaimer}</p>
        </section>

        <section className="neighborhood-preview">
          <div className="neighborhood-preview__lead section-pad">
            <p className="eyebrow">{content.neighborhoodsEyebrow}</p>
            <h2>
              {content.neighborhoodsTitleLine1}
              <br />
              <em>{content.neighborhoodsTitleEmphasis}</em>
            </h2>
            <p>{content.neighborhoodsDeck}</p>
          </div>
          <div className="neighborhood-list">
            {catalog.neighborhoods.map((n, i) => (
              <a
                href="/neighborhoods"
                className="neighborhood-row"
                key={n.slug}
              >
                <span className="neighborhood-row__num">0{i + 1}</span>
                <span className="neighborhood-row__name">{n.name}</span>
                <span className="neighborhood-row__kicker">{n.kicker}</span>
                <span className="neighborhood-row__arrow">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="quote section-pad">
          <p className="quote__mark">“</p>
          <blockquote>
            {content.quoteBefore} <em>{content.quoteEmphasis}</em>{" "}
            {content.quoteAfter}
          </blockquote>
          <div className="quote__source">
            <span>{content.quoteSource}</span>
            <span>{content.quoteNote}</span>
          </div>
        </section>
      </main>
    </VossChrome>
  );
}
