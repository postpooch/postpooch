/** Scoped Elena template CSS — all selectors under .elena-site */
export const ELENA_CSS = `
.elena-site, .elena-site * { box-sizing: border-box; }
.elena-site { scroll-behavior: smooth; min-height: 100vh; }
.elena-site{
  --ink: #171714;
  --ink-soft: #3f3f39;
  --paper: #f3f0e9;
  --paper-deep: #e9e4da;
  --line: rgba(23, 23, 20, 0.22);
  --night: #1e231f;
  --cream: #f5f0e5;
  --serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;
  --sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
}



.elena-site{
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
.elena-site button, .elena-site input, .elena-site textarea{ font: inherit; }
.elena-site a{ color: inherit; text-decoration: none; }
.elena-site button{ color: inherit; }
.elena-site main{ overflow: clip; }

.elena-site .section-shell{ padding-left: clamp(22px, 4vw, 68px); padding-right: clamp(22px, 4vw, 68px); }
.elena-site .eyebrow{
  margin: 0;
  font-size: 10px;
  line-height: 1.3;
  letter-spacing: .19em;
  text-transform: uppercase;
  font-weight: 600;
}
.elena-site .eyebrow.light{ color: rgba(245, 240, 229, .68); }
.elena-site .section-label{
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
  font-size: 10px;
  letter-spacing: .17em;
  text-transform: uppercase;
}
.elena-site .underlined-link{
  width: fit-content;
  display: inline-flex;
  gap: 34px;
  align-items: center;
  padding: 0 0 8px;
  border-bottom: 1px solid currentColor;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.elena-site .underlined-link.light{ color: var(--cream); }

.elena-site .site-header{
  position: absolute;
  z-index: 40;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  padding: 24px clamp(22px, 4vw, 68px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  color: var(--ink);
}
.elena-site .wordmark{ width: fit-content; display: flex; gap: 8px; align-items: baseline; font-size: 14px; letter-spacing: .15em; font-weight: 700; }
.elena-site .wordmark span:last-child{ font-family: var(--serif); font-style: italic; font-weight: 400; letter-spacing: .03em; font-size: 16px; }
.elena-site .header-center{ font-size: 9px; text-transform: uppercase; letter-spacing: .17em; }
.elena-site .header-actions{ justify-self: end; display: flex; align-items: center; gap: 24px; }
.elena-site .text-button{ border: 0; background: transparent; cursor: pointer; padding: 7px 0; border-bottom: 1px solid currentColor; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }
.elena-site .text-button.light{ color: var(--cream); }
.elena-site .menu-button{ width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(23,23,20,.35); background: rgba(243,240,233,.3); display: grid; place-content: center; gap: 5px; cursor: pointer; transition: transform .3s ease, background .3s ease; }
.elena-site .menu-button:hover{ transform: rotate(8deg); background: rgba(243,240,233,.8); }
.elena-site .menu-button span{ width: 14px; height: 1px; background: var(--ink); display: block; }

.elena-site .menu-overlay{
  position: fixed;
  z-index: 100;
  inset: 0;
  background: var(--night);
  color: var(--cream);
  padding: 28px clamp(22px, 4vw, 68px) 34px;
  display: flex;
  flex-direction: column;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-2%);
  transition: opacity .35s ease, transform .5s cubic-bezier(.22,.61,.36,1), visibility .35s;
}
.elena-site .menu-overlay.is-open{ visibility: visible; opacity: 1; transform: translateY(0); }
.elena-site .menu-topline, .elena-site .menu-footer{ display: flex; justify-content: space-between; align-items: center; }
.elena-site .menu-brand{ font-size: 11px; letter-spacing: .16em; }
.elena-site .round-close{ width: 44px; height: 44px; border-radius: 50%; background: transparent; color: var(--cream); border: 1px solid rgba(245,240,229,.35); font-size: 23px; font-weight: 200; cursor: pointer; }
.elena-site .round-close.dark{ color: var(--ink); border-color: rgba(23,23,20,.35); }
.elena-site .menu-grid{ flex: 1; display: grid; grid-template-columns: 1fr minmax(420px, 1.25fr); gap: 10vw; align-items: center; }
.elena-site .menu-intro{ align-self: end; padding-bottom: 7vh; max-width: 320px; }
.elena-site .menu-intro p{ font-family: var(--serif); font-size: 25px; line-height: 1.25; margin: 0 0 24px; }
.elena-site .menu-intro span{ font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: rgba(245,240,229,.55); }
.elena-site .overlay-nav{ display: flex; flex-direction: column; }
.elena-site .overlay-nav button{ border: 0; border-bottom: 1px solid rgba(245,240,229,.18); background: transparent; color: var(--cream); text-align: left; cursor: pointer; font-family: var(--serif); font-size: clamp(40px, 5vw, 76px); line-height: 1.06; padding: 10px 0 13px; display: flex; align-items: baseline; gap: 28px; transition: padding-left .25s ease; }
.elena-site .overlay-nav button:hover{ padding-left: 12px; }
.elena-site .overlay-nav button span{ font-family: var(--sans); font-size: 9px; letter-spacing: .15em; color: rgba(245,240,229,.48); }
.elena-site .menu-footer{ padding-top: 22px; border-top: 1px solid rgba(245,240,229,.2); font-size: 11px; }

.elena-site .contact-drawer{ position: fixed; z-index: 120; inset: 0; pointer-events: none; visibility: hidden; }
.elena-site .contact-drawer.is-open{ pointer-events: auto; visibility: visible; }
.elena-site .drawer-scrim{ position: absolute; inset: 0; width: 100%; border: 0; background: rgba(10, 10, 8, .55); opacity: 0; transition: opacity .35s ease; cursor: default; }
.elena-site .contact-drawer.is-open .drawer-scrim{ opacity: 1; }
.elena-site .drawer-panel{ position: absolute; right: 0; top: 0; height: 100%; width: min(610px, 100%); background: var(--paper); padding: 34px clamp(24px, 4vw, 58px); transform: translateX(100%); transition: transform .5s cubic-bezier(.22,.61,.36,1); overflow-y: auto; }
.elena-site .contact-drawer.is-open .drawer-panel{ transform: translateX(0); }
.elena-site .drawer-head{ display: flex; justify-content: space-between; align-items: flex-start; gap: 30px; }
.elena-site .drawer-head h2{ font-family: var(--serif); font-size: clamp(34px, 4.5vw, 58px); line-height: 1; font-weight: 400; margin: 20px 0 35px; max-width: 420px; }
.elena-site .inquiry-form{ display: grid; gap: 22px; }
.elena-site .interest-row{ display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.elena-site .chip input{ position: absolute; opacity: 0; }
.elena-site .chip span{ display: block; padding: 9px 13px; border: 1px solid var(--line); border-radius: 999px; font-size: 10px; letter-spacing: .07em; text-transform: uppercase; cursor: pointer; }
.elena-site .chip input:checked + span{ background: var(--ink); color: var(--paper); }
.elena-site .inquiry-form > label{ display: grid; gap: 8px; }
.elena-site .inquiry-form > label > span{ font-size: 9px; text-transform: uppercase; letter-spacing: .15em; }
.elena-site .inquiry-form input, .elena-site .inquiry-form textarea{ border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; padding: 10px 0 13px; outline: none; resize: vertical; }
.elena-site .inquiry-form input:focus, .elena-site .inquiry-form textarea:focus{ border-color: var(--ink); }
.elena-site .primary-button{ border: 0; background: var(--ink); color: var(--paper); padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; text-transform: uppercase; letter-spacing: .12em; font-size: 10px; cursor: pointer; margin-top: 6px; }
.elena-site .form-note{ margin: -10px 0 0; font-size: 10px; line-height: 1.5; color: #77756f; }
.elena-site .drawer-direct{ display: flex; justify-content: space-between; gap: 20px; border-top: 1px solid var(--line); margin-top: 32px; padding-top: 18px; font-size: 11px; }

.elena-site .hero{ min-height: 100vh; padding-top: 150px; position: relative; display: flex; flex-direction: column; }
.elena-site .hero-kicker{ margin-left: 52%; max-width: 300px; font-size: 9px; line-height: 1.45; letter-spacing: .16em; text-transform: uppercase; }
.elena-site .hero-title-wrap{ position: relative; z-index: 2; margin-top: 4vh; }
.elena-site .hero h1{ margin: 0; font-family: var(--serif); font-weight: 400; font-size: clamp(62px, 9.4vw, 142px); line-height: .86; letter-spacing: -.055em; }
.elena-site .hero h1 em{ font-weight: 400; }
.elena-site .hero-bottom{ width: 47%; margin: 4vh 0 42px 52%; display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; }
.elena-site .hero-bottom p{ max-width: 420px; margin: 0; font-size: 13px; line-height: 1.65; color: var(--ink-soft); }
.elena-site .circle-link{ flex: 0 0 auto; display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; border: 1px solid var(--line); font-size: 16px; transition: background .25s ease, color .25s ease; }
.elena-site .circle-link:hover{ background: var(--ink); color: var(--paper); }
.elena-site .hero-image-wrap{ position: relative; margin-left: -4vw; margin-right: -4vw; }
.elena-site .hero-image{ height: min(63vw, 780px); min-height: 520px; background-size: cover; background-position: center 56%; }
.elena-site .image-caption{ position: absolute; right: clamp(22px, 4vw, 68px); bottom: 20px; color: #fff; font-size: 9px; text-transform: uppercase; letter-spacing: .14em; }

.elena-site .stats-band{ display: grid; grid-template-columns: repeat(3, 1fr) 1.35fr; border-bottom: 1px solid var(--line); }
.elena-site .stat, .elena-site .stats-note{ min-height: 170px; padding: 30px clamp(22px, 3vw, 50px); border-right: 1px solid var(--line); display: flex; flex-direction: column; justify-content: space-between; }
.elena-site .stat strong{ font-family: var(--serif); font-size: clamp(34px, 4vw, 58px); font-weight: 400; }
.elena-site .stat span, .elena-site .stats-note{ font-size: 9px; letter-spacing: .14em; text-transform: uppercase; }
.elena-site .stats-note{ justify-content: flex-end; border-right: 0; line-height: 1.55; }

.elena-site .about-section{ padding-top: 120px; padding-bottom: 150px; }
.elena-site .about-grid{ display: grid; grid-template-columns: minmax(300px, .9fr) minmax(460px, 1.1fr); gap: 9vw; padding-top: 54px; align-items: start; }
.elena-site .about-portrait-frame{ position: relative; }
.elena-site .about-portrait{ aspect-ratio: .78; background-size: cover; background-position: center 24%; filter: saturate(.72) contrast(.94); }
.elena-site .portrait-meta{ display: flex; justify-content: space-between; gap: 20px; padding-top: 13px; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
.elena-site .portrait-meta span:last-child{ text-align: right; color: #6f6d66; }
.elena-site .about-copy{ padding-top: 8vh; }
.elena-site .about-copy h2{ max-width: 720px; margin: 25px 0 54px; font-family: var(--serif); font-size: clamp(45px, 5.6vw, 82px); line-height: .99; font-weight: 400; letter-spacing: -.035em; }
.elena-site .copy-columns{ display: grid; grid-template-columns: 1fr 1fr; gap: 34px; margin-bottom: 46px; }
.elena-site .copy-columns p{ margin: 0; font-size: 12px; line-height: 1.72; color: var(--ink-soft); }

.elena-site .manifesto-section{ min-height: 780px; position: relative; display: grid; align-items: end; background: #667064; color: var(--cream); }
.elena-site .manifesto-image{ position: absolute; inset: 0; background-image: linear-gradient(180deg, rgba(22,27,23,.08), rgba(22,27,23,.58)), url('https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b4/b460677727cc3d57ba010e132e1b4ca94143ea5a423008bb1b9db854797f712c.avif'); background-size: cover; background-position: center; filter: saturate(.68); }
.elena-site .manifesto-copy{ position: relative; z-index: 1; width: 100%; padding-bottom: 68px; display: grid; grid-template-columns: .55fr 1.45fr auto; gap: 7vw; align-items: end; }
.elena-site .manifesto-copy blockquote{ margin: 0; font-family: var(--serif); font-size: clamp(40px, 5.2vw, 78px); line-height: 1.01; letter-spacing: -.03em; max-width: 1000px; }
.elena-site .signature{ font-family: var(--serif); font-style: italic; font-size: 16px; white-space: nowrap; }

.elena-site .expertise-section{ padding-top: 125px; padding-bottom: 145px; }
.elena-site .expertise-head{ display: grid; grid-template-columns: 1.35fr .65fr; gap: 9vw; padding: 55px 0 80px; align-items: end; }
.elena-site .expertise-head h2, .elena-site .residences-head h2, .elena-site .process-title h2, .elena-site .journal-head h2{ margin: 0; font-family: var(--serif); font-weight: 400; letter-spacing: -.04em; }
.elena-site .expertise-head h2{ font-size: clamp(54px, 7vw, 100px); line-height: .94; max-width: 850px; }
.elena-site .expertise-head p{ margin: 0 0 8px; font-size: 12px; line-height: 1.7; color: var(--ink-soft); max-width: 430px; }
.elena-site .service-list{ border-top: 1px solid var(--line); }
.elena-site .service-row{ min-height: 165px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: .26fr 1.05fr 1fr auto; gap: 35px; align-items: center; transition: background .3s ease, padding .3s ease; }
.elena-site .service-row:hover{ background: var(--paper-deep); padding-left: 16px; padding-right: 16px; }
.elena-site .service-number{ font-size: 9px; letter-spacing: .15em; }
.elena-site .service-row h3{ margin: 0; font-family: var(--serif); font-weight: 400; font-size: clamp(29px, 3vw, 46px); }
.elena-site .service-row p{ max-width: 530px; margin: 0; font-size: 11px; line-height: 1.65; color: var(--ink-soft); }
.elena-site .service-arrow{ font-size: 19px; }

.elena-site .residences-section{ background: var(--night); color: var(--cream); padding-top: 110px; padding-bottom: 70px; }
.elena-site .residences-section .section-label{ border-color: rgba(245,240,229,.22); }
.elena-site .residences-head{ display: grid; grid-template-columns: .55fr 1.25fr auto; gap: 6vw; align-items: end; }
.elena-site .residences-head h2{ font-size: clamp(50px, 6.5vw, 92px); line-height: .95; margin-top: 18px; }
.elena-site .listing-grid{ margin-top: 70px; display: grid; grid-template-columns: 1.1fr .9fr; gap: 80px 28px; align-items: start; }
.elena-site .listing-card:nth-child(3){ grid-column: 1 / -1; width: 72%; margin-left: auto; }
.elena-site .listing-image{ height: 58vw; max-height: 760px; min-height: 480px; background-size: cover; background-position: center; position: relative; filter: saturate(.77); }
.elena-site .listing-2 .listing-image{ height: 45vw; max-height: 620px; }
.elena-site .listing-3 .listing-image{ height: 42vw; max-height: 650px; }
.elena-site .listing-status{ position: absolute; top: 18px; left: 18px; padding: 8px 10px; border: 1px solid rgba(255,255,255,.42); font-size: 8px; letter-spacing: .16em; text-transform: uppercase; backdrop-filter: blur(7px); background: rgba(20,20,18,.12); }
.elena-site .listing-copy{ display: flex; justify-content: space-between; align-items: end; gap: 30px; padding-top: 15px; }
.elena-site .listing-copy span{ font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: rgba(245,240,229,.6); }
.elena-site .listing-copy h3{ margin: 7px 0 0; font-family: var(--serif); font-size: 27px; font-weight: 400; }
.elena-site .listing-data{ display: grid; text-align: right; gap: 7px; }
.elena-site .listing-data strong{ font-family: var(--serif); font-size: 18px; font-weight: 400; }
.elena-site .disclaimer{ margin-top: 65px; margin-bottom: 0; font-size: 9px; letter-spacing: .08em; color: rgba(245,240,229,.42); text-transform: uppercase; }

.elena-site .process-section{ padding-top: 125px; padding-bottom: 145px; }
.elena-site .process-grid{ padding-top: 60px; display: grid; grid-template-columns: .85fr 1.15fr; gap: 11vw; }
.elena-site .process-title{ position: sticky; top: 100px; height: fit-content; }
.elena-site .process-title h2{ font-size: clamp(58px, 7vw, 102px); line-height: .92; margin-top: 20px; }
.elena-site .process-steps{ display: grid; }
.elena-site .process-steps article{ display: grid; grid-template-columns: 60px .7fr 1fr; gap: 25px; border-top: 1px solid var(--line); padding: 32px 0 42px; }
.elena-site .process-steps article:last-child{ border-bottom: 1px solid var(--line); }
.elena-site .process-steps span{ font-size: 9px; letter-spacing: .15em; }
.elena-site .process-steps h3{ margin: 0; font-family: var(--serif); font-size: 28px; font-weight: 400; }
.elena-site .process-steps p{ margin: 0; font-size: 11px; line-height: 1.7; color: var(--ink-soft); }

.elena-site .journal-section{ padding-top: 110px; padding-bottom: 135px; background: #e4ded3; }
.elena-site .journal-head{ display: grid; grid-template-columns: 1.2fr .8fr; gap: 9vw; align-items: end; }
.elena-site .journal-head .section-label{ margin-bottom: 54px; }
.elena-site .journal-head h2{ font-size: clamp(54px, 6.7vw, 96px); line-height: .95; }
.elena-site .journal-head > p{ max-width: 360px; justify-self: end; margin: 0 0 6px; font-size: 12px; line-height: 1.7; color: var(--ink-soft); }
.elena-site .journal-grid{ margin-top: 72px; border-top: 1px solid var(--line); }
.elena-site .journal-card{ min-height: 245px; display: grid; grid-template-columns: .25fr 1fr auto; gap: 50px; padding: 32px 0; border-bottom: 1px solid var(--line); transition: padding .25s ease; }
.elena-site .journal-card:hover{ padding-left: 12px; padding-right: 12px; }
.elena-site .journal-index{ font-size: 9px; letter-spacing: .14em; }
.elena-site .journal-card h3{ margin: 16px 0 16px; font-family: var(--serif); font-weight: 400; font-size: clamp(31px, 3.5vw, 50px); line-height: 1; max-width: 780px; }
.elena-site .journal-card > div > p:last-child{ max-width: 620px; margin: 0; font-size: 11px; line-height: 1.7; color: var(--ink-soft); }
.elena-site .journal-arrow{ font-size: 18px; }
.elena-site a.journal-card{ color: inherit; }
.elena-site .journal-archive{ padding-top: 160px; }
.elena-site .journal-empty{ margin-top: 56px; font-size: 12px; color: var(--ink-soft); }
.elena-site .journal-article{ padding-top: 160px; padding-bottom: 120px; max-width: 760px; }
.elena-site .journal-article h1{ font-family: var(--serif); font-weight: 400; font-size: clamp(46px, 6.4vw, 86px); line-height: .95; margin: 18px 0 28px; }
.elena-site .journal-article__dek{ font-size: 16px; line-height: 1.7; color: var(--ink-soft); max-width: 620px; margin: 0 0 36px; }
.elena-site .journal-article__body p{ font-size: 15px; line-height: 1.8; margin: 0 0 22px; }
.elena-site .journal-article .underlined-link{ margin-top: 28px; display: inline-block; }
.elena-site a.listing-card{ color: inherit; text-decoration: none; }
.elena-site .residence-article{ padding-top: 160px; padding-bottom: 120px; }
.elena-site .residence-hero{ height: 68vh; min-height: 420px; max-height: 760px; background-size: cover; background-position: center; filter: saturate(.77); margin-bottom: 48px; }
.elena-site .residence-kicker{ font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); }
.elena-site .residence-article h1{ font-family: var(--serif); font-weight: 400; font-size: clamp(46px, 6.4vw, 86px); line-height: .95; margin: 18px 0 12px; }
.elena-site .residence-address{ margin: 0; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); }
.elena-site .residence-meta{ display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 12px; }
.elena-site .residence-price{ font-family: var(--serif); font-size: 28px; font-weight: 400; }
.elena-site .residence-facts{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin: 40px 0; }
.elena-site .residence-facts div{ padding: 22px 0; display: grid; gap: 8px; }
.elena-site .residence-facts span{ font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--ink-soft); }
.elena-site .residence-facts strong{ font-family: var(--serif); font-size: 22px; font-weight: 400; }
.elena-site .residence-body p{ font-size: 15px; line-height: 1.8; margin: 0 0 22px; max-width: 680px; }
.elena-site .residence-gallery{ display: grid; gap: 16px; margin: 56px 0; }
.elena-site .residence-gallery img{ width: 100%; display: block; }
.elena-site .residence-actions{ display: flex; gap: 36px; flex-wrap: wrap; margin-top: 36px; }
.elena-site .residence-actions .underlined-link{ margin-top: 0; }

.elena-site .contact-section{ min-height: 900px; position: relative; display: grid; align-items: end; background: #282e28; color: var(--cream); }
.elena-site .contact-visual{ position: absolute; inset: 0; background-image: linear-gradient(180deg, rgba(20,24,20,.18), rgba(20,24,20,.67)), url('https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/4f/4fb5faf4c291ba886ae120de66d4ac2d32843280b483e7ed278daa14ede57ec9.avif'); background-size: cover; background-position: center; filter: saturate(.62); }
.elena-site .contact-copy{ position: relative; z-index: 1; width: 100%; padding-bottom: 82px; }
.elena-site .contact-copy h2{ margin: 18px 0 22px; font-family: var(--serif); font-size: clamp(63px, 9vw, 132px); line-height: .9; letter-spacing: -.05em; font-weight: 400; }
.elena-site .contact-copy > p{ max-width: 510px; margin: 0 0 48px; font-size: 12px; line-height: 1.7; color: rgba(245,240,229,.72); }
.elena-site .contact-links{ display: flex; align-items: center; gap: 40px; flex-wrap: wrap; }
.elena-site .contact-links a{ padding-bottom: 7px; border-bottom: 1px solid rgba(245,240,229,.6); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
.elena-site .contact-links a:first-child{ display: flex; gap: 28px; }

.elena-site .footer{ background: var(--paper); padding-top: 55px; padding-bottom: 32px; display: grid; grid-template-columns: 1.1fr .7fr 1fr; gap: 7vw; align-items: start; }
.elena-site .footer-brand{ display: flex; align-items: center; gap: 20px; }
.elena-site .footer-monogram{ width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; font-family: var(--serif); font-style: italic; }
.elena-site .footer-brand div{ display: grid; gap: 4px; }
.elena-site .footer-brand strong{ font-family: var(--serif); font-weight: 400; font-size: 23px; }
.elena-site .footer-brand div span{ font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: #77756f; }
.elena-site .footer-nav{ display: grid; gap: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }
.elena-site .footer-meta{ display: grid; justify-items: end; gap: 8px; font-size: 8px; letter-spacing: .11em; text-transform: uppercase; color: #77756f; text-align: right; }

@media (max-width: 980px){
  .elena-site .header-center, .elena-site .desktop-contact{ display: none; }
  .elena-site .site-header{ grid-template-columns: 1fr auto; }
  .elena-site .menu-grid{ grid-template-columns: 1fr; padding-top: 8vh; }
  .elena-site .menu-intro{ display: none; }
  .elena-site .hero-kicker{ margin-left: 0; }
  .elena-site .hero-bottom{ width: 100%; margin-left: 0; }
  .elena-site .stats-band{ grid-template-columns: repeat(3, 1fr); }
  .elena-site .stats-note{ grid-column: 1 / -1; min-height: 90px; border-top: 1px solid var(--line); }
  .elena-site .about-grid{ grid-template-columns: .8fr 1.2fr; gap: 6vw; }
  .elena-site .copy-columns{ grid-template-columns: 1fr; }
  .elena-site .manifesto-copy{ grid-template-columns: 1fr; gap: 24px; }
  .elena-site .signature{ justify-self: end; }
  .elena-site .residences-head{ grid-template-columns: 1fr 1fr; }
  .elena-site .residences-head .underlined-link{ grid-column: 2; }
  .elena-site .listing-grid{ gap: 55px 20px; }
  .elena-site .process-grid{ gap: 6vw; }
  .elena-site .journal-card{ grid-template-columns: 50px 1fr auto; gap: 20px; }
}

@media (max-width: 720px){
  .elena-site .section-shell{ padding-left: 19px; padding-right: 19px; }
  .elena-site .site-header{ height: 76px; padding: 18px 19px; }
  .elena-site .hero{ min-height: auto; padding-top: 130px; }
  .elena-site .hero h1{ font-size: clamp(57px, 18vw, 92px); line-height: .89; }
  .elena-site .hero-bottom{ margin-top: 38px; align-items: center; }
  .elena-site .hero-bottom p{ font-size: 12px; }
  .elena-site .circle-link{ width: 45px; height: 45px; }
  .elena-site .hero-image-wrap{ margin-left: -19px; margin-right: -19px; }
  .elena-site .hero-image{ min-height: 500px; height: 76vh; background-position: center; }
  .elena-site .image-caption{ right: 19px; }
  .elena-site .stats-band{ grid-template-columns: 1fr; }
  .elena-site .stat{ min-height: 120px; border-right: 0; border-bottom: 1px solid var(--line); }
  .elena-site .stats-note{ grid-column: auto; border-top: 0; }
  .elena-site .about-section{ padding-top: 80px; padding-bottom: 90px; }
  .elena-site .about-grid{ grid-template-columns: 1fr; gap: 48px; padding-top: 35px; }
  .elena-site .about-portrait-frame{ width: 83%; }
  .elena-site .about-copy{ padding-top: 0; }
  .elena-site .about-copy h2{ font-size: 49px; margin-bottom: 35px; }
  .elena-site .manifesto-section{ min-height: 690px; }
  .elena-site .manifesto-copy{ padding-bottom: 38px; }
  .elena-site .manifesto-copy blockquote{ font-size: 42px; }
  .elena-site .expertise-section{ padding-top: 80px; padding-bottom: 90px; }
  .elena-site .expertise-head{ grid-template-columns: 1fr; gap: 28px; padding: 35px 0 55px; }
  .elena-site .expertise-head h2{ font-size: 57px; }
  .elena-site .service-row{ min-height: 0; grid-template-columns: 40px 1fr auto; gap: 15px; padding: 26px 0; }
  .elena-site .service-row h3{ font-size: 28px; }
  .elena-site .service-row p{ grid-column: 2 / -1; font-size: 11px; padding-top: 3px; }
  .elena-site .residences-section{ padding-top: 78px; }
  .elena-site .residences-head{ grid-template-columns: 1fr; gap: 28px; }
  .elena-site .residences-head .underlined-link{ grid-column: auto; }
  .elena-site .residences-head h2{ font-size: 54px; }
  .elena-site .listing-grid{ grid-template-columns: 1fr; margin-top: 50px; gap: 58px; }
  .elena-site .listing-card:nth-child(3){ grid-column: auto; width: 100%; }
  .elena-site .listing-image, .elena-site .listing-2 .listing-image, .elena-site .listing-3 .listing-image{ height: 68vh; min-height: 480px; }
  .elena-site .listing-copy{ align-items: start; flex-direction: column; gap: 18px; }
  .elena-site .listing-data{ text-align: left; }
  .elena-site .process-section{ padding-top: 80px; padding-bottom: 90px; }
  .elena-site .process-grid{ grid-template-columns: 1fr; gap: 50px; padding-top: 40px; }
  .elena-site .process-title{ position: static; }
  .elena-site .process-title h2{ font-size: 58px; }
  .elena-site .process-steps article{ grid-template-columns: 42px 1fr; gap: 15px; }
  .elena-site .process-steps p{ grid-column: 2; }
  .elena-site .journal-section{ padding-top: 78px; padding-bottom: 90px; }
  .elena-site .journal-head{ grid-template-columns: 1fr; gap: 28px; }
  .elena-site .journal-head .section-label{ margin-bottom: 36px; }
  .elena-site .journal-head h2{ font-size: 58px; }
  .elena-site .journal-head > p{ justify-self: start; }
  .elena-site .journal-grid{ margin-top: 50px; }
  .elena-site .journal-card{ grid-template-columns: 36px 1fr auto; gap: 10px; }
  .elena-site .journal-card h3{ font-size: 33px; }
  .elena-site .contact-section{ min-height: 760px; }
  .elena-site .contact-copy{ padding-bottom: 44px; }
  .elena-site .contact-copy h2{ font-size: 66px; }
  .elena-site .footer{ grid-template-columns: 1fr; gap: 35px; padding-top: 40px; }
  .elena-site .footer-meta{ justify-items: start; text-align: left; }
  .elena-site .menu-overlay{ padding: 20px 19px 24px; }
  .elena-site .overlay-nav button{ font-size: clamp(42px, 14vw, 62px); }
  .elena-site .menu-footer{ align-items: flex-end; gap: 25px; }
  .elena-site .drawer-direct{ flex-direction: column; }
}

`;
