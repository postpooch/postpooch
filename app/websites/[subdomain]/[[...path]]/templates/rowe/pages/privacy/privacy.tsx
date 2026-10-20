import { Fragment } from "react";

import type { TemplatePageProps } from "../../../types";
import { RoweChrome } from "../../components/rowe-chrome";
import type { RoweSettings } from "../../settings";

import type { RowePrivacyContent } from "./schema";

export function RowePrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<RowePrivacyContent, RoweSettings>) {
  return (
    <RoweChrome site={site} settings={settings}>
      <section className="legal-page">
        <div className="page-hero-label">{content.label}</div>
        <h1>{content.title}</h1>
        <div className="legal-grid">
          <aside>
            {content.updatedLabel}
            <br />
            {content.updatedDate}
          </aside>
          <div className="legal-copy">
            {content.sections.map((section, index) => (
              <Fragment key={section.title ?? `intro-${index}`}>
                {section.title ? <h2>{section.title}</h2> : null}
                <p>
                  {section.strongPrefix ? (
                    <strong>{section.strongPrefix}</strong>
                  ) : null}
                  {section.body}
                </p>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </RoweChrome>
  );
}
