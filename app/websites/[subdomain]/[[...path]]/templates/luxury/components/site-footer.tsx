import type { LuxurySettings } from "../settings";

type SiteFooterProps = {
  settings: LuxurySettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { brand, realtor, brokerage, callsToAction } = settings;

  return (
    <footer className="site-footer">
      <section
        className="footer-cta image-cover"
        style={{
          backgroundImage: `linear-gradient(var(--overlay), var(--overlay)), url(${realtor.lifestyleImage})`,
        }}
      >
        <p className="eyebrow">BEGIN A CONVERSATION</p>
        <h2>{callsToAction.workWithTitle}</h2>
        <p>{callsToAction.workWithSubtitle}</p>
        <div className="button-row center">
          <a className="button button-light" href="/contact">
            Contact
          </a>
          <a className="text-link light" href="/home-search">
            Search Homes
          </a>
        </div>
      </section>
      <section className="footer-main">
        <div className="footer-brand">
          <div className="monogram">{brand.monogram}</div>
          <div className="brand-lockup brand-lockup-light">
            <span>{brand.logoTextTop}</span>
            <small>{brand.logoTextBottom}</small>
          </div>
        </div>
        <div>
          <h3>{realtor.name}</h3>
          <a href={`tel:${realtor.phone}`}>{realtor.phone}</a>
          <a href={`mailto:${realtor.email}`}>{realtor.email}</a>
          <p>{realtor.license}</p>
        </div>
        <div>
          <h3>Office</h3>
          <p>
            {brokerage.addressLine1}
            <br />
            {brokerage.addressLine2}
          </p>
          <p>
            {brokerage.name}
            <br />
            {brokerage.officePhone}
          </p>
        </div>
        <div className="footer-links">
          <h3>Explore</h3>
          <a href="/about">About</a>
          <a href="/exclusive-listings">Properties</a>
          <a href="/neighborhoods">Communities</a>
          <a href="/blog">Journal</a>
          <a href="/contact">Contact</a>
        </div>
      </section>
      <section className="footer-legal">
        <p>{brokerage.disclaimer}</p>
        <p>{brokerage.equalHousingText}</p>
        <div>
          <span>
            © {new Date().getFullYear()} {realtor.name}
          </span>
          <a href="/privacy">Privacy</a>
          <a href="/brand-studio">Template Studio</a>
        </div>
      </section>
    </footer>
  );
}
