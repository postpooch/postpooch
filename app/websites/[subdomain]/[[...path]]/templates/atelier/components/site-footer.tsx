import type { AtelierSettings } from "../settings";

type SiteFooterProps = {
  settings: AtelierSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { brand, agent } = settings;

  return (
    <footer className="footer">
      <section className="footerCta">
        <div>
          <p className="kicker light">Private representation, thoughtfully delivered</p>
          <h2>
            Make your next move
            <br />
            <em>exceptional.</em>
          </h2>
        </div>
        <div>
          <p>
            Whether you are buying, selling, or simply planning ahead, begin with a
            confidential conversation.
          </p>
          <a href="/contact" className="textLink lightLink">
            Start a conversation <span>↗</span>
          </a>
        </div>
      </section>
      <section className="footerGrid">
        <div>
          <div className="wordmark footerMark">
            <span>{brand.wordmarkTop}</span>
            <span>{brand.wordmarkBottom}</span>
          </div>
          <p>
            {agent.name}
            <br />
            {agent.title}
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            {agent.phone}
            <br />
            {agent.email}
            <br />
            {agent.address}
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <p>
            <a href="/properties">Properties</a>
            <br />
            <a href="/communities">Communities</a>
            <br />
            <a href="/journal">Journal</a>
            <br />
            <a href="/valuation">Home Valuation</a>
          </p>
        </div>
        <div>
          <h4>Follow</h4>
          <p>
            Instagram
            <br />
            LinkedIn
            <br />
            YouTube
          </p>
        </div>
      </section>
      <div className="legal">
        <span>© {new Date().getFullYear()} {brand.siteName}. Template demonstration.</span>
        <span>Equal Housing Opportunity · Privacy · Terms</span>
      </div>
    </footer>
  );
}
