import type { ValeSettings } from "../settings";

type SiteFooterProps = {
  settings: ValeSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { agent, navItems } = settings;
  const wordmark = `${agent.wordmarkLeft} / ${agent.wordmarkRight}`;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <p className="eyebrow">A more considered move</p>
        <h2>
          Thinking about
          <br />
          what comes next?
        </h2>
        <a className="circle-link" href="/contact">
          <span>Start a conversation</span>
          <b>↗</b>
        </a>
      </div>
      <div className="footer-bottom">
        <div>
          <strong>{wordmark}</strong>
          <p>
            {agent.title}
            <br />
            {agent.market}
          </p>
        </div>
        <div>
          <p>
            {agent.phone}
            <br />
            {agent.email}
          </p>
        </div>
        <div>
          <p>
            Instagram
            <br />
            {agent.instagram}
          </p>
        </div>
        <div className="footer-links">
          {navItems
            .filter((item) => item.href !== "/contact")
            .map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
        </div>
      </div>
      <p className="fineprint">
        © {year} {agent.name}. Fictional demo identity and property content for
        template use.
      </p>
    </footer>
  );
}
