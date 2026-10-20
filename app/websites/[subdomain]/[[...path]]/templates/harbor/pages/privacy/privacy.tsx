import { Fragment } from "react";

import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import type { HarborSettings } from "../../settings";

import type { HarborPrivacyContent } from "./schema";

export function HarborPrivacyPage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborPrivacyContent, HarborSettings>) {
  return (
    <HarborChrome site={site} settings={settings}>
      <section className="legal-page shell">
        <p className="kicker">{content.kicker}</p>
        <h1>{content.title}</h1>
        <div>
          {content.sections.map((section) => (
            <Fragment key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </Fragment>
          ))}
        </div>
      </section>
    </HarborChrome>
  );
}
