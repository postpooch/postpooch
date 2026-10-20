import type { TemplatePageProps } from "../../../types";
import { HarborChrome } from "../../components/harbor-chrome";
import { LeadForm } from "../../components/lead-form";
import type { HarborSettings } from "../../settings";

import type { HarborHomeValueContent } from "./schema";

export function HarborHomeValuePage({
  site,
  settings,
  content,
}: TemplatePageProps<HarborHomeValueContent, HarborSettings>) {
  return (
    <HarborChrome site={site} settings={settings}>
      <section className="lead-page">
        <div className="lead-page-image">
          <img src={content.image} alt={content.imageAlt} />
        </div>
        <div className="lead-page-copy">
          <p className="kicker">{content.kicker}</p>
          <h1>
            {content.titleBefore} <em>{content.titleItalic}</em>
          </h1>
          <p>{content.body}</p>
          <LeadForm label={content.formLabel} />
          <small>{content.note}</small>
        </div>
      </section>
    </HarborChrome>
  );
}
