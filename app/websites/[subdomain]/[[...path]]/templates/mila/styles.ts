/** Scoped Mila template CSS — all selectors under .mila-site */
export const MILA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.mila-site {
--paper: #f7f2ea;
  --paper-2: #efe6da;
  --ink: #211b1e;
  --muted: #756b6f;
  --wine: #5c2638;
  --wine-dark: #3d1926;
  --clay: #bd7159;
  --sage: #9da797;
  --line: rgba(33,27,30,.14);
  --white: #fffdf9;
  --shadow: 0 25px 70px rgba(53, 34, 39, .12);
  --serif: Georgia, 'Times New Roman', serif;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.mila-site {
  margin: 0; background: var(--paper); color: var(--ink); font-family: var(--sans); font-size: 16px; line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}
.mila-site main { flex: 1; }

.mila-site, .mila-site *{ box-sizing: border-box; }

.mila-site a{ color: inherit; text-decoration: none; }
.mila-site img{ width: 100%; height: 100%; object-fit: cover; display: block; }
.mila-site button, .mila-site input, .mila-site textarea, .mila-site select{ font: inherit; }
.mila-site button{ color: inherit; }
.mila-site ::selection{ background: var(--wine); color: var(--white); }
.mila-site .shell{ width: min(1240px, calc(100% - 48px)); margin: 0 auto; }
.mila-site .section{ padding-top: 120px; padding-bottom: 120px; }
.mila-site .eyebrow{ display: inline-flex; align-items: center; gap: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: .17em; font-weight: 700; color: var(--wine); }
.mila-site .eyebrow::before{ content: ''; width: 24px; height: 1px; background: currentColor; }
.mila-site .eyebrow.light{ color: #eadcd8; }
.mila-site h1, .mila-site h2, .mila-site h3, .mila-site p{ margin-top: 0; }
.mila-site h1, .mila-site h2, .mila-site h3{ font-family: var(--serif); font-weight: 400; line-height: .98; letter-spacing: -.03em; }
.mila-site h1{ font-size: clamp(56px, 7.5vw, 112px); margin-bottom: 28px; }
.mila-site h2{ font-size: clamp(42px, 5vw, 72px); margin-bottom: 24px; }
.mila-site h3{ font-size: 30px; }
.mila-site em{ font-weight: 400; color: var(--clay); }
.mila-site .lead{ font-family: var(--serif); font-size: clamp(22px, 2.2vw, 30px); line-height: 1.38; color: #4c4246; }
.mila-site .light-text{ color: var(--white); }

.mila-site .button{ display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 0 22px; border: 1px solid transparent; border-radius: 999px; font-size: 14px; font-weight: 700; transition: .25s ease; cursor: pointer; }
.mila-site .button:hover{ transform: translateY(-2px); }
.mila-site .button-dark{ background: var(--ink); color: white; }
.mila-site .button-dark:hover{ background: var(--wine); }
.mila-site .button-light{ background: var(--white); color: var(--ink); }
.mila-site .button-light:hover{ background: var(--paper-2); }
.mila-site .button-outline{ border-color: var(--line); background: transparent; }
.mila-site .button-outline:hover{ border-color: var(--wine); color: var(--wine); }
.mila-site .button-small{ min-height: 44px; padding: 0 16px; background: var(--wine); color: white; font-size: 13px; }
.mila-site .text-link{ display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; border-bottom: 1px solid currentColor; padding-bottom: 3px; }
.mila-site .light-link{ color: #f4e8e2; }
.mila-site .circle-arrow{ width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; flex: 0 0 auto; }

.mila-site /* Header */
.site-header{ position: sticky; top: 0; z-index: 50; display: grid; grid-template-columns: 220px 1fr auto; align-items: center; gap: 28px; width: 100%; min-height: 88px; padding: 0 28px; background: rgba(247,242,234,.92); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(33,27,30,.08); }
.mila-site .brand{ display: inline-flex; align-items: center; gap: 11px; width: fit-content; }
.mila-site .brand-mark{ width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50% 50% 50% 8px; background: var(--wine); color: white; font-family: var(--serif); font-size: 23px; font-style: italic; }
.mila-site .brand-mark.inverse{ background: var(--white); color: var(--wine); }
.mila-site .brand-type{ display: flex; flex-direction: column; line-height: 1; }
.mila-site .brand-type strong{ font-size: 18px; letter-spacing: .12em; }
.mila-site .brand-type small{ margin-top: 5px; font-family: var(--serif); font-style: italic; color: var(--wine); }
.mila-site .desktop-nav{ display: flex; justify-content: center; gap: 30px; }
.mila-site .desktop-nav a{ font-size: 13px; font-weight: 650; position: relative; padding: 32px 0; }
.mila-site .desktop-nav a::after{ content: ''; position: absolute; height: 1px; left: 0; right: 100%; bottom: 22px; background: var(--wine); transition: .25s ease; }
.mila-site .desktop-nav a:hover::after, .mila-site .desktop-nav a.active::after{ right: 0; }
.mila-site .header-actions{ display: flex; align-items: center; gap: 16px; }
.mila-site .header-phone{ font-size: 13px; font-weight: 650; }
.mila-site .menu-button{ display: none; border: 0; background: transparent; width: 42px; height: 42px; align-items: center; justify-content: center; }
.mila-site .mobile-panel{ position: fixed; inset: 88px 0 0 0; z-index: 49; background: var(--wine-dark); color: white; transform: translateY(-110%); transition: .4s cubic-bezier(.7,0,.2,1); display: grid; grid-template-columns: 1fr 1fr; padding: 8vw; }
.mila-site .mobile-panel.open{ transform: translateY(0); }
.mila-site .mobile-nav{ display: flex; flex-direction: column; justify-content: center; }
.mila-site .mobile-nav a{ display: flex; align-items: center; gap: 24px; border-bottom: 1px solid rgba(255,255,255,.15); padding: 15px 0; font-family: var(--serif); font-size: 38px; }
.mila-site .mobile-nav span{ font-family: var(--sans); font-size: 11px; opacity: .55; }
.mila-site .mobile-contact{ align-self: end; display: flex; flex-direction: column; }
.mila-site .mobile-contact small{ text-transform: uppercase; letter-spacing: .13em; opacity: .6; margin-bottom: 14px; }
.mila-site .mobile-contact a{ font-family: var(--serif); font-size: 24px; }

.mila-site /* Home hero */
.home-hero{ min-height: calc(100vh - 88px); padding-top: 65px; padding-bottom: 70px; display: grid; grid-template-columns: 1.02fr .98fr; gap: 68px; align-items: center; }
.mila-site .hero-copy h1{ margin-top: 24px; font-size: clamp(60px, 7.2vw, 108px); }
.mila-site .hero-copy > p{ max-width: 610px; font-size: 18px; color: var(--muted); }
.mila-site .hero-actions{ display: flex; gap: 22px; align-items: center; margin-top: 34px; flex-wrap: wrap; }
.mila-site .hero-proof{ margin-top: 72px; border-top: 1px solid var(--line); display: grid; grid-template-columns: repeat(3,1fr); }
.mila-site .hero-proof > div{ padding: 20px 14px 0 0; border-right: 1px solid var(--line); }
.mila-site .hero-proof > div:last-child{ border-right: 0; padding-left: 16px; }
.mila-site .hero-proof > div:nth-child(2){ padding-left: 16px; }
.mila-site .hero-proof strong{ display: block; font-family: var(--serif); font-size: 32px; color: var(--wine); }
.mila-site .hero-proof span{ display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .11em; color: var(--muted); }
.mila-site .hero-collage{ min-height: 610px; position: relative; display: grid; grid-template-columns: 1.15fr .85fr; grid-template-rows: 1fr 1fr; gap: 14px; }
.mila-site .hero-collage > div:not(.hero-stamp){ overflow: hidden; }
.mila-site .hero-collage img{ transition: transform .9s ease; }
.mila-site .hero-collage:hover img{ transform: scale(1.025); }
.mila-site .collage-tall{ grid-row: 1 / 3; border-radius: 220px 220px 24px 24px; }
.mila-site .collage-small.top{ border-radius: 20px 100px 20px 20px; }
.mila-site .collage-small.bottom{ border-radius: 20px 20px 100px 20px; }
.mila-site .hero-stamp{ position: absolute; left: 52%; top: 51%; transform: translate(-50%,-50%) rotate(-7deg); width: 130px; height: 130px; border-radius: 50%; background: var(--clay); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: var(--shadow); text-align: center; }
.mila-site .hero-stamp span{ font-family: var(--serif); font-size: 32px; font-style: italic; line-height: 1; }
.mila-site .hero-stamp small{ margin-top: 7px; font-size: 8px; text-transform: uppercase; letter-spacing: .12em; line-height: 1.4; }

.mila-site .section-heading-row{ display: flex; align-items: flex-end; justify-content: space-between; gap: 50px; margin-bottom: 56px; }
.mila-site .section-heading-row h2{ max-width: 780px; margin: 10px 0 0; }
.mila-site .section-heading-row > p{ max-width: 440px; color: var(--muted); }
.mila-site .service-rows{ border-top: 1px solid var(--line); }
.mila-site .service-row{ display: grid; grid-template-columns: 70px 1.15fr 1fr 54px; gap: 32px; align-items: center; padding: 32px 0; border-bottom: 1px solid var(--line); transition: .3s ease; }
.mila-site .service-row:hover{ padding-left: 14px; color: var(--wine); }
.mila-site .service-number{ font-size: 12px; letter-spacing: .1em; color: var(--muted); }
.mila-site .service-row small{ font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); }
.mila-site .service-row h3{ margin: 5px 0 0; font-size: 38px; }
.mila-site .service-row p{ margin: 0; color: var(--muted); }
.mila-site .service-row:hover .circle-arrow{ background: var(--wine); color: white; border-color: var(--wine); }

.mila-site .featured-section{ background: var(--wine-dark); color: white; overflow: hidden; }
.mila-site .featured-grid{ display: grid; grid-template-columns: 1.25fr .8fr .8fr; gap: 22px; align-items: start; }
.mila-site .property-card{ min-width: 0; }
.mila-site .property-image-wrap{ height: 330px; position: relative; overflow: hidden; display: block; background: #ddd; border-radius: 8px 8px 70px 8px; }
.mila-site .property-card.large .property-image-wrap{ height: 480px; border-radius: 8px 8px 110px 8px; }
.mila-site .property-image{ transition: transform .65s ease; }
.mila-site .property-card:hover .property-image{ transform: scale(1.035); }
.mila-site .status-pill{ position: absolute; top: 14px; left: 14px; display: inline-flex; align-items: center; min-height: 30px; padding: 0 11px; background: rgba(247,242,234,.92); backdrop-filter: blur(8px); color: var(--ink); border-radius: 999px; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; font-weight: 700; }
.mila-site .status-under-offer, .mila-site .status-sold{ background: var(--wine); color: white; }
.mila-site .status-off-market{ background: var(--ink); color: white; }
.mila-site .image-arrow{ position: absolute; right: 16px; bottom: 16px; width: 46px; height: 46px; background: var(--white); color: var(--ink); border-radius: 50%; display: grid; place-items: center; opacity: 0; transform: translateY(8px); transition: .25s ease; }
.mila-site .property-card:hover .image-arrow{ opacity: 1; transform: translateY(0); }
.mila-site .property-info{ padding-top: 18px; }
.mila-site .property-meta-top{ display: flex; justify-content: space-between; gap: 14px; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.mila-site .property-meta-top strong{ color: inherit; }
.mila-site .property-info h3{ margin: 8px 0 8px; font-size: 32px; }
.mila-site .property-info p{ color: var(--muted); font-size: 14px; }
.mila-site .property-facts{ display: flex; gap: 14px; flex-wrap: wrap; border-top: 1px solid var(--line); padding-top: 14px; color: var(--muted); font-size: 12px; }
.mila-site .property-facts span{ display: inline-flex; gap: 6px; align-items: center; }
.mila-site .featured-section .property-meta-top, .mila-site .featured-section .property-info p, .mila-site .featured-section .property-facts{ color: #c9b9be; }
.mila-site .featured-section .property-info h3{ color: white; }
.mila-site .featured-section .property-facts{ border-color: rgba(255,255,255,.15); }

.mila-site .agent-home{ display: grid; grid-template-columns: .9fr 1.1fr; gap: 85px; align-items: center; }
.mila-site .agent-photo-wrap{ height: 690px; position: relative; border-radius: 180px 180px 12px 12px; overflow: hidden; }
.mila-site .agent-photo-wrap::after{ content: ''; position: absolute; inset: 0; background: linear-gradient(transparent 70%, rgba(32,20,24,.55)); }
.mila-site .agent-caption{ position: absolute; z-index: 2; left: 28px; bottom: 26px; color: white; font-family: var(--serif); font-size: 20px; }
.mila-site .agent-caption small{ font-family: var(--sans); font-size: 10px; text-transform: uppercase; letter-spacing: .12em; opacity: .8; }
.mila-site .agent-copy h2{ margin-top: 16px; }
.mila-site .agent-copy .lead{ font-size: 25px; }
.mila-site .agent-values{ display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--line); border-left: 1px solid var(--line); margin: 34px 0; }
.mila-site .agent-values span{ padding: 16px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: 13px; }

.mila-site .region-grid{ display: grid; grid-template-columns: 1.2fr .8fr .8fr; grid-template-rows: 300px 300px; gap: 18px; }
.mila-site .region-card{ position: relative; overflow: hidden; border-radius: 6px; }
.mila-site .region-1{ grid-row: 1 / 3; }
.mila-site .region-4{ grid-column: 2 / 4; }
.mila-site .region-card::after{ content: ''; position: absolute; inset: 0; background: linear-gradient(transparent 35%, rgba(25,17,20,.75)); }
.mila-site .region-card img{ transition: transform .7s ease; }
.mila-site .region-card:hover img{ transform: scale(1.04); }
.mila-site .region-card > div{ position: absolute; z-index: 2; inset: auto 22px 20px 22px; color: white; }
.mila-site .region-card small{ font-size: 10px; text-transform: uppercase; letter-spacing: .12em; opacity: .75; }
.mila-site .region-card h3{ font-size: 36px; margin: 4px 0 0; }
.mila-site .region-card span{ position: absolute; right: 0; bottom: 4px; width: 40px; height: 40px; display: grid; place-items: center; background: rgba(255,255,255,.15); border-radius: 50%; backdrop-filter: blur(8px); }

.mila-site .testimonial{ background: var(--clay); color: #fffaf7; text-align: center; }
.mila-site .testimonial-inner{ max-width: 980px; }
.mila-site .testimonial svg{ opacity: .35; }
.mila-site .testimonial blockquote{ margin: 18px 0 30px; font-family: var(--serif); font-size: clamp(34px, 4.5vw, 62px); line-height: 1.1; }
.mila-site .testimonial-meta{ display: flex; gap: 10px; justify-content: center; align-items: center; font-size: 12px; }
.mila-site .testimonial-meta span{ opacity: .7; }

.mila-site .article-grid{ display: grid; grid-template-columns: repeat(3,1fr); gap: 26px; }
.mila-site .article-image{ height: 270px; overflow: hidden; border-radius: 6px 6px 70px 6px; margin-bottom: 18px; }
.mila-site .article-card img{ transition: transform .6s ease; }
.mila-site .article-card:hover img{ transform: scale(1.035); }
.mila-site .article-card > span, .mila-site .journal-copy > span{ font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--wine); font-weight: 700; }
.mila-site .article-card h3{ font-size: 30px; margin: 10px 0; line-height: 1.05; }
.mila-site .article-card p{ font-size: 14px; color: var(--muted); }
.mila-site .article-card b{ display: inline-flex; gap: 8px; align-items: center; font-size: 12px; }

.mila-site /* General inner pages */
.page-title{ padding-top: 115px; padding-bottom: 50px; }
.mila-site .page-title h1{ margin-top: 22px; max-width: 1000px; }
.mila-site .page-title .lead{ max-width: 760px; }
.mila-site .compact-title{ padding-bottom: 10px; }
.mila-site .inner-hero{ min-height: 690px; padding-top: 78px; padding-bottom: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.mila-site .inner-hero-copy h1{ margin-top: 20px; font-size: clamp(58px, 6.4vw, 94px); }
.mila-site .inner-hero-image{ position: relative; height: 620px; border-radius: 14px 190px 14px 14px; overflow: hidden; }
.mila-site .image-index{ position: absolute; left: 22px; bottom: 18px; width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; background: var(--paper); color: var(--wine); font-family: var(--serif); font-size: 26px; }
.mila-site .process-section{ display: grid; grid-template-columns: .75fr 1.25fr; gap: 100px; }
.mila-site .section-intro{ position: sticky; top: 130px; align-self: start; }
.mila-site .section-intro p{ color: var(--muted); max-width: 440px; }
.mila-site .process-list{ border-top: 1px solid var(--line); }
.mila-site .process-row{ display: grid; grid-template-columns: 45px .7fr 1fr; gap: 25px; border-bottom: 1px solid var(--line); padding: 28px 0; }
.mila-site .process-row > span{ font-size: 11px; color: var(--clay); letter-spacing: .12em; }
.mila-site .process-row h3{ font-size: 28px; margin: 0; }
.mila-site .process-row p{ color: var(--muted); margin: 0; }
.mila-site .split-quote{ background: var(--wine); color: white; }
.mila-site .split-quote-grid{ display: grid; grid-template-columns: 1.1fr .9fr; gap: 100px; align-items: end; }
.mila-site .split-quote h2{ margin-top: 15px; color: white; }
.mila-site .split-quote p{ font-family: var(--serif); font-size: 26px; line-height: 1.45; color: #eadfe2; }

.mila-site .service-index{ display: grid; gap: 26px; }
.mila-site .service-index-card{ display: grid; grid-template-columns: .82fr 1.18fr; min-height: 430px; background: var(--white); overflow: hidden; border-radius: 8px; transition: .3s ease; }
.mila-site .service-index-card:hover{ transform: translateY(-3px); box-shadow: var(--shadow); }
.mila-site .service-index-img{ position: relative; overflow: hidden; }
.mila-site .service-index-img img{ transition: transform .6s ease; }
.mila-site .service-index-card:hover img{ transform: scale(1.025); }
.mila-site .service-index-img span{ position: absolute; top: 20px; left: 20px; width: 56px; height: 56px; background: var(--paper); border-radius: 50%; display: grid; place-items: center; font-family: var(--serif); color: var(--wine); }
.mila-site .service-index-copy{ padding: 60px; align-self: center; }
.mila-site .service-index-copy small{ text-transform: uppercase; letter-spacing: .12em; color: var(--wine); font-size: 10px; }
.mila-site .service-index-copy h2{ font-size: 54px; margin: 10px 0 18px; }
.mila-site .service-index-copy p{ color: var(--muted); max-width: 600px; }
.mila-site .service-index-copy b, .mila-site .area-index-copy b{ display: inline-flex; align-items: center; gap: 8px; font-size: 12px; margin-top: 12px; }

.mila-site /* Listings */
.listing-toolbar{ display: grid; grid-template-columns: 1fr auto auto; align-items: end; gap: 30px; margin-bottom: 42px; padding-bottom: 22px; border-bottom: 1px solid var(--line); }
.mila-site .filter-group > span{ display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); margin-bottom: 8px; }
.mila-site .filter-pills{ display: flex; gap: 8px; flex-wrap: wrap; }
.mila-site .filter-pills button{ border: 1px solid var(--line); border-radius: 999px; background: transparent; padding: 8px 13px; font-size: 11px; cursor: pointer; }
.mila-site .filter-pills button.active{ background: var(--wine); color: white; border-color: var(--wine); }
.mila-site .filter-group select{ border: 1px solid var(--line); background: transparent; border-radius: 999px; padding: 9px 36px 9px 14px; min-width: 130px; }
.mila-site .result-count{ font-family: var(--serif); font-weight: 400; font-size: 20px; white-space: nowrap; }
.mila-site .listing-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 46px 24px; }
.mila-site .empty-state{ text-align: center; padding: 90px 20px; background: var(--paper-2); }

.mila-site /* Property detail */
.property-head{ padding-top: 84px; padding-bottom: 38px; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
.mila-site .property-head h1{ font-size: clamp(54px, 7vw, 94px); margin: 12px 0 4px; }
.mila-site .property-head p{ color: var(--muted); }
.mila-site .property-price{ display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.mila-site .property-price span{ font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); }
.mila-site .property-price strong{ font-family: var(--serif); font-size: 30px; font-weight: 400; margin-bottom: 10px; }
.mila-site .property-gallery{ display: grid; height: 690px; grid-template-columns: 1.25fr .75fr; grid-template-rows: 1fr 1fr 1fr; gap: 10px; overflow: hidden; border-radius: 10px; }
.mila-site .gallery-item{ border: 0; padding: 0; cursor: zoom-in; overflow: hidden; position: relative; }
.mila-site .gallery-item img{ transition: transform .5s ease; }
.mila-site .gallery-item:hover img{ transform: scale(1.02); }
.mila-site .item-1{ grid-row: 1/4; }
.mila-site .gallery-item span{ position: absolute; left: 18px; bottom: 18px; padding: 10px 14px; background: var(--white); color: var(--ink); border-radius: 999px; font-size: 11px; font-weight: 700; }
.mila-site .lightbox{ position: fixed; inset: 0; z-index: 100; background: rgba(20,15,17,.96); display: grid; place-items: center; padding: 60px; }
.mila-site .lightbox img{ max-width: min(1200px, 90vw); max-height: 82vh; object-fit: contain; }
.mila-site .lightbox-close{ position: absolute; right: 28px; top: 26px; width: 46px; height: 46px; border-radius: 50%; border: 1px solid rgba(255,255,255,.3); background: transparent; color: white; display: grid; place-items: center; cursor: pointer; }
.mila-site .lightbox-nav{ position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; border: 0; background: white; cursor: pointer; }
.mila-site .lightbox-nav.prev{ left: 24px; }.mila-site .lightbox-nav.next{ right: 24px; }
.mila-site .lightbox-count{ position: absolute; bottom: 24px; color: white; font-size: 12px; }
.mila-site .property-
.property-sidebar{ display: grid; align-content: start; position: sticky; top: 120px; }
.mila-site .fact-block{ padding: 18px 0; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.mila-site .fact-block span{ display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 12px; }
.mila-site .fact-block strong{ font-family: var(--serif); font-size: 20px; font-weight: 400; }
.mila-site .property-description h2{ margin-top: 14px; }
.mila-site .property-description h3{ margin-top: 48px; }
.mila-site .property-description ul{ list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.mila-site .property-description li{ padding: 15px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: 13px; }
.mila-site .agent-inline{ margin-top: 60px; padding: 22px; background: var(--wine); color: white; display: grid; grid-template-columns: 150px 1fr; gap: 24px; align-items: center; border-radius: 6px 70px 6px 6px; }
.mila-site .agent-inline img{ height: 170px; border-radius: 4px 50px 4px 4px; }
.mila-site .agent-inline span{ font-size: 10px; text-transform: uppercase; letter-spacing: .12em; opacity: .7; }
.mila-site .agent-inline h3{ margin: 8px 0 12px; font-size: 30px; }
.mila-site .agent-inline a{ display: block; font-size: 13px; }
.mila-site .related{ padding-top: 20px; }

.mila-site /* Areas */
.area-index{ display: grid; gap: 1px; background: var(--line); padding-top: 0; }
.mila-site .area-index-card{ background: var(--paper); display: grid; grid-template-columns: 70px .7fr 1fr; gap: 38px; align-items: center; min-height: 320px; padding: 30px 0; }
.mila-site .area-index-number{ align-self: start; padding-top: 10px; font-size: 11px; letter-spacing: .12em; color: var(--clay); }
.mila-site .area-index-image{ height: 260px; overflow: hidden; border-radius: 5px 60px 5px 5px; }
.mila-site .area-index-image img{ transition: transform .6s ease; }
.mila-site .area-index-card:hover img{ transform: scale(1.03); }
.mila-site .area-index-copy{ padding-right: 50px; }
.mila-site .area-index-copy small{ text-transform: uppercase; letter-spacing: .12em; font-size: 10px; color: var(--wine); }
.mila-site .area-index-copy h2{ font-size: 52px; margin: 7px 0 12px; }
.mila-site .area-index-copy p{ color: var(--muted); }
.mila-site .area-hero{ height: min(760px, 82vh); position: relative; color: white; overflow: hidden; }
.mila-site .area-hero::after{ content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(30,20,23,.72), rgba(30,20,23,.18) 70%); }
.mila-site .area-overlay{ position: absolute; z-index: 2; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.mila-site .area-overlay h1{ margin: 18px 0 18px; color: white; }
.mila-site .area-overlay em{ color: #e3aa98; }
.mila-site .area-overlay p{ max-width: 590px; font-size: 18px; }
.mila-site .area-story{ display: grid; grid-template-columns: .45fr 1.2fr; gap: 90px; }
.mila-site .sticky-label{ position: sticky; top: 130px; align-self: start; }
.mila-site .area-story .lead{ max-width: 850px; }
.mila-site .area-points{ margin-top: 42px; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
.mila-site .area-points span{ padding: 16px 0; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 15px; font-size: 13px; }
.mila-site .area-points b{ font-size: 10px; color: var(--clay); }

.mila-site /* About */
.about-hero{ min-height: 760px; padding-top: 85px; padding-bottom: 85px; display: grid; grid-template-columns: 1.1fr .9fr; gap: 80px; align-items: center; }
.mila-site .about-copy h1{ margin-top: 18px; font-size: clamp(60px, 7vw, 100px); }
.mila-site .about-photo{ height: 650px; position: relative; border-radius: 150px 150px 10px 10px; overflow: hidden; }
.mila-site .photo-note{ position: absolute; right: 18px; bottom: 18px; width: 160px; height: 160px; padding: 20px; border-radius: 50%; background: var(--paper); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.mila-site .photo-note strong{ font-family: var(--serif); font-size: 27px; color: var(--wine); }
.mila-site .photo-note span{ font-size: 9px; text-transform: uppercase; letter-spacing: .1em; }
.mila-site .about-story{ display: grid; grid-template-columns: .45fr 1.15fr; gap: 100px; }
.mila-site .about-story p{ max-width: 790px; color: var(--muted); font-size: 18px; }
.mila-site .values-band{ background: var(--wine-dark); color: white; }
.mila-site .values-grid{ display: grid; grid-template-columns: repeat(4,1fr); }
.mila-site .values-grid > div{ padding: 30px; border-right: 1px solid rgba(255,255,255,.14); }
.mila-site .values-grid > div:first-child{ padding-left: 0; }
.mila-site .values-grid span{ font-size: 10px; letter-spacing: .12em; color: #d9a794; }
.mila-site .values-grid h3{ margin: 18px 0 10px; }
.mila-site .values-grid p{ color: #c9bac0; font-size: 13px; }
.mila-site .about-quote{ text-align: center; max-width: 980px; }
.mila-site .about-quote svg{ color: var(--clay); }
.mila-site .about-quote blockquote{ font-family: var(--serif); font-size: clamp(36px, 4.5vw, 62px); line-height: 1.15; margin: 15px 0 25px; }
.mila-site .about-quote > div{ display: flex; gap: 12px; justify-content: center; font-size: 12px; }
.mila-site .about-quote > div span{ color: var(--muted); }
.mila-site .about-cta{ border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; }
.mila-site .about-cta h2{ max-width: 780px; margin: 12px 0 0; }

.mila-site /* Journal */
.journal-index{ display: grid; gap: 70px; }
.mila-site .journal-row{ display: grid; grid-template-columns: .9fr 1.1fr; gap: 55px; align-items: center; }
.mila-site .journal-row:nth-child(even){ grid-template-columns: 1.1fr .9fr; }
.mila-site .journal-row:nth-child(even) .journal-img{ order: 2; }
.mila-site .journal-img{ height: 430px; overflow: hidden; border-radius: 8px 8px 100px 8px; }
.mila-site .journal-img img{ transition: transform .6s ease; }
.mila-site .journal-row:hover img{ transform: scale(1.025); }
.mila-site .journal-copy h2{ font-size: 52px; margin: 12px 0 16px; }
.mila-site .journal-copy p{ color: var(--muted); font-size: 16px; }
.mila-site .journal-copy b{ display: inline-flex; gap: 8px; align-items: center; font-size: 12px; }
.mila-site .article-hero{ padding-top: 110px; padding-bottom: 60px; max-width: 1050px; }
.mila-site .article-hero h1{ font-size: clamp(58px, 7vw, 96px); margin-top: 22px; }
.mila-site .article-feature{ height: 680px; border-radius: 10px; overflow: hidden; }
.mila-site .article-content{ display: grid; grid-template-columns: .38fr 1fr; gap: 90px; padding-top: 90px; padding-bottom: 120px; max-width: 1050px; }
.mila-site .article-content aside{ position: sticky; top: 120px; align-self: start; display: flex; flex-direction: column; border-top: 1px solid var(--line); }
.mila-site .article-content aside span{ padding: 14px 0; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); }
.mila-site .article-content aside a{ padding: 10px 0; font-size: 12px; }
.mila-site .article-prose section{ padding-bottom: 52px; margin-bottom: 52px; border-bottom: 1px solid var(--line); }
.mila-site .article-prose section > span{ color: var(--clay); font-size: 10px; letter-spacing: .12em; }
.mila-site .article-prose h2{ font-size: 46px; margin: 10px 0 18px; }
.mila-site .article-prose p{ color: #5f565a; font-size: 18px; line-height: 1.8; }
.mila-site .article-cta{ background: var(--paper-2); padding: 38px; border-radius: 6px 60px 6px 6px; }
.mila-site .article-cta h3{ margin-bottom: 12px; }
.mila-site .article-cta p{ font-size: 15px; }

.mila-site /* Forms / contact */
.contact-page{ min-height: calc(100vh - 88px); padding-top: 90px; padding-bottom: 100px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 90px; align-items: start; }
.mila-site .contact-intro h1{ margin-top: 18px; }
.mila-site .contact-direct{ margin-top: 55px; display: grid; border-top: 1px solid var(--line); }
.mila-site .contact-direct > div{ display: grid; grid-template-columns: 100px 1fr; padding: 16px 0; border-bottom: 1px solid var(--line); }
.mila-site .contact-direct span{ font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); }
.mila-site .contact-direct a, .mila-site .contact-direct p{ margin: 0; font-family: var(--serif); font-size: 18px; }
.mila-site .contact-form-wrap{ background: var(--white); padding: 42px; border-radius: 8px 90px 8px 8px; box-shadow: var(--shadow); }
.mila-site .form-kicker{ display: block; font-size: 11px; color: var(--wine); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 22px; }
.mila-site .contact-form{ display: grid; gap: 18px; }
.mila-site .form-row{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mila-site .contact-form label{ display: grid; gap: 7px; font-size: 11px; text-transform: uppercase; letter-spacing: .09em; font-weight: 700; }
.mila-site .contact-form input, .mila-site .contact-form textarea, .mila-site .contact-form select{ width: 100%; border: 0; border-bottom: 1px solid var(--line); background: transparent; padding: 10px 0 12px; color: var(--ink); outline: none; text-transform: none; letter-spacing: 0; font-weight: 400; }
.mila-site .contact-form input:focus, .mila-site .contact-form textarea:focus, .mila-site .contact-form select:focus{ border-color: var(--wine); }
.mila-site .contact-form textarea{ resize: vertical; min-height: 120px; }
.mila-site .contact-form .check{ display: flex; grid-template-columns: none; align-items: flex-start; gap: 10px; text-transform: none; letter-spacing: 0; font-weight: 400; color: var(--muted); }
.mila-site .check input{ width: auto; margin-top: 5px; }
.mila-site .contact-form .button{ justify-self: start; margin-top: 6px; }
.mila-site .form-success{ padding: 40px 0; }
.mila-site .form-success > span{ color: var(--wine); text-transform: uppercase; letter-spacing: .12em; font-size: 10px; }
.mila-site .form-success h3{ font-size: 42px; margin: 12px 0; }
.mila-site .form-success p{ color: var(--muted); }
.mila-site .form-success button{ border: 0; background: none; cursor: pointer; }
.mila-site .searcher-hero{ background: var(--wine-dark); color: white; }
.mila-site .searcher-grid{ min-height: 650px; display: grid; grid-template-columns: 1.05fr .95fr; gap: 70px; align-items: center; }
.mila-site .searcher-grid h1{ color: white; margin-top: 18px; }
.mila-site .searcher-grid p{ max-width: 620px; color: #d1c4c8; font-size: 18px; }
.mila-site .searcher-image{ height: 530px; border-radius: 120px 120px 8px 8px; overflow: hidden; }
.mila-site .searcher-form-section{ display: grid; grid-template-columns: .7fr 1fr; gap: 100px; }
.mila-site .searcher-form-section > div:first-child p{ color: var(--muted); }

.mila-site .legal{ padding-top: 100px; padding-bottom: 120px; max-width: 900px; }
.mila-site .legal h1{ margin-top: 18px; }
.mila-site .legal h2{ font-size: 34px; margin-top: 55px; }
.mila-site .legal p{ color: var(--muted); }

.mila-site /* Footer */
.site-footer{ background: #1f171a; color: white; }
.mila-site .footer-top{ padding-top: 105px; padding-bottom: 80px; display: grid; grid-template-columns: 1.1fr .9fr; gap: 90px; }
.mila-site .footer-statement h2{ color: white; max-width: 720px; margin: 16px 0 32px; }
.mila-site .footer-details{ align-self: end; border-top: 1px solid rgba(255,255,255,.16); }
.mila-site .footer-details > div{ display: grid; grid-template-columns: 95px 1fr; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,.16); }
.mila-site .footer-details span{ font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: #a9959d; }
.mila-site .footer-details a, .mila-site .footer-details p{ margin: 0; font-family: var(--serif); font-size: 18px; }
.mila-site .footer-bottom{ min-height: 120px; border-top: 1px solid rgba(255,255,255,.14); display: grid; grid-template-columns: 1fr 1fr auto; gap: 30px; align-items: center; }
.mila-site .footer-brand{ display: flex; align-items: center; gap: 12px; }
.mila-site .footer-brand div{ display: flex; flex-direction: column; }
.mila-site .footer-brand strong{ font-size: 13px; letter-spacing: .08em; text-transform: uppercase; }
.mila-site .footer-brand small{ color: #9c8990; }
.mila-site .footer-links{ display: flex; gap: 18px; font-size: 11px; color: #c4b4ba; }
.mila-site .footer-meta{ display: flex; gap: 15px; font-size: 10px; color: #8f7d84; }

@media (max-width: 1100px) {
  .mila-site .desktop-nav, .mila-site .header-phone, .mila-site .header-actions .button{ display: none; }
  .mila-site .site-header{ grid-template-columns: 1fr auto; }
  .mila-site .menu-button{ display: inline-flex; }
  .mila-site .home-hero{ grid-template-columns: 1fr; padding-top: 70px; }
  .mila-site .hero-copy{ max-width: 850px; }
  .mila-site .hero-collage{ min-height: 700px; }
  .mila-site .featured-grid, .mila-site .listing-grid{ grid-template-columns: 1fr 1fr; }
  .mila-site .featured-grid .property-card:first-child{ grid-column: 1 / 3; }
  .mila-site .agent-home, .mila-site .inner-hero, .mila-site .about-hero, .mila-site .contact-page, .mila-site .searcher-grid{ gap: 50px; }
  .mila-site .process-section, .mila-site .property-body, .mila-site .about-story, .mila-site .article-content, .mila-site .searcher-form-section{ gap: 55px; }
  .mila-site .region-grid{ grid-template-columns: 1fr 1fr; grid-template-rows: 360px 300px 300px; }
  .mila-site .region-1{ grid-row: auto; }
  .mila-site .region-4{ grid-column: 1 / 3; }
  .mila-site .region-card{ min-height: 280px; }
  .mila-site .article-grid{ gap: 18px; }
}

@media (max-width: 800px) {
  .mila-site .shell{ width: min(100% - 30px, 1240px); }
  .mila-site .section{ padding-top: 82px; padding-bottom: 82px; }
  .mila-site .site-header{ min-height: 72px; padding: 0 15px; }
  .mila-site .brand-mark{ width: 38px; height: 38px; }
  .mila-site .mobile-panel{ top: 72px; grid-template-columns: 1fr; padding: 50px 28px; }
  .mila-site .mobile-nav a{ font-size: 31px; }
  .mila-site .mobile-contact{ margin-top: 40px; }
  .mila-site .home-hero{ min-height: auto; padding-top: 55px; grid-template-columns: 1fr; gap: 48px; }
  .mila-site .hero-copy h1{ font-size: clamp(53px, 15vw, 78px); }
  .mila-site .hero-proof{ margin-top: 45px; }
  .mila-site .hero-proof strong{ font-size: 25px; }
  .mila-site .hero-proof span{ font-size: 9px; }
  .mila-site .hero-collage{ min-height: 480px; }
  .mila-site .hero-stamp{ width: 100px; height: 100px; }
  .mila-site .section-heading-row{ align-items: flex-start; flex-direction: column; gap: 16px; margin-bottom: 36px; }
  .mila-site .service-row{ grid-template-columns: 42px 1fr 45px; gap: 14px; padding: 24px 0; }
  .mila-site .service-row p{ display: none; }
  .mila-site .service-row h3{ font-size: 30px; }
  .mila-site .featured-grid, .mila-site .listing-grid{ grid-template-columns: 1fr; }
  .mila-site .featured-grid .property-card:first-child{ grid-column: auto; }
  .mila-site .property-card.large .property-image-wrap, .mila-site .property-image-wrap{ height: 390px; }
  .mila-site .agent-home, .mila-site .inner-hero, .mila-site .about-hero, .mila-site .contact-page, .mila-site .searcher-grid, .mila-site .process-section, .mila-site .property-body, .mila-site .about-story, .mila-site .searcher-form-section, .mila-site .footer-top, .mila-site .split-quote-grid, .mila-site .area-story{ grid-template-columns: 1fr; }
  .mila-site .agent-photo-wrap, .mila-site .about-photo{ height: 560px; }
  .mila-site .region-grid{ grid-template-columns: 1fr; grid-template-rows: repeat(4, 330px); }
  .mila-site .region-4{ grid-column: auto; }
  .mila-site .article-grid{ grid-template-columns: 1fr; gap: 45px; }
  .mila-site .testimonial blockquote{ font-size: 38px; }
  .mila-site .page-title{ padding-top: 80px; }
  .mila-site .inner-hero{ padding-top: 65px; }
  .mila-site .inner-hero-image{ height: 500px; order: -1; }
  .mila-site .section-intro, .mila-site .property-sidebar, .mila-site .sticky-label, .mila-site .article-content aside{ position: static; }
  .mila-site .process-row{ grid-template-columns: 35px 1fr; }
  .mila-site .process-row p{ grid-column: 2; }
  .mila-site .service-index-card{ grid-template-columns: 1fr; }
  .mila-site .service-index-img{ min-height: 330px; }
  .mila-site .service-index-copy{ padding: 32px 25px 38px; }
  .mila-site .service-index-copy h2{ font-size: 42px; }
  .mila-site .listing-toolbar{ grid-template-columns: 1fr; align-items: start; }
  .mila-site .result-count{ justify-self: start; }
  .mila-site .property-head{ align-items: flex-start; flex-direction: column; }
  .mila-site .property-price{ align-items: flex-start; }
  .mila-site .property-gallery{ height: 590px; grid-template-columns: 1fr 1fr; grid-template-rows: 1.4fr .6fr; }
  .mila-site .item-1{ grid-row: auto; grid-column: 1 / 3; }
  .mila-site .item-4{ display: none; }
  .mila-site .property-description ul{ grid-template-columns: 1fr; }
  .mila-site .agent-inline{ grid-template-columns: 100px 1fr; }
  .mila-site .agent-inline img{ height: 130px; }
  .mila-site .area-index-card{ grid-template-columns: 40px 1fr; gap: 15px; }
  .mila-site .area-index-image{ grid-column: 2; }
  .mila-site .area-index-copy{ grid-column: 2; padding-right: 10px; padding-bottom: 24px; }
  .mila-site .area-index-copy h2{ font-size: 43px; }
  .mila-site .area-hero{ height: 650px; }
  .mila-site .area-points{ grid-template-columns: 1fr; }
  .mila-site .values-grid{ grid-template-columns: 1fr 1fr; }
  .mila-site .values-grid > div:nth-child(2){ border-right: 0; }
  .mila-site .values-grid > div:first-child{ padding-left: 30px; }
  .mila-site .about-cta{ align-items: flex-start; flex-direction: column; }
  .mila-site .journal-row, .mila-site .journal-row:nth-child(even){ grid-template-columns: 1fr; gap: 28px; }
  .mila-site .journal-row:nth-child(even) .journal-img{ order: 0; }
  .mila-site .journal-img{ height: 360px; }
  .mila-site .journal-copy h2{ font-size: 42px; }
  .mila-site .article-feature{ height: 480px; }
  .mila-site .article-content{ grid-template-columns: 1fr; padding-top: 60px; }
  .mila-site .article-content aside{ border-bottom: 1px solid var(--line); padding-bottom: 18px; }
  .mila-site .form-row{ grid-template-columns: 1fr; }
  .mila-site .contact-form-wrap{ padding: 28px 20px; }
  .mila-site .searcher-grid{ padding-top: 60px; padding-bottom: 60px; }
  .mila-site .searcher-image{ height: 440px; }
  .mila-site .footer-bottom{ grid-template-columns: 1fr; padding-top: 28px; padding-bottom: 28px; }
  .mila-site .footer-links{ flex-wrap: wrap; }
}

@media (max-width: 520px) {
  .mila-site h1{ font-size: 52px; }
  .mila-site h2{ font-size: 40px; }
  .mila-site .hero-proof{ grid-template-columns: 1fr; }
  .mila-site .hero-proof > div{ border-right: 0; border-bottom: 1px solid var(--line); padding: 14px 0 !important; }
  .mila-site .hero-collage{ min-height: 390px; gap: 8px; }
  .mila-site .collage-tall{ border-radius: 120px 120px 14px 14px; }
  .mila-site .collage-small.top{ border-radius: 14px 60px 14px 14px; }
  .mila-site .collage-small.bottom{ border-radius: 14px 14px 60px 14px; }
  .mila-site .hero-stamp{ left: 54%; width: 86px; height: 86px; }
  .mila-site .hero-stamp span{ font-size: 25px; }
  .mila-site .hero-stamp small{ display: none; }
  .mila-site .property-card.large .property-image-wrap, .mila-site .property-image-wrap{ height: 330px; }
  .mila-site .agent-photo-wrap, .mila-site .about-photo{ height: 460px; }
  .mila-site .agent-values{ grid-template-columns: 1fr; }
  .mila-site .property-gallery{ height: 460px; }
  .mila-site .agent-inline{ grid-template-columns: 1fr; }
  .mila-site .agent-inline img{ height: 220px; }
  .mila-site .values-grid{ grid-template-columns: 1fr; }
  .mila-site .values-grid > div{ border-right: 0; border-bottom: 1px solid rgba(255,255,255,.14); padding-left: 0 !important; }
  .mila-site .article-feature{ height: 340px; }
  .mila-site .footer-meta{ flex-direction: column; }
}
`;
