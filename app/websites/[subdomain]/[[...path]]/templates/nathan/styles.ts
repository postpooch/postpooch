/** Scoped Nathan template CSS — all selectors under .nathan-site */
export const NATHAN_CSS = `
.nathan-site{--ink:#111315;--paper:#f1eee7;--white:#fbfaf7;--line:rgba(17,19,21,.18);--cobalt:#3155ff;--muted:#6e706f;--pad:clamp(22px,4vw,68px);--serif:Georgia,'Times New Roman',serif;--sans:Arial,Helvetica,sans-serif}
.nathan-site{min-height:100vh;display:flex;flex-direction:column}
.nathan-site main{flex:1}
.nathan-site, .nathan-site *{ box-sizing: border-box; }
.nathan-site{ scroll-behavior: smooth; }
.nathan-site{ margin: 0; background: var(--paper); color: var(--ink); font-family: var(--sans); -webkit-font-smoothing: antialiased; }
.nathan-site a{ color: inherit; text-decoration: none; }
.nathan-site button,.nathan-site input,.nathan-site textarea,.nathan-site select{ font: inherit; }
.nathan-site img{ display: block; width: 100%; height: 100%; object-fit: cover; }
.nathan-site ::selection{ background: var(--cobalt); color: white; }

.nathan-site .section-pad{ padding-left: var(--pad); padding-right: var(--pad); }
.nathan-site .page-top{ padding-top: 160px; }
.nathan-site .eyebrow{ margin: 0 0 22px; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
.nathan-site .light-text{ color: white; }
.nathan-site .text-link{ display: inline-flex; gap: 8px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; border-bottom: 1px solid currentColor; padding-bottom: 5px; }
.nathan-site .pill{ display: inline-flex; align-items: center; justify-content: space-between; gap: 32px; min-width: 190px; border: 1px solid currentColor; border-radius: 99px; padding: 14px 18px 14px 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; transition: transform .2s, background .2s, color .2s; }
.nathan-site .pill:hover{ transform: translateY(-2px); }
.nathan-site .pill span{ font-size: 17px; }
.nathan-site .pill.light{ color: white; border-color: rgba(255,255,255,.7); }
.nathan-site .pill.light:hover{ background: white; color: var(--ink); }
.nathan-site .pill.dark{ color: var(--paper); background: var(--ink); border-color: var(--ink); }
.nathan-site .pill.dark:hover{ background: var(--cobalt); border-color: var(--cobalt); }
.nathan-site .pill.outline:hover{ color: white; background: var(--ink); }

/* Header */
.nathan-site .site-header{ position: fixed; z-index: 80; top: 0; left: 0; width: 100%; height: 92px; padding: 0 var(--pad); display: grid; grid-template-columns: 230px 1fr auto; align-items: center; gap: 24px; background: rgba(241,238,231,.92); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
.nathan-site .wordmark{ line-height: .82; font-size: 17px; font-weight: 900; letter-spacing: -.04em; width: max-content; }
.nathan-site .wordmark span{ display: block; }
.nathan-site .wordmark b{ color: var(--cobalt); }
.nathan-site .desktop-nav{ display: flex; justify-content: center; gap: 30px; }
.nathan-site .desktop-nav a,.nathan-site .header-contact{ position: relative; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.nathan-site .desktop-nav a::after{ content: ''; position: absolute; left: 0; bottom: -7px; width: 100%; height: 1px; background: var(--ink); transform: scaleX(0); transform-origin: right; transition: transform .2s; }
.nathan-site .desktop-nav a:hover::after,.nathan-site .desktop-nav a.active::after{ transform: scaleX(1); transform-origin: left; }
.nathan-site .header-actions{ display: flex; align-items: center; gap: 24px; }
.nathan-site .header-contact{ padding: 12px 16px; background: var(--cobalt); color: white; border-radius: 99px; }
.nathan-site .menu-button{ display: none; border: 0; background: transparent; width: 55px; height: 42px; padding: 0; cursor: pointer; position: relative; color: var(--ink); }
.nathan-site .menu-button span{ font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.nathan-site .menu-button i{ position: absolute; width: 14px; height: 1px; background: currentColor; right: 0; top: 17px; }
.nathan-site .menu-button i:last-child{ top: 23px; }
.nathan-site .menu-overlay{ position: fixed; z-index: 70; inset: 0; background: var(--ink); color: white; visibility: hidden; opacity: 0; transform: translateY(-12px); transition: .32s ease; padding: 130px var(--pad) 60px; }
.nathan-site .menu-overlay.is-open{ visibility: visible; opacity: 1; transform: translateY(0); }
.nathan-site .menu-grid{ height: 100%; display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 40px; align-items: end; }
.nathan-site .menu-index{ align-self: start; font-size: 11px; letter-spacing: .12em; color: #aaa; }
.nathan-site .menu-links{ display: grid; }
.nathan-site .menu-links a{ display: flex; gap: 22px; align-items: baseline; font-family: var(--serif); font-size: clamp(36px, 5vw, 74px); line-height: 1.05; border-bottom: 1px solid rgba(255,255,255,.15); padding: 8px 0; }
.nathan-site .menu-links em{ font-family: var(--sans); font-style: normal; font-size: 10px; color: #999; }
.nathan-site .menu-links a:hover{ color: #9caeff; }
.nathan-site .menu-meta{ display: grid; gap: 8px; font-size: 12px; align-self: end; }
.nathan-site .menu-meta p{ color: #aaa; }

/* Home hero */
.nathan-site .home-hero{ min-height: 900px; height: 100vh; max-height: 1080px; background: var(--ink); color: white; position: relative; overflow: hidden; padding-top: 92px; }
.nathan-site .home-hero::after{ content: ''; position: absolute; inset: 92px 0 0; background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size: 25% 25%; pointer-events: none; }
.nathan-site .hero-number{ position: absolute; z-index: 2; left: var(--pad); top: 140px; font-size: 10px; letter-spacing: .17em; color: #999; }
.nathan-site .hero-title-wrap{ position: absolute; z-index: 3; left: var(--pad); top: 24%; width: min(690px, 53vw); }
.nathan-site .hero-title-wrap h1{ margin: 0; font-family: var(--serif); font-size: clamp(72px, 8.8vw, 145px); line-height: .79; letter-spacing: -.065em; font-weight: 400; }
.nathan-site .hero-title-wrap h1 span{ font-style: italic; color: #c6ceff; }
.nathan-site .hero-deck{ max-width: 470px; margin: 38px 0 30px; font-size: 15px; line-height: 1.6; color: #d5d5d2; }
.nathan-site .hero-actions{ display: flex; align-items: center; gap: 25px; }
.nathan-site .hero-image-frame{ position: absolute; z-index: 2; width: 43%; height: 68%; right: 5.5%; bottom: 0; overflow: hidden; }
.nathan-site .hero-image-frame img{ transition: transform 1s ease; }
.nathan-site .home-hero:hover .hero-image-frame img{ transform: scale(1.025); }
.nathan-site .image-caption{ position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; padding: 13px 16px; background: rgba(17,19,21,.72); font-size: 9px; letter-spacing: .12em; }
.nathan-site .vertical-word{ position: absolute; z-index: 3; right: 20px; top: 145px; writing-mode: vertical-rl; font-size: 9px; letter-spacing: .24em; color: #a7a7a3; }

/* Intro + stats */
.nathan-site .intro{ display: grid; grid-template-columns: .45fr 1.25fr .8fr; gap: 50px; padding-top: 120px; padding-bottom: 120px; border-bottom: 1px solid var(--line); }
.nathan-site .section-index{ font-size: 11px; letter-spacing: .18em; color: var(--muted); }
.nathan-site .intro h2,.nathan-site .section-head h2,.nathan-site .about-story h2,.nathan-site .press-feature h2,.nathan-site .neighborhood-quote h2,.nathan-site .media-inquiry h2{ margin: 0; font-family: var(--serif); font-weight: 400; letter-spacing: -.045em; font-size: clamp(52px, 5.4vw, 88px); line-height: .97; }
.nathan-site .intro-aside{ align-self: end; max-width: 420px; }
.nathan-site .intro-aside p{ font-size: 16px; line-height: 1.65; margin: 0 0 30px; }
.nathan-site .stat-band{ display: grid; grid-template-columns: repeat(4,1fr); background: var(--cobalt); color: white; padding: 0 var(--pad); }
.nathan-site .stat-band div{ padding: 42px 24px 45px 0; border-right: 1px solid rgba(255,255,255,.22); display: grid; gap: 10px; }
.nathan-site .stat-band div:not(:first-child){ padding-left: 28px; }
.nathan-site .stat-band strong{ font-family: var(--serif); font-size: clamp(38px,4vw,64px); font-weight: 400; letter-spacing: -.05em; }
.nathan-site .stat-band span{ font-size: 11px; line-height: 1.4; text-transform: uppercase; letter-spacing: .08em; }

/* Featured */
.nathan-site .featured{ padding-top: 125px; padding-bottom: 130px; }
.nathan-site .section-head{ display: flex; justify-content: space-between; gap: 50px; align-items: end; margin-bottom: 70px; }
.nathan-site .section-head .head-note{ width: 340px; align-self: end; font-size: 14px; line-height: 1.6; margin: 0; }
.nathan-site .featured-stack{ border-top: 1px solid var(--ink); }
.nathan-site .feature-row{ display: grid; grid-template-columns: 52px 135px 1fr auto 28px; gap: 25px; align-items: center; border-bottom: 1px solid var(--line); padding: 24px 0; transition: background .2s, padding .2s; }
.nathan-site .feature-row:hover{ background: rgba(255,255,255,.5); padding-left: 12px; padding-right: 12px; }
.nathan-site .feature-no{ font-size: 10px; color: var(--muted); }
.nathan-site .feature-thumb{ height: 86px; overflow: hidden; }
.nathan-site .feature-name h3{ margin: 0 0 7px; font-family: var(--serif); font-size: 25px; font-weight: 400; letter-spacing: -.025em; }
.nathan-site .feature-name p{ margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.nathan-site .feature-price{ font-size: 13px; font-weight: 800; }
.nathan-site .feature-go{ font-size: 18px; }

/* Manifesto */
.nathan-site .manifesto{ display: grid; grid-template-columns: 1.05fr .95fr; min-height: 780px; background: #202327; color: white; }
.nathan-site .manifesto-image{ min-height: 780px; }
.nathan-site .manifesto-copy{ padding: 100px clamp(40px,6vw,110px); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.nathan-site .manifesto-copy blockquote{ margin: 20px 0 36px; font-family: var(--serif); font-size: clamp(48px,5vw,78px); line-height: 1; letter-spacing: -.045em; }
.nathan-site .manifesto-copy > p:not(.eyebrow){ max-width: 460px; color: #c8c9c8; line-height: 1.65; margin: 0 0 32px; }

/* Neighborhood preview */
.nathan-site .neighborhood-preview{ padding-top: 125px; padding-bottom: 125px; }
.nathan-site .neighborhood-strip{ display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.nathan-site .n-card{ position: relative; height: 540px; overflow: hidden; background: #222; color: white; }
.nathan-site .n-card::after{ content:''; position:absolute; inset:0; background:linear-gradient(transparent 45%, rgba(0,0,0,.78)); }
.nathan-site .n-card img{ transition: transform .55s; }
.nathan-site .n-card:hover img{ transform: scale(1.04); }
.nathan-site .n-card > div{ position: absolute; z-index: 2; left: 22px; right: 22px; bottom: 22px; }
.nathan-site .n-card span{ font-size: 9px; letter-spacing: .13em; }
.nathan-site .n-card h3{ margin: 8px 0; font-family: var(--serif); font-size: 35px; font-weight: 400; letter-spacing: -.04em; }
.nathan-site .n-card p{ margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: .07em; color: #d0d0ce; }

/* Results home */
.nathan-site .results-home{ background: var(--ink); color: white; display: grid; grid-template-columns: .8fr 1.2fr; padding-top: 100px; padding-bottom: 105px; }
.nathan-site .results-title h2{ margin: 0; max-width: 520px; font-family: var(--serif); font-size: clamp(60px,7vw,105px); font-weight: 400; letter-spacing: -.06em; line-height: .9; }
.nathan-site .results-list{ border-left: 1px solid rgba(255,255,255,.17); }
.nathan-site .result-line{ display: grid; grid-template-columns: 145px 1fr 50px; gap: 25px; align-items: baseline; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,.17); }
.nathan-site .result-line strong{ font-family: var(--serif); font-size: 36px; font-weight: 400; }
.nathan-site .result-line span{ font-size: 14px; color: #d1d1cf; }
.nathan-site .result-line em{ font-style: normal; font-size: 10px; color: #8d8e8e; }
.nathan-site .results-list .text-link{ margin-top: 36px; }

/* Journal */
.nathan-site .insights-home{ padding-top: 125px; padding-bottom: 130px; }
.nathan-site .journal-grid{ display: grid; grid-template-columns: 1.2fr .8fr .8fr; gap: 18px; align-items: start; }
.nathan-site .journal-card{ display: block; }
.nathan-site .journal-image{ height: 360px; margin-bottom: 20px; overflow: hidden; }
.nathan-site .journal-card.j1 .journal-image{ height: 530px; }
.nathan-site .journal-card img{ transition: transform .5s; }
.nathan-site .journal-card:hover img{ transform: scale(1.025); }
.nathan-site .journal-card .eyebrow{ font-size: 9px; margin-bottom: 12px; }
.nathan-site .journal-card h3{ margin: 0 0 13px; font-family: var(--serif); font-size: 29px; line-height: 1.04; font-weight: 400; letter-spacing: -.03em; }
.nathan-site .journal-card > p:last-child{ margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
.nathan-site .press-ticker{ display: flex; align-items: center; gap: clamp(25px,5vw,80px); overflow: hidden; white-space: nowrap; background: #dad5ca; padding: 35px var(--pad); }
.nathan-site .press-ticker p{ font-size: 9px; letter-spacing: .15em; }
.nathan-site .press-ticker span{ font-family: var(--serif); font-size: clamp(22px,2.7vw,43px); }

/* Footer */
.nathan-site .site-footer{ background: var(--cobalt); color: white; }
.nathan-site .footer-cta{ padding-top: 100px; padding-bottom: 100px; border-bottom: 1px solid rgba(255,255,255,.23); }
.nathan-site .footer-cta-grid{ display: grid; grid-template-columns: 1.25fr .75fr; gap: 80px; align-items: end; }
.nathan-site .footer-cta h2{ margin: 0; font-family: var(--serif); font-size: clamp(58px,6.5vw,108px); line-height: .9; font-weight: 400; letter-spacing: -.06em; max-width: 900px; }
.nathan-site .footer-cta-grid > div p{ max-width: 450px; line-height: 1.6; color: #e3e5ff; margin: 0 0 28px; }
.nathan-site .footer-main{ padding-top: 70px; padding-bottom: 60px; display: grid; grid-template-columns: 1fr 1.35fr 1fr; gap: 70px; }
.nathan-site .mega-mark{ font-size: clamp(80px,9vw,150px); font-weight: 900; letter-spacing: -.09em; line-height: .8; }
.nathan-site .mega-mark span{ color: #111; }
.nathan-site .footer-brand p{ max-width: 280px; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; line-height: 1.5; margin-top: 25px; }
.nathan-site .footer-links{ display: grid; grid-template-columns: repeat(3,1fr); gap: 30px; }
.nathan-site .footer-links > div{ display: flex; flex-direction: column; gap: 10px; }
.nathan-site .footer-links a,.nathan-site .footer-links span{ font-size: 12px; }
.nathan-site .footer-links .eyebrow{ margin-bottom: 8px; color: #d5dbff; }
.nathan-site .newsletter .eyebrow{ color: #d5dbff; }
.nathan-site .newsletter > p:not(.eyebrow){ max-width: 390px; font-size: 13px; line-height: 1.55; }
.nathan-site .newsletter-row{ display: flex; border-bottom: 1px solid white; margin-top: 26px; }
.nathan-site .newsletter-row input{ width: 100%; border: 0; outline: 0; background: transparent; color: white; padding: 12px 0; }
.nathan-site .newsletter-row input::placeholder{ color: #c4ccff; }
.nathan-site .newsletter-row button{ border: 0; background: transparent; color: white; font-size: 11px; font-weight: 800; text-transform: uppercase; cursor: pointer; }
.nathan-site .legal-bar{ min-height: 65px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,.23); font-size: 9px; letter-spacing: .08em; }
.nathan-site .legal-bar div{ display: flex; gap: 25px; }

/* Generic page hero */
.nathan-site .page-hero{ padding-top: 185px; padding-bottom: 110px; }
.nathan-site .page-hero h1,.nathan-site .listing-title h1,.nathan-site .results-hero h1,.nathan-site .contact-intro h1,.nathan-site .press-hero h1,.nathan-site .insight-header h1,.nathan-site .legal-page h1,.nathan-site .not-found h1{ margin: 0; font-family: var(--serif); font-size: clamp(74px,10vw,160px); line-height: .82; letter-spacing: -.07em; font-weight: 400; }
.nathan-site .page-hero h1 span,.nathan-site .results-hero h1 span{ color: var(--cobalt); font-style: italic; }
.nathan-site .page-deck{ max-width: 550px; margin: 50px 0 0 auto; font-size: 17px; line-height: 1.65; }

/* About */
.nathan-site .about-hero-grid{ display: grid; grid-template-columns: 1.1fr .65fr; gap: 120px; align-items: end; margin-top: 80px; }
.nathan-site .about-hero-grid p{ margin: 0; line-height: 1.65; }
.nathan-site .about-hero-grid .big-lede{ font-family: var(--serif); font-size: clamp(28px,3vw,48px); line-height: 1.08; letter-spacing: -.03em; }
.nathan-site .about-portrait{ height: 78vh; min-height: 620px; position: relative; }
.nathan-site .about-portrait img{ object-position: center 23%; filter: saturate(.86); }
.nathan-site .about-portrait-label{ position: absolute; bottom: 0; left: 0; background: var(--cobalt); color: white; padding: 16px 22px; font-size: 9px; letter-spacing: .15em; }
.nathan-site .about-story{ padding-top: 120px; padding-bottom: 120px; display: grid; grid-template-columns: .3fr .8fr 1fr; gap: 70px; }
.nathan-site .story-columns{ display: grid; grid-template-columns: 1fr 1fr; gap: 35px; }
.nathan-site .story-columns p{ margin: 0; line-height: 1.75; font-size: 14px; }
.nathan-site .principles{ padding-top: 100px; padding-bottom: 110px; background: #dad5ca; }
.nathan-site .principle-grid{ display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid var(--ink); margin-top: 45px; }
.nathan-site .principle-grid article{ padding: 35px 45px 20px 0; border-right: 1px solid rgba(17,19,21,.25); }
.nathan-site .principle-grid article:not(:first-child){ padding-left: 35px; }
.nathan-site .principle-grid span{ font-size: 10px; }
.nathan-site .principle-grid h3{ font-family: var(--serif); font-size: 38px; font-weight: 400; letter-spacing: -.04em; margin: 70px 0 20px; }
.nathan-site .principle-grid p{ max-width: 330px; color: #4f5252; line-height: 1.55; font-size: 13px; }
.nathan-site .about-image-pair{ display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; padding-top: 18px; padding-bottom: 18px; background: var(--white); }
.nathan-site .about-image-pair > div{ height: 650px; }
.nathan-site .about-image-pair > div:last-child{ height: 470px; align-self: center; }
.nathan-site .credentials{ padding-top: 120px; padding-bottom: 130px; }
.nathan-site .credentials-grid{ display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--ink); margin: 50px 0 55px; }
.nathan-site .credentials-grid > div{ padding: 34px 24px 34px 0; border-right: 1px solid var(--line); display: grid; gap: 13px; }
.nathan-site .credentials-grid > div:not(:first-child){ padding-left: 25px; }
.nathan-site .credentials-grid strong{ font-family: var(--serif); font-size: 30px; font-weight: 400; }
.nathan-site .credentials-grid span{ font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }

/* Listings */
.nathan-site .listing-page,.nathan-site .insights-page{ padding-bottom: 140px; }
.nathan-site .listing-title{ display: grid; grid-template-columns: 1fr .45fr; column-gap: 80px; align-items: end; margin-bottom: 75px; }
.nathan-site .listing-title .eyebrow{ grid-column: 1/-1; }
.nathan-site .listing-title h1{ font-size: clamp(80px,11vw,170px); }
.nathan-site .listing-title > p:last-child{ margin: 0 0 8px; line-height: 1.6; color: var(--muted); }
.nathan-site .filter-row{ display: flex; gap: 9px; flex-wrap: wrap; border-top: 1px solid var(--ink); padding: 22px 0 45px; }
.nathan-site .filter-row button{ border: 1px solid #aaa; background: transparent; border-radius: 99px; padding: 9px 13px; font-size: 9px; text-transform: uppercase; font-weight: 700; cursor: pointer; }
.nathan-site .filter-row button.active,.nathan-site .filter-row button:hover{ background: var(--ink); color: white; border-color: var(--ink); }
.nathan-site .property-grid{ display: grid; grid-template-columns: 1fr 1fr; gap: 65px 18px; }
.nathan-site .property-card.wide{ grid-column: span 2; }
.nathan-site .property-card.wide .property-image{ height: min(72vh, 790px); }
.nathan-site .property-image{ height: 510px; overflow: hidden; position: relative; background: #ddd; }
.nathan-site .property-image img{ transition: transform .5s; }
.nathan-site .property-card:hover .property-image img{ transform: scale(1.025); }
.nathan-site .property-status{ position: absolute; top: 14px; left: 14px; background: var(--paper); padding: 8px 10px; font-size: 8px; font-weight: 800; letter-spacing: .1em; }
.nathan-site .property-arrow{ position: absolute; right: 14px; bottom: 14px; width: 42px; height: 42px; display: grid; place-items:center; border-radius: 50%; background: white; font-size: 17px; }
.nathan-site .property-copy{ display: flex; justify-content: space-between; gap: 30px; align-items: baseline; margin-top: 18px; }
.nathan-site .property-copy h3{ font-family: var(--serif); font-size: 27px; font-weight: 400; letter-spacing: -.03em; margin: 0 0 5px; }
.nathan-site .property-copy p{ margin: 0; font-size: 9px; text-transform: uppercase; letter-spacing: .09em; color: var(--muted); }
.nathan-site .property-price{ font-size: 13px; font-weight: 800; white-space: nowrap; }
.nathan-site .property-specs{ display: flex; gap: 16px; padding-top: 12px; font-size: 9px; letter-spacing: .09em; color: var(--muted); }

/* Property detail */
.nathan-site .property-detail-hero{ height: 100vh; min-height: 720px; position: relative; color: white; }
.nathan-site .property-detail-hero::after{ content:''; position:absolute; inset:0; background:linear-gradient(transparent 30%, rgba(0,0,0,.7)); }
.nathan-site .property-detail-overlay{ position: absolute; z-index: 2; inset: auto 0 0; padding-bottom: 50px; }
.nathan-site .property-detail-overlay > p{ font-size: 10px; font-weight: 800; letter-spacing: .15em; }
.nathan-site .property-detail-overlay h1{ font-family: var(--serif); font-size: clamp(62px,8vw,130px); line-height: .85; font-weight: 400; letter-spacing: -.06em; margin: 10px 0 30px; max-width: 1100px; }
.nathan-site .property-detail-overlay > div{ display: flex; justify-content: space-between; align-items: end; }
.nathan-site .property-detail-overlay strong{ font-family: var(--serif); font-size: 42px; font-weight: 400; }
.nathan-site .property-detail-overlay span{ font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
.nathan-site .property-detail-meta{ display: flex; justify-content: space-between; align-items: center; padding-top: 42px; padding-bottom: 42px; border-bottom: 1px solid var(--line); }
.nathan-site .detail-specs{ display: flex; gap: 45px; }
.nathan-site .detail-specs span{ display: grid; gap: 5px; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
.nathan-site .detail-specs b{ font-family: var(--serif); font-size: 32px; font-weight: 400; text-transform: none; letter-spacing: 0; }
.nathan-site .property-editorial{ padding-top: 115px; padding-bottom: 115px; display: grid; grid-template-columns: .3fr 1.1fr .65fr; gap: 70px; }
.nathan-site .property-editorial h2{ margin: 0; font-family: var(--serif); font-size: clamp(44px,4.4vw,72px); line-height: 1; font-weight: 400; letter-spacing: -.045em; }
.nathan-site .property-editorial > p:last-child{ align-self: end; margin: 0; line-height: 1.75; }
.nathan-site .property-gallery{ display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; padding-bottom: 18px; }
.nathan-site .property-gallery img{ height: 690px; }
.nathan-site .property-gallery img:last-child{ height: 520px; align-self: end; }
.nathan-site .property-facts{ display: grid; grid-template-columns: repeat(3,1fr); gap: 0; padding-top: 90px; padding-bottom: 90px; }
.nathan-site .property-facts > div{ border-top: 1px solid var(--ink); padding: 25px 25px 0 0; }
.nathan-site .property-facts > div:not(:first-child){ padding-left: 25px; border-left: 1px solid var(--line); }
.nathan-site .property-facts strong{ font-family: var(--serif); font-size: 26px; font-weight: 400; }
.nathan-site .next-property{ background: #dad5ca; padding-top: 65px; padding-bottom: 70px; }
.nathan-site .next-property a{ font-family: var(--serif); font-size: clamp(42px,5vw,76px); letter-spacing: -.045em; }

/* Neighborhoods */
.nathan-site .neighborhood-directory{ padding-bottom: 110px; }
.nathan-site .directory-row{ min-height: 185px; display: grid; grid-template-columns: 0fr 50px 1fr auto; gap: 25px; align-items: center; border-top: 1px solid var(--ink); position: relative; overflow: hidden; transition: grid-template-columns .35s ease; }
.nathan-site .directory-row:last-child{ border-bottom: 1px solid var(--ink); }
.nathan-site .directory-image{ width: 180px; height: 135px; overflow: hidden; opacity: 0; transform: translateX(-20px); transition: opacity .3s, transform .3s; }
.nathan-site .directory-row:hover{ grid-template-columns: 180px 50px 1fr auto; }
.nathan-site .directory-row:hover .directory-image{ opacity: 1; transform: translateX(0); }
.nathan-site .directory-no{ font-size: 10px; }
.nathan-site .directory-row h2{ margin: 0 0 8px; font-family: var(--serif); font-size: clamp(42px,5vw,78px); line-height: 1; font-weight: 400; letter-spacing: -.045em; }
.nathan-site .directory-row p{ margin: 0; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
.nathan-site .directory-row > strong{ font-size: 9px; letter-spacing: .09em; }
.nathan-site .neighborhood-quote{ padding-top: 120px; padding-bottom: 120px; background: var(--cobalt); color: white; display: grid; grid-template-columns: .35fr 1.25fr .4fr; align-items: end; gap: 55px; }
.nathan-site .neighborhood-quote h2{ font-size: clamp(48px,5.5vw,88px); }

/* Results */
.nathan-site .results-hero{ min-height: 760px; background: var(--ink); color: white; padding-bottom: 90px; display: flex; flex-direction: column; justify-content: end; }
.nathan-site .results-hero .eyebrow{ margin-bottom: 25px; }
.nathan-site .results-hero h1{ font-size: clamp(76px,10vw,155px); }
.nathan-site .results-hero > p:last-child{ width: 420px; margin: 50px 0 0 auto; line-height: 1.65; color: #c5c6c5; }
.nathan-site .case-study{ display: grid; grid-template-columns: .35fr .65fr .8fr; gap: 50px; padding-top: 120px; padding-bottom: 120px; }
.nathan-site .case-label{ font-size: 10px; letter-spacing: .1em; }
.nathan-site .case-label p{ color: var(--muted); margin-top: 130px; }
.nathan-site .case-number{ font-family: var(--serif); font-size: clamp(75px,8vw,130px); letter-spacing: -.07em; }
.nathan-site .case-copy{ align-self: end; }
.nathan-site .case-copy h2{ font-family: var(--serif); font-size: 47px; line-height: 1; font-weight: 400; letter-spacing: -.04em; margin: 0 0 25px; }
.nathan-site .case-copy p{ margin: 0; max-width: 500px; line-height: 1.65; }
.nathan-site .sales-ledger{ padding-top: 100px; padding-bottom: 120px; background: #dad5ca; }
.nathan-site .ledger-row{ display: grid; grid-template-columns: 50px 160px 1fr 70px; gap: 25px; align-items: baseline; padding: 19px 0; border-top: 1px solid rgba(17,19,21,.35); }
.nathan-site .ledger-row:last-child{ border-bottom: 1px solid rgba(17,19,21,.35); }
.nathan-site .ledger-row span,.nathan-site .ledger-row em{ font-size: 9px; font-style: normal; }
.nathan-site .ledger-row strong{ font-family: var(--serif); font-size: 32px; font-weight: 400; }
.nathan-site .ledger-row p{ margin: 0; }
.nathan-site .testimonial-dark{ padding-top: 125px; padding-bottom: 125px; background: #202327; color: white; }
.nathan-site .testimonial-dark blockquote{ max-width: 1050px; margin: 0 0 35px; font-family: var(--serif); font-size: clamp(50px,5.7vw,90px); line-height: .99; letter-spacing: -.045em; }
.nathan-site .testimonial-dark > p{ font-size: 10px; letter-spacing: .1em; color: #aaa; margin-bottom: 35px; }

/* Insights */
.nathan-site .article-list{ border-top: 1px solid var(--ink); }
.nathan-site .article-row{ display: grid; grid-template-columns: 45px 180px 1fr 30px; gap: 28px; align-items: center; border-bottom: 1px solid var(--line); padding: 28px 0; }
.nathan-site .article-thumb{ height: 110px; overflow: hidden; }
.nathan-site .article-no{ font-size: 10px; color: var(--muted); }
.nathan-site .article-info .eyebrow{ font-size: 8px; margin-bottom: 8px; }
.nathan-site .article-info h2{ margin: 0 0 8px; font-family: var(--serif); font-size: 34px; font-weight: 400; letter-spacing: -.03em; }
.nathan-site .article-info > p:last-child{ margin: 0; color: var(--muted); font-size: 12px; max-width: 750px; line-height: 1.5; }
.nathan-site .article-arrow{ font-size: 18px; }
.nathan-site .insight-header{ padding-top: 165px; padding-bottom: 70px; }
.nathan-site .insight-header h1{ font-size: clamp(65px,8vw,125px); max-width: 1200px; }
.nathan-site .insight-header > p:last-child{ margin: 45px 0 0 auto; max-width: 570px; line-height: 1.6; font-size: 16px; }
.nathan-site .insight-image{ height: 72vh; min-height: 560px; }
.nathan-site .insight-body{ display: grid; grid-template-columns: .45fr 1fr; gap: 80px; max-width: 1200px; margin: 0 auto; padding-top: 95px; padding-bottom: 105px; }
.nathan-site .insight-body aside{ font-size: 10px; letter-spacing: .1em; }
.nathan-site .insight-body aside p{ color: var(--muted); }
.nathan-site .insight-body > div > p{ font-family: var(--serif); font-size: 24px; line-height: 1.6; margin: 0 0 28px; }
.nathan-site .insight-body .text-link{ margin-top: 15px; }
.nathan-site .insight-back{ padding-top: 35px; padding-bottom: 50px; border-top: 1px solid var(--line); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }

/* Press */
.nathan-site .press-hero{ padding-bottom: 90px; display: grid; grid-template-columns: 1fr .45fr; gap: 80px; align-items: end; }
.nathan-site .press-hero h1{ font-size: clamp(72px,9vw,140px); }
.nathan-site .press-hero > p{ margin: 0 0 10px; line-height: 1.65; }
.nathan-site .press-feature{ display: grid; grid-template-columns: 1.1fr .9fr; min-height: 680px; background: var(--ink); color: white; }
.nathan-site .press-feature-copy{ padding: 80px clamp(45px,6vw,95px); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.nathan-site .press-feature-copy h2{ font-size: clamp(45px,4.5vw,72px); }
.nathan-site .press-feature-copy > p:not(.eyebrow){ max-width: 430px; color: #bfc0bf; line-height: 1.6; }
.nathan-site .press-feature-copy > span{ margin-top: 25px; font-size: 10px; letter-spacing: .1em; }
.nathan-site .press-list{ padding-top: 100px; padding-bottom: 120px; }
.nathan-site .press-list article{ display: grid; grid-template-columns: 45px 170px 1fr 85px 25px; gap: 25px; align-items: baseline; padding: 24px 0; border-top: 1px solid var(--ink); }
.nathan-site .press-list article:last-child{ border-bottom: 1px solid var(--ink); }
.nathan-site .press-list article > span,.nathan-site .press-list time{ font-size: 9px; letter-spacing: .08em; }
.nathan-site .press-list strong{ font-size: 10px; letter-spacing: .08em; }
.nathan-site .press-list h3{ font-family: var(--serif); font-size: 27px; font-weight: 400; margin: 0; }
.nathan-site .press-list em{ font-style: normal; }
.nathan-site .media-inquiry{ background: var(--cobalt); color: white; padding-top: 105px; padding-bottom: 105px; display: grid; grid-template-columns: .35fr 1fr .3fr; gap: 40px; align-items: end; }
.nathan-site .media-inquiry h2{ font-size: clamp(44px,4.8vw,76px); }

/* Contact */
.nathan-site .contact-page{ min-height: 900px; display: grid; grid-template-columns: .8fr 1.2fr; gap: 8vw; padding-bottom: 120px; }
.nathan-site .contact-intro{ position: sticky; top: 145px; align-self: start; }
.nathan-site .contact-intro h1{ font-size: clamp(68px,7.5vw,120px); }
.nathan-site .contact-intro > p:not(.eyebrow){ max-width: 420px; margin: 45px 0; line-height: 1.65; }
.nathan-site .contact-direct{ display: grid; gap: 9px; border-top: 1px solid var(--ink); padding-top: 18px; max-width: 420px; }
.nathan-site .contact-direct span{ font-size: 9px; letter-spacing: .12em; margin-bottom: 8px; }
.nathan-site .contact-direct a{ font-family: var(--serif); font-size: 24px; }
.nathan-site .contact-direct p{ color: var(--muted); font-size: 11px; }
.nathan-site .contact-form-wrap{ background: var(--white); padding: clamp(35px,5vw,75px); }
.nathan-site .contact-form{ display: grid; gap: 34px; }
.nathan-site .contact-form label{ display: grid; gap: 10px; }
.nathan-site .contact-form label > span{ font-size: 9px; letter-spacing: .12em; font-weight: 800; }
.nathan-site .contact-form input,.nathan-site .contact-form textarea,.nathan-site .contact-form select{ width: 100%; background: transparent; border: 0; border-bottom: 1px solid #999; border-radius: 0; padding: 13px 0; outline: none; color: var(--ink); }
.nathan-site .contact-form textarea{ resize: vertical; }
.nathan-site .contact-form input:focus,.nathan-site .contact-form textarea:focus,.nathan-site .contact-form select:focus{ border-color: var(--cobalt); }
.nathan-site .form-pair{ display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.nathan-site .contact-form .pill{ width: max-content; margin-top: 10px; }
.nathan-site .form-note{ font-size: 9px; line-height: 1.5; color: var(--muted); }
.nathan-site .form-success{ padding-top: 40px; }
.nathan-site .form-success span{ font-size: 10px; }
.nathan-site .form-success h2{ font-family: var(--serif); font-size: 75px; font-weight: 400; margin: 50px 0 20px; }
.nathan-site .form-success p{ max-width: 460px; line-height: 1.6; }

/* Legal / 404 */
.nathan-site .legal-page,.nathan-site .not-found{ max-width: 1000px; padding-bottom: 130px; }
.nathan-site .legal-page h1,.nathan-site .not-found h1{ margin-bottom: 70px; }
.nathan-site .legal-page h2{ margin: 45px 0 15px; font-family: var(--serif); font-size: 34px; font-weight: 400; }
.nathan-site .legal-page p,.nathan-site .not-found p{ max-width: 750px; line-height: 1.75; }
.nathan-site .not-found > span{ font-size: 11px; letter-spacing: .15em; }
.nathan-site .not-found .pill{ margin-top: 30px; }

@media (max-width: 1100px) {
  .nathan-site .desktop-nav{ display: none; }
  .nathan-site .site-header{ grid-template-columns: 1fr auto; }
  .nathan-site .menu-button{ display: block; }
  .nathan-site .hero-title-wrap{ width: 58vw; }
  .nathan-site .hero-image-frame{ width: 48%; right: 2.5%; }
  .nathan-site .intro{ grid-template-columns: .25fr 1fr; }
  .nathan-site .intro-aside{ grid-column: 2; }
  .nathan-site .neighborhood-strip{ grid-template-columns: 1fr 1fr; }
  .nathan-site .n-card{ height: 460px; }
  .nathan-site .journal-grid{ grid-template-columns: 1fr 1fr; }
  .nathan-site .journal-card.j1{ grid-column: 1/-1; }
  .nathan-site .journal-card.j1 .journal-image{ height: 580px; }
  .nathan-site .footer-main{ grid-template-columns: .7fr 1.3fr; }
  .nathan-site .newsletter{ grid-column: 2; }
  .nathan-site .about-story{ grid-template-columns: .2fr 1fr; }
  .nathan-site .story-columns{ grid-column: 2; }
  .nathan-site .property-editorial{ grid-template-columns: .25fr 1fr; }
  .nathan-site .property-editorial > p:last-child{ grid-column: 2; max-width: 620px; }
  .nathan-site .directory-row:hover{ grid-template-columns: 0fr 50px 1fr auto; }
  .nathan-site .directory-row:hover .directory-image{ opacity: 0; }
  .nathan-site .media-inquiry,.nathan-site .neighborhood-quote{ grid-template-columns: .25fr 1fr; }
  .nathan-site .media-inquiry .pill,.nathan-site .neighborhood-quote .pill{ grid-column: 2; }
}

@media (max-width: 760px) {
  .nathan-site{--pad:20px}
  .nathan-site .page-top{ padding-top: 125px; }
  .nathan-site .site-header{ height: 74px; }
  .nathan-site .header-contact{ display: none; }
  .nathan-site .menu-grid{ grid-template-columns: 1fr; align-items: start; }
  .nathan-site .menu-index{ display: none; }
  .nathan-site .menu-overlay{ padding-top: 105px; }
  .nathan-site .menu-links a{ font-size: 43px; }
  .nathan-site .menu-meta{ margin-top: 25px; }

  .nathan-site .home-hero{ min-height: 850px; height: auto; padding-top: 74px; }
  .nathan-site .home-hero::after{ inset: 74px 0 0; background-size: 50% 25%; }
  .nathan-site .hero-number{ top: 105px; }
  .nathan-site .hero-title-wrap{ top: 145px; width: calc(100% - 40px); }
  .nathan-site .hero-title-wrap h1{ font-size: clamp(64px,20vw,92px); }
  .nathan-site .hero-deck{ max-width: 95%; margin-top: 28px; }
  .nathan-site .hero-actions{ flex-direction: column; align-items: flex-start; }
  .nathan-site .hero-image-frame{ width: 78%; height: 310px; right: 0; bottom: 0; }
  .nathan-site .vertical-word{ display: none; }
  .nathan-site .image-caption span:last-child{ display: none; }

  .nathan-site .intro{ grid-template-columns: 1fr; padding-top: 80px; padding-bottom: 80px; gap: 24px; }
  .nathan-site .intro-aside{ grid-column: auto; margin-top: 25px; }
  .nathan-site .stat-band{ grid-template-columns: 1fr 1fr; }
  .nathan-site .stat-band div:nth-child(2){ border-right: 0; }
  .nathan-site .stat-band div:nth-child(n+3){ border-top: 1px solid rgba(255,255,255,.22); }
  .nathan-site .stat-band div{ padding: 28px 12px 28px 0; }
  .nathan-site .stat-band div:not(:first-child){ padding-left: 15px; }

  .nathan-site .featured,.nathan-site .neighborhood-preview,.nathan-site .insights-home{ padding-top: 85px; padding-bottom: 90px; }
  .nathan-site .section-head{ align-items: flex-start; flex-direction: column; margin-bottom: 45px; gap: 30px; }
  .nathan-site .section-head .head-note{ width: auto; }
  .nathan-site .feature-row{ grid-template-columns: 35px 92px 1fr 20px; gap: 12px; }
  .nathan-site .feature-thumb{ height: 70px; }
  .nathan-site .feature-price{ grid-column: 3; font-size: 11px; }
  .nathan-site .feature-name h3{ font-size: 20px; }
  .nathan-site .feature-go{ grid-column: 4; grid-row: 1; }
  .nathan-site .manifesto{ grid-template-columns: 1fr; }
  .nathan-site .manifesto-image{ min-height: 510px; }
  .nathan-site .manifesto-copy{ padding: 70px 20px 80px; }
  .nathan-site .neighborhood-strip{ grid-template-columns: 1fr; }
  .nathan-site .n-card{ height: 430px; }
  .nathan-site .results-home{ grid-template-columns: 1fr; padding-top: 75px; padding-bottom: 80px; }
  .nathan-site .results-list{ border-left: 0; margin-top: 45px; }
  .nathan-site .result-line{ grid-template-columns: 100px 1fr 35px; gap: 12px; }
  .nathan-site .result-line strong{ font-size: 29px; }
  .nathan-site .journal-grid{ grid-template-columns: 1fr; }
  .nathan-site .journal-card.j1{ grid-column: auto; }
  .nathan-site .journal-image,.nathan-site .journal-card.j1 .journal-image{ height: 350px; }
  .nathan-site .press-ticker{ overflow-x: auto; }

  .nathan-site .footer-cta{ padding-top: 75px; padding-bottom: 75px; }
  .nathan-site .footer-cta-grid,.nathan-site .footer-main{ grid-template-columns: 1fr; gap: 45px; }
  .nathan-site .footer-links{ grid-template-columns: 1fr 1fr; }
  .nathan-site .newsletter{ grid-column: auto; }
  .nathan-site .legal-bar{ align-items: flex-start; flex-direction: column; gap: 10px; padding-top: 20px; padding-bottom: 20px; }
  .nathan-site .legal-bar div{ flex-wrap: wrap; }

  .nathan-site .page-hero{ padding-top: 130px; padding-bottom: 80px; }
  .nathan-site .page-hero h1,.nathan-site .listing-title h1,.nathan-site .results-hero h1,.nathan-site .contact-intro h1,.nathan-site .press-hero h1,.nathan-site .insight-header h1{ font-size: clamp(62px,19vw,95px); }
  .nathan-site .page-deck{ margin: 35px 0 0; }
  .nathan-site .about-hero-grid{ grid-template-columns: 1fr; gap: 30px; margin-top: 50px; }
  .nathan-site .about-portrait{ min-height: 520px; height: 65vh; }
  .nathan-site .about-story{ grid-template-columns: 1fr; padding-top: 80px; padding-bottom: 80px; gap: 25px; }
  .nathan-site .story-columns{ grid-column: auto; grid-template-columns: 1fr; }
  .nathan-site .principle-grid,.nathan-site .credentials-grid{ grid-template-columns: 1fr; }
  .nathan-site .principle-grid article,.nathan-site .principle-grid article:not(:first-child){ padding: 28px 0; border-right: 0; border-bottom: 1px solid rgba(17,19,21,.25); }
  .nathan-site .principle-grid h3{ margin-top: 35px; }
  .nathan-site .about-image-pair{ grid-template-columns: 1fr; }
  .nathan-site .about-image-pair > div,.nathan-site .about-image-pair > div:last-child{ height: 420px; }
  .nathan-site .credentials-grid > div,.nathan-site .credentials-grid > div:not(:first-child){ padding: 24px 0; border-right: 0; border-bottom: 1px solid var(--line); }

  .nathan-site .listing-title{ grid-template-columns: 1fr; margin-bottom: 45px; }
  .nathan-site .listing-title > p:last-child{ margin-top: 30px; }
  .nathan-site .property-grid{ grid-template-columns: 1fr; gap: 52px; }
  .nathan-site .property-card.wide{ grid-column: auto; }
  .nathan-site .property-image,.nathan-site .property-card.wide .property-image{ height: 430px; }
  .nathan-site .property-copy{ align-items: flex-start; flex-direction: column; gap: 8px; }
  .nathan-site .property-detail-hero{ min-height: 680px; height: 88vh; }
  .nathan-site .property-detail-overlay h1{ font-size: 56px; }
  .nathan-site .property-detail-overlay > div{ align-items: flex-start; flex-direction: column; gap: 10px; }
  .nathan-site .property-detail-meta{ align-items: flex-start; flex-direction: column; gap: 30px; }
  .nathan-site .detail-specs{ gap: 25px; }
  .nathan-site .detail-specs b{ font-size: 25px; }
  .nathan-site .property-editorial{ grid-template-columns: 1fr; padding-top: 80px; padding-bottom: 80px; gap: 25px; }
  .nathan-site .property-editorial > p:last-child{ grid-column: auto; }
  .nathan-site .property-gallery{ grid-template-columns: 1fr; }
  .nathan-site .property-gallery img,.nathan-site .property-gallery img:last-child{ height: 430px; }
  .nathan-site .property-facts{ grid-template-columns: 1fr; }
  .nathan-site .property-facts > div,.nathan-site .property-facts > div:not(:first-child){ padding: 22px 0; border-left: 0; border-bottom: 1px solid var(--line); }

  .nathan-site .directory-row{ grid-template-columns: 34px 1fr; gap: 12px; padding: 25px 0; }
  .nathan-site .directory-image{ display: none; }
  .nathan-site .directory-row > strong{ grid-column: 2; }
  .nathan-site .directory-row h2{ font-size: 45px; }
  .nathan-site .neighborhood-quote,.nathan-site .media-inquiry{ grid-template-columns: 1fr; gap: 25px; }
  .nathan-site .neighborhood-quote .pill,.nathan-site .media-inquiry .pill{ grid-column: auto; }

  .nathan-site .results-hero{ min-height: 650px; }
  .nathan-site .results-hero > p:last-child{ width: auto; margin: 40px 0 0; }
  .nathan-site .case-study{ grid-template-columns: 1fr; gap: 25px; padding-top: 80px; padding-bottom: 80px; }
  .nathan-site .case-label p{ margin-top: 15px; }
  .nathan-site .case-number{ font-size: 77px; }
  .nathan-site .ledger-row{ grid-template-columns: 32px 100px 1fr; gap: 10px; }
  .nathan-site .ledger-row em{ grid-column: 3; }
  .nathan-site .ledger-row strong{ font-size: 26px; }

  .nathan-site .article-row{ grid-template-columns: 30px 100px 1fr; gap: 12px; }
  .nathan-site .article-thumb{ height: 90px; }
  .nathan-site .article-arrow{ display: none; }
  .nathan-site .article-info h2{ font-size: 23px; }
  .nathan-site .article-info > p:last-child{ display: none; }
  .nathan-site .insight-header{ padding-top: 125px; }
  .nathan-site .insight-header > p:last-child{ margin: 30px 0 0; }
  .nathan-site .insight-image{ min-height: 390px; height: 50vh; }
  .nathan-site .insight-body{ grid-template-columns: 1fr; gap: 35px; padding-top: 65px; padding-bottom: 70px; }
  .nathan-site .insight-body > div > p{ font-size: 21px; }

  .nathan-site .press-hero{ grid-template-columns: 1fr; gap: 35px; }
  .nathan-site .press-feature{ grid-template-columns: 1fr; }
  .nathan-site .press-feature-image{ height: 470px; }
  .nathan-site .press-feature-copy{ padding: 65px 20px; }
  .nathan-site .press-list article{ grid-template-columns: 30px 1fr 22px; gap: 12px; }
  .nathan-site .press-list strong{ grid-column: 2; }
  .nathan-site .press-list h3{ grid-column: 2; }
  .nathan-site .press-list time{ grid-column: 2; }
  .nathan-site .press-list em{ grid-column: 3; grid-row: 1/5; align-self: center; }

  .nathan-site .contact-page{ grid-template-columns: 1fr; gap: 60px; padding-bottom: 80px; }
  .nathan-site .contact-intro{ position: static; }
  .nathan-site .contact-form-wrap{ padding: 32px 20px; }
  .nathan-site .form-pair{ grid-template-columns: 1fr; }
}
`;
