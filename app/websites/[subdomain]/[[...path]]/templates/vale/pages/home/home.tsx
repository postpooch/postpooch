import { isAvailableListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toValeArticle } from "../../../blog-post-adapters";
import { toValeProperty } from "../../../property-adapters";
import { PropertyCard } from "../../components/property-card";
import { Reveal } from "../../components/reveal";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValeHomeContent } from "./schema";

export function ValeHomePage({
  site,
  settings,
  content,
  properties,
  blogPosts,
}: TemplatePageProps<ValeHomeContent, ValeSettings>) {
  const { agent } = settings;
  const featured = properties.filter(isAvailableListing).slice(0, 3).map(toValeProperty);
  const previewArticles = blogPosts.map(toValeArticle).slice(0, 3);

  return (
    <ValeChrome site={site} settings={settings}>
      <section className="home-hero">
        <div className="hero-image">
          <img src={content.heroImage} alt="Modern coastal residence" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            {content.heroEyebrowSuffix} · {agent.market}
          </p>
          <h1>
            {content.heroTitleLine1}
            <br />
            <em>{content.heroTitleEmphasis}</em>
          </h1>
          <div className="hero-sub">
            <p>{content.heroSubtext}</p>
            <a href={content.heroCtaHref} className="text-link">
              {content.heroCtaLabel} <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-index">
          <span>{content.heroIndexCurrent}</span>
          <span>/</span>
          <span>{content.heroIndexTotal}</span>
        </div>
      </section>

      <section className="manifesto page-pad">
        <Reveal>
          <p className="eyebrow">{content.manifestoEyebrow}</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="manifesto-text">{content.manifestoText}</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="manifesto-aside">
            <p>{content.manifestoAside}</p>
            <a href={content.manifestoCtaHref} className="text-link">
              {content.manifestoCtaLabel} <span>↗</span>
            </a>
          </div>
        </Reveal>
      </section>

      {featured.length ? <section className="featured page-pad">
        <div className="section-heading">
          <p className="eyebrow">{content.featuredEyebrow}</p>
          <h2>{content.featuredTitle}</h2>
          <a href="/properties" className="text-link">
            {content.featuredCtaLabel} <span>↗</span>
          </a>
        </div>
        <div className="property-grid home-grid">
          {featured.map((property, i) => (
            <Reveal key={property.slug} delay={i * 90}>
              <PropertyCard property={property} index={i} />
            </Reveal>
          ))}
        </div>
      </section> : null}

      <section className="agent-feature">
        <div className="agent-photo">
          <img src={content.agentPhoto} alt="Real estate advisor at a desk" />
        </div>
        <div className="agent-copy">
          <p className="eyebrow">{content.agentEyebrow}</p>
          <h2>{content.agentTitle}</h2>
          <p>{content.agentBody}</p>
          <a href="/about" className="circle-link inverse">
            <span>{content.agentCtaLabel}</span>
            <b>↗</b>
          </a>
        </div>
      </section>

      {previewArticles.length ? (
      <section className="journal-preview page-pad">
        <div className="section-heading">
          <p className="eyebrow">{content.journalEyebrow}</p>
          <h2>{content.journalTitle}</h2>
          <a href="/journal" className="text-link">
            {content.journalCtaLabel} <span>↗</span>
          </a>
        </div>
        <div className="article-list">
          {previewArticles.map((article, i) => (
            <a
              href={`/journal/${article.slug}`}
              className="article-row"
              key={article.slug}
            >
              <span>0{i + 1}</span>
              <div>
                <small>
                  {article.category} · {article.date}
                </small>
                <h3>{article.title}</h3>
              </div>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
      ) : null}
    </ValeChrome>
  );
}
