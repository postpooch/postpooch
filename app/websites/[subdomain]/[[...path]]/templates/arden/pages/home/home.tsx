import { exclusiveListings } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { images } from "../../catalog-defaults";
import { ArdenChrome } from "../../components/arden-chrome";
import { EditorialCta, Hero, PropertyGrid, SectionHeading, SplitFeature } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenHomeContent } from "./schema";

export function ArdenHomePage({
  site,
  settings,
  content,
  properties: websiteProperties,
}: TemplatePageProps<ArdenHomeContent, ArdenSettings>) {
  const featured = exclusiveListings(websiteProperties).slice(0, 4).map(toArdenProperty);
  const founder = settings.catalog.agents[0];
  const press = settings.catalog.press.slice(0, 3);
  const places = settings.catalog.neighborhoods.slice(0, 2);

  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        image={settings.hero.image}
        eyebrow={settings.hero.eyebrow}
        title={settings.hero.title}
        subtitle={settings.hero.subtitle}
      />
      <section className="introPanel">
        <h2>
          {content.introTitle.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <div className="copy">
          {content.introCopy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a href="/about" className="textLink">
            {content.introCtaLabel} ↗
          </a>
        </div>
      </section>
      {featured.length ? (
      <section className="section">
        <SectionHeading
          eyebrow={content.listingsEyebrow}
          title={content.listingsTitle}
          copy={content.listingsCopy}
        />
        <PropertyGrid items={featured} />
        <a className="textLink" href="/properties/sale">
          {content.listingsCtaLabel} ↗
        </a>
      </section>
      ) : null}
      <section className="statsBand">
        {settings.results.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>
      {founder ? (
        <SplitFeature
          image={founder.image}
          eyebrow={content.founderEyebrow}
          title={content.founderTitle}
          href={`/agents/${founder.slug}`}
          label={content.founderCtaLabel}
        >
          <p>{founder.intro}</p>
          <p>{content.founderCopy}</p>
        </SplitFeature>
      ) : null}
      <section className="section">
        <SectionHeading
          eyebrow={content.pressEyebrow}
          title={content.pressTitle}
          copy={content.pressCopy}
        />
        <div className="pressGrid">
          {press.map((item) => (
            <div className="pressCard" key={item.title}>
              <span className="pub">{item.publication}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="read">Read More ↗</span>
            </div>
          ))}
        </div>
        <a className="textLink" href="/press">
          View All Press ↗
        </a>
      </section>
      <SplitFeature
        reverse
        image={images.landscape}
        eyebrow={content.sellerEyebrow}
        title={content.sellerTitle}
        href="/sell-your-home"
        label={content.sellerCtaLabel}
      >
        <p>{content.sellerCopy}</p>
      </SplitFeature>
      <section className="section">
        <SectionHeading
          center
          eyebrow={content.lifestyleEyebrow}
          title={content.lifestyleTitle}
          copy={content.lifestyleCopy}
        />
        <div className="ctaGrid">
          {places.map((place) => (
            <EditorialCta
              key={place.slug}
              image={place.image}
              title={place.name}
              copy={place.tagline}
              href={`/neighborhoods/${place.slug}`}
              label="Explore Community"
            />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 35 }}>
          <a href="/neighborhoods" className="textLink">
            Explore All Communities ↗
          </a>
        </div>
      </section>
      <section className="logoBand">
        {content.logos.map((logo) => (
          <span key={logo}>{logo}</span>
        ))}
      </section>
    </ArdenChrome>
  );
}
