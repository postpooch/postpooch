import { notFound } from "next/navigation";

import type { TemplatePageProps } from "../../../types";
import { ReyChrome } from "../../components/rey-chrome";
import { ContactBand } from "../../components/site-footer";
import { ArrowLink } from "../../components/ui";
import type { ReySettings } from "../../settings";

import type { ReyTeamMemberContent } from "./schema";

export function ReyTeamMemberPage({
  site,
  settings,
  content,
  params,
}: TemplatePageProps<ReyTeamMemberContent, ReySettings>) {
  const member = settings.catalog.team.find((item) => item.slug === params.slug);
  if (!member) notFound();

  const [firstName, ...rest] = member.name.split(" ");
  const lastName = rest.join(" ");
  const telHref = `tel:${member.phone.replace(/\D/g, "")}`;

  return (
    <ReyChrome site={site} settings={settings}>
      <section className="agent-hero">
        <div
          className="agent-hero__photo"
          style={{ backgroundImage: `url("${member.image}")` }}
        />
        <div className="agent-hero__copy">
          <span className="eyebrow">{content.meetEyebrow}</span>
          <h1>
            {firstName}
            <br />
            <em>{lastName}</em>
          </h1>
          <div className="agent-role">
            {member.role} · {member.license}
          </div>
          <div className="agent-contact">
            <a href={telHref}>{member.phone}</a>
            <a href={`mailto:${member.email}`}>{member.email}</a>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="bio-copy">
          {member.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <ArrowLink href="/contact">
            {content.contactCtaPrefix} {firstName}
          </ArrowLink>
        </div>
      </section>
      <section className="quote-section">
        <div className="quote-mark">“</div>
        <div className="quote-copy">
          <blockquote>{content.quote}</blockquote>
          <div className="quote-by">
            <strong>{member.name}</strong>
            <span>{member.role}</span>
          </div>
        </div>
      </section>
      <ContactBand settings={settings} />
    </ReyChrome>
  );
}
