import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import { PageHero } from "../../components/blocks";
import type { AtelierSettings } from "../../settings";

import type { AtelierValuationContent } from "./schema";

export function AtelierValuationPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierValuationContent, AtelierSettings>) {
  return (
    <AtelierChrome site={site} settings={settings}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        image={content.heroImage}
      />
      <section className="valuationWrap">
        <form className="valuationCard">
          <p className="kicker">{content.stepLabel}</p>
          <h2>{content.formTitle}</h2>
          <label>
            Property address
            <input placeholder="Street address" />
          </label>
          <div className="formRow">
            <label>
              City
              <input placeholder="Austin" />
            </label>
            <label>
              ZIP
              <input placeholder="78703" />
            </label>
          </div>
          <label>
            Anything we should know?
            <textarea
              placeholder="Recent renovation, architecture, privacy needs, timing…"
              rows={4}
            />
          </label>
          <button className="darkButton" type="button">
            Continue
          </button>
          <p className="finePrint">{content.finePrint}</p>
        </form>
      </section>
    </AtelierChrome>
  );
}
