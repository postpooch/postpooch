import type { TemplatePageProps } from "../../../types";
import { ContactForm } from "../../components/contact-form";
import { SloaneChrome } from "../../components/sloane-chrome";
import type { SloaneSettings } from "../../settings";

import type { SloaneValuationContent } from "./schema";

export function SloaneValuationPage({
  site,
  settings,
  content,
}: TemplatePageProps<SloaneValuationContent, SloaneSettings>) {
  return (
    <SloaneChrome site={site} settings={settings}>
      <section className="page-hero">
        <div className="inner">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
      </section>
      <section className="section-pad wide">
        <div className="resource-page-grid">
          <div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(42px,5vw,72px)",
                fontWeight: 400,
                lineHeight: 1,
                margin: 0,
              }}
            >
              {content.requestTitle}
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>{content.requestBody}</p>
          </div>
          <div className="valuation-form">
            <ContactForm title={content.formTitle} />
          </div>
        </div>
      </section>
    </SloaneChrome>
  );
}
