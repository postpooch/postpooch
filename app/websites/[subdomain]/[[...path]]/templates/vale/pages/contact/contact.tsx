import type { TemplatePageProps } from "../../../types";
import { InquiryForm } from "../../components/inquiry-form";
import { ValeChrome } from "../../components/vale-chrome";
import type { ValeSettings } from "../../settings";

import type { ValeContactContent } from "./schema";

export function ValeContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<ValeContactContent, ValeSettings>) {
  const { agent } = settings;

  return (
    <ValeChrome site={site} settings={settings}>
      <div className="contact-page page-pad">
        <header>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>
            {content.titleLine1}
            <br />
            <em>{content.titleEmphasis}</em>
          </h1>
        </header>
        <div className="contact-grid">
          <div className="contact-meta">
            <p>{content.intro}</p>
            <div>
              <small>Phone</small>
              <a href={`tel:${agent.phone}`}>{agent.phone}</a>
            </div>
            <div>
              <small>Email</small>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </div>
            <div>
              <small>Based in</small>
              <span>
                {agent.basedIn}
                <br />
                {agent.serving}
              </span>
            </div>
          </div>
          <InquiryForm />
        </div>
      </div>
    </ValeChrome>
  );
}
