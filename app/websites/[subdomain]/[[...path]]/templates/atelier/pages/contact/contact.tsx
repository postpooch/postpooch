import type { TemplatePageProps } from "../../../types";
import { AtelierChrome } from "../../components/atelier-chrome";
import type { AtelierSettings } from "../../settings";

import type { AtelierContactContent } from "./schema";

export function AtelierContactPage({
  site,
  settings,
  content,
}: TemplatePageProps<AtelierContactContent, AtelierSettings>) {
  const { agent } = settings;

  return (
    <AtelierChrome site={site} settings={settings}>
      <section className="contactPage">
        <div
          className="contactVisual"
          style={{
            backgroundImage: `linear-gradient(180deg,rgba(8,8,7,.12),rgba(8,8,7,.45)),url("${content.visualImage}")`,
          }}
        >
          <div>
            <p className="kicker light">{content.visualEyebrow}</p>
            <h1>
              {content.visualTitle.split("\n").map((line, index, lines) => (
                <span key={line}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p>
              {agent.phone}
              <br />
              {agent.email}
            </p>
          </div>
        </div>
        <form className="contactForm">
          <p className="kicker">{content.formEyebrow}</p>
          <h2>{content.formTitle}</h2>
          <div className="formRow">
            <label>
              First name
              <input />
            </label>
            <label>
              Last name
              <input />
            </label>
          </div>
          <label>
            Email
            <input type="email" />
          </label>
          <label>
            Phone
            <input type="tel" />
          </label>
          <label>
            I’m interested in
            <select>
              <option>Buying a home</option>
              <option>Selling a home</option>
              <option>Home valuation</option>
              <option>New development</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Message
            <textarea rows={5} />
          </label>
          <button className="darkButton" type="button">
            {content.submitLabel}
          </button>
          <p className="finePrint">{content.finePrint}</p>
        </form>
      </section>
    </AtelierChrome>
  );
}
