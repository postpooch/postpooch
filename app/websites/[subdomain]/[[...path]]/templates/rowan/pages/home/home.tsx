import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { LeadForm } from "../../components/lead-form";
import { ListingCard } from "../../components/listing-card";
import { ProjectCard } from "../../components/project-card";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanHomeContent } from "./schema";
import { toRowanListing } from "../../../property-adapters";

export function RowanHomePage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<RowanHomeContent, RowanSettings>) {
  const { agent, region, catalog } = settings;
  const { projects, testimonials } = catalog;
  const listings = properties.filter(isAvailableListing).map(toRowanListing);
  const phoneHref = `tel:${agent.phone.replace(/\s/g, "")}`;

  return (
    <RowanChrome site={site} settings={settings}>
      <section className="hero" id="top">
        <img
          className="hero__image"
          src={content.heroImage}
          alt="Modern home surrounded by forest"
        />
        <div className="hero__scrim" />
        <div className="hero__content shell">
          <p className="hero__kicker">{content.heroKicker}</p>
          <h1>
            {content.heroTitle}
            <span className="hero__accent"> {content.heroAccent}</span>
          </h1>
          <p className="hero__subhead">{content.heroSubhead}</p>
          <div className="hero__actions">
            <a className="button button--light" href={content.heroCtaHref}>
              {content.heroCtaLabel}
            </a>
            <a
              className="text-link text-link--light"
              href={content.heroSecondaryHref}
            >
              {content.heroSecondaryLabel}
            </a>
          </div>
        </div>
        <div className="hero__footer shell">
          <span>{agent.name}</span>
          <span>{region}</span>
          <span>Scroll ↓</span>
        </div>
      </section>

      <section className="statement section-pad">
        <div className="shell statement__inner">
          <p className="eyebrow">{content.statementEyebrow}</p>
          <h2>
            {content.statementHeadline}{" "}
            <em>{content.statementHeadlineEmphasis}</em>
          </h2>
          <div className="statement__grid">
            <div className="statement__copy">
              <p>{content.statementCopy}</p>
              <a className="text-link" href={content.statementCtaHref}>
                {content.statementCtaLabel}
              </a>
            </div>
            <div
              className="statement__collage"
              aria-label="Architectural and landscape imagery"
            >
              <div className="statement__frame statement__frame--one">
                <img
                  src={content.statementImageOne}
                  alt="Bright architectural interior"
                />
              </div>
              <div className="statement__frame statement__frame--two">
                <img
                  src={content.statementImageTwo}
                  alt="Mountain lake landscape"
                />
              </div>
              <div className="statement__frame statement__frame--three">
                <img
                  src={content.statementImageThree}
                  alt="Design-led home among trees"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="projects__mast">
          <div className="shell projects__mast-inner">
            <div>
              <p className="eyebrow eyebrow--light">{content.projectsEyebrow}</p>
              <h2>
                {content.projectsTitle} <sup>×{projects.length}</sup>
              </h2>
            </div>
            <p>{content.projectsIntro}</p>
          </div>
        </div>
        <div className="projects__list shell">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="buy" id="buy">
        <div className="buy__banner">
          <img src={content.buyBannerImage} alt="Mountain and lake landscape" />
          <div className="buy__banner-scrim" />
          <div className="shell buy__banner-content">
            <p className="eyebrow eyebrow--light">{content.buyBannerEyebrow}</p>
            <h2>
              {content.buyBannerTitle} <em>{content.buyBannerEmphasis}</em>
            </h2>
            <span className="buy__arrow">↓</span>
          </div>
        </div>
        <div className="shell buy__content section-pad">
          <div className="buy__copy">
            <p className="eyebrow">{content.buyEyebrow}</p>
            <h3>{content.buyHeadline}</h3>
            {content.buyCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="button button--dark" href={content.buyCtaHref}>
              {content.buyCtaLabel}
            </a>
          </div>
          <div className="buy__aside">
            <div className="buy__image-wrap">
              <img
                src={content.buyAsideImage}
                alt="Contemporary residence in a forest"
              />
            </div>
            <div className="newsletter-card">
              <p className="eyebrow">{content.newsletterEyebrow}</p>
              <h4>{content.newsletterTitle}</h4>
              <p>{content.newsletterHint}</p>
              <LeadForm compact />
            </div>
          </div>
        </div>

        {listings.length ? <div className="featured-listings shell">
          <div className="featured-listings__heading">
            <div>
              <p className="eyebrow">{content.featuredEyebrow}</p>
              <h3>{content.featuredTitle}</h3>
            </div>
            <a className="text-link" href="/listings">
              {content.featuredCtaLabel}
            </a>
          </div>
          <div className="featured-listings__grid">
            {listings.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} compact />
            ))}
          </div>
        </div> : null}
      </section>

      <section className="sell" id="sell">
        <div className="shell sell__inner section-pad">
          <div className="sell__intro">
            <p className="eyebrow eyebrow--accent">{content.sellEyebrow}</p>
            <h2>
              {content.sellHeadlineBefore} <span>→</span>{" "}
              {content.sellHeadlineAfter}{" "}
              <sup>×{content.sellerSteps.length}</sup>
            </h2>
            <p>{content.sellIntro}</p>
            <a className="button button--accent" href={content.sellCtaHref}>
              {content.sellCtaLabel}
            </a>
          </div>
          <div className="sell__steps">
            {content.sellerSteps.map((step, index) => (
              <article key={step.title} className="sell-step">
                <span>({index + 1})</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="results section-pad">
        <div className="shell">
          <div className="results__heading">
            <p className="eyebrow">{content.resultsEyebrow}</p>
            <h2>{content.resultsTitle}</h2>
          </div>
          <div className="results__grid">
            {testimonials.map((item, index) => (
              <blockquote key={item.name} className="testimonial">
                <span className="testimonial__index">0{index + 1}</span>
                <p>“{item.quote}”</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="shell about__inner section-pad">
          <div className="about__visual">
            <div className="about__label">{content.aboutLabel}</div>
            <div className="about__image-shape">
              <img
                src={content.aboutImage}
                alt="Demo real estate advisor portrait"
              />
            </div>
          </div>
          <div className="about__copy">
            <p className="eyebrow">{content.aboutEyebrow}</p>
            <h2>{agent.name}</h2>
            <p className="about__role">({agent.role})</p>
            <p className="about__lead">{content.aboutLead}</p>
            {content.aboutBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="text-link" href={content.aboutCtaHref}>
              {content.aboutCtaLabel}
            </a>
            <div className="about__tags">
              {content.aboutTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact__inner section-pad">
          <div className="contact__intro">
            <p className="eyebrow eyebrow--light">{content.contactEyebrow}</p>
            <h2>{content.contactTitle}</h2>
            <p>{content.contactIntro}</p>
            <div className="contact__direct">
              <span>Direct</span>
              <a href={phoneHref}>{agent.phone}</a>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </div>
          </div>
          <div className="contact__form">
            <p className="eyebrow eyebrow--light">{content.contactFormEyebrow}</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </RowanChrome>
  );
}
