import type { TemplatePageProps } from "../../../types";
import { toAureliaProperty } from "../../../property-adapters";
import { AureliaChrome } from "../../components/aurelia-chrome";
import { PageHero } from "../../components/page-hero";
import { PropertyGrid } from "../../components/property-grid";
import type { AureliaSettings } from "../../settings";

import type { AureliaAboutContent } from "./schema";

export function AureliaAboutPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<AureliaAboutContent, AureliaSettings>) {
  const { agent } = settings;
  const listings = properties
    .map(toAureliaProperty)
    .filter((property) => property.type === "sale")
    .slice(0, 4);

  return (
    <AureliaChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="about-profile">
        <img src={content.portrait} alt="" />
        <div className="about-profile-card">
          <p className="kicker light">{content.profileKicker}</p>
          <h2>{agent.name}</h2>
          <div className="profile-detail">
            <span>Phone</span>
            <span>{agent.phone}</span>
          </div>
          <div className="profile-detail">
            <span>Email</span>
            <span>{agent.email}</span>
          </div>
          <div className="profile-detail">
            <span>License</span>
            <span>{agent.license}</span>
          </div>
          <div className="profile-detail">
            <span>Office</span>
            <span>{agent.address}</span>
          </div>
        </div>
      </section>
      <section className="section-pad section-space content-two-col">
        <div className="sticky-note">
          <p className="eyebrow-line">{content.noteKicker}</p>
        </div>
        <div className="prose">
          <p className="prose-large">{content.lead}</p>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <h3>{content.globalTitle}</h3>
          <p>{content.globalBody}</p>
          <h3>{content.designTitle}</h3>
          <p>{content.designBody}</p>
        </div>
      </section>
      <section className="section-pad section-space" style={{ background: "#e9e2d7" }}>
        <p className="kicker">{content.recognitionKicker}</p>
        <div className="logo-cloud">
          {content.recognitionLogos.map((logo) => (
            <div className="logo-cell" key={logo}>
              {logo.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
      {listings.length ? (
        <section className="section-pad section-space">
          <div className="section-head">
            <div>
              <p className="kicker">{content.listingsKicker}</p>
              <h2 className="section-title">{content.listingsTitle}</h2>
            </div>
          </div>
          <PropertyGrid items={listings} />
        </section>
      ) : null}
    </AureliaChrome>
  );
}
