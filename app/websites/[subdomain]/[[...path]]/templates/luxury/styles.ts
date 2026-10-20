/** Scoped luxury template CSS — all selectors under .luxury-site */
export const LUXURY_CSS = `
.luxury-site, .luxury-site * { box-sizing: border-box; }
.luxury-site { scroll-behavior: smooth; }
.luxury-site { margin: 0; min-height: 100vh; display: flex; flex-direction: column; background: var(--paper); color: var(--ink); font-family: var(--body); font-size: 16px; line-height: 1.65; }
.luxury-site, .luxury-site button, .luxury-site input, .luxury-site textarea, .luxury-site select { font-family: var(--body); }
.luxury-site a { color: inherit; text-decoration: none; }
.luxury-site img { display: block; width: 100%; }
.luxury-site button, .luxury-site input, .luxury-site textarea, .luxury-site select { font: inherit; }
.luxury-site button { cursor: pointer; }
.luxury-site main { flex: 1; overflow: hidden; }
.luxury-site h1, .luxury-site h2, .luxury-site h3, .luxury-site p { margin-top: 0; }
.luxury-site h1, .luxury-site h2, .luxury-site h3 { font-family: var(--display); font-weight: 400; line-height: 1.05; }
.luxury-site h1 { font-size: clamp(3.3rem, 7vw, 8rem); letter-spacing: -.035em; }
.luxury-site h2 { font-size: clamp(2.5rem, 4.7vw, 5.4rem); letter-spacing: -.025em; }
.luxury-site h3 { font-size: clamp(1.45rem, 2vw, 2.15rem); }
.luxury-site ::selection { background: var(--accent); color: #fff; }
.luxury-site .image-cover { background-size: cover; background-position: center; }
.luxury-site .section-pad { padding: clamp(5rem, 9vw, 10rem) clamp(1.5rem, 5vw, 6rem); }
.luxury-site .section-pad-topless { padding: 0 clamp(1.5rem, 5vw, 6rem) clamp(5rem, 9vw, 10rem); }
.luxury-site .eyebrow { margin-bottom: 1.3rem; font-size: .67rem; letter-spacing: var(--tracking); line-height: 1.4; text-transform: uppercase; font-weight: 700; }
.luxury-site .button { display: inline-flex; justify-content: center; align-items: center; min-height: 3.2rem; padding: .75rem 1.7rem; border: 1px solid var(--ink); background: var(--ink); color: white; font-size: .67rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; transition: .25s ease; }
.luxury-site .button:hover { background: var(--accent); border-color: var(--accent); }
.luxury-site .button-light { background: #fff; color: var(--ink); border-color: #fff; }
.luxury-site .button-light:hover { color: #fff; background: var(--accent); border-color: var(--accent); }
.luxury-site .button-outline { background: transparent; color: var(--ink); }
.luxury-site .text-link { display: inline-flex; align-items: center; gap: .7rem; padding-bottom: .35rem; border-bottom: 1px solid currentColor; font-size: .68rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
.luxury-site .text-link::after { content: "↗"; font-size: .9rem; }
.luxury-site .text-link.light { color: white; }
.luxury-site .button-row { display: flex; align-items: center; gap: 1.6rem; flex-wrap: wrap; }
.luxury-site .button-row.center { justify-content: center; }
.luxury-site .section-action { margin-top: 3.8rem; text-align: center; }
.luxury-site .center-title { text-align: center; margin-bottom: 4rem; }
.luxury-site .section-heading { max-width: 850px; margin-bottom: 4.2rem; }
.luxury-site .section-heading h2 { margin-bottom: 1.4rem; }
.luxury-site .section-heading > p:not(.eyebrow) { max-width: 650px; color: var(--muted); }
.luxury-site .section-heading.align-center { margin-left: auto; margin-right: auto; text-align: center; }
.luxury-site .section-heading.align-center > p:not(.eyebrow) { margin-left: auto; margin-right: auto; }
.luxury-site .prose p { margin-bottom: 1.35rem; color: #4f5550; }

.luxury-site .site-header { position: fixed; z-index: 50; top: 0; left: 0; right: 0; height: 94px; padding: 0 clamp(1.3rem, 3.5vw, 4rem); display: flex; align-items: center; justify-content: space-between; gap: 2rem; color: #fff; transition: .3s ease; }
.luxury-site .site-header.is-scrolled { height: 74px; color: var(--ink); background: rgba(243,240,233,.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(24,32,29,.12); }
.luxury-site .brand-lockup { display: inline-flex; flex-direction: column; align-items: center; min-width: 150px; line-height: 1; }
.luxury-site .brand-lockup span { font-family: var(--display); font-size: 1.18rem; letter-spacing: .13em; }
.luxury-site .brand-lockup small { margin-top: .45rem; font-size: .48rem; font-weight: 700; letter-spacing: .38em; }
.luxury-site .brand-lockup-light { color: #fff; }
.luxury-site .desktop-nav { display: flex; align-items: center; gap: clamp(1rem, 2.2vw, 2.5rem); }
.luxury-site .nav-group { position: relative; padding: 1.7rem 0; }
.luxury-site .nav-group > a, .luxury-site .header-contact { font-size: .61rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.luxury-site .nav-dropdown { position: absolute; left: 50%; top: calc(100% - .3rem); transform: translate(-50%, 10px); width: 230px; padding: 1.1rem 0; display: flex; flex-direction: column; background: var(--surface); color: var(--ink); opacity: 0; visibility: hidden; box-shadow: 0 20px 50px rgba(0,0,0,.13); transition: .2s ease; }
.luxury-site .nav-group:hover .nav-dropdown { opacity: 1; visibility: visible; transform: translate(-50%, 0); }
.luxury-site .nav-dropdown a { padding: .55rem 1.4rem; font-size: .7rem; letter-spacing: .08em; }
.luxury-site .nav-dropdown a:hover { color: var(--accent); }
.luxury-site .header-actions { display: flex; align-items: center; gap: 1.5rem; }
.luxury-site .header-contact { padding-bottom: .2rem; border-bottom: 1px solid; }
.luxury-site .menu-button { display: none; width: 38px; height: 38px; border: 0; background: transparent; padding: 9px 4px; }
.luxury-site .menu-button span { display: block; height: 1px; background: currentColor; margin: 7px 0; }
.luxury-site .menu-overlay { position: fixed; z-index: 100; inset: 0; padding: 2rem clamp(1.5rem, 5vw, 5rem); background: var(--ink); color: white; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: .3s ease; }
.luxury-site .menu-overlay.is-open { opacity: 1; visibility: visible; transform: none; }
.luxury-site .menu-top { display: flex; align-items: center; justify-content: space-between; }
.luxury-site .close-button { border: 0; background: transparent; color: white; text-transform: uppercase; letter-spacing: .15em; font-size: .7rem; }
.luxury-site .menu-content { height: calc(100% - 80px); display: grid; grid-template-columns: 1.4fr 1fr .8fr; gap: 4rem; align-items: center; }
.luxury-site .menu-primary { display: flex; flex-direction: column; }
.luxury-site .menu-primary a { font-family: var(--display); font-size: clamp(2.3rem, 4.4vw, 5rem); line-height: 1.13; }
.luxury-site .menu-primary a:hover, .luxury-site .menu-secondary a:hover { color: #c8ad87; }
.luxury-site .menu-secondary { display: flex; flex-direction: column; gap: .7rem; }
.luxury-site .menu-secondary a { font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; }
.luxury-site .menu-contact { display: flex; flex-direction: column; gap: .4rem; font-size: .8rem; color: rgba(255,255,255,.7); }

.luxury-site .home-hero { min-height: 100vh; position: relative; display: flex; align-items: flex-end; padding: 10rem clamp(1.5rem, 6vw, 7rem) 7rem; color: white; }
.luxury-site .hero-content { max-width: 960px; }
.luxury-site .hero-content h1 { margin-bottom: 1.6rem; }
.luxury-site .hero-content h1 span { display: block; }
.luxury-site .hero-content > p:not(.eyebrow) { max-width: 620px; font-size: 1.08rem; margin-bottom: 2.1rem; }
.luxury-site .scroll-cue { position: absolute; right: clamp(1.5rem, 4vw, 4rem); bottom: 3rem; display: flex; align-items: center; gap: .8rem; transform: rotate(90deg); transform-origin: right bottom; }
.luxury-site .scroll-cue span { font-size: .55rem; letter-spacing: .22em; }
.luxury-site .scroll-cue i { width: 55px; height: 1px; background: white; }
.luxury-site .intro-statement { max-width: 1080px; margin: auto; text-align: center; }
.luxury-site .intro-statement h2 { margin-bottom: 2rem; }
.luxury-site .intro-statement > p:not(.eyebrow) { max-width: 650px; margin: auto; color: var(--muted); }
.luxury-site .split-editorial { min-height: 750px; display: grid; grid-template-columns: 1fr 1fr; background: var(--surface); }
.luxury-site .split-editorial.reverse .split-image { order: 2; }
.luxury-site .split-image { min-height: 700px; background-position: center top; }
.luxury-site .split-copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(4rem, 8vw, 9rem); }
.luxury-site .split-copy h2 { margin-bottom: 2rem; }
.luxury-site .split-copy .button { margin-top: 1.2rem; }
.luxury-site .results-section { background: var(--ink); color: #fff; }
.luxury-site .results-section .section-heading > p:not(.eyebrow), .luxury-site .dark-section .section-heading > p:not(.eyebrow) { color: rgba(255,255,255,.65); }
.luxury-site .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,.2); border-bottom: 1px solid rgba(255,255,255,.2); }
.luxury-site .stats-grid > div { min-height: 190px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-right: 1px solid rgba(255,255,255,.2); padding: 1.5rem; }
.luxury-site .stats-grid > div:last-child { border-right: 0; }
.luxury-site .stats-grid strong { font-family: var(--display); font-size: clamp(2.6rem, 5vw, 5.4rem); font-weight: 400; line-height: 1; }
.luxury-site .stats-grid span { margin-top: 1rem; font-size: .65rem; letter-spacing: .13em; text-transform: uppercase; }
.luxury-site .inventory-section { background: var(--paper); }
.luxury-site .property-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3.5rem 1.4rem; }
.luxury-site .property-grid.featured { grid-template-columns: repeat(2, 1fr); }
.luxury-site .property-card { min-width: 0; }
.luxury-site .property-image-wrap { display: block; position: relative; overflow: hidden; aspect-ratio: 1.35; background: #d8d4cb; }
.luxury-site .property-image-wrap img { height: 100%; object-fit: cover; transition: transform .7s ease; }
.luxury-site .property-card:hover .property-image-wrap img { transform: scale(1.035); }
.luxury-site .property-status { position: absolute; left: 1rem; top: 1rem; padding: .45rem .7rem; background: rgba(255,255,255,.9); color: var(--ink); font-size: .56rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
.luxury-site .property-view { position: absolute; inset: auto 0 0; padding: 1rem; background: rgba(24,32,29,.9); color: white; text-align: center; font-size: .59rem; letter-spacing: .14em; text-transform: uppercase; transform: translateY(100%); transition: .25s ease; }
.luxury-site .property-card:hover .property-view { transform: none; }
.luxury-site .property-copy { padding: 1.25rem .15rem 0; }
.luxury-site .property-price { margin-bottom: .35rem; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 700; }
.luxury-site .property-copy h3 { font-size: clamp(1.45rem, 2vw, 2rem); margin-bottom: .45rem; }
.luxury-site .property-copy > p:not(.property-price) { color: var(--muted); font-size: .84rem; }
.luxury-site .property-meta { display: flex; flex-wrap: wrap; gap: .65rem 1rem; padding-top: .75rem; border-top: 1px solid var(--line); font-size: .67rem; letter-spacing: .06em; text-transform: uppercase; }
.luxury-site .feature-sale { min-height: 82vh; display: flex; align-items: flex-end; padding: clamp(3rem, 7vw, 7rem); color: white; }
.luxury-site .feature-sale > div { max-width: 750px; }
.luxury-site .feature-sale p:not(.eyebrow) { max-width: 600px; }
.luxury-site .community-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--paper); }
.luxury-site .community-card { min-height: 430px; padding: 2rem; display: flex; flex-direction: column; justify-content: flex-end; color: white; transition: filter .25s ease; }
.luxury-site .community-card:hover { filter: brightness(.9); }
.luxury-site .community-card span { font-family: var(--display); font-size: 2.4rem; }
.luxury-site .community-card small { max-width: 270px; margin-top: .4rem; }
.luxury-site .journal-preview { background: var(--surface); }
.luxury-site .post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.luxury-site .post-grid img { aspect-ratio: 1.4; object-fit: cover; margin-bottom: 1.4rem; }
.luxury-site .post-grid h3 { margin-bottom: .8rem; }
.luxury-site .post-grid article > p:not(.eyebrow) { color: var(--muted); }
.luxury-site .newsletter { padding: 4rem clamp(1.5rem, 6vw, 7rem); display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: 4rem; background: #d9d1c4; }
.luxury-site .newsletter h2 { font-size: clamp(2.4rem, 4vw, 4.3rem); margin-bottom: 1rem; }
.luxury-site .newsletter form { display: flex; border-bottom: 1px solid var(--ink); }
.luxury-site .newsletter input { flex: 1; padding: 1rem 0; border: 0; background: transparent; outline: none; }
.luxury-site .newsletter button { border: 0; background: transparent; font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; }

.luxury-site .page-hero { min-height: 76vh; padding: 10rem clamp(1.5rem, 6vw, 7rem) 5.5rem; display: flex; align-items: flex-end; color: white; }
.luxury-site .page-hero.compact { min-height: 54vh; }
.luxury-site .page-hero-content { max-width: 1000px; }
.luxury-site .page-hero h1 { margin-bottom: 1rem; }
.luxury-site .page-hero-content > p:not(.eyebrow) { max-width: 650px; font-size: 1.08rem; }
.luxury-site .quote-band { padding: clamp(5rem, 10vw, 11rem) clamp(2rem, 10vw, 12rem); text-align: center; background: #d8d0c4; }
.luxury-site .quote-band blockquote { max-width: 980px; margin: auto; font-family: var(--display); font-size: clamp(2.1rem, 4.2vw, 4.5rem); line-height: 1.15; }
.luxury-site .team-intro { padding-bottom: 4rem; }
.luxury-site .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.luxury-site .team-card img { aspect-ratio: .78; object-fit: cover; object-position: top; }
.luxury-site .team-card > div { padding: 1.8rem 0; }
.luxury-site .team-card h2 { font-size: 2.4rem; margin-bottom: 1rem; }
.luxury-site .press-logos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; padding-top: 4rem; padding-bottom: 4rem; }
.luxury-site .press-logos span { min-height: 110px; border: 1px solid var(--line); display: grid; place-items: center; text-align: center; font-family: var(--display); letter-spacing: .08em; }
.luxury-site .press-list article { display: grid; grid-template-columns: 1fr auto 50px; gap: 2rem; align-items: center; padding: 2rem 0; border-top: 1px solid var(--line); }
.luxury-site .press-list article:last-child { border-bottom: 1px solid var(--line); }
.luxury-site .press-list article h2 { font-size: clamp(1.7rem, 2.5vw, 3rem); margin: 0; }
.luxury-site .press-list article > span { font-size: .75rem; }
.luxury-site .press-list button { width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line); background: transparent; }
.luxury-site .marketing-intro .two-column-prose { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 1000px; margin-left: auto; }
.luxury-site .pillar-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.luxury-site .pillar-grid article { min-height: 300px; padding: 2rem; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.luxury-site .pillar-grid article > span { color: var(--accent); font-size: .65rem; letter-spacing: .15em; }
.luxury-site .pillar-grid h3 { margin-top: 3.5rem; }
.luxury-site .dark-section { background: var(--ink); color: white; }
.luxury-site .dark-section .stats-grid { max-width: 1000px; margin: auto; }
.luxury-site .dark-section .lead-form input, .luxury-site .dark-section .lead-form textarea, .luxury-site .dark-section .lead-form select { color: white; }

.luxury-site .property-detail-hero { position: relative; height: 92vh; background: #ddd; }
.luxury-site .property-detail-hero > img { height: 100%; object-fit: cover; }
.luxury-site .property-detail-hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(transparent 45%, rgba(0,0,0,.65)); }
.luxury-site .property-detail-title { position: absolute; z-index: 1; left: clamp(1.5rem, 6vw, 7rem); bottom: 4rem; color: white; }
.luxury-site .property-detail-title h1 { font-size: clamp(3rem, 6vw, 7rem); margin-bottom: .5rem; }
.luxury-site .property-facts { display: flex; align-items: stretch; justify-content: center; background: var(--surface); border-bottom: 1px solid var(--line); }
.luxury-site .property-facts > * { padding: 1.6rem clamp(1rem, 3vw, 3rem); border-right: 1px solid var(--line); display: flex; align-items: center; text-align: center; font-size: .67rem; letter-spacing: .1em; text-transform: uppercase; }
.luxury-site .property-facts > *:last-child { border: 0; }
.luxury-site .property-facts strong { font-family: var(--display); font-size: 1.4rem; letter-spacing: 0; text-transform: none; }
.luxury-site .property-overview { display: grid; grid-template-columns: 1fr 1fr; gap: 7rem; }
.luxury-site .property-overview p { color: var(--muted); }
.luxury-site .property-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; padding: .5rem; background: #fff; }
.luxury-site .property-gallery img { height: 55vw; max-height: 720px; object-fit: cover; }
.luxury-site .property-gallery img.wide { grid-column: 1 / -1; height: 70vw; max-height: 900px; }
.luxury-site .property-inquiry { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(3rem, 8vw, 9rem); align-items: start; }

.luxury-site .valuation-page { min-height: 100vh; display: grid; place-items: center; padding: 9rem 1.5rem 4rem; }
.luxury-site .valuation-card { width: min(680px, 100%); min-height: 540px; padding: clamp(2rem, 6vw, 5rem); background: rgba(250,249,246,.97); box-shadow: 0 25px 70px rgba(0,0,0,.25); }
.luxury-site .steps { display: flex; align-items: center; justify-content: center; margin-bottom: 3.5rem; }
.luxury-site .steps span { width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 50%; font-size: .7rem; }
.luxury-site .steps span.active { background: var(--ink); color: white; border-color: var(--ink); }
.luxury-site .steps i { width: 60px; height: 1px; background: var(--line); }
.luxury-site .valuation-card h1 { font-size: clamp(2.7rem, 5vw, 4.8rem); }
.luxury-site .valuation-card h2 { font-size: clamp(2.3rem, 4vw, 3.8rem); }
.luxury-site .valuation-card form, .luxury-site .valuation-thanks { display: flex; flex-direction: column; gap: 1rem; }
.luxury-site .lead-form label, .luxury-site .valuation-card label, .luxury-site .studio-panel label { display: flex; flex-direction: column; gap: .45rem; font-size: .63rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.luxury-site .lead-form input, .luxury-site .lead-form textarea, .luxury-site .lead-form select, .luxury-site .valuation-card input, .luxury-site .valuation-card select, .luxury-site .studio-panel input, .luxury-site .studio-panel select { width: 100%; padding: .85rem .15rem; border: 0; border-bottom: 1px solid var(--line); background: transparent; outline: 0; color: var(--ink); text-transform: none; letter-spacing: 0; font-weight: 400; }
.luxury-site .search-toolbar { display: grid; grid-template-columns: 1.5fr .8fr .8fr auto; gap: .7rem; padding: 1rem; background: var(--surface); border: 1px solid var(--line); }
.luxury-site .search-toolbar input, .luxury-site .search-toolbar select { min-height: 48px; padding: 0 .9rem; border: 1px solid var(--line); background: white; }
.luxury-site .search-toolbar button { border: 0; padding: 0 1.1rem; background: var(--ink); color: white; text-transform: uppercase; font-size: .62rem; letter-spacing: .12em; }
.luxury-site .search-summary { display: flex; justify-content: space-between; padding: 2rem 0; font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; }
.luxury-site .empty-state { padding: 6rem 1rem; text-align: center; }
.luxury-site .empty-state h2 { font-size: 2.5rem; }

.luxury-site .development-row { display: grid; grid-template-columns: 1.1fr .9fr; min-height: 600px; margin-bottom: 1px; background: var(--surface); }
.luxury-site .development-row.reverse > a { order: 2; }
.luxury-site .development-row > a img { height: 100%; min-height: 600px; object-fit: cover; }
.luxury-site .development-row > div { padding: clamp(3rem, 7vw, 7rem); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.luxury-site .development-detail-hero { min-height: 100vh; padding: 10rem clamp(1.5rem, 6vw, 7rem) 5rem; display: flex; align-items: flex-end; color: white; }
.luxury-site .development-detail-hero h1 { margin-bottom: .6rem; }
.luxury-site .development-lede { text-align: center; max-width: 1200px; margin: auto; }
.luxury-site .development-lede h2 { font-size: clamp(2.2rem, 4vw, 4.7rem); line-height: 1.2; }
.luxury-site .development-section { display: grid; grid-template-columns: 1.2fr .8fr; min-height: 650px; }
.luxury-site .development-section.reverse img { order: 2; }
.luxury-site .development-section img { height: 100%; min-height: 650px; object-fit: cover; }
.luxury-site .development-section > div { padding: clamp(3rem, 7vw, 8rem); display: flex; flex-direction: column; justify-content: center; }

.luxury-site .community-index { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem 1.5rem; }
.luxury-site .community-index-card img { aspect-ratio: 1.25; object-fit: cover; }
.luxury-site .community-index-card > div { position: relative; padding: 1.4rem 0 0 3.2rem; }
.luxury-site .community-index-card span { position: absolute; left: 0; top: 1.8rem; font-size: .65rem; letter-spacing: .12em; }
.luxury-site .community-index-card h2 { font-size: 2.8rem; margin-bottom: .5rem; }
.luxury-site .community-index-card p { color: var(--muted); }
.luxury-site .community-lede { display: grid; grid-template-columns: .9fr 1.1fr; gap: 7rem; }
.luxury-site .community-lede p { color: var(--muted); }
.luxury-site .community-highlights { display: grid; grid-template-columns: 1.1fr .9fr; min-height: 750px; background: var(--surface); }
.luxury-site .community-highlights > div:last-child { padding: clamp(3rem, 8vw, 9rem); display: flex; flex-direction: column; justify-content: center; }
.luxury-site .community-highlights ul { list-style: none; padding: 1rem 0 0; margin: 0; border-top: 1px solid var(--line); }
.luxury-site .community-highlights li { padding: .85rem 0; border-bottom: 1px solid var(--line); font-family: var(--display); font-size: 1.4rem; }
.luxury-site .community-stats { background: #d9d1c4; }
.luxury-site .community-stats .stats-grid { color: var(--ink); border-color: rgba(24,32,29,.2); }
.luxury-site .community-stats .stats-grid > div { border-color: rgba(24,32,29,.2); }
.luxury-site .data-note { max-width: 650px; margin: 2rem auto 0; text-align: center; font-size: .72rem; color: var(--muted); }

.luxury-site .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem 1.5rem; }
.luxury-site .video-grid article > div { position: relative; }
.luxury-site .video-grid img { aspect-ratio: 1.55; object-fit: cover; }
.luxury-site .video-grid button { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 72px; height: 72px; border-radius: 50%; border: 1px solid white; background: rgba(0,0,0,.25); color: white; }
.luxury-site .video-grid article > div span { position: absolute; right: 1rem; bottom: 1rem; padding: .25rem .5rem; background: rgba(0,0,0,.6); color: white; font-size: .65rem; }
.luxury-site .video-grid h2 { font-size: 2.3rem; margin: 1.3rem 0 .7rem; }
.luxury-site .video-grid p { color: var(--muted); }
.luxury-site .featured-post { display: grid; grid-template-columns: 1.2fr .8fr; min-height: 560px; background: var(--surface); margin-bottom: 6rem; }
.luxury-site .featured-post img { height: 100%; min-height: 560px; object-fit: cover; }
.luxury-site .featured-post > div { padding: clamp(2.5rem, 6vw, 6rem); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.luxury-site .featured-post h2 { font-size: clamp(2.4rem, 4vw, 4.5rem); }
.luxury-site .blog-index { margin-top: 4rem; }
.luxury-site .article-page { background: var(--surface); }
.luxury-site .article-page > header { padding: 11rem clamp(1.5rem, 8vw, 10rem) 5rem; text-align: center; }
.luxury-site .article-page > header h1 { max-width: 1150px; margin: 0 auto 1.5rem; font-size: clamp(3rem, 6vw, 7rem); }
.luxury-site .article-excerpt { max-width: 730px; margin: 0 auto 1.7rem; color: var(--muted); font-size: 1.08rem; }
.luxury-site .article-page > header > div { display: flex; justify-content: center; gap: 1.5rem; font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
.luxury-site .article-hero { width: calc(100% - clamp(2rem, 10vw, 12rem)); max-height: 850px; margin: auto; object-fit: cover; }
.luxury-site .article-body { width: min(760px, calc(100% - 3rem)); margin: auto; padding: 6rem 0 9rem; }
.luxury-site .article-body section { margin-bottom: 4rem; }
.luxury-site .article-body h2 { font-size: clamp(2rem, 3.2vw, 3.3rem); }
.luxury-site .article-body p { color: #4f5550; font-size: 1.04rem; }
.luxury-site .article-cta { margin-top: 6rem; padding: 3rem; background: var(--paper); text-align: center; }
.luxury-site .article-cta h2 { font-size: 3rem; }

.luxury-site .contact-page { min-height: 100vh; display: grid; grid-template-columns: .9fr 1.1fr; background: var(--surface); }
.luxury-site .contact-image { min-height: 100vh; position: relative; color: white; }
.luxury-site .contact-image > div { position: absolute; left: clamp(2rem, 6vw, 6rem); bottom: 4rem; }
.luxury-site .contact-content { padding: 10rem clamp(2rem, 7vw, 8rem) 5rem; }
.luxury-site .contact-content h2 { margin-bottom: 1.5rem; }
.luxury-site .lead-form { display: flex; flex-direction: column; gap: 1.4rem; margin-top: 2rem; }
.luxury-site .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; }
.luxury-site .lead-form textarea { resize: vertical; }
.luxury-site .lead-form .consent { flex-direction: row; align-items: flex-start; text-transform: none; letter-spacing: 0; font-weight: 400; line-height: 1.45; font-size: .7rem; }
.luxury-site .lead-form .consent input { width: auto; margin-top: .2rem; }
.luxury-site .lead-form .button { align-self: flex-start; }
.luxury-site .lead-form.dark input, .luxury-site .lead-form.dark textarea, .luxury-site .lead-form.dark select { border-color: rgba(255,255,255,.35); }
.luxury-site .lead-form.compact .form-grid { grid-template-columns: 1fr; }
.luxury-site .contact-details { display: flex; flex-direction: column; gap: .25rem; margin-top: 3rem; font-size: .82rem; }
.luxury-site .form-success { padding: 3rem; background: var(--paper); }
.luxury-site .form-success.dark { background: rgba(255,255,255,.08); }
.luxury-site .legal-page { max-width: 900px; margin: 0 auto; padding-top: 11rem; background: var(--paper); }
.luxury-site .legal-page h1 { font-size: 5rem; }
.luxury-site .legal-page h2 { font-size: 2.3rem; margin-top: 3rem; }

.luxury-site .footer-cta { min-height: 630px; padding: 5rem 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; }
.luxury-site .footer-cta h2 { margin-bottom: 1rem; }
.luxury-site .footer-main { padding: 5rem clamp(1.5rem, 6vw, 7rem); display: grid; grid-template-columns: 1.2fr 1fr 1fr .7fr; gap: 3rem; background: var(--ink); color: white; border-bottom: 1px solid rgba(255,255,255,.15); }
.luxury-site .footer-brand { display: flex; align-items: center; gap: 1.4rem; }
.luxury-site .monogram { width: 80px; height: 80px; border: 1px solid rgba(255,255,255,.55); border-radius: 50%; display: grid; place-items: center; font-family: var(--display); font-size: 1.7rem; }
.luxury-site .footer-main h3 { font-family: var(--body); font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; }
.luxury-site .footer-main > div { display: flex; flex-direction: column; gap: .35rem; font-size: .79rem; color: rgba(255,255,255,.72); }
.luxury-site .footer-links a:hover { color: white; }
.luxury-site .footer-legal { padding: 2rem clamp(1.5rem, 6vw, 7rem); background: var(--ink); color: rgba(255,255,255,.5); font-size: .62rem; }
.luxury-site .footer-legal > div { display: flex; gap: 1.4rem; margin-top: 1.4rem; }

.luxury-site .studio-shell { min-height: 100vh; display: grid; grid-template-columns: 390px 1fr; background: #eceae4; }
.luxury-site .studio-panel { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 3rem 2rem; background: white; z-index: 60; box-shadow: 10px 0 30px rgba(0,0,0,.08); }
.luxury-site .studio-panel h1 { font-size: 3rem; }
.luxury-site .studio-panel p { color: #666; font-size: .85rem; }
.luxury-site .studio-panel code { background: #eee; padding: .15rem .35rem; }
.luxury-site .studio-panel label { margin-top: 1.1rem; }
.luxury-site .color-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; }
.luxury-site .color-grid input { height: 42px; padding: 0; border: 0; }
.luxury-site .studio-panel .button { margin-top: 2rem; width: 100%; }
.luxury-site .studio-preview { margin: 3rem; min-width: 0; background: var(--studio-paper); color: var(--studio-ink); box-shadow: 0 25px 70px rgba(0,0,0,.16); }
.luxury-site .studio-nav { height: 80px; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: .65rem; letter-spacing: .1em; }
.luxury-site .studio-nav strong { font-family: var(--studio-display); font-size: 1.1rem; }
.luxury-site .studio-nav button, .luxury-site .studio-hero button { border: 1px solid var(--studio-ink); background: var(--studio-ink); color: white; padding: .75rem 1rem; font-size: .55rem; letter-spacing: .12em; }
.luxury-site .studio-hero { position: relative; min-height: 650px; color: white; }
.luxury-site .studio-hero img { position: absolute; inset: 0; height: 100%; object-fit: cover; filter: brightness(.58); }
.luxury-site .studio-hero > div { position: absolute; left: 7%; bottom: 10%; }
.luxury-site .studio-hero small, .luxury-site .studio-copy small { letter-spacing: .17em; }
.luxury-site .studio-hero h2, .luxury-site .studio-copy h2 { font-family: var(--studio-display); font-size: clamp(2.6rem, 5vw, 5.5rem); margin: 1rem 0; }
.luxury-site .studio-hero button { background: white; color: var(--studio-ink); border-color: white; }
.luxury-site .studio-copy { padding: 7rem 8%; text-align: center; }
.luxury-site .studio-copy p { max-width: 620px; margin: auto; }

@media (max-width: 1180px) {
  .luxury-site .desktop-nav { display: none; }
  .luxury-site .menu-button { display: block; }
  .luxury-site .menu-content { grid-template-columns: 1fr 1fr; }
  .luxury-site .menu-contact { display: none; }
  .luxury-site .property-grid { grid-template-columns: repeat(2, 1fr); }
  .luxury-site .community-grid { grid-template-columns: repeat(2, 1fr); }
  .luxury-site .footer-main { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 800px) {
  .luxury-site h1 { font-size: clamp(3rem, 14vw, 5rem); }
  .luxury-site h2 { font-size: clamp(2.4rem, 11vw, 4rem); }
  .luxury-site .section-pad { padding: 5rem 1.25rem; }
  .luxury-site .section-pad-topless { padding: 0 1.25rem 5rem; }
  .luxury-site .site-header { height: 72px; padding: 0 1rem; }
  .luxury-site .header-contact { display: none; }
  .luxury-site .brand-lockup { min-width: auto; align-items: flex-start; }
  .luxury-site .brand-lockup span { font-size: .9rem; }
  .luxury-site .menu-content { display: block; padding-top: 4rem; }
  .luxury-site .menu-primary a { font-size: 2.5rem; }
  .luxury-site .menu-secondary { display: none; }
  .luxury-site .home-hero { padding: 8rem 1.25rem 4rem; min-height: 94vh; }
  .luxury-site .scroll-cue { display: none; }
  .luxury-site .split-editorial, .luxury-site .split-editorial.reverse { grid-template-columns: 1fr; }
  .luxury-site .split-editorial.reverse .split-image { order: 0; }
  .luxury-site .split-image { min-height: 110vw; }
  .luxury-site .split-copy { padding: 4rem 1.25rem; }
  .luxury-site .stats-grid { grid-template-columns: 1fr 1fr; }
  .luxury-site .stats-grid > div:nth-child(2) { border-right: 0; }
  .luxury-site .stats-grid > div { min-height: 150px; border-bottom: 1px solid rgba(255,255,255,.2); }
  .luxury-site .property-grid, .luxury-site .property-grid.featured, .luxury-site .community-grid, .luxury-site .post-grid, .luxury-site .team-grid, .luxury-site .video-grid, .luxury-site .community-index { grid-template-columns: 1fr; }
  .luxury-site .community-card { min-height: 500px; }
  .luxury-site .newsletter { grid-template-columns: 1fr; gap: 1.5rem; }
  .luxury-site .page-hero { min-height: 68vh; padding: 8rem 1.25rem 3.5rem; }
  .luxury-site .page-hero.compact { min-height: 52vh; }
  .luxury-site .marketing-intro .two-column-prose, .luxury-site .property-overview, .luxury-site .community-lede { grid-template-columns: 1fr; gap: 1rem; }
  .luxury-site .pillar-grid { grid-template-columns: 1fr; }
  .luxury-site .press-logos { grid-template-columns: 1fr 1fr; padding-left: 1.25rem; padding-right: 1.25rem; }
  .luxury-site .press-list article { grid-template-columns: 1fr auto; }
  .luxury-site .press-list article button { display: none; }
  .luxury-site .property-detail-hero { height: 80vh; }
  .luxury-site .property-detail-title { left: 1.25rem; right: 1.25rem; bottom: 2.5rem; }
  .luxury-site .property-facts { flex-wrap: wrap; }
  .luxury-site .property-facts > * { width: 50%; justify-content: center; border-bottom: 1px solid var(--line); }
  .luxury-site .property-gallery { grid-template-columns: 1fr; }
  .luxury-site .property-gallery img, .luxury-site .property-gallery img.wide { grid-column: auto; height: 100vw; }
  .luxury-site .property-inquiry { grid-template-columns: 1fr; }
  .luxury-site .search-toolbar { grid-template-columns: 1fr; }
  .luxury-site .development-row, .luxury-site .development-row.reverse, .luxury-site .development-section, .luxury-site .development-section.reverse { grid-template-columns: 1fr; }
  .luxury-site .development-row.reverse > a, .luxury-site .development-section.reverse img { order: 0; }
  .luxury-site .development-row > a img, .luxury-site .development-section img { min-height: 100vw; }
  .luxury-site .community-highlights { grid-template-columns: 1fr; }
  .luxury-site .community-highlights > div:first-child { min-height: 100vw; }
  .luxury-site .featured-post { grid-template-columns: 1fr; }
  .luxury-site .featured-post img { min-height: 70vw; }
  .luxury-site .article-page > header { padding: 8rem 1.25rem 4rem; }
  .luxury-site .article-page > header > div { flex-direction: column; gap: .3rem; }
  .luxury-site .article-hero { width: calc(100% - 2rem); }
  .luxury-site .contact-page { grid-template-columns: 1fr; }
  .luxury-site .contact-image { min-height: 68vh; }
  .luxury-site .contact-content { padding: 5rem 1.25rem; }
  .luxury-site .form-grid { grid-template-columns: 1fr; }
  .luxury-site .footer-main { grid-template-columns: 1fr; }
  .luxury-site .footer-brand { margin-bottom: 1.5rem; }
  .luxury-site .footer-legal > div { flex-wrap: wrap; }
  .luxury-site .studio-shell { grid-template-columns: 1fr; }
  .luxury-site .studio-panel { position: relative; height: auto; }
  .luxury-site .studio-preview { margin: 1rem; }
  .luxury-site .studio-nav span { display: none; }
  .luxury-site .studio-hero { min-height: 560px; }
}

`;
