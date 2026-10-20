import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { MilaChrome } from "../../components/mila-chrome";
import type { MilaSettings } from "../../settings";

import type { MilaWoningzoekerContent } from "./schema";

export function MilaWoningzoekerPage({
  site,
  settings,
  content,
}: TemplatePageProps<MilaWoningzoekerContent, MilaSettings>) {
  return (
    <MilaChrome site={site} settings={settings}>
      <section className="searcher-hero">
        <div className="shell searcher-grid">
          <div>
            <span className="eyebrow light">{content.heroEyebrow}</span>
            <h1>
              {content.heroTitleLine1}
              <br />
              <em>{content.heroTitleEmphasis}</em>
            </h1>
            <p>{content.heroBody}</p>
          </div>
          <div className="searcher-image">
            <img src={content.heroImage} alt="Calm home interior" />
          </div>
        </div>
      </section>
      <section className="section shell searcher-form-section">
        <div>
          <span className="eyebrow">{content.formEyebrow}</span>
          <h2>{content.formTitle}</h2>
          <p>{content.formBody}</p>
        </div>
        <div>
          <ContactForm kind="searcher" />
        </div>
      </section>
    </MilaChrome>
  );
}
