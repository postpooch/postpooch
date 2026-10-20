import type { CoastalGuideStep } from "../settings";

import { PageHero } from "./page-hero";

type StepPageProps = {
  section: string;
  base: string;
  steps: readonly CoastalGuideStep[];
  current?: string;
  image: string;
  processTitle: string;
  processBody: string;
  quote: string;
  focusTitle: string;
  focusItems: readonly string[];
};

export function firstStep(
  steps: readonly CoastalGuideStep[],
  slug: string | undefined,
): CoastalGuideStep | undefined {
  return steps.find((step) => step.slug === slug) ?? steps[0];
}

export function StepPage({
  section,
  base,
  steps,
  current,
  image,
  processTitle,
  processBody,
  quote,
  focusTitle,
  focusItems,
}: StepPageProps) {
  const idx = Math.max(
    0,
    steps.findIndex((step) => step.slug === current),
  );
  const step = steps[idx];
  if (!step) return null;

  return (
    <>
      <PageHero eyebrow={section} title={step.title} image={image} />
      <section className="contentShell twoColumnContent">
        <aside className="stepsNav">
          <p className="eyebrow">{section} Guide</p>
          {steps.map((item, index) => (
            <a
              key={item.slug}
              className={index === idx ? "active" : ""}
              href={`/${base}/${item.slug}`}
            >
              {String(index + 1).padStart(2, "0")} <span>{item.title}</span>
            </a>
          ))}
        </aside>
        <article className="editorialArticle">
          <p className="lede">{step.intro}</p>
          <h2>{processTitle}</h2>
          <p>{processBody}</p>
          <p>
            At this stage, the focus is on reducing uncertainty. We’ll review the
            practical questions, identify any specialists who should be involved,
            and create a clear next step so momentum never comes at the expense of
            judgment.
          </p>
          <blockquote>{quote}</blockquote>
          <h3>{focusTitle}</h3>
          <ul>
            {focusItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="articlePager">
            {idx > 0 ? (
              <a href={`/${base}/${steps[idx - 1]!.slug}`}>← {steps[idx - 1]!.title}</a>
            ) : (
              <span />
            )}
            {idx < steps.length - 1 ? (
              <a href={`/${base}/${steps[idx + 1]!.slug}`}>{steps[idx + 1]!.title} →</a>
            ) : (
              <a href="/contact">Start a conversation →</a>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
