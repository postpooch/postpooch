import type { TemplatePageProps } from "../../../types";
import { toElenaPost } from "../../../blog-post-adapters";
import { ElenaChrome } from "../../components/elena-chrome";
import type { ElenaSettings } from "../../settings";

import type { ElenaHomeContent } from "./schema";
import {
  formatPropertyArea,
  formatPropertyPrice,
  propertyLocation,
  propertyPrimaryImage,
  propertyStatusLabel,
  propertyTitle,
} from "@/lib/websites/property";

const Arrow = () => <span aria-hidden="true">↗</span>;

export function ElenaHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<ElenaHomeContent, ElenaSettings>) {
  const { agent, catalog, navItems } = settings;
  const agentName = `${agent.firstName} ${agent.lastName}`.trim();
  const notes = blogPosts.map(toElenaPost).slice(0, 4);

  return (
    <ElenaChrome site={site} settings={settings}>
      <main id="top">
        <section className="hero section-shell">
          <div className="hero-kicker">{content.heroKicker}</div>
          <div className="hero-title-wrap">
            <h1>
              {content.heroTitleLine1}
              <br />
              to <em>{content.heroTitleEmphasis}</em>
              <br />
              {content.heroTitleLine3}
            </h1>
          </div>
          <div className="hero-bottom">
            <p>{content.heroSubtext}</p>
            <a className="circle-link" href="#about" aria-label="Discover more">
              ↓
            </a>
          </div>
          <div className="hero-image-wrap">
            <div
              className="hero-image"
              role="img"
              aria-label={content.heroImageLabel}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(24,24,21,.04), rgba(24,24,21,.18)), url('${content.heroImage}')`,
              }}
            />
            <div className="image-caption">{content.heroCaption}</div>
          </div>
        </section>

        <section className="stats-band" aria-label="Career highlights">
          {catalog.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
          <div className="stats-note">{content.statsNote}</div>
        </section>

        <section id="about" className="about-section section-shell">
          <div className="section-label">{content.aboutLabel}</div>
          <div className="about-grid">
            <div className="about-portrait-frame">
              <div
                className="about-portrait"
                role="img"
                aria-label={content.aboutPortraitLabel}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(29,29,25,.02), rgba(29,29,25,.12)), url('${content.aboutPortrait}')`,
                }}
              />
              <div className="portrait-meta">
                <span>{agentName}</span>
                <span>{agent.title}</span>
              </div>
            </div>
            <div className="about-copy">
              <p className="eyebrow">{content.aboutEyebrow}</p>
              <h2>{content.aboutTitle}</h2>
              <div className="copy-columns">
                <p>{content.aboutBodyLeft}</p>
                <p>{content.aboutBodyRight}</p>
              </div>
              <a className="underlined-link" href={content.aboutCtaHref}>
                {content.aboutCtaLabel} <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="manifesto-section">
          <div
            className="manifesto-image"
            aria-hidden="true"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(22,27,23,.08), rgba(22,27,23,.58)), url('${content.manifestoImage}')`,
            }}
          />
          <div className="manifesto-copy section-shell">
            <span className="eyebrow light">{content.manifestoEyebrow}</span>
            <blockquote>{content.manifestoQuote}</blockquote>
            <span className="signature">{content.manifestoSignature}</span>
          </div>
        </section>

        <section id="expertise" className="expertise-section section-shell">
          <div className="section-label">{content.expertiseLabel}</div>
          <div className="expertise-head">
            <h2>{content.expertiseTitle}</h2>
            <p>{content.expertiseSubtext}</p>
          </div>
          <div className="service-list">
            {catalog.services.map((service) => (
              <article className="service-row" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="service-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        {properties.length ? <section id="residences" className="residences-section">
          <div className="section-shell residences-head">
            <div className="section-label">{content.residencesLabel}</div>
            <div>
              <p className="eyebrow light">{content.residencesEyebrow}</p>
              <h2>{content.residencesTitle}</h2>
            </div>
            <a
              className="underlined-link light"
              href={content.residencesCtaHref}
            >
              {content.residencesCtaLabel} <Arrow />
            </a>
          </div>
          <div className="listing-grid section-shell">
            {properties.map((listing, index) => {
              const image = propertyPrimaryImage(listing);
              return (
              <a
                className={`listing-card listing-${index + 1}`}
                href={`/residences/${listing.slug}`}
                key={listing.id}
              >
                <div
                  className="listing-image"
                  style={image ? { backgroundImage: `url('${image}')` } : undefined}
                >
                  <span className="listing-status">{propertyStatusLabel(listing.status)}</span>
                </div>
                <div className="listing-copy">
                  <div>
                    <span>{propertyLocation(listing)}</span>
                    <h3>{propertyTitle(listing)}</h3>
                  </div>
                  <div className="listing-data">
                    <strong>{formatPropertyPrice(listing)}</strong>
                    <span>{[listing.bedrooms !== null ? `${listing.bedrooms} beds` : "", listing.bathrooms !== null ? `${listing.bathrooms} baths` : "", formatPropertyArea(listing)].filter(Boolean).join(" · ")}</span>
                  </div>
                </div>
              </a>
              );
            })}
          </div>
          <p className="section-shell disclaimer">{content.residencesDisclaimer}</p>
        </section> : null}

        <section className="process-section section-shell">
          <div className="section-label">{content.processLabel}</div>
          <div className="process-grid">
            <div className="process-title">
              <p className="eyebrow">{content.processEyebrow}</p>
              <h2>{content.processTitle}</h2>
            </div>
            <div className="process-steps">
              {catalog.processSteps.map((step, index) => (
                <article key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {notes.length ? (
        <section id="journal" className="journal-section section-shell">
          <div className="journal-head">
            <div>
              <div className="section-label">{content.journalLabel}</div>
              <h2>{content.journalTitle}</h2>
            </div>
            <p>{content.journalSubtext}</p>
          </div>
          <div className="journal-grid">
            {notes.map((entry, index) => (
              <a className="journal-card" href={`/journal/${entry.slug}`} key={entry.slug}>
                <span className="journal-index">0{index + 1}</span>
                <div>
                  <p className="eyebrow">{entry.date}</p>
                  <h3>{entry.title}</h3>
                  <p>{entry.excerpt || entry.text}</p>
                </div>
                <span className="journal-arrow">↗</span>
              </a>
            ))}
          </div>
        </section>
        ) : null}

        <section id="contact" className="contact-section">
          <div
            className="contact-visual"
            aria-hidden="true"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(20,24,20,.18), rgba(20,24,20,.67)), url('${content.contactImage}')`,
            }}
          />
          <div className="contact-copy section-shell">
            <span className="eyebrow light">{content.contactEyebrow}</span>
            <h2>{content.contactTitle}</h2>
            <p>{content.contactBody}</p>
            <div className="contact-links">
              <a href={`mailto:${agent.email}`}>
                {agent.email} <Arrow />
              </a>
              <a href={`tel:${agent.phone.replace(/\s/g, "")}`}>{agent.phone}</a>
            </div>
          </div>
        </section>

        <footer className="footer section-shell">
          <div className="footer-brand">
            <span className="footer-monogram">{agent.initials}</span>
            <div>
              <strong>{agentName}</strong>
              <span>{agent.footerTagline}</span>
            </div>
          </div>
          <div className="footer-nav">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="footer-meta">
            <span>{content.footerCopyright}</span>
            <span>{content.footerLegal}</span>
          </div>
        </footer>
      </main>
    </ElenaChrome>
  );
}
