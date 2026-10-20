import type { TemplatePageProps } from "../../../types";
import { VossChrome } from "../../components/voss-chrome";
import type { VossSettings } from "../../settings";

import type { VossPressContent } from "./schema";

export function VossPressPage({
  site,
  settings,
  content,
}: TemplatePageProps<VossPressContent, VossSettings>) {
  const pressEmail = settings.agent.pressEmail;

  return (
    <VossChrome site={site} settings={settings}>
      <main>
        <section className="page-hero press-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
          <p className="page-hero__intro">{content.intro}</p>
        </section>
        <section className="press-list section-pad section-pad--topless">
          {settings.catalog.press.map((m, i) => (
            <article key={m.outlet}>
              <span>0{i + 1}</span>
              <h2>{m.outlet}</h2>
              <p>{m.title}</p>
              <small>{m.note}</small>
              <b>↗</b>
            </article>
          ))}
          <p className="disclaimer">{content.disclaimer}</p>
        </section>
        <section className="press-inquiry section-pad">
          <div>
            <p className="eyebrow eyebrow--light">{content.inquiryEyebrow}</p>
            <h2>
              {content.inquiryTitleLine1}
              <br />
              {content.inquiryTitleLine2}
            </h2>
          </div>
          <div>
            <a
              className="line-link line-link--light"
              href={`mailto:${pressEmail}`}
            >
              {pressEmail} <span>↗</span>
            </a>
            <p>{content.inquiryBody}</p>
          </div>
        </section>
      </main>
    </VossChrome>
  );
}
