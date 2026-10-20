/** Scoped Rowe template CSS — all selectors under .rowe-site */
export const ROWE_CSS = `
.rowe-site{--paper:#eeeae2;--paper-2:#e6e0d6;--ink:#11110f;--muted:#6b675f;--line:rgba(17,17,15,.18);--soft-line:rgba(255,255,255,.18);--black:#10100f;--cream:#f3efe7;--max:1600px;--pad:clamp(22px, 3.3vw, 58px);--serif:"Iowan Old Style","Baskerville","Times New Roman",serif;--sans:"Helvetica Neue",Arial,sans-serif}
.rowe-site{min-height:100vh;display:flex;flex-direction:column;margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.45;-webkit-font-smoothing:antialiased}
.rowe-site main{flex:1;overflow:hidden}
.rowe-site, .rowe-site *{box-sizing:border-box}
.rowe-site{scroll-behavior:smooth}
.rowe-site ::selection{background:var(--ink);color:var(--cream)}
.rowe-site a{color:inherit;text-decoration:none}
.rowe-site button,.rowe-site input,.rowe-site textarea{font:inherit}
.rowe-site img{display:block;width:100%;height:100%;object-fit:cover;background:#d7d0c4}
.rowe-site a{color: inherit; text-decoration: none;}
.rowe-site button, .rowe-site input, .rowe-site textarea{font: inherit;}
.rowe-site img{display: block; width: 100%; height: 100%; object-fit: cover; background: #d7d0c4;}
.rowe-site main{overflow: hidden;}
.rowe-site .section-pad{padding-left: var(--pad); padding-right: var(--pad);}
.rowe-site .site-header{position: fixed; z-index: 50; top: 0; left: 0; right: 0;
  height: 84px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding: 0 var(--pad); color: var(--ink); transition: background .25s ease, border-color .25s ease, color .25s ease;
  border-bottom: 1px solid transparent;}
.rowe-site .site-header.is-scrolled{background: rgba(238,234,226,.92); backdrop-filter: blur(14px); border-bottom-color: var(--line);}
.rowe-site .brand{display: inline-flex; flex-direction: column; width: max-content; line-height: 1; letter-spacing: .02em;}
.rowe-site .brand span{font-size: 16px; font-weight: 600;}
.rowe-site .brand small{margin-top: 5px; font-size: 8px; letter-spacing: .18em;}
.rowe-site .brand.inverted{color: var(--cream);}
.rowe-site .desktop-nav{display: flex; align-items: center; gap: 28px; font-size: 12px;}
.rowe-site .desktop-nav a, .rowe-site .contact-link{position: relative;}
.rowe-site .desktop-nav a::after, .rowe-site .contact-link::after{content: ""; position: absolute; left: 0; bottom: -4px; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .25s ease;}
.rowe-site .desktop-nav a:hover::after, .rowe-site .contact-link:hover::after{transform: scaleX(1); transform-origin: left;}
.rowe-site .header-actions{justify-self: end; display: flex; align-items: center; gap: 22px;}
.rowe-site .contact-link{font-size: 12px;}
.rowe-site .menu-button{display: none; background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;}
.rowe-site .menu-overlay{position: fixed; z-index: 100; inset: 0; background: #11110f; color: var(--cream); padding: 26px var(--pad) 32px; display: flex; flex-direction: column; transform: translateY(-102%); transition: transform .55s cubic-bezier(.75,0,.15,1);}
.rowe-site .menu-overlay.is-open{transform: translateY(0);}
.rowe-site .menu-top, .rowe-site .menu-bottom{display: flex; justify-content: space-between; align-items: flex-start;}
.rowe-site .menu-close{background: transparent; border: 0; color: var(--cream); cursor: pointer;}
.rowe-site .menu-grid{flex: 1; display: grid; grid-template-columns: 1fr 1.4fr; align-items: center; gap: 8vw;}
.rowe-site .menu-note{max-width: 360px; color: #b5afa5; font-family: var(--serif); font-size: 28px; line-height: 1.15;}
.rowe-site .menu-nav{display: flex; flex-direction: column;}
.rowe-site .menu-nav a{border-bottom: 1px solid rgba(255,255,255,.18); display: grid; grid-template-columns: 42px 1fr; align-items: baseline; padding: 13px 0; font-family: var(--serif); font-size: clamp(38px, 5.5vw, 88px); line-height: 1;}
.rowe-site .menu-nav a span{font-family: var(--sans); font-size: 9px; color: #8d887f;}
.rowe-site .menu-bottom{border-top: 1px solid rgba(255,255,255,.18); padding-top: 17px; color: #9c978e; font-size: 11px;}
.rowe-site .home-hero{min-height: 100svh; display: grid; grid-template-columns: 61% 39%; position: relative; border-bottom: 1px solid var(--line);}
.rowe-site .hero-copy{padding: 154px var(--pad) 44px; display: flex; flex-direction: column; justify-content: space-between;}
.rowe-site .eyebrow, .rowe-site .page-hero-label{text-transform: uppercase; letter-spacing: .15em; font-size: 9px;}
.rowe-site .eyebrow span{margin: 0 12px;}
.rowe-site .hero-copy h1, .rowe-site .page-hero h1, .rowe-site .detail-title h1, .rowe-site .about-hero h1, .rowe-site .contact-intro h1, .rowe-site .article header h1, .rowe-site .legal-page h1{font-family: var(--serif); font-weight: 400; letter-spacing: -.055em; line-height: .86; margin: 40px 0;}
.rowe-site .hero-copy h1{font-size: clamp(72px, 9.2vw, 155px); max-width: 1050px;}
.rowe-site .hero-copy h1 em, .rowe-site .page-hero h1 em, .rowe-site .about-hero h1 em, .rowe-site .contact-intro h1 em{font-weight: 400;}
.rowe-site .hero-bottom-copy{display: flex; align-items: flex-end; justify-content: space-between; gap: 35px;}
.rowe-site .hero-bottom-copy p{margin: 0; max-width: 440px; font-size: 16px; color: #45413b;}
.rowe-site .round-link{width: 126px; height: 126px; border: 1px solid var(--ink); border-radius: 50%; display: flex; flex-direction: column; justify-content: center; padding: 20px; font-size: 11px; transition: background .25s ease, color .25s ease;}
.rowe-site .round-link span{align-self: flex-end; margin-top: 7px;}
.rowe-site .round-link:hover{background: var(--ink); color: var(--cream);}
.rowe-site .hero-image{position: relative; min-height: 100svh; overflow: hidden;}
.rowe-site .hero-image img{transition: transform 1.2s ease;}
.rowe-site .hero-image:hover img{transform: scale(1.02);}
.rowe-site .hero-image-caption{position: absolute; left: 18px; right: 18px; bottom: 17px; display: flex; justify-content: space-between; color: white; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; text-shadow: 0 1px 10px rgba(0,0,0,.35);}
.rowe-site .vertical-note{position: absolute; top: 50%; left: 61%; transform: translate(-50%,-50%) rotate(-90deg); transform-origin: center; z-index: 2; color: rgba(255,255,255,.85); font-size: 8px; letter-spacing: .2em; white-space: nowrap;}
.rowe-site .ticker{background: var(--ink); color: var(--cream); overflow: hidden; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,.12);}
.rowe-site .ticker div{width: max-content; padding: 14px 0; font-size: 9px; letter-spacing: .14em; animation: ticker 30s linear infinite;}
.rowe-site .ticker i{padding: 0 23px; color: #777269;}
@keyframes ticker{ from { transform: translateX(0); } to { transform: translateX(-42%); } }
.rowe-site .section-label{font-size: 9px; text-transform: uppercase; letter-spacing: .15em; color: var(--muted);}
.rowe-site .manifesto{display: grid; grid-template-columns: 24% 76%; padding-top: 130px; padding-bottom: 150px;}
.rowe-site .manifesto-copy h2{font-family: var(--serif); font-weight: 400; font-size: clamp(40px, 5vw, 78px); line-height: 1.02; letter-spacing: -.04em; margin: 0; max-width: 1140px;}
.rowe-site .manifesto-lower{margin-top: 70px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: end;}
.rowe-site .manifesto-lower p{max-width: 590px; margin: 0; color: #4c4842; font-size: 16px;}
.rowe-site .text-arrow{display: inline-flex; width: max-content; align-items: center; justify-content: space-between; min-width: 175px; padding: 0 0 8px; border-bottom: 1px solid currentColor; font-size: 11px; gap: 30px;}
.rowe-site .text-arrow span{transition: transform .2s ease;}
.rowe-site .text-arrow:hover span{transform: translate(3px,-3px);}
.rowe-site .text-arrow.light{color: var(--cream); border-color: rgba(255,255,255,.6);}
.rowe-site .featured-section{padding-top: 95px; padding-bottom: 140px; border-top: 1px solid var(--line);}
.rowe-site .section-heading{display: grid; grid-template-columns: 24% 76%; margin-bottom: 65px;}
.rowe-site .section-heading h2{font-family: var(--serif); font-weight: 400; font-size: clamp(52px, 6vw, 96px); line-height: .92; letter-spacing: -.045em; margin: 0 0 34px;}
.rowe-site .section-heading h2 em{font-weight: 400;}
.rowe-site .property-grid.home-grid{display: grid; grid-template-columns: 1.5fr .9fr; gap: 17px; align-items: start;}
.rowe-site .property-stack{display: grid; gap: 40px;}
.rowe-site .property-card{display: block;}
.rowe-site .property-image-wrap{aspect-ratio: 4/3; position: relative; overflow: hidden; background: #d0c8bd;}
.rowe-site .property-card.featured .property-image-wrap{aspect-ratio: 4/5;}
.rowe-site .property-card img{transition: transform .75s cubic-bezier(.2,.6,.3,1);}
.rowe-site .property-card:hover img{transform: scale(1.025);}
.rowe-site .image-badge, .rowe-site .image-index{position: absolute; top: 13px; background: rgba(239,235,227,.92); padding: 7px 9px; font-size: 8px; text-transform: uppercase; letter-spacing: .1em;}
.rowe-site .image-badge{left: 13px;}
.rowe-site .image-index{right: 13px; opacity: 0; transform: translateY(5px); transition: .25s ease;}
.rowe-site .property-card:hover .image-index{opacity: 1; transform: translateY(0);}
.rowe-site .property-meta{display: flex; justify-content: space-between; gap: 20px; padding-top: 13px; border-top: 1px solid var(--line); margin-top: 9px;}
.rowe-site .property-meta h3{margin: 0 0 2px; font-family: var(--serif); font-weight: 400; font-size: 22px; letter-spacing: -.02em;}
.rowe-site .property-meta p, .rowe-site .property-price small{margin: 0; color: var(--muted); font-size: 9px; text-transform: uppercase; letter-spacing: .08em;}
.rowe-site .property-price{text-align: right; display: flex; flex-direction: column; gap: 5px;}
.rowe-site .property-price span{font-size: 12px;}
.rowe-site .services-home{background: var(--black); color: var(--cream); padding-top: 125px; padding-bottom: 120px;}
.rowe-site .light-heading .section-label{color: #918b82;}
.rowe-site .light-heading{margin-bottom: 55px;}
.rowe-site .light-heading p{max-width: 530px; color: #aaa49b; margin: 0;}
.rowe-site .service-list{border-top: 1px solid var(--soft-line);}
.rowe-site .service-row{display: grid; grid-template-columns: 8% 34% 1fr 24px; align-items: center; min-height: 122px; border-bottom: 1px solid var(--soft-line); transition: padding .25s ease;}
.rowe-site .service-row:hover{padding-left: 10px;}
.rowe-site .service-row > span{font-size: 9px; color: #7f7a72;}
.rowe-site .service-row h3{font-family: var(--serif); font-size: clamp(30px, 3vw, 47px); font-weight: 400; margin: 0; letter-spacing: -.035em;}
.rowe-site .service-row p{max-width: 500px; margin: 0; color: #a5a097; font-size: 13px;}
.rowe-site .service-row b{font-weight: 400;}
.rowe-site .services-all{margin-top: 38px;}
.rowe-site .quote-section{padding-top: 150px; padding-bottom: 150px; display: grid; grid-template-columns: 24% 58% 18%; align-items: start; border-bottom: 1px solid var(--line);}
.rowe-site .quote-mark{font-family: var(--serif); font-size: 120px; line-height: .7; color: #b5aea2;}
.rowe-site .quote-section blockquote{font-family: var(--serif); font-size: clamp(40px, 4.8vw, 72px); line-height: 1.02; letter-spacing: -.04em; font-weight: 400; margin: 0;}
.rowe-site .quote-credit{align-self: end; display: flex; flex-direction: column; gap: 4px; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted);}
.rowe-site .about-home{display: grid; grid-template-columns: 50% 50%; min-height: 850px; padding: 0;}
.rowe-site .about-image{position: relative; min-height: 850px;}
.rowe-site .about-image-note{position: absolute; bottom: 25px; left: 25px; color: white; font-family: var(--serif); font-size: 26px; line-height: 1.05; text-shadow: 0 2px 12px rgba(0,0,0,.35);}
.rowe-site .about-copy{padding: 105px var(--pad); display: flex; flex-direction: column; justify-content: center; align-items: flex-start;}
.rowe-site .about-copy h2{font-family: var(--serif); font-size: clamp(48px, 5vw, 78px); line-height: .98; font-weight: 400; letter-spacing: -.045em; margin: 48px 0;}
.rowe-site .about-copy p{max-width: 610px; font-size: 15px; color: #49463f;}
.rowe-site .about-copy .text-arrow{margin-top: 30px;}
.rowe-site .stats{display: grid; grid-template-columns: repeat(4,1fr); padding-top: 70px; padding-bottom: 80px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);}
.rowe-site .stats div{padding-right: 25px; display: flex; flex-direction: column; gap: 14px;}
.rowe-site .stats strong{font-family: var(--serif); font-size: clamp(52px, 5vw, 82px); font-weight: 400; letter-spacing: -.05em;}
.rowe-site .stats span{max-width: 180px; color: var(--muted); font-size: 10px; text-transform: uppercase; letter-spacing: .09em;}
.rowe-site .journal-home{padding-top: 110px; padding-bottom: 150px;}
.rowe-site .journal-grid{display: grid; grid-template-columns: repeat(3,1fr); gap: 18px;}
.rowe-site .journal-card img{aspect-ratio: 4/3;}
.rowe-site .journal-meta{display: flex; justify-content: space-between; padding-top: 12px; margin-top: 8px; border-top: 1px solid var(--line); color: var(--muted); font-size: 8px; text-transform: uppercase; letter-spacing: .08em;}
.rowe-site .journal-card h3{font-family: var(--serif); font-size: 30px; line-height: 1.05; font-weight: 400; letter-spacing: -.025em; margin: 24px 0 8px;}
.rowe-site .journal-card p{color: var(--muted); max-width: 410px; margin: 0; font-size: 13px;}
.rowe-site .footer{background: #0d0d0c; color: var(--cream); padding: 115px var(--pad) 26px;}
.rowe-site .footer-main{display: grid; grid-template-columns: 2fr 1fr; min-height: 480px; border-bottom: 1px solid var(--soft-line);}
.rowe-site .footer-kicker{font-size: 9px; text-transform: uppercase; letter-spacing: .14em; color: #8b867e;}
.rowe-site .footer h2{font-family: var(--serif); font-size: clamp(70px, 8vw, 132px); font-weight: 400; line-height: .82; letter-spacing: -.055em; margin: 45px 0 55px;}
.rowe-site .footer h2 em{font-weight: 400;}
.rowe-site .footer-contact{border-left: 1px solid var(--soft-line); padding-left: 30px; display: flex; flex-direction: column;}
.rowe-site .footer-contact > span, .rowe-site .footer-newsletter > span{font-size: 9px; color: #89847d; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 25px;}
.rowe-site .footer-contact a{font-family: var(--serif); font-size: 28px; margin-bottom: 8px;}
.rowe-site .footer-contact p{margin-top: auto; color: #97928a; font-size: 12px;}
.rowe-site .footer-grid{display: grid; grid-template-columns: 2fr 1fr .8fr 1.3fr; gap: 40px; padding: 38px 0 70px;}
.rowe-site .footer-tagline{max-width: 330px; color: #a29d95; font-family: var(--serif); font-size: 24px; line-height: 1.12;}
.rowe-site .footer-links, .rowe-site .footer-social{display: flex; flex-direction: column; gap: 8px; font-size: 11px;}
.rowe-site .footer-newsletter form{display: flex; border-bottom: 1px solid rgba(255,255,255,.45);}
.rowe-site .footer-newsletter input{flex: 1; border: 0; background: transparent; color: white; padding: 8px 0 10px; outline: 0;}
.rowe-site .footer-newsletter button{background: transparent; color: white; border: 0; cursor: pointer;}
.rowe-site .footer-legal{display: flex; justify-content: space-between; color: #6f6b65; font-size: 8px; text-transform: uppercase; letter-spacing: .1em; border-top: 1px solid rgba(255,255,255,.08); padding-top: 20px;}
.rowe-site .page-hero{padding: 180px var(--pad) 90px; min-height: 650px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 24% 76%; grid-template-rows: auto 1fr auto;}
.rowe-site .page-hero .page-hero-label{grid-column: 1 / -1;}
.rowe-site .page-hero h1{grid-column: 2; font-size: clamp(76px, 9vw, 145px); align-self: center;}
.rowe-site .page-hero > p{grid-column: 2; max-width: 580px; font-size: 16px; color: #4f4b44;}
.rowe-site .services-index{display: grid; grid-template-columns: repeat(2,1fr); gap: 0; padding-top: 90px; padding-bottom: 140px;}
.rowe-site .service-index-card{border-top: 1px solid var(--line); padding: 18px 18px 70px 0;}
.rowe-site .service-index-card:nth-child(even){border-left: 1px solid var(--line); padding-left: 18px; padding-right: 0;}
.rowe-site .service-card-top{display: flex; justify-content: space-between; color: var(--muted); font-size: 8px; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 55px;}
.rowe-site .service-card-image{overflow: hidden; aspect-ratio: 16/10;}
.rowe-site .service-card-image img{transition: transform .7s ease;}
.rowe-site .service-index-card:hover .service-card-image img{transform: scale(1.02);}
.rowe-site .service-card-copy h2{font-family: var(--serif); font-size: clamp(42px, 4vw, 62px); font-weight: 400; letter-spacing: -.04em; margin: 26px 0 10px;}
.rowe-site .service-card-copy p{max-width: 520px; color: var(--muted); margin: 0;}
.rowe-site .editorial-cta{background: #cbc3b7; padding-top: 110px; padding-bottom: 110px; display: grid; grid-template-columns: 24% 1fr 170px; align-items: center; gap: 40px;}
.rowe-site .editorial-cta h2{font-family: var(--serif); font-size: clamp(44px, 4.5vw, 72px); line-height: 1; font-weight: 400; letter-spacing: -.04em; margin: 0;}
.rowe-site .dark-round{width: 150px; height: 150px;}
.rowe-site .detail-hero{padding-top: 84px; display: grid; grid-template-columns: 55% 45%; min-height: 780px; border-bottom: 1px solid var(--line);}
.rowe-site .detail-title{padding: 100px var(--pad) 70px; display: flex; flex-direction: column; justify-content: center;}
.rowe-site .detail-title h1{font-size: clamp(78px, 8vw, 130px); margin: 52px 0 45px;}
.rowe-site .detail-title p{max-width: 650px; font-size: 19px; color: #4c4943;}
.rowe-site .detail-image{min-height: 696px;}
.rowe-site .service-facts{display: grid; grid-template-columns: repeat(4,1fr); padding-top: 42px; padding-bottom: 55px; border-bottom: 1px solid var(--line);}
.rowe-site .service-facts div{padding-right: 25px;}
.rowe-site .service-facts span{font-size: 8px; text-transform: uppercase; letter-spacing: .11em; color: var(--muted);}
.rowe-site .service-facts p{font-family: var(--serif); font-size: 21px; line-height: 1.12; margin: 10px 0 0; max-width: 260px;}
.rowe-site .service-body{display: grid; grid-template-columns: 24% 76%; padding-top: 115px; padding-bottom: 140px;}
.rowe-site .body-copy{max-width: 880px;}
.rowe-site .body-copy > p{font-family: var(--serif); font-size: clamp(28px, 2.7vw, 42px); line-height: 1.15; letter-spacing: -.02em;}
.rowe-site .body-copy h2{font-size: 11px; text-transform: uppercase; letter-spacing: .12em; font-weight: 500; margin-top: 70px;}
.rowe-site .body-copy ul{padding: 0; margin: 25px 0 65px; list-style: none; border-top: 1px solid var(--line);}
.rowe-site .body-copy li{display: grid; grid-template-columns: 38px 1fr; padding: 15px 0; border-bottom: 1px solid var(--line); font-size: 15px;}
.rowe-site .body-copy li span{color: #8c867e;}
.rowe-site .body-copy blockquote{margin: 0 0 55px; padding: 35px 0 35px 8vw; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-family: var(--serif); font-size: 30px; line-height: 1.18; color: #575249;}
.rowe-site .other-services{background: #d9d2c7; padding-top: 65px; padding-bottom: 90px;}
.rowe-site .other-services > div:last-child{margin-top: 38px;}
.rowe-site .other-services a{display: grid; grid-template-columns: 8% 1fr 20px; align-items: center; border-top: 1px solid rgba(17,17,15,.22); padding: 20px 0;}
.rowe-site .other-services a:last-child{border-bottom: 1px solid rgba(17,17,15,.22);}
.rowe-site .other-services a span{font-size: 9px; color: var(--muted);}
.rowe-site .other-services h3{margin: 0; font-family: var(--serif); font-weight: 400; font-size: 40px;}
.rowe-site .other-services b{font-weight: 400;}
.rowe-site .property-page-hero{background: #d5cec2;}
.rowe-site .properties-list{padding-top: 80px; padding-bottom: 130px; display: grid; grid-template-columns: 1fr 1fr; gap: 70px 18px;}
.rowe-site .properties-list .property-card:first-child{grid-column: 1 / -1;}
.rowe-site .properties-list .property-card:first-child .property-image-wrap{aspect-ratio: 16/8;}
.rowe-site .offmarket-cta{background: var(--black); color: var(--cream); padding-top: 95px; padding-bottom: 100px; display: grid; grid-template-columns: 1fr auto; align-items: end;}
.rowe-site .offmarket-cta span{font-size: 9px; text-transform: uppercase; letter-spacing: .12em; color: #8f8a82;}
.rowe-site .offmarket-cta h2{font-family: var(--serif); font-size: clamp(50px, 5vw, 78px); font-weight: 400; max-width: 900px; line-height: 1; letter-spacing: -.04em; margin: 35px 0 0;}
.rowe-site .listing-hero{height: 100svh; min-height: 690px; position: relative; background: #9a9389;}
.rowe-site .listing-hero::after{content:""; position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,.48), transparent 55%);}
.rowe-site .listing-overlay{position: absolute; z-index: 2; left: var(--pad); right: var(--pad); bottom: 34px; color: white;}
.rowe-site .listing-overlay > div:first-child{display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.5); padding-bottom: 12px; font-size: 9px; text-transform: uppercase; letter-spacing: .1em;}
.rowe-site .listing-overlay h1{font-family: var(--serif); font-weight: 400; font-size: clamp(72px, 9vw, 150px); line-height: .85; letter-spacing: -.055em; margin: 32px 0 22px;}
.rowe-site .listing-price{font-size: 16px;}
.rowe-site .listing-intro{display: grid; grid-template-columns: 24% 76%; padding-top: 100px; padding-bottom: 135px; border-bottom: 1px solid var(--line);}
.rowe-site .listing-specs{display: flex; flex-direction: column; gap: 7px; text-transform: uppercase; font-size: 9px; letter-spacing: .1em; color: var(--muted);}
.rowe-site .listing-intro > div:last-child{max-width: 950px;}
.rowe-site .listing-intro h2{font-family: var(--serif); font-size: clamp(44px, 4.7vw, 76px); line-height: 1.02; font-weight: 400; letter-spacing: -.04em; margin: 0 0 55px;}
.rowe-site .listing-intro p{font-size: 17px; max-width: 760px; color: #4d4942;}
.rowe-site .listing-intro .text-arrow{margin-top: 30px;}
.rowe-site .listing-gallery{padding-top: 18px; padding-bottom: 90px; display: grid; grid-template-columns: 1.6fr 1fr; gap: 18px;}
.rowe-site .listing-gallery img{min-height: 680px;}
.rowe-site .listing-gallery .wide{grid-column: 1 / -1; height: 82vh;}
.rowe-site .listing-details{background: #d4ccc0; padding: 45px; display: flex; flex-direction: column; justify-content: flex-end;}
.rowe-site .listing-details > span{font-size: 9px; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); margin-bottom: auto;}
.rowe-site .listing-details div{padding: 14px 0; border-top: 1px solid rgba(17,17,15,.22); font-family: var(--serif); font-size: 24px;}
.rowe-site .listing-details div:last-child{border-bottom: 1px solid rgba(17,17,15,.22);}
.rowe-site .listing-disclaimer{display: grid; grid-template-columns: 24% 76%; padding-top: 34px; padding-bottom: 55px; border-top: 1px solid var(--line); color: var(--muted); font-size: 10px;}
.rowe-site .listing-disclaimer span{text-transform: uppercase; letter-spacing: .1em;}
.rowe-site .listing-disclaimer p{max-width: 700px; margin: 0;}
.rowe-site .journal-index{padding-top: 70px; padding-bottom: 140px;}
.rowe-site .journal-row{position: relative; display: grid; grid-template-columns: 24% 18% 1fr 30px; align-items: start; min-height: 210px; padding: 18px 0; border-top: 1px solid var(--line);}
.rowe-site .journal-row:last-child{border-bottom: 1px solid var(--line);}
.rowe-site .journal-row-image{width: 0; opacity: 0; overflow: hidden; aspect-ratio: 4/3; transition: width .3s ease, opacity .3s ease;}
.rowe-site .journal-row:hover .journal-row-image{width: calc(100% - 28px); opacity: 1;}
.rowe-site .journal-row-meta{display: flex; flex-direction: column; gap: 4px; color: var(--muted); font-size: 8px; text-transform: uppercase; letter-spacing: .1em;}
.rowe-site .journal-row-copy h2{font-family: var(--serif); font-size: clamp(38px, 4vw, 62px); line-height: 1; font-weight: 400; letter-spacing: -.04em; margin: 0 0 14px;}
.rowe-site .journal-row-copy p{max-width: 570px; color: var(--muted); margin: 0;}
.rowe-site .journal-arrow{justify-self: end;}
.rowe-site .article{padding-top: 84px;}
.rowe-site .article header{padding: 120px var(--pad) 90px; max-width: 1450px; margin: auto;}
.rowe-site .article header h1{font-size: clamp(70px, 8.5vw, 135px); max-width: 1250px;}
.rowe-site .article header > p{max-width: 720px; font-size: 19px; color: #504b44; margin-left: 24%;}
.rowe-site .article-image{height: 76vh; min-height: 590px;}
.rowe-site .article-body{padding: 100px var(--pad) 140px; display: grid; grid-template-columns: 24% 76%;}
.rowe-site .article-aside{display: flex; flex-direction: column; gap: 3px; font-size: 9px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted);}
.rowe-site .article-aside strong{color: var(--ink); font-weight: 500;}
.rowe-site .article-copy{max-width: 820px;}
.rowe-site .article-copy > p:not(.article-note){font-family: var(--serif); font-size: clamp(28px, 2.5vw, 39px); line-height: 1.18; letter-spacing: -.02em; margin: 0 0 35px;}
.rowe-site .article-rule{border-top: 1px solid var(--line); margin: 65px 0 25px;}
.rowe-site .article-note{font-size: 11px; color: var(--muted); max-width: 580px; margin-bottom: 45px;}
.rowe-site .about-hero{padding-top: 84px; min-height: 900px; display: grid; grid-template-columns: 55% 45%; border-bottom: 1px solid var(--line);}
.rowe-site .about-hero > div:first-child{padding: 110px var(--pad) 80px; display: flex; flex-direction: column; justify-content: center;}
.rowe-site .about-hero h1{font-size: clamp(74px, 8.2vw, 130px);}
.rowe-site .about-hero-image{min-height: 816px;}
.rowe-site .about-story{display: grid; grid-template-columns: 24% 76%; padding-top: 120px; padding-bottom: 150px;}
.rowe-site .about-story > div:last-child{max-width: 950px;}
.rowe-site .about-story h2{font-family: var(--serif); font-size: clamp(45px, 4.5vw, 72px); line-height: 1.03; font-weight: 400; letter-spacing: -.04em; margin: 0 0 55px;}
.rowe-site .about-story > div > p{max-width: 730px; color: #4c4841; font-size: 16px;}
.rowe-site .about-values{display: grid; grid-template-columns: repeat(3,1fr); gap: 25px; border-top: 1px solid var(--line); margin: 70px 0 55px; padding-top: 22px;}
.rowe-site .about-values span{font-size: 9px; color: var(--muted);}
.rowe-site .about-values h3{font-family: var(--serif); font-size: 26px; font-weight: 400; line-height: 1.05;}
.rowe-site .about-values p{color: var(--muted); font-size: 12px;}
.rowe-site .contact-page{min-height: 100svh; padding: 155px var(--pad) 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 9vw; background: #d8d0c4;}
.rowe-site .contact-intro{display: flex; flex-direction: column;}
.rowe-site .contact-intro h1{font-size: clamp(70px, 7.6vw, 118px); margin: 62px 0 38px;}
.rowe-site .contact-intro > p{max-width: 570px; color: #4f4a43; font-size: 16px;}
.rowe-site .contact-direct{margin-top: auto; display: flex; flex-direction: column;}
.rowe-site .contact-direct > span{font-size: 9px; text-transform: uppercase; letter-spacing: .11em; color: var(--muted); margin-bottom: 15px;}
.rowe-site .contact-direct a{font-family: var(--serif); font-size: 28px;}
.rowe-site .contact-form-wrap{border-left: 1px solid rgba(17,17,15,.2); padding-left: 45px; display: flex; align-items: center;}
.rowe-site .contact-form{width: 100%;}
.rowe-site .field-label, .rowe-site .contact-form label{display: flex; flex-direction: column; gap: 8px; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted);}
.rowe-site .intent-list{display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0 38px;}
.rowe-site .intent-list button{border: 1px solid rgba(17,17,15,.28); background: transparent; padding: 8px 11px; cursor: pointer; border-radius: 100px; font-size: 10px; color: var(--ink);}
.rowe-site .intent-list button.active{background: var(--ink); color: var(--cream);}
.rowe-site .form-row{display: grid; grid-template-columns: 1fr 1fr; gap: 22px;}
.rowe-site .contact-form input, .rowe-site .contact-form textarea{width: 100%; border: 0; border-bottom: 1px solid rgba(17,17,15,.35); background: transparent; color: var(--ink); padding: 10px 0 12px; outline: none; text-transform: none; letter-spacing: normal;}
.rowe-site .contact-form textarea{resize: vertical; min-height: 110px; margin-bottom: 24px;}
.rowe-site .contact-form input:focus, .rowe-site .contact-form textarea:focus{border-color: var(--ink);}
.rowe-site .submit-button{width: 100%; border: 1px solid var(--ink); background: var(--ink); color: var(--cream); display: flex; justify-content: space-between; padding: 16px 18px; cursor: pointer;}
.rowe-site .success-note{font-size: 10px; color: #48443d; margin-top: 15px;}
.rowe-site .legal-page{padding: 170px var(--pad) 150px;}
.rowe-site .legal-page h1{font-size: clamp(80px, 9vw, 145px); margin: 75px 0 100px 24%;}
.rowe-site .legal-grid{display: grid; grid-template-columns: 24% 76%; border-top: 1px solid var(--line); padding-top: 30px;}
.rowe-site .legal-grid aside{font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted);}
.rowe-site .legal-copy{max-width: 820px;}
.rowe-site .legal-copy p{font-size: 15px; color: #4e4a43;}
.rowe-site .legal-copy h2{font-family: var(--serif); font-size: 36px; font-weight: 400; letter-spacing: -.03em; border-top: 1px solid var(--line); padding-top: 25px; margin-top: 45px;}
@media (max-width: 1050px){
.rowe-site .site-header{grid-template-columns: 1fr auto;}
.rowe-site .desktop-nav, .rowe-site .contact-link{display: none;}
.rowe-site .menu-button{display: block;}
.rowe-site .home-hero{grid-template-columns: 1fr; min-height: auto;}
.rowe-site .hero-copy{min-height: 78svh; padding-top: 140px;}
.rowe-site .hero-image{min-height: 70svh;}
.rowe-site .vertical-note{display: none;}
.rowe-site .manifesto, .rowe-site .section-heading, .rowe-site .quote-section, .rowe-site .service-body, .rowe-site .listing-intro, .rowe-site .article-body, .rowe-site .about-story, .rowe-site .legal-grid{grid-template-columns: 18% 82%;}
.rowe-site .property-grid.home-grid{grid-template-columns: 1fr;}
.rowe-site .property-card.featured .property-image-wrap{aspect-ratio: 16/11;}
.rowe-site .property-stack{grid-template-columns: 1fr 1fr; gap: 18px;}
.rowe-site .about-home{grid-template-columns: 1fr;}
.rowe-site .about-image{min-height: 70svh;}
.rowe-site .about-copy{min-height: 620px;}
.rowe-site .stats{grid-template-columns: repeat(2,1fr); gap: 45px 20px;}
.rowe-site .page-hero{grid-template-columns: 18% 82%;}
.rowe-site .detail-hero, .rowe-site .about-hero{grid-template-columns: 1fr;}
.rowe-site .detail-image, .rowe-site .about-hero-image{min-height: 65svh;}
.rowe-site .contact-page{grid-template-columns: 1fr; gap: 60px;}
.rowe-site .contact-intro{min-height: 650px;}
.rowe-site .contact-form-wrap{border-left: 0; border-top: 1px solid rgba(17,17,15,.2); padding: 55px 0 0;}
.rowe-site .journal-row{grid-template-columns: 18% 18% 1fr 25px;}
}
@media (max-width: 760px){
.rowe-site{--pad:18px}
.rowe-site .site-header{height: 68px;}
.rowe-site .brand span{font-size: 14px;}
.rowe-site .menu-grid{grid-template-columns: 1fr; align-content: center;}
.rowe-site .menu-note{display: none;}
.rowe-site .menu-nav a{font-size: 44px;}
.rowe-site .menu-bottom{flex-direction: column; gap: 5px;}
.rowe-site .hero-copy{min-height: 72svh; padding-top: 110px; padding-bottom: 25px;}
.rowe-site .hero-copy h1{font-size: 18vw; margin-top: 28px;}
.rowe-site .hero-bottom-copy p{max-width: 250px; font-size: 13px;}
.rowe-site .round-link{width: 96px; height: 96px; padding: 14px; font-size: 9px; flex-shrink: 0;}
.rowe-site .hero-image{min-height: 68svh;}
.rowe-site .hero-image-caption{font-size: 7px;}
.rowe-site .ticker div{animation-duration: 24s;}
.rowe-site .manifesto, .rowe-site .section-heading, .rowe-site .quote-section, .rowe-site .service-body, .rowe-site .listing-intro, .rowe-site .article-body, .rowe-site .about-story, .rowe-site .listing-disclaimer, .rowe-site .legal-grid{display: block;}
.rowe-site .manifesto{padding-top: 75px; padding-bottom: 90px;}
.rowe-site .manifesto .section-label, .rowe-site .section-heading .section-label, .rowe-site .service-body > .section-label, .rowe-site .about-story > .section-label{margin-bottom: 42px; display: block;}
.rowe-site .manifesto-copy h2{font-size: 40px;}
.rowe-site .manifesto-lower{grid-template-columns: 1fr; margin-top: 45px;}
.rowe-site .featured-section{padding-top: 70px; padding-bottom: 90px;}
.rowe-site .section-heading h2{font-size: 52px;}
.rowe-site .property-stack{grid-template-columns: 1fr; gap: 40px;}
.rowe-site .property-card.featured .property-image-wrap, .rowe-site .property-image-wrap{aspect-ratio: 4/5;}
.rowe-site .property-meta{flex-direction: column;}
.rowe-site .property-price{text-align: left;}
.rowe-site .services-home{padding-top: 80px; padding-bottom: 80px;}
.rowe-site .service-row{grid-template-columns: 34px 1fr 18px; min-height: 95px;}
.rowe-site .service-row p{display: none;}
.rowe-site .service-row h3{font-size: 33px;}
.rowe-site .quote-section{padding-top: 95px; padding-bottom: 95px;}
.rowe-site .quote-mark{margin-bottom: 25px;}
.rowe-site .quote-section blockquote{font-size: 38px;}
.rowe-site .quote-credit{margin-top: 30px;}
.rowe-site .about-home{min-height: 0;}
.rowe-site .about-image{min-height: 62svh;}
.rowe-site .about-copy{padding-top: 80px; padding-bottom: 80px; min-height: 0;}
.rowe-site .about-copy h2{font-size: 47px;}
.rowe-site .stats{grid-template-columns: 1fr 1fr;}
.rowe-site .stats strong{font-size: 52px;}
.rowe-site .journal-home{padding-top: 80px; padding-bottom: 100px;}
.rowe-site .journal-grid{grid-template-columns: 1fr; gap: 55px;}
.rowe-site .footer{padding-top: 80px;}
.rowe-site .footer-main{grid-template-columns: 1fr; min-height: 0;}
.rowe-site .footer h2{font-size: 72px;}
.rowe-site .footer-contact{border-left: 0; border-top: 1px solid var(--soft-line); padding: 34px 0; margin-top: 55px;}
.rowe-site .footer-contact p{margin-top: 45px;}
.rowe-site .footer-grid{grid-template-columns: 1fr 1fr;}
.rowe-site .footer-tagline, .rowe-site .footer-newsletter{grid-column: 1 / -1;}
.rowe-site .footer-legal{flex-direction: column; gap: 6px;}
.rowe-site .page-hero{display: block; padding-top: 125px; min-height: 570px;}
.rowe-site .page-hero h1{font-size: 19vw; margin: 75px 0 45px;}
.rowe-site .services-index{grid-template-columns: 1fr; padding-top: 50px; padding-bottom: 80px;}
.rowe-site .service-index-card, .rowe-site .service-index-card:nth-child(even){border-left: 0; padding: 16px 0 55px;}
.rowe-site .service-card-top{margin-bottom: 32px;}
.rowe-site .service-card-copy h2{font-size: 43px;}
.rowe-site .editorial-cta{grid-template-columns: 1fr; padding-top: 75px; padding-bottom: 80px;}
.rowe-site .editorial-cta h2{font-size: 43px;}
.rowe-site .detail-hero, .rowe-site .about-hero{padding-top: 68px; min-height: 0;}
.rowe-site .detail-title{padding-top: 80px; padding-bottom: 65px;}
.rowe-site .detail-title h1, .rowe-site .about-hero h1{font-size: 18vw;}
.rowe-site .detail-title p{font-size: 16px;}
.rowe-site .detail-image, .rowe-site .about-hero-image{min-height: 58svh;}
.rowe-site .service-facts{grid-template-columns: 1fr 1fr; gap: 35px 15px;}
.rowe-site .service-facts p{font-size: 18px;}
.rowe-site .service-body{padding-top: 80px; padding-bottom: 90px;}
.rowe-site .body-copy > p{font-size: 28px;}
.rowe-site .body-copy blockquote{padding-left: 28px; font-size: 24px;}
.rowe-site .other-services h3{font-size: 30px;}
.rowe-site .properties-list{grid-template-columns: 1fr; padding-top: 50px; padding-bottom: 80px;}
.rowe-site .properties-list .property-card:first-child{grid-column: auto;}
.rowe-site .properties-list .property-card:first-child .property-image-wrap{aspect-ratio: 4/5;}
.rowe-site .offmarket-cta{grid-template-columns: 1fr; gap: 35px;}
.rowe-site .offmarket-cta h2{font-size: 46px;}
.rowe-site .listing-hero{min-height: 620px;}
.rowe-site .listing-overlay h1{font-size: 18vw;}
.rowe-site .listing-intro{padding-top: 75px; padding-bottom: 85px;}
.rowe-site .listing-specs{flex-direction: row; flex-wrap: wrap; gap: 15px; margin-bottom: 45px;}
.rowe-site .listing-intro h2{font-size: 42px;}
.rowe-site .listing-gallery{grid-template-columns: 1fr;}
.rowe-site .listing-gallery .wide{grid-column: auto; height: 62vh;}
.rowe-site .listing-gallery img{min-height: 56vh;}
.rowe-site .listing-details{min-height: 520px; padding: 28px;}
.rowe-site .listing-disclaimer span{display: block; margin-bottom: 12px;}
.rowe-site .journal-row{grid-template-columns: 1fr 25px; min-height: auto; padding: 26px 0 35px;}
.rowe-site .journal-row-image{width: 100%; opacity: 1; grid-column: 1 / -1; margin-bottom: 18px;}
.rowe-site .journal-row:hover .journal-row-image{width: 100%;}
.rowe-site .journal-row-meta{grid-column: 1; flex-direction: row; justify-content: space-between; margin-bottom: 23px;}
.rowe-site .journal-row-copy{grid-column: 1;}
.rowe-site .journal-row-copy h2{font-size: 40px;}
.rowe-site .journal-arrow{grid-column: 2; grid-row: 3;}
.rowe-site .article header{padding-top: 90px;}
.rowe-site .article header h1{font-size: 17vw;}
.rowe-site .article header > p{margin-left: 0; font-size: 16px;}
.rowe-site .article-image{height: 58vh; min-height: 440px;}
.rowe-site .article-body{padding-top: 75px; padding-bottom: 90px;}
.rowe-site .article-aside{margin-bottom: 45px;}
.rowe-site .article-copy > p:not(.article-note){font-size: 27px;}
.rowe-site .about-hero{display: block;}
.rowe-site .about-hero > div:first-child{padding-top: 90px; padding-bottom: 55px;}
.rowe-site .about-values{grid-template-columns: 1fr;}
.rowe-site .contact-page{padding-top: 120px;}
.rowe-site .contact-intro{min-height: 560px;}
.rowe-site .contact-intro h1{font-size: 18vw;}
.rowe-site .form-row{grid-template-columns: 1fr; gap: 18px;}
.rowe-site .legal-page{padding-top: 125px; padding-bottom: 90px;}
.rowe-site .legal-page h1{margin: 60px 0 75px; font-size: 18vw;}
.rowe-site .legal-grid aside{margin-bottom: 45px;}
}
`;
