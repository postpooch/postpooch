import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { MaraChrome } from "../../components/mara-chrome";
import type { MaraSettings } from "../../settings";

import type { MaraCondoContent } from "./schema";

export function MaraCondoPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<MaraCondoContent, MaraSettings>) {
  const condo = settings.catalog.condos.find((item) => item.slug === params.slug);
  if (!condo) notFound();

  return (
    <MaraChrome site={site} settings={settings}>
      <section className="detailHero">
        <img src={condo.image} alt={condo.name} />
        <div className="detailHeroText">
          <div>
            <p>Condo guide · {condo.area}</p>
            <h1>{condo.name}</h1>
          </div>
        </div>
      </section>
      <section className="introSplit section">
        <p className="eyebrow">{content.profileEyebrow}</p>
        <div>
          <h2>{condo.copy}</h2>
          <p>{content.profileBody}</p>
        </div>
      </section>
      <section className="process section">
        {content.blocks.map((b) => (
          <article key={b.number}>
            <span>{b.number}</span>
            <h3>{b.title}</h3>
            <p>{b.copy}</p>
          </article>
        ))}
      </section>
      <section className="formSection section">
        <ContactForm title={`${content.formTitlePrefix} ${condo.name}.`} />
      </section>
    </MaraChrome>
  );
}
