/** Scoped Voss (mara-voss-real-estate) template CSS — all selectors under .voss-site */
export const VOSS_CSS = `
.voss-site {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--sans);
}
.voss-site *, .voss-site *::before, .voss-site *::after { box-sizing: border-box; }

.voss-site{
  --ink: #171714;
  --paper: #f2efe8;
  --paper-2: #e8e3d9;
  --white: #fcfaf5;
  --copper: #9b5d43;
  --line: rgba(23,23,20,.2);
  --serif: "Iowan Old Style", "Baskerville", "Times New Roman", serif;
  --sans: "Helvetica Neue", "Arial", sans-serif;
}

.voss-site *{ box-sizing: border-box; }

.voss-site{ scroll-behavior: smooth; background: var(--paper); }

.voss-site{ margin: 0; color: var(--ink); background: var(--paper); font-family: var(--sans); }

.voss-site a{ color: inherit; text-decoration: none; }

.voss-site button, .voss-site input, .voss-site textarea, .voss-site select{ font: inherit; }

.voss-site img{ display: block; width: 100%; }

.voss-site ::selection{ background: var(--ink); color: var(--paper); }

.voss-site .site-header{ height: 106px; padding: 0 3.2vw; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 50; border-bottom: 1px solid var(--line); background: var(--paper); }

.voss-site .site-header--transparent{ position: absolute; width: 100%; color: var(--white); background: transparent; border-bottom-color: rgba(255,255,255,.35); }

.voss-site .logo{ display: inline-flex; flex-direction: column; line-height: 1; gap: 7px; }

.voss-site .logo__name{ font-family: var(--serif); font-size: 23px; letter-spacing: .08em; }

.voss-site .logo__sub{ font-size: 8px; letter-spacing: .32em; }

.voss-site .logo--light{ color: var(--white); }

.voss-site .site-header__right{ display: flex; align-items: center; gap: 38px; }

.voss-site .header-contact{ font-size: 11px; text-transform: uppercase; letter-spacing: .14em; }

.voss-site .menu-button{ width: 58px; height: 42px; border: 0; border-left: 1px solid currentColor; background: transparent; color: inherit; padding-left: 21px; cursor: pointer; display: flex; flex-direction: column; justify-content: center; gap: 7px; }

.voss-site .menu-button span{ display: block; width: 28px; height: 1px; background: currentColor; }

.voss-site .menu-button span:last-child{ width: 18px; align-self: flex-end; }

.voss-site .menu-overlay{ position: fixed; inset: 0; z-index: 100; background: var(--ink); color: var(--white); transform: translateY(-102%); transition: transform .65s cubic-bezier(.76,0,.24,1); padding: 0 3.2vw; }

.voss-site .menu-overlay.is-open{ transform: translateY(0); }

.voss-site .menu-overlay__top{ height: 106px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.2); }

.voss-site .close-button{ background: none; border: 0; color: var(--white); text-transform: uppercase; letter-spacing: .14em; font-size: 10px; cursor: pointer; display: flex; align-items: center; gap: 16px; }

.voss-site .close-button span{ font-size: 28px; font-weight: 200; }

.voss-site .menu-overlay__grid{ height: calc(100vh - 106px); display: grid; grid-template-columns: 1.45fr .55fr; align-items: center; }

.voss-site .menu-nav{ display: flex; flex-direction: column; padding-right: 8vw; }

.voss-site .menu-nav a{ display: grid; grid-template-columns: 55px 1fr; align-items: baseline; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,.14); font-family: var(--serif); font-size: clamp(38px, 5.3vw, 82px); line-height: .95; transition: opacity .25s, padding-left .25s; }

.voss-site .menu-nav a:hover{ padding-left: 14px; }

.voss-site .menu-nav a span{ font-family: var(--sans); font-size: 9px; letter-spacing: .12em; opacity: .5; }

.voss-site .menu-nav a.active{ color: #d9b5a5; }

.voss-site .menu-aside{ border-left: 1px solid rgba(255,255,255,.2); padding-left: 5vw; max-width: 390px; }

.voss-site .menu-aside > p:nth-child(2){ font-family: var(--serif); font-size: 25px; line-height: 1.25; }

.voss-site .menu-aside__meta{ display: flex; flex-direction: column; margin-top: 50px; gap: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; }

.voss-site .eyebrow{ margin: 0 0 24px; font-size: 9px; text-transform: uppercase; letter-spacing: .22em; line-height: 1.4; }

.voss-site .eyebrow--light{ color: var(--white); }

.voss-site .section-pad{ padding: 120px 6vw; }

.voss-site .section-pad--topless{ padding-top: 0; }

.voss-site .hero{ min-height: 100vh; position: relative; overflow: hidden; background: #222; color: var(--white); }

.voss-site .hero__image{ position: absolute; inset: 0; height: 100%; object-fit: cover; object-position: center 46%; transform: scale(1.02); animation: vossHeroIn 1.4s ease-out both; }

.voss-site .hero__shade{ position: absolute; inset: 0; background: rgba(12,12,10,.46); }

@keyframes vossHeroIn { from { transform: scale(1.08); opacity: .6; } to { transform: scale(1.02); opacity: 1; } }
.voss-site .hero__copy{ position: relative; z-index: 2; padding: 210px 6vw 100px; min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; }

.voss-site .hero h1{ font-family: var(--serif); font-weight: 400; font-size: clamp(72px, 10.5vw, 170px); line-height: .77; letter-spacing: -.055em; margin: 8vh 0 56px; max-width: 1300px; }

.voss-site .hero h1 em, .voss-site .intro h2 em, .voss-site .numbers h2 em, .voss-site .neighborhood-preview h2 em, .voss-site .page-hero h1 em, .voss-site .about-hero h1 em, .voss-site .property-story h2 em, .voss-site .property-details h2 em, .voss-site .contact-copy h1 em{ font-weight: 400; color: #d9b5a5; }

.voss-site .hero__lower{ width: 100%; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,.4); padding-top: 22px; }

.voss-site .hero__lower p{ max-width: 560px; font-size: 16px; line-height: 1.5; margin: 0; }

.voss-site .hero__index{ position: absolute; right: 3.2vw; top: 128px; z-index: 2; display: flex; gap: 22px; font-size: 9px; letter-spacing: .18em; }

.voss-site .line-link{ display: inline-flex; gap: 45px; min-width: 210px; justify-content: space-between; align-items: center; padding: 0 0 10px; border-bottom: 1px solid currentColor; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; }

.voss-site .line-link--light{ color: var(--white); }

.voss-site .line-link span{ font-size: 16px; }

.voss-site .intro{ display: grid; grid-template-columns: 16% 84%; min-height: 680px; align-items: start; }

.voss-site .intro__side{ display: flex; gap: 20px; height: 100%; }

.voss-site .vertical-rule{ display: block; width: 1px; background: var(--line); height: 100%; margin-left: auto; margin-right: 35px; }

.voss-site .intro__content h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(54px, 6.5vw, 108px); line-height: .92; letter-spacing: -.045em; margin: 0; }

.voss-site .intro__text{ display: grid; grid-template-columns: 1fr 260px; gap: 12vw; margin: 70px 0 0 24%; align-items: end; }

.voss-site .intro__text p{ font-family: var(--serif); font-size: 24px; line-height: 1.38; margin: 0; }

.voss-site .section-heading{ display: flex; align-items: end; justify-content: space-between; border-bottom: 1px solid var(--line); padding-bottom: 28px; margin-bottom: 35px; }

.voss-site .section-heading h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(44px, 5vw, 78px); margin: 0; letter-spacing: -.03em; }

.voss-site .property-grid{ display: grid; grid-template-columns: 1.25fr .75fr; gap: 72px 26px; }

.voss-site .property-grid .property-card:nth-child(4n+3), .voss-site .property-grid .property-card:nth-child(4n+4){ transform: translateY(30px); }

.voss-site .property-card{ display: block; }

.voss-site .property-card__image-wrap{ position: relative; overflow: hidden; background: #d7d3cc; aspect-ratio: 1.28; }

.voss-site .property-card:nth-child(even) .property-card__image-wrap{ aspect-ratio: .96; }

.voss-site .property-card__image{ width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.2,.7,.2,1); }

.voss-site .property-card:hover .property-card__image{ transform: scale(1.035); }

.voss-site .property-card__status, .voss-site .property-card__number{ position: absolute; top: 18px; font-size: 8px; text-transform: uppercase; letter-spacing: .18em; color: white; text-shadow: 0 1px 8px rgba(0,0,0,.3); }

.voss-site .property-card__status{ left: 18px; }

.voss-site .property-card__number{ right: 18px; }

.voss-site .property-card__body{ display: flex; justify-content: space-between; gap: 25px; padding-top: 17px; }

.voss-site .property-card__neighborhood{ font-size: 8px; text-transform: uppercase; letter-spacing: .18em; margin: 0 0 6px; }

.voss-site .property-card h3{ font-family: var(--serif); font-weight: 400; font-size: 28px; margin: 0; }

.voss-site .property-card__meta{ display: flex; flex-direction: column; align-items: flex-end; gap: 8px; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; padding-top: 3px; white-space: nowrap; }

.voss-site .manifesto{ min-height: 930px; background: var(--ink); color: var(--white); position: relative; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 95px 6vw; margin-top: 130px; }

.voss-site .manifesto__word{ position: absolute; left: -2vw; top: -4vh; font-family: var(--serif); font-size: 19vw; letter-spacing: -.07em; color: rgba(255,255,255,.055); line-height: 1; }

.voss-site .manifesto__image{ width: 66%; margin: 4vh auto 0 8vw; z-index: 1; }

.voss-site .manifesto__image img{ aspect-ratio: .73; object-fit: cover; }

.voss-site .manifesto__copy{ z-index: 1; max-width: 600px; padding-right: 6vw; }

.voss-site .manifesto__copy h2{ font-family: var(--serif); font-size: clamp(55px, 6.2vw, 100px); line-height: .9; font-weight: 400; letter-spacing: -.045em; margin: 0 0 50px; }

.voss-site .manifesto__copy > p:not(.eyebrow){ font-family: var(--serif); font-size: 23px; line-height: 1.45; max-width: 520px; margin-bottom: 50px; color: #d8d3cb; }

.voss-site .numbers__intro{ display: flex; justify-content: space-between; align-items: start; padding-bottom: 75px; }

.voss-site .numbers h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(50px, 6vw, 90px); line-height: .95; letter-spacing: -.04em; margin: 0; }

.voss-site .number-grid{ display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }

.voss-site .number-grid > div{ padding: 35px 22px 80px 0; border-right: 1px solid var(--line); }

.voss-site .number-grid > div + div{ padding-left: 22px; }

.voss-site .number-grid > div:last-child{ border-right: 0; }

.voss-site .number-grid strong{ display: block; font-family: var(--serif); font-size: clamp(48px, 5vw, 82px); font-weight: 400; letter-spacing: -.04em; }

.voss-site .number-grid span{ display: block; font-size: 9px; text-transform: uppercase; letter-spacing: .13em; margin-top: 15px; }

.voss-site .disclaimer{ font-size: 9px; line-height: 1.5; color: rgba(23,23,20,.55); max-width: 750px; margin-top: 17px; }

.voss-site .neighborhood-preview{ background: var(--paper-2); padding-bottom: 120px; }

.voss-site .neighborhood-preview__lead{ display: grid; grid-template-columns: 1fr 1.25fr; column-gap: 9vw; align-items: end; }

.voss-site .neighborhood-preview__lead .eyebrow{ grid-column: 1 / -1; }

.voss-site .neighborhood-preview h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(50px, 6vw, 92px); line-height: .93; letter-spacing: -.04em; margin: 0; }

.voss-site .neighborhood-preview__lead > p:last-child{ font-family: var(--serif); font-size: 23px; line-height: 1.45; margin: 0; max-width: 500px; }

.voss-site .neighborhood-list{ border-top: 1px solid var(--line); }

.voss-site .neighborhood-row{ display: grid; grid-template-columns: 8% 45% 1fr auto; align-items: center; padding: 23px 6vw; border-bottom: 1px solid var(--line); transition: background .25s, color .25s; }

.voss-site .neighborhood-row:hover{ background: var(--ink); color: var(--paper); }

.voss-site .neighborhood-row__num, .voss-site .neighborhood-row__kicker{ font-size: 9px; text-transform: uppercase; letter-spacing: .14em; }

.voss-site .neighborhood-row__name{ font-family: var(--serif); font-size: clamp(34px,4vw,58px); }

.voss-site .neighborhood-row__arrow{ font-size: 20px; }

.voss-site .quote{ min-height: 670px; display: grid; align-content: center; }

.voss-site .quote__mark{ font-family: var(--serif); font-size: 140px; line-height: .3; margin: 0 0 25px; color: var(--copper); }

.voss-site .quote blockquote{ font-family: var(--serif); font-size: clamp(48px, 6.4vw, 100px); line-height: .97; letter-spacing: -.045em; margin: 0; max-width: 1250px; }

.voss-site .quote blockquote em{ color: var(--copper); font-weight: 400; }

.voss-site .quote__source{ margin-top: 45px; display: flex; gap: 50px; font-size: 9px; text-transform: uppercase; letter-spacing: .12em; }

.voss-site .footer{ background: var(--ink); color: var(--white); padding: 120px 6vw 55px; }

.voss-site .footer__cta{ min-height: 520px; position: relative; }

.voss-site .footer__cta h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(62px, 8vw, 130px); line-height: .86; letter-spacing: -.055em; margin: 0; }

.voss-site .footer__cta h2 em{ color: #d9b5a5; font-weight: 400; }

.voss-site .circle-link{ position: absolute; right: 3vw; top: 25%; width: 180px; height: 180px; border: 1px solid rgba(255,255,255,.45); border-radius: 50%; display: flex; align-items: center; justify-content: center; gap: 15px; text-transform: uppercase; font-size: 9px; letter-spacing: .12em; transition: background .25s, color .25s; }

.voss-site .circle-link:hover{ background: var(--white); color: var(--ink); }

.voss-site .circle-link span{ font-size: 15px; }

.voss-site .footer__bottom{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 50px; align-items: end; padding-top: 35px; border-top: 1px solid rgba(255,255,255,.2); }

.voss-site .footer__links{ display: flex; flex-wrap: wrap; gap: 13px 30px; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }

.voss-site .footer__legal{ display: flex; flex-direction: column; align-items: flex-end; gap: 7px; font-size: 8px; text-transform: uppercase; letter-spacing: .1em; opacity: .62; }

.voss-site .page-hero{ padding: 130px 6vw 115px; }

.voss-site .page-hero h1{ font-family: var(--serif); font-weight: 400; font-size: clamp(72px, 9vw, 145px); line-height: .84; letter-spacing: -.055em; margin: 0; }

.voss-site .page-hero__intro{ max-width: 570px; font-family: var(--serif); font-size: 22px; line-height: 1.45; margin: 55px 0 0 auto; }

.voss-site .filter-bar{ border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); display: flex; align-items: center; margin-bottom: 50px; }

.voss-site .filter-bar button{ border: 0; border-right: 1px solid var(--line); background: transparent; padding: 17px 26px; text-transform: uppercase; font-size: 9px; letter-spacing: .11em; cursor: pointer; color: var(--ink); }

.voss-site .filter-bar button.active{ background: var(--ink); color: var(--paper); }

.voss-site .filter-bar span{ margin-left: auto; padding-right: 20px; font-size: 9px; text-transform: uppercase; letter-spacing: .11em; }

.voss-site .property-grid--archive{ grid-template-columns: 1fr 1fr; }

.voss-site .property-grid--archive .property-card:nth-child(n){ transform: none; }

.voss-site .property-grid--archive .property-card:nth-child(3n+2){ margin-top: 80px; }

.voss-site .property-hero{ height: 100vh; min-height: 760px; position: relative; color: white; }

.voss-site .property-hero > img{ position: absolute; inset: 0; height: 100%; object-fit: cover; }

.voss-site .property-hero__shade{ position: absolute; inset: 0; background: rgba(10,10,8,.35); }

.voss-site .property-hero__copy{ position: absolute; inset: auto 6vw 70px; }

.voss-site .property-hero__copy h1{ font-family: var(--serif); font-size: clamp(68px,9vw,140px); line-height: .9; font-weight: 400; letter-spacing: -.05em; margin: 0 0 40px; }

.voss-site .property-hero__copy > div{ display: flex; gap: 40px; border-top: 1px solid rgba(255,255,255,.5); padding-top: 18px; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }

.voss-site .property-story{ display: grid; grid-template-columns: 1.2fr .8fr; gap: 10vw; align-items: end; }

.voss-site .property-story h2, .voss-site .property-details h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(52px,6vw,92px); line-height: .94; letter-spacing: -.04em; margin: 0; }

.voss-site .property-story__copy p{ font-family: var(--serif); font-size: 24px; line-height: 1.45; margin: 0 0 45px; }

.voss-site .property-gallery{ display: grid; grid-template-columns: 1.2fr .8fr; gap: 24px; align-items: start; }

.voss-site .gallery-item img{ height: 100%; object-fit: cover; }

.voss-site .gallery-item--1{ grid-row: span 2; height: 850px; }

.voss-site .gallery-item--2, .voss-site .gallery-item--3{ height: 413px; }

.voss-site .property-details{ display: grid; grid-template-columns: 1fr 1fr; gap: 10vw; border-top: 1px solid var(--line); }

.voss-site .property-details ul{ list-style: none; padding: 0; margin: 0; }

.voss-site .property-details li{ display: grid; grid-template-columns: 40px 1fr; border-bottom: 1px solid var(--line); padding: 16px 0; font-family: var(--serif); font-size: 22px; }

.voss-site .property-details li span{ color: var(--copper); }

.voss-site .property-disclaimer{ padding-bottom: 80px; }

.voss-site .property-disclaimer p{ font-size: 9px; max-width: 900px; line-height: 1.6; color: rgba(23,23,20,.55); }

.voss-site .neighborhood-editorial{ display: flex; flex-direction: column; gap: 150px; }

.voss-site .neighborhood-feature{ display: grid; grid-template-columns: 1.15fr .85fr; gap: 8vw; align-items: center; }

.voss-site .neighborhood-feature:nth-child(even){ grid-template-columns: .85fr 1.15fr; }

.voss-site .neighborhood-feature:nth-child(even) .neighborhood-feature__image{ order: 2; }

.voss-site .neighborhood-feature__image{ position: relative; }

.voss-site .neighborhood-feature__image img{ aspect-ratio: 1.13; object-fit: cover; }

.voss-site .neighborhood-feature__image span{ position: absolute; right: 14px; bottom: 14px; background: var(--paper); padding: 8px 11px; font-size: 9px; }

.voss-site .neighborhood-feature__copy h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(62px,7vw,108px); letter-spacing: -.05em; margin: 0 0 30px; }

.voss-site .neighborhood-feature__copy > p:not(.eyebrow){ font-family: var(--serif); font-size: 23px; line-height: 1.5; margin: 0 0 40px; }

.voss-site .about-hero{ display: grid; grid-template-columns: 1.05fr .95fr; gap: 8vw; align-items: center; padding-top: 90px; }

.voss-site .about-hero h1{ font-family: var(--serif); font-size: clamp(70px,8vw,125px); font-weight: 400; line-height: .85; letter-spacing: -.055em; margin: 0; }

.voss-site .about-hero__copy > p:last-child{ font-family: var(--serif); font-size: 25px; line-height: 1.45; max-width: 600px; margin: 55px 0 0; }

.voss-site .about-hero__portrait img{ aspect-ratio: .78; object-fit: cover; object-position: center; filter: saturate(.7); }

.voss-site .about-hero__portrait span{ display: block; text-align: right; margin-top: 10px; font-size: 8px; text-transform: uppercase; letter-spacing: .16em; }

.voss-site .about-story{ display: grid; grid-template-columns: 20% 80%; border-top: 1px solid var(--line); }

.voss-site .about-story__body{ max-width: 1050px; }

.voss-site .lead-serif{ font-family: var(--serif); font-size: clamp(36px,4.5vw,68px); line-height: 1.08; letter-spacing: -.025em; margin: 0 0 65px; }

.voss-site .two-col-copy{ display: grid; grid-template-columns: 1fr 1fr; gap: 70px; margin-left: 20%; }

.voss-site .two-col-copy p{ font-size: 15px; line-height: 1.65; }

.voss-site .about-values{ display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }

.voss-site .about-values > div{ padding: 65px 4vw 90px; min-height: 330px; border-right: 1px solid var(--line); }

.voss-site .about-values > div:last-child{ border-right: 0; }

.voss-site .about-values span{ font-size: 9px; letter-spacing: .14em; }

.voss-site .about-values h3{ font-family: var(--serif); font-size: 34px; font-weight: 400; line-height: 1.1; margin: 55px 0 20px; }

.voss-site .about-values p{ font-size: 13px; line-height: 1.6; max-width: 330px; }

.voss-site .press-strip > div{ display: flex; align-items: center; justify-content: space-between; gap: 35px; padding: 30px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-family: var(--serif); font-size: 18px; }

.voss-site .about-closing{ background: var(--paper-2); }

.voss-site .about-closing blockquote{ font-family: var(--serif); font-size: clamp(48px,6.5vw,100px); line-height: 1; letter-spacing: -.04em; max-width: 1250px; margin: 0 0 60px; }

.voss-site .journal-list{ display: flex; flex-direction: column; gap: 90px; }

.voss-site .journal-card{ display: grid; grid-template-columns: .9fr 1.1fr; gap: 8vw; padding-bottom: 90px; border-bottom: 1px solid var(--line); color: inherit; }

.voss-site .journal-card__image--plain{ min-height: 220px; background: var(--paper-2); position: relative; }

.voss-site .journal-article__header h1{ font-family: var(--serif); font-size: clamp(52px, 7vw, 110px); font-weight: 400; line-height: .9; letter-spacing: -.05em; margin: 18px 0 28px; max-width: 1100px; }

.voss-site .journal-article__dek{ font-size: 18px; line-height: 1.6; max-width: 640px; }

.voss-site .journal-article__image{ padding: 0 6vw 20px; }

.voss-site .journal-article__image img{ width: 100%; max-height: 620px; object-fit: cover; }

.voss-site .journal-article__body{ max-width: 760px; }

.voss-site .journal-article__body p{ font-size: 16px; line-height: 1.75; margin: 0 0 22px; }

.voss-site .journal-card__image{ position: relative; }

.voss-site .journal-card__image img{ aspect-ratio: 1.25; height: 100%; object-fit: cover; }

.voss-site .journal-card__image > span{ position: absolute; top: 13px; right: 13px; background: var(--paper); padding: 7px 9px; font-size: 9px; }

.voss-site .journal-card__copy{ display: flex; flex-direction: column; justify-content: center; }

.voss-site .journal-card__copy > div{ display: flex; justify-content: space-between; border-bottom: 1px solid var(--line); padding-bottom: 15px; font-size: 9px; text-transform: uppercase; letter-spacing: .12em; }

.voss-site .journal-card h2{ font-family: var(--serif); font-size: clamp(44px,5vw,78px); line-height: 1; letter-spacing: -.04em; font-weight: 400; margin: 35px 0 25px; }

.voss-site .journal-card p{ font-size: 14px; line-height: 1.6; max-width: 570px; margin-bottom: 35px; }

.voss-site .contact-grid{ display: grid; grid-template-columns: .95fr 1.05fr; gap: 10vw; min-height: 720px; padding-top: 100px; }

.voss-site .contact-copy h1{ font-family: var(--serif); font-size: clamp(70px,8vw,125px); font-weight: 400; line-height: .85; letter-spacing: -.055em; margin: 0; }

.voss-site .contact-copy > p:not(.eyebrow){ font-family: var(--serif); font-size: 22px; line-height: 1.45; max-width: 520px; margin: 55px 0; }

.voss-site .contact-meta{ display: flex; flex-direction: column; gap: 9px; font-size: 10px; text-transform: uppercase; letter-spacing: .13em; }

.voss-site .contact-form{ display: grid; grid-template-columns: 1fr 1fr; gap: 38px 25px; padding-top: 25px; }

.voss-site .contact-form label{ display: flex; flex-direction: column; gap: 8px; }

.voss-site .contact-form label span{ font-size: 8px; text-transform: uppercase; letter-spacing: .15em; }

.voss-site .contact-form input, .voss-site .contact-form textarea, .voss-site .contact-form select{ border: 0; border-bottom: 1px solid var(--line); background: transparent; border-radius: 0; padding: 11px 0 13px; outline: 0; color: var(--ink); }

.voss-site .contact-form input:focus, .voss-site .contact-form textarea:focus, .voss-site .contact-form select:focus{ border-bottom-color: var(--ink); }

.voss-site .form-full{ grid-column: 1 / -1; }

.voss-site .submit-button{ grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; background: var(--ink); color: var(--paper); border: 0; padding: 21px 24px; text-transform: uppercase; letter-spacing: .13em; font-size: 9px; cursor: pointer; }

.voss-site .submit-button span{ font-size: 16px; }

.voss-site .form-note{ grid-column: 1 / -1; font-size: 8px; line-height: 1.5; opacity: .6; }

.voss-site .form-success{ min-height: 430px; display: flex; flex-direction: column; justify-content: center; }

.voss-site .form-success h3{ font-family: var(--serif); font-size: 46px; font-weight: 400; line-height: 1.1; }

.voss-site .text-link{ align-self: flex-start; border: 0; border-bottom: 1px solid var(--ink); background: none; padding: 0 0 8px; cursor: pointer; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; }

.voss-site .contact-image{ position: relative; height: 540px; overflow: hidden; }

.voss-site .contact-image img{ height: 100%; object-fit: cover; filter: saturate(.7); }

.voss-site .contact-image > div{ position: absolute; left: 6vw; right: 6vw; bottom: 25px; color: white; display: flex; justify-content: space-between; font-size: 9px; text-transform: uppercase; letter-spacing: .14em; }

@media (max-width: 1000px) {

.voss-site .section-pad{ padding: 90px 5vw; }

.voss-site .site-header{ padding-left: 5vw; padding-right: 5vw; }

.voss-site .menu-overlay{ padding: 0 5vw; }

.voss-site .menu-overlay__grid{ grid-template-columns: 1fr; align-content: center; }

.voss-site .menu-aside{ display: none; }

.voss-site .hero__copy{ padding-left: 5vw; padding-right: 5vw; }

.voss-site .intro{ grid-template-columns: 1fr; }

.voss-site .intro__side{ height: auto; }

.voss-site .vertical-rule{ display: none; }

.voss-site .intro__text{ margin-left: 10%; gap: 6vw; }

.voss-site .property-grid{ grid-template-columns: 1fr 1fr; }

.voss-site .manifesto{ grid-template-columns: 1fr 1fr; padding-left: 5vw; padding-right: 5vw; }

.voss-site .manifesto__image{ width: 82%; margin-left: 0; }

.voss-site .number-grid{ grid-template-columns: 1fr 1fr; }

.voss-site .number-grid > div:nth-child(2){ border-right: 0; }

.voss-site .number-grid > div:nth-child(-n+2){ border-bottom: 1px solid var(--line); }

.voss-site .neighborhood-preview__lead{ grid-template-columns: 1fr; gap: 40px; }

.voss-site .property-story, .voss-site .property-details, .voss-site .about-hero, .voss-site .contact-grid{ gap: 6vw; }

.voss-site .about-values > div{ padding-left: 3vw; padding-right: 3vw; }


}

@media (max-width: 700px) {

.voss-site .site-header, .voss-site .menu-overlay__top{ height: 82px; }

.voss-site .site-header__right{ gap: 14px; }

.voss-site .header-contact{ display: none; }

.voss-site .logo__name{ font-size: 19px; }

.voss-site .logo__sub{ font-size: 7px; }

.voss-site .menu-button{ width: 44px; padding-left: 13px; }

.voss-site .menu-overlay__grid{ height: calc(100vh - 82px); }

.voss-site .menu-nav a{ grid-template-columns: 38px 1fr; font-size: 43px; padding: 14px 0; }

.voss-site .section-pad{ padding: 72px 5vw; }

.voss-site .hero{ min-height: 840px; }

.voss-site .hero__copy{ min-height: 840px; padding-top: 150px; padding-bottom: 50px; }

.voss-site .hero h1{ font-size: 70px; line-height: .83; margin-bottom: 38px; }

.voss-site .hero__lower{ flex-direction: column; align-items: flex-start; gap: 35px; }

.voss-site .hero__lower p{ font-size: 14px; }

.voss-site .hero__index{ right: 5vw; top: 98px; }

.voss-site .intro{ min-height: 0; }

.voss-site .intro__content h2{ font-size: 52px; }

.voss-site .intro__text{ grid-template-columns: 1fr; margin: 42px 0 0; gap: 36px; }

.voss-site .intro__text p{ font-size: 20px; }

.voss-site .section-heading{ align-items: flex-start; gap: 30px; flex-direction: column; }

.voss-site .property-grid, .voss-site .property-grid--archive{ grid-template-columns: 1fr; gap: 60px; }

.voss-site .property-grid .property-card:nth-child(n), .voss-site .property-grid--archive .property-card:nth-child(n){ transform: none; margin-top: 0; }

.voss-site .property-card:nth-child(even) .property-card__image-wrap, .voss-site .property-card__image-wrap{ aspect-ratio: 1.08; }

.voss-site .property-card__body{ flex-direction: column; }

.voss-site .property-card__meta{ align-items: flex-start; }

.voss-site .manifesto{ grid-template-columns: 1fr; min-height: 0; margin-top: 80px; padding: 80px 5vw; gap: 60px; }

.voss-site .manifesto__word{ font-size: 31vw; }

.voss-site .manifesto__image{ width: 70%; margin: 0 0 0 auto; }

.voss-site .manifesto__copy h2{ font-size: 57px; }

.voss-site .numbers__intro{ flex-direction: column; gap: 30px; }

.voss-site .number-grid{ grid-template-columns: 1fr; }

.voss-site .number-grid > div{ border-right: 0 !important; border-bottom: 1px solid var(--line); padding: 28px 0 50px !important; }

.voss-site .number-grid > div:last-child{ border-bottom: 0; }

.voss-site .neighborhood-preview{ padding-bottom: 70px; }

.voss-site .neighborhood-preview h2{ font-size: 52px; }

.voss-site .neighborhood-row{ grid-template-columns: 10% 1fr auto; padding-left: 5vw; padding-right: 5vw; }

.voss-site .neighborhood-row__kicker{ display: none; }

.voss-site .quote{ min-height: 540px; }

.voss-site .quote blockquote{ font-size: 46px; }

.voss-site .quote__source{ flex-direction: column; gap: 10px; }

.voss-site .footer{ padding-left: 5vw; padding-right: 5vw; }

.voss-site .footer__cta{ min-height: 480px; }

.voss-site .footer__cta h2{ font-size: 62px; }

.voss-site .circle-link{ width: 140px; height: 140px; top: auto; bottom: 25px; right: 0; }

.voss-site .footer__bottom{ grid-template-columns: 1fr; }

.voss-site .footer__legal{ align-items: flex-start; }

.voss-site .page-hero{ padding: 90px 5vw 80px; }

.voss-site .page-hero h1{ font-size: 68px; }

.voss-site .page-hero__intro{ font-size: 19px; margin-left: 0; }

.voss-site .filter-bar{ overflow-x: auto; }

.voss-site .filter-bar button{ white-space: nowrap; }

.voss-site .filter-bar > span{ display: none; }

.voss-site .property-hero{ min-height: 720px; }

.voss-site .property-hero__copy{ left: 5vw; right: 5vw; bottom: 45px; }

.voss-site .property-hero__copy h1{ font-size: 62px; }

.voss-site .property-hero__copy > div{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.voss-site .property-story, .voss-site .property-details{ grid-template-columns: 1fr; gap: 45px; }

.voss-site .property-story h2, .voss-site .property-details h2{ font-size: 53px; }

.voss-site .property-story__copy p{ font-size: 20px; }

.voss-site .property-gallery{ grid-template-columns: 1fr; }

.voss-site .gallery-item--1, .voss-site .gallery-item--2, .voss-site .gallery-item--3{ height: auto; }

.voss-site .gallery-item img{ aspect-ratio: 1.05; }

.voss-site .neighborhood-editorial{ gap: 90px; }

.voss-site .neighborhood-feature, .voss-site .neighborhood-feature:nth-child(even){ grid-template-columns: 1fr; gap: 35px; }

.voss-site .neighborhood-feature:nth-child(even) .neighborhood-feature__image{ order: 0; }

.voss-site .neighborhood-feature__copy h2{ font-size: 64px; }

.voss-site .about-hero{ grid-template-columns: 1fr; gap: 60px; }

.voss-site .about-hero h1{ font-size: 66px; }

.voss-site .about-hero__copy > p:last-child{ font-size: 21px; }

.voss-site .about-story{ grid-template-columns: 1fr; gap: 25px; }

.voss-site .lead-serif{ font-size: 38px; }

.voss-site .two-col-copy{ grid-template-columns: 1fr; margin-left: 0; gap: 20px; }

.voss-site .about-values{ grid-template-columns: 1fr; }

.voss-site .about-values > div{ border-right: 0; border-bottom: 1px solid var(--line); padding: 55px 5vw; min-height: 0; }

.voss-site .press-strip > div{ flex-wrap: wrap; justify-content: flex-start; }

.voss-site .about-closing blockquote{ font-size: 45px; }

.voss-site .journal-card{ grid-template-columns: 1fr; gap: 30px; padding-bottom: 65px; }

.voss-site .journal-card h2{ font-size: 45px; }

.voss-site .contact-grid{ grid-template-columns: 1fr; gap: 75px; }

.voss-site .contact-copy h1{ font-size: 66px; }

.voss-site .contact-form{ grid-template-columns: 1fr; }

.voss-site .form-full, .voss-site .submit-button, .voss-site .form-note{ grid-column: 1; }

.voss-site .contact-image{ height: 380px; }


}

.voss-site .services-list{ border-top: 1px solid var(--line); }

.voss-site .service-row{ display: grid; grid-template-columns: 8% 30% 1fr; gap: 4vw; padding: 38px 6vw; border-bottom: 1px solid var(--line); align-items: start; }

.voss-site .service-row > span{ font-size: 9px; letter-spacing: .14em; padding-top: 10px; }

.voss-site .service-row h2{ font-family: var(--serif); font-size: clamp(40px,4.5vw,70px); font-weight: 400; margin: 0; letter-spacing: -.035em; }

.voss-site .service-row p{ max-width: 650px; font-family: var(--serif); font-size: 20px; line-height: 1.45; margin: 6px 0 0; }

.voss-site .service-method{ background: var(--paper-2); display: grid; grid-template-columns: .8fr 1.2fr; gap: 8vw; }

.voss-site .service-method h2{ font-family: var(--serif); font-size: clamp(56px,6vw,95px); font-weight: 400; line-height: .92; letter-spacing: -.045em; margin: 0; }

.voss-site .service-method h2 em{ font-weight: 400; color: var(--copper); }

.voss-site .service-method__steps{ display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid var(--line); }

.voss-site .service-method__steps > div{ padding: 25px 25px 30px 0; border-right: 1px solid var(--line); }

.voss-site .service-method__steps > div + div{ padding-left: 25px; }

.voss-site .service-method__steps > div:last-child{ border-right: 0; }

.voss-site .service-method__steps span{ font-size: 9px; letter-spacing: .14em; }

.voss-site .service-method__steps h3{ font-family: var(--serif); font-size: 28px; font-weight: 400; margin: 70px 0 18px; }

.voss-site .service-method__steps p{ font-size: 12px; line-height: 1.6; }

.voss-site .service-links{ display: flex; flex-direction: column; }

.voss-site .service-links a{ display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding: 24px 0; font-family: var(--serif); font-size: 30px; }

.voss-site .service-links a:last-child{ border-bottom: 1px solid var(--line); }

.voss-site .service-links b{ font-family: var(--sans); font-size: 9px; text-transform: uppercase; letter-spacing: .14em; font-weight: 400; }

.voss-site .development-lead{ display: grid; grid-template-columns: 1.1fr .9fr; gap: 9vw; align-items: end; }

.voss-site .development-lead h2{ font-family: var(--serif); font-size: clamp(48px,5.4vw,84px); line-height: .98; font-weight: 400; letter-spacing: -.035em; margin: 0; }

.voss-site .development-lead > p{ font-family: var(--serif); font-size: 22px; line-height: 1.5; margin: 0; }

.voss-site .development-grid{ display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }

.voss-site .development-card > div{ position: relative; overflow: hidden; }

.voss-site .development-card img{ aspect-ratio: .78; object-fit: cover; transition: transform .6s ease; }

.voss-site .development-card:hover img{ transform: scale(1.025); }

.voss-site .development-card > div span{ position: absolute; right: 12px; top: 12px; background: var(--paper); padding: 7px 9px; font-size: 9px; }

.voss-site .development-card .eyebrow{ margin-top: 20px; margin-bottom: 8px; }

.voss-site .development-card h2{ font-family: var(--serif); font-weight: 400; font-size: 34px; margin: 0; }

.voss-site .demo-tag{ font-size: 8px; text-transform: uppercase; letter-spacing: .11em; opacity: .55; }

.voss-site .developer-panel{ background: var(--ink); color: var(--white); display: grid; grid-template-columns: 1fr 1fr; gap: 10vw; }

.voss-site .developer-panel h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(54px,6vw,94px); line-height: .94; letter-spacing: -.045em; margin: 0; }

.voss-site .developer-panel h2 em{ font-weight: 400; color: #d9b5a5; }

.voss-site .developer-panel > div:last-child{ align-self: end; }

.voss-site .developer-panel > div:last-child p{ font-family: var(--serif); font-size: 21px; line-height: 1.5; color: #d6d1c8; margin-bottom: 38px; }

.voss-site .press-list article{ display: grid; grid-template-columns: 7% 23% 1fr 16% auto; gap: 2vw; align-items: center; border-top: 1px solid var(--line); padding: 27px 0; }

.voss-site .press-list article:last-of-type{ border-bottom: 1px solid var(--line); }

.voss-site .press-list article > span, .voss-site .press-list article small{ font-size: 8px; text-transform: uppercase; letter-spacing: .13em; }

.voss-site .press-list article h2{ font-family: var(--serif); font-weight: 400; font-size: 28px; margin: 0; }

.voss-site .press-list article p{ font-family: var(--serif); font-size: 22px; margin: 0; }

.voss-site .press-list article b{ font-weight: 400; font-size: 18px; }

.voss-site .press-inquiry{ background: var(--ink); color: white; display: grid; grid-template-columns: 1fr .65fr; gap: 10vw; }

.voss-site .press-inquiry h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(55px,6vw,92px); line-height: .94; letter-spacing: -.04em; margin: 0; }

.voss-site .press-inquiry > div:last-child{ align-self: end; }

.voss-site .press-inquiry > div:last-child p{ font-size: 13px; line-height: 1.6; color: #d6d1c8; margin-top: 40px; }

.voss-site .guide-grid{ display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--line); }

.voss-site .guide-grid article{ background: var(--paper); padding: 50px 3vw 70px; }

.voss-site .guide-grid article > span{ font-size: 8px; letter-spacing: .14em; }

.voss-site .guide-grid h2{ font-family: var(--serif); font-size: 39px; font-weight: 400; margin: 80px 0 30px; }

.voss-site .guide-grid ul{ padding: 0; list-style: none; margin: 0; }

.voss-site .guide-grid li{ border-top: 1px solid var(--line); padding: 13px 0; font-size: 12px; line-height: 1.4; }

.voss-site .guide-grid li:last-child{ border-bottom: 1px solid var(--line); }

.voss-site .guide-warning{ background: var(--paper-2); }

.voss-site .guide-warning h2{ font-family: var(--serif); font-weight: 400; font-size: clamp(52px,6vw,90px); margin: 0 0 30px; letter-spacing: -.04em; }

.voss-site .guide-warning > p:not(.eyebrow){ font-family: var(--serif); font-size: 22px; line-height: 1.5; max-width: 800px; margin-bottom: 45px; }

@media (max-width: 700px) {

.voss-site .service-row{ grid-template-columns: 40px 1fr; gap: 10px; padding: 30px 5vw; }

.voss-site .service-row p{ grid-column: 2; font-size: 18px; }

.voss-site .service-method{ grid-template-columns: 1fr; }

.voss-site .service-method__steps{ grid-template-columns: 1fr; }

.voss-site .service-method__steps > div{ border-right: 0; border-bottom: 1px solid var(--line); padding: 25px 0 35px !important; }

.voss-site .service-method__steps h3{ margin-top: 32px; }

.voss-site .service-links a{ font-size: 23px; }

.voss-site .development-lead, .voss-site .developer-panel, .voss-site .press-inquiry{ grid-template-columns: 1fr; gap: 45px; }

.voss-site .development-grid{ grid-template-columns: 1fr; gap: 55px; }

.voss-site .development-card img{ aspect-ratio: .95; }

.voss-site .press-list article{ grid-template-columns: 35px 1fr auto; gap: 12px; align-items: start; }

.voss-site .press-list article h2{ grid-column: 2; }

.voss-site .press-list article p{ grid-column: 2 / -1; font-size: 19px; }

.voss-site .press-list article small{ grid-column: 2; }

.voss-site .press-list article b{ grid-column: 3; grid-row: 1; }

.voss-site .guide-grid{ grid-template-columns: 1fr; }

.voss-site .guide-grid article{ padding: 45px 5vw; }

.voss-site .guide-grid h2{ margin-top: 40px; }


}


`;
