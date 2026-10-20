import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { Arrow } from "../../components/icons";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraPropertyContent } from "./schema";
import { toMaraProperty } from "../../../property-adapters";

export function MaraPropertyPage({
  site,
  settings,
  content,
  params,
  properties,
}: TemplatePageProps<MaraPropertyContent, MaraSettings>) {
  const source = properties.find((item) => item.slug === params.slug);
  if (!source) notFound();
  const property = toMaraProperty(source);

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="detailHero">
        <img src={property.image} alt={property.address} />
        <div className="detailHeroText">
          <div>
            <p>
              {property.status} · {property.neighborhood}
            </p>
            <h1>{property.address}</h1>
          </div>
          <strong>{property.price}</strong>
        </div>
      </section>
      <section className="detailSpecs">
        <div>
          <strong>{property.beds}</strong>
          <span>Bedrooms</span>
        </div>
        <div>
          <strong>{property.baths}</strong>
          <span>Bathrooms</span>
        </div>
        <div>
          <strong>{property.sqft}</strong>
          <span>Interior</span>
        </div>
        <div>
          <strong>{property.neighborhood}</strong>
          <span>Neighbourhood</span>
        </div>
      </section>
      <section className="introSplit section">
        <p className="eyebrow">{content.residenceEyebrow}</p>
        <div>
          <h2>{property.address}</h2>
          {property.summary ? <p>{property.summary}</p> : null}
        </div>
      </section>
      {source.images.length ? (
      <section className="section wide">
        <div className="galleryMosaic">
          {source.images.map((image, index) => (
            <div key={`${image}-${index}`}>
              <img src={image} alt={`${property.address} view ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
      ) : null}
      <section className="splitMedia section">
        <div className="splitImage">
          <img src={content.showingImage} alt="Interior detail" />
        </div>
        <div className="splitCopy">
          <p className="eyebrow">{content.showingEyebrow}</p>
          <h2>{content.showingTitle}</h2>
          <p>{content.showingBody}</p>
          <a className="button dark" href="/contact">
            {content.showingCta} <Arrow />
          </a>
        </div>
      </section>
      <section className="formSection section">
        <ContactForm title={`${content.formTitlePrefix} ${property.address}`} />
      </section>
    </MaraChrome>
  );
}
