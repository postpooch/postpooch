import type { ReactNode } from "react";

import type { NorthpineGuide } from "../settings";

export function GuideView({
  path,
  base,
  steps,
  data,
  calloutTitle,
  calloutBody,
  calloutLabel,
  calloutHref,
}: {
  path: string;
  base: string;
  steps: readonly NorthpineGuide[];
  data: NorthpineGuide;
  calloutTitle: string;
  calloutBody: string;
  calloutLabel: string;
  calloutHref: string;
}): ReactNode {
  return (
    <>
      <section className="guide-tabs container wide">
        {steps.map((step) => (
          <a
            className={path.endsWith(step.slug) ? "active" : ""}
            href={`${base}/${step.slug}`}
            key={step.slug}
          >
            {step.title}
          </a>
        ))}
      </section>
      <section className="section-pad container article">
        <p className="lead">{data.intro}</p>
        {data.sections.map((section) => (
          <div className="guide-section" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
        <div className="callout">
          <h3>{calloutTitle}</h3>
          <p>{calloutBody}</p>
          <a href={calloutHref} className="btn btn-dark">
            {calloutLabel}
          </a>
        </div>
      </section>
    </>
  );
}

export function firstGuide(
  guides: readonly NorthpineGuide[],
  slug: string | undefined,
): NorthpineGuide | undefined {
  return guides.find((guide) => guide.slug === slug) ?? guides[0];
}
