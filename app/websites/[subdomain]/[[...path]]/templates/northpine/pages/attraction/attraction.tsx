import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { NorthpineInnerPage } from "../../components/northpine-chrome";
import type { NorthpineSettings } from "../../settings";

import type { NorthpineAttractionContent } from "./schema";

export function NorthpineAttractionPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<NorthpineAttractionContent, NorthpineSettings>) {
  const attraction = settings.catalog.attractions.find(
    (item) => item.slug === params.slug,
  );
  if (!attraction) notFound();

  return (
    <NorthpineInnerPage
      site={site}
      settings={settings}
      title={attraction.title}
      subtitle={attraction.intro}
      image={attraction.image}
      current={attraction.title}
    >
      <section className="section-pad container article">
        <div className="article-image">
          <img src={attraction.image} alt={attraction.title} />
        </div>
        <p className="lead">{attraction.intro}</p>
        <p>{content.body}</p>
        <h2>{content.localTitle}</h2>
        <p>{content.localBody}</p>
        <a href={content.ctaHref} className="btn btn-dark">
          {content.ctaLabel}
        </a>
      </section>
    </NorthpineInnerPage>
  );
}
