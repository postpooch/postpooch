import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { images } from "../../catalog-defaults";
import { ArdenChrome } from "../../components/arden-chrome";
import { ContactForm } from "../../components/forms";
import { SearchPanel } from "../../components/search-panel";
import { FilmCard, Hero } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type {
  ArdenContactContent,
  ArdenCopilotContent,
  ArdenFilmsContent,
  ArdenPressContent,
  ArdenSearchContent,
  ArdenTestimonialsContent,
} from "./schema";

export function ArdenPressPage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenPressContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        height="medium"
        image={content.heroImage ?? images.modern}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="section">
        <div className="pressGrid">
          {settings.catalog.press.map((item) => (
            <article className="pressCard" key={item.title}>
              <span className="pub">{item.publication}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="read">Read More ↗</span>
            </article>
          ))}
        </div>
        <p className="copy" style={{ marginTop: 40 }}>
          {content.body}
        </p>
      </section>
    </ArdenChrome>
  );
}

export function ArdenFilmsPage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenFilmsContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <Hero
        height="medium"
        image={content.heroImage ?? images.dusk}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <section className="section">
        <div className="filmGrid">
          {settings.catalog.films.map((film) => (
            <FilmCard key={film.title} image={film.image} title={film.title} copy={film.copy} />
          ))}
        </div>
      </section>
    </ArdenChrome>
  );
}

export function ArdenTestimonialsPage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenTestimonialsContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="pageIntro">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </section>
      <section className="testimonialGrid">
        {settings.catalog.testimonials.map((item) => (
          <article className="testimonial" key={item.cite}>
            <blockquote>“{item.quote}”</blockquote>
            <cite>{item.cite}</cite>
          </article>
        ))}
      </section>
    </ArdenChrome>
  );
}

export function ArdenContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenContactContent, ArdenSettings>) {
  const { contact } = settings;
  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="pageIntro">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <p>
          {contact.address}
          <br />
          {contact.phone}
          <br />
          {contact.email}
          <br />
          {content.hours}
        </p>
        <div style={{ maxWidth: 850, marginTop: 50 }}>
          <ContactForm />
        </div>
      </section>
    </ArdenChrome>
  );
}

function PhoneMock({ label }: { label: string }) {
  return (
    <div className="phoneMock">
      <div className="phoneScreen">
        <div className="bar" />
        <div className="tile">
          <small>{label}</small>
          <h3>Saved Homes</h3>
          <p>6 properties · 3 new notes</p>
        </div>
        <div className="tile">
          <small>New match</small>
          <h3>St. Helena</h3>
          <p>$6M–$10M · 4+ beds</p>
        </div>
        <div className="tile">
          <small>Your advisor</small>
          <p>A private opportunity was added this morning.</p>
        </div>
      </div>
    </div>
  );
}

export function ArdenCopilotPage({
  site,
  settings,
  content,
}: TemplatePageProps<ArdenCopilotContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="pageIntro">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </section>
      {content.features.map((feature, index) => (
        <section className="portalFeature" key={feature.title}>
          <div className="portalVisual">
            <PhoneMock label={`Board ${index + 1}`} />
          </div>
          <div className="portalCopy">
            <p className="eyebrow">{feature.title}</p>
            <h2>{feature.title}</h2>
            <p>{feature.copy}</p>
          </div>
        </section>
      ))}
    </ArdenChrome>
  );
}

export function ArdenSearchPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ArdenSearchContent, ArdenSettings>) {
  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="pageIntro">
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </section>
      <SearchPanel properties={properties.map(toArdenProperty)} />
    </ArdenChrome>
  );
}
