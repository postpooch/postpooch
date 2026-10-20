import type { TemplatePageProps } from "../../../types";
import { Arrow } from "../../components/icons";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraAboutContent } from "./schema";

export function MaraAboutPage({
  site,
  settings,
  content,
}: TemplatePageProps<MaraAboutContent, MaraSettings>) {
  const portrait = content.portraitImage || settings.images.portrait;

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="profileHero">
        <div className="profileIntro">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            {content.titleLine2}
            <br />
            {content.titleLine3}
          </h1>
          <p>{content.intro}</p>
        </div>
        <div className="profileImage">
          <img src={portrait} alt={`Portrait placeholder for ${settings.agent.name}`} />
        </div>
      </section>
      <section className="facts">
        <div>
          <strong>{content.fact1Value}</strong>
          <span>{content.fact1Label}</span>
        </div>
        <div>
          <strong>{content.fact2Value}</strong>
          <span>{content.fact2Label}</span>
        </div>
        <div>
          <strong>{content.fact3Value}</strong>
          <span>{content.fact3Label}</span>
        </div>
      </section>
      <section className="storyGrid section">
        <div>
          <p className="eyebrow">{content.whyEyebrow}</p>
          <h2>{content.whyTitle}</h2>
        </div>
        <div className="storyText">
          {content.whyParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>
      <section className="section wide">
        <div className="storyGrid">
          <div className="storyPortrait">
            <img src={content.attentionImage} alt="Architectural interior" />
          </div>
          <div className="splitCopy">
            <p className="eyebrow">{content.attentionEyebrow}</p>
            <h2>{content.attentionTitle}</h2>
            <p>{content.attentionBody}</p>
            <a className="button dark" href="/contact">
              {content.attentionCta} <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">{content.helpEyebrow}</p>
        <div className="simpleCards">
          <article className="simpleCard">
            <div>
              <h3>{content.buyingTitle}</h3>
              <p>{content.buyingBody}</p>
            </div>
            <a className="textLink" href="/buy">
              {content.buyingCta} <span>→</span>
            </a>
          </article>
          <article className="simpleCard">
            <div>
              <h3>{content.sellingTitle}</h3>
              <p>{content.sellingBody}</p>
            </div>
            <a className="textLink" href="/sell">
              {content.sellingCta} <span>→</span>
            </a>
          </article>
          <article className="simpleCard">
            <div>
              <h3>{content.advisoryTitle}</h3>
              <p>{content.advisoryBody}</p>
            </div>
            <a className="textLink" href="/valuation">
              {content.advisoryCta} <span>→</span>
            </a>
          </article>
        </div>
      </section>
    </MaraChrome>
  );
}
