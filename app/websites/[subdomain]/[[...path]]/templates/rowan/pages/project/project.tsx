import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { RowanChrome } from "../../components/rowan-chrome";
import type { RowanSettings } from "../../settings";

import type { RowanProjectContent } from "./schema";

export function RowanProjectPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<RowanProjectContent, RowanSettings>) {
  const { projects } = settings.catalog;
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === params.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length]!;

  return (
    <RowanChrome site={site} settings={settings} darkHeader>
      <section className="project-hero">
        <img src={project.image} alt={`${project.name} property`} />
        <div className="project-hero__scrim" />
        <div className="shell project-hero__content">
          <p className="eyebrow eyebrow--light">{project.eyebrow}</p>
          <h1>{project.name}</h1>
          <div className="project-hero__meta">
            <span>({project.location})</span>
            <span>{project.price}</span>
          </div>
        </div>
      </section>

      <section className="project-summary section-pad">
        <div className="shell project-summary__grid">
          <div>
            <p className="eyebrow">{content.summaryEyebrow}</p>
            <h2>{project.intro}</h2>
          </div>
          <div className="project-summary__facts">
            {project.facts.map((fact, index) => (
              <div key={fact}>
                <span>0{index + 1}</span>
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-editorial">
        <div className="shell project-editorial__grid">
          <div className="project-editorial__image project-editorial__image--main">
            <img
              src={project.image}
              alt={`${project.name} architectural view`}
            />
          </div>
          <div className="project-editorial__copy">
            <p className="eyebrow">{content.editorialEyebrow}</p>
            {project.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="button button--dark" href={content.interestCtaHref}>
              {content.interestCtaLabel}
            </a>
          </div>
          <div className="project-editorial__image project-editorial__image--secondary">
            <img
              src={content.editorialSecondaryImage}
              alt="Architectural interior with natural light"
            />
          </div>
        </div>
      </section>

      <section className="project-next">
        <a href={`/projects/${nextProject.slug}`}>
          <span className="eyebrow eyebrow--light">{content.nextEyebrow}</span>
          <strong>{nextProject.name}</strong>
          <span>↗</span>
        </a>
      </section>
    </RowanChrome>
  );
}
