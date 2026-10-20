/** Scoped Harbor template CSS - all selectors under .harbor-site */
export const HARBOR_CSS = `
.harbor-site{
  --ink:#171713;
  --paper:#f3f0e9;
  --paper-2:#e8e3d8;
  --white:#fcfbf7;
  --olive:#4e5446;
  --line:rgba(23,23,19,.18);
  --light-line:rgba(255,255,255,.2);
  --serif:Georgia,'Times New Roman',serif;
  --sans:Arial,Helvetica,sans-serif;
}
.harbor-site,.harbor-site *{box-sizing:border-box}
.harbor-site{scroll-behavior:smooth}
.harbor-site{min-height:100vh;display:flex;flex-direction:column;margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;scroll-behavior:smooth}
.harbor-site a{color:inherit;text-decoration:none}
.harbor-site button,.harbor-site input,.harbor-site textarea{font:inherit}
.harbor-site img{display:block;width:100%}
.harbor-site main{overflow:hidden;flex:1}
.harbor-site .shell{width:min(1320px,calc(100% - 72px));margin-inline:auto}
.harbor-site .section-pad{padding-top:120px;padding-bottom:120px}
.harbor-site .kicker{margin:0 0 22px;text-transform:uppercase;letter-spacing:.16em;font-size:11px;font-weight:700}
.harbor-site .kicker.light{color:rgba(255,255,255,.85)}
.harbor-site .kicker.muted{color:rgba(255,255,255,.55)}
.harbor-site h1,.harbor-site h2,.harbor-site h3,.harbor-site p{margin-top:0}
.harbor-site h1,.harbor-site h2,.harbor-site h3{font-family:var(--serif);font-weight:400;letter-spacing:-.035em;line-height:.98}
.harbor-site h1 em,.harbor-site h2 em{font-weight:400}
.harbor-site em{font-family:var(--serif);font-style:italic}
.harbor-site h1{font-size:clamp(60px,8vw,132px)}
.harbor-site h2{font-size:clamp(42px,5.2vw,82px)}
.harbor-site h3{font-size:30px}
.harbor-site p{max-width:68ch}
.harbor-site .lead{font-family:var(--serif);font-size:24px;line-height:1.45;letter-spacing:-.015em}
.harbor-site .button{display:inline-flex;align-items:center;justify-content:space-between;gap:44px;min-width:190px;padding:16px 18px;border:1px solid transparent;text-transform:uppercase;letter-spacing:.1em;font-size:11px;font-weight:700;transition:.25s ease}
.harbor-site .button span{font-size:15px}
.harbor-site .button-dark{background:var(--ink);color:white}
.harbor-site .button-dark:hover{background:var(--olive)}
.harbor-site .button-light{background:var(--white);color:var(--ink)}
.harbor-site .button-light:hover{background:#dcd7cd}
.harbor-site .button-ghost{border-color:rgba(255,255,255,.55);color:white}
.harbor-site .button-ghost:hover{background:rgba(255,255,255,.1)}
.harbor-site .text-link{display:inline-flex;align-items:center;gap:12px;border-bottom:1px solid currentColor;padding-bottom:5px;font-size:13px;font-weight:700}
.harbor-site .light-link{color:white}
.harbor-site .dark-panel{background:var(--ink);color:var(--white)}
/* Header */
.harbor-site .site-header{height:92px;padding:0 36px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;background:var(--paper);position:relative;z-index:40;border-bottom:1px solid var(--line)}
.harbor-site .brand{display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:11px;width:max-content;align-items:center}
.harbor-site .brand-mark{grid-row:1/3;width:39px;height:39px;border:1px solid currentColor;border-radius:50%;display:grid;place-items:center;font-family:var(--serif);font-size:14px;font-style:italic}
.harbor-site .brand-name{font-family:var(--serif);font-size:18px;line-height:1}
.harbor-site .brand-sub{font-size:8px;letter-spacing:.19em;margin-top:5px}
.harbor-site .brand-light{color:white}
.harbor-site .desktop-nav{display:flex;gap:28px;font-size:12px;font-weight:700}
.harbor-site .desktop-nav a{position:relative}
.harbor-site .desktop-nav a:after{content:'';position:absolute;left:0;right:100%;bottom:-7px;height:1px;background:currentColor;transition:.2s}
.harbor-site .desktop-nav a:hover:after{right:0}
.harbor-site .header-actions{justify-self:end;display:flex;align-items:center;gap:28px}
.harbor-site .menu-button,.harbor-site .menu-close{border:0;background:none;cursor:pointer;text-transform:uppercase;letter-spacing:.12em;font-size:10px;font-weight:700}
.harbor-site .menu-button{border:1px solid var(--ink);padding:12px 15px}
.harbor-site .menu-panel{position:fixed;inset:0;background:#1c211d;color:white;z-index:100;padding:28px 40px 50px;transform:translateY(-102%);transition:transform .55s cubic-bezier(.75,0,.2,1);overflow:auto}
.harbor-site .menu-panel.is-open{transform:translateY(0)}
.harbor-site .menu-top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--light-line);padding-bottom:26px}
.harbor-site .menu-close{color:white;border:1px solid var(--light-line);padding:12px 15px}
.harbor-site .menu-grid{display:grid;grid-template-columns:1.4fr .6fr;gap:90px;min-height:calc(100vh - 140px);padding-top:42px}
.harbor-site .menu-primary a{display:grid;grid-template-columns:48px 1fr auto;align-items:baseline;border-bottom:1px solid var(--light-line);padding:14px 0;font-family:var(--serif);font-size:clamp(38px,5.5vw,76px);line-height:1}
.harbor-site .menu-primary a span{font-family:var(--sans);font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.4)}
.harbor-site .menu-primary a b{font-family:var(--sans);font-size:17px;font-weight:400}
.harbor-site .menu-secondary{align-self:end;padding-bottom:30px}
.harbor-site .menu-secondary>a{display:block;padding:12px 0;border-bottom:1px solid var(--light-line);font-family:var(--serif);font-size:20px}
.harbor-site .menu-contact{display:flex;flex-direction:column;margin-top:36px;font-size:12px;gap:5px}
/* Home */
.harbor-site .home-hero{height:calc(100svh - 92px);min-height:680px;position:relative;color:white;display:flex;align-items:flex-end}
.harbor-site .hero-photo,.harbor-site .hero-overlay{position:absolute;inset:0}
.harbor-site .hero-photo img{height:100%;object-fit:cover}
.harbor-site .hero-overlay{background:linear-gradient(90deg,rgba(8,10,8,.72) 0%,rgba(8,10,8,.3) 55%,rgba(8,10,8,.12) 100%),linear-gradient(0deg,rgba(0,0,0,.34),transparent 50%)}
.harbor-site .hero-copy{position:relative;z-index:2;padding-bottom:72px}
.harbor-site .hero-copy h1{max-width:1000px;margin-bottom:28px;font-size:clamp(64px,9vw,142px)}
.harbor-site .hero-copy>p:not(.kicker){font-family:var(--serif);font-size:21px;line-height:1.4;max-width:600px}
.harbor-site .hero-actions{display:flex;gap:10px;margin-top:34px}
.harbor-site .hero-side-note{position:absolute;right:36px;bottom:45px;z-index:2;border-left:1px solid rgba(255,255,255,.45);padding-left:18px}
.harbor-site .hero-side-note span{font-size:10px;letter-spacing:.12em;color:rgba(255,255,255,.55)}
.harbor-site .hero-side-note p{font-family:var(--serif);font-size:18px;line-height:1.25;margin:11px 0 0}
.harbor-site .intro{display:grid;grid-template-columns:.55fr 1.45fr;gap:10vw;align-items:start}
.harbor-site .intro-number{font-family:var(--serif);font-size:130px;line-height:.7;display:grid;grid-template-columns:auto auto;width:max-content}
.harbor-site .intro-number span{font-size:32px;margin-left:8px}
.harbor-site .intro-number small{grid-column:1/3;font-family:var(--sans);font-size:10px;text-transform:uppercase;letter-spacing:.14em;line-height:1.4;width:120px;margin-top:25px}
.harbor-site .intro-copy h2{font-size:clamp(48px,5vw,76px);max-width:900px}
.harbor-site .intro-copy>p{font-size:18px;margin-top:30px;margin-bottom:28px;max-width:750px}
.harbor-site .feature-split{display:grid;grid-template-columns:1.15fr .85fr;min-height:760px}
.harbor-site .feature-split.reverse{grid-template-columns:.85fr 1.15fr}
.harbor-site .feature-split.reverse .feature-image{order:2}
.harbor-site .feature-split.reverse .feature-copy{order:1}
.harbor-site .feature-image img{height:100%;object-fit:cover}
.harbor-site .feature-copy{padding:9vw 7vw;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
.harbor-site .feature-copy h2{font-size:clamp(48px,5.7vw,84px);max-width:720px}
.harbor-site .feature-copy>p:not(.kicker){font-size:17px;color:rgba(255,255,255,.72);max-width:600px;margin:24px 0 32px}
.harbor-site .feature-copy .text-link{margin-top:22px}
.harbor-site .section-head{margin-bottom:60px}
.harbor-site .section-head h2{margin:0;max-width:840px}
.harbor-site .section-head.split{display:grid;grid-template-columns:1.25fr .75fr;gap:60px;align-items:end}
.harbor-site .section-head.split>p,.harbor-site .section-head.split>a{justify-self:end}
.harbor-site .section-head.split>p{font-family:var(--serif);font-size:20px;line-height:1.45;max-width:480px;margin:0}
.harbor-site .listing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:54px 22px}
.harbor-site .home-grid{grid-template-columns:repeat(2,1fr)}
.harbor-site .listing-card.large{grid-column:span 2}
.harbor-site .listing-image-wrap{position:relative;overflow:hidden;background:#ddd}
.harbor-site .listing-card.large .listing-image-wrap{aspect-ratio:16/8}
.harbor-site .listing-card:not(.large) .listing-image-wrap{aspect-ratio:4/3}
.harbor-site .listing-image{height:100%;object-fit:cover;transition:transform .6s ease}
.harbor-site .listing-card:hover .listing-image{transform:scale(1.025)}
.harbor-site .status-pill{position:absolute;left:15px;top:15px;background:rgba(248,246,240,.9);padding:7px 10px;font-size:9px;text-transform:uppercase;letter-spacing:.12em;font-weight:700}
.harbor-site .image-arrow{position:absolute;right:15px;bottom:15px;background:var(--ink);color:white;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;transition:.2s}
.harbor-site .listing-card:hover .image-arrow{transform:rotate(45deg)}
.harbor-site .listing-meta{display:flex;justify-content:space-between;gap:25px;padding-top:17px}
.harbor-site .listing-meta .kicker{margin-bottom:6px}
.harbor-site .listing-meta h3{font-size:25px;margin:0}
.harbor-site .listing-price{text-align:right;display:flex;flex-direction:column;white-space:nowrap;font-family:var(--serif)}
.harbor-site .listing-price strong{font-size:19px;font-weight:400}
.harbor-site .listing-price span{font-family:var(--sans);font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin-top:6px}
.harbor-site .testimonials{background:var(--paper-2)}
.harbor-site .testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.harbor-site .testimonial-card{min-height:390px;padding:38px 32px;position:relative;border-right:1px solid var(--line);display:flex;flex-direction:column}
.harbor-site .testimonial-card:last-child{border-right:0}
.harbor-site .quote-mark{font-family:var(--serif);font-size:52px;line-height:1;color:var(--olive)}
.harbor-site .testimonial-card>p{font-family:var(--serif);font-size:25px;line-height:1.35;margin-top:18px}
.harbor-site .testimonial-card>div{margin-top:auto;display:flex;flex-direction:column}
.harbor-site .testimonial-card strong{font-size:12px}
.harbor-site .testimonial-card div span{font-size:10px;text-transform:uppercase;letter-spacing:.1em;margin-top:3px}
.harbor-site .testimonial-card small{position:absolute;right:28px;bottom:32px;color:#8e8a80}
.harbor-site .buy-section{display:grid;grid-template-columns:.85fr 1.15fr;gap:8vw;align-items:center}
.harbor-site .buy-copy h2{max-width:650px}
.harbor-site .buy-copy>p{font-size:18px;max-width:560px;margin:28px 0}
.harbor-site .buy-image-stack{position:relative;padding-bottom:80px}
.harbor-site .buy-main{width:83%;margin-left:auto;aspect-ratio:4/5;object-fit:cover}
.harbor-site .buy-small{position:absolute;left:0;bottom:0;width:42%;aspect-ratio:4/3;object-fit:cover;border:12px solid var(--paper)}
.harbor-site .neighbourhood-section .section-head{color:white}
.harbor-site .neighbourhood-list{border-top:1px solid var(--light-line)}
.harbor-site .neighbourhood-list a{display:grid;grid-template-columns:80px 1fr auto;align-items:center;padding:23px 0;border-bottom:1px solid var(--light-line);transition:.2s}
.harbor-site .neighbourhood-list a:hover{padding-left:12px}
.harbor-site .neighbourhood-list span{font-size:9px;color:rgba(255,255,255,.4)}
.harbor-site .neighbourhood-list strong{font-family:var(--serif);font-size:36px;font-weight:400}
.harbor-site .neighbourhood-list b{font-weight:400}
.harbor-site .post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.harbor-site .post-card img{aspect-ratio:4/3;object-fit:cover;margin-bottom:22px}
.harbor-site .post-card .kicker{margin-bottom:10px}
.harbor-site .post-card h3{font-size:31px;margin-bottom:14px}
.harbor-site .post-card>p:not(.kicker){font-size:14px;color:#555149}
.harbor-site .post-card .text-link{margin-top:8px;font-size:11px}
/* Generic pages */
.harbor-site .page-hero{display:grid;grid-template-columns:.9fr 1.1fr;min-height:760px;border-bottom:1px solid var(--line)}
.harbor-site .page-hero-copy{padding:110px max(40px,7vw) 90px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
.harbor-site .page-hero-copy h1{font-size:clamp(58px,6.8vw,105px);margin-bottom:28px}
.harbor-site .page-hero-copy .lead{max-width:650px}
.harbor-site .page-hero-copy .button{margin-top:28px}
.harbor-site .page-hero-image img{height:100%;object-fit:cover}
.harbor-site .two-col-copy{display:grid;grid-template-columns:.9fr 1.1fr;gap:10vw}
.harbor-site .two-col-copy h2{font-size:clamp(46px,5vw,76px)}
.harbor-site .two-col-copy>div:last-child{padding-top:55px}
.harbor-site .two-col-copy>div:last-child p{font-size:18px;max-width:690px}
.harbor-site .two-col-copy .text-link{margin-top:18px}
.harbor-site .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--light-line);border-bottom:1px solid var(--light-line)}
.harbor-site .stats-grid>div{padding:52px 30px;border-right:1px solid var(--light-line);display:flex;flex-direction:column}
.harbor-site .stats-grid>div:last-child{border-right:0}
.harbor-site .stats-grid strong{font-family:var(--serif);font-size:62px;font-weight:400}
.harbor-site .stats-grid span{font-size:10px;text-transform:uppercase;letter-spacing:.11em;color:rgba(255,255,255,.52);max-width:170px}
.harbor-site .image-text{display:grid;grid-template-columns:1.1fr .9fr;gap:9vw;align-items:center}
.harbor-site .image-text img{aspect-ratio:4/5;object-fit:cover}
.harbor-site .image-text>div p:not(.kicker){font-size:18px}
.harbor-site .image-text .button{margin-top:20px}
.harbor-site .process .section-head{margin-bottom:40px}
.harbor-site .process-list{border-top:1px solid var(--line)}
.harbor-site .process-list article{display:grid;grid-template-columns:90px .7fr 1.3fr;align-items:start;gap:25px;border-bottom:1px solid var(--line);padding:32px 0}
.harbor-site .process-list article>span{font-size:10px;color:#77736b}
.harbor-site .process-list h3{font-size:40px;margin:0}
.harbor-site .process-list p{margin:6px 0 0;max-width:650px;color:#57534c}
.harbor-site .soft-cta{border-top:1px solid var(--line);display:grid;grid-template-columns:1.1fr .9fr;gap:10vw;align-items:center}
.harbor-site .soft-cta h2{font-size:clamp(45px,5vw,74px);margin:0}
.harbor-site .soft-cta>div:last-child>p{font-size:18px;margin-bottom:28px}
.harbor-site .visual-grid{display:grid;grid-template-columns:1.3fr .7fr;grid-template-rows:430px 430px;gap:12px;padding-left:12px;padding-right:12px}
.harbor-site .visual-grid img{height:100%;object-fit:cover}
.harbor-site .visual-grid .wide{grid-row:1/3}
.harbor-site .visual-quote{padding:55px;display:flex;flex-direction:column;justify-content:center}
.harbor-site .visual-quote>span{font-size:9px;text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.5)}
.harbor-site .visual-quote h2{font-size:48px;margin:25px 0}
.harbor-site .visual-quote p{color:rgba(255,255,255,.68)}
.harbor-site .archive-hero{padding-top:120px;padding-bottom:70px}
.harbor-site .archive-hero h1{font-size:clamp(62px,8vw,118px);max-width:1100px;margin-bottom:25px}
.harbor-site .archive-hero>p:last-child{font-family:var(--serif);font-size:21px;max-width:650px}
.harbor-site .listing-archive{padding-top:20px}
.harbor-site .filter-row{display:flex;gap:8px;margin-bottom:45px}
.harbor-site .filter-row button{border:1px solid var(--line);background:transparent;padding:10px 14px;cursor:pointer;text-transform:uppercase;letter-spacing:.08em;font-size:9px}
.harbor-site .filter-row button.active{background:var(--ink);color:white}
.harbor-site .review-wall{display:grid;grid-template-columns:1fr 1fr;padding-top:20px}
.harbor-site .review-wall article{min-height:410px;border-top:1px solid var(--line);padding:35px 40px 35px 0;display:flex;flex-direction:column}
.harbor-site .review-wall article:nth-child(even){border-left:1px solid var(--line);padding-left:40px;padding-right:0}
.harbor-site .review-wall article>span{font-size:9px;color:#7c786f}
.harbor-site .review-wall blockquote{font-family:var(--serif);font-size:30px;line-height:1.35;margin:40px 0}
.harbor-site .review-wall article>div{margin-top:auto;display:flex;flex-direction:column}
.harbor-site .review-wall small{text-transform:uppercase;letter-spacing:.1em;font-size:9px}
.harbor-site .journal-list{padding-top:20px}
.harbor-site .journal-row{display:grid;grid-template-columns:55px 240px 1fr 30px;gap:28px;align-items:center;border-top:1px solid var(--line);padding:28px 0}
.harbor-site .journal-row:last-child{border-bottom:1px solid var(--line)}
.harbor-site .journal-row>span{font-size:9px;color:#88847c}
.harbor-site .journal-row img{height:150px;object-fit:cover}
.harbor-site .journal-row .kicker{margin-bottom:8px}
.harbor-site .journal-row h2{font-size:43px;margin-bottom:10px}
.harbor-site .journal-row p:last-child{font-size:13px;color:#5f5b53;margin-bottom:0}
.harbor-site .journal-row b{font-weight:400}
.harbor-site .building-list{padding-top:80px}
.harbor-site .building-list>a{display:grid;grid-template-columns:55px 1fr .8fr 1fr 30px;align-items:center;border-top:1px solid var(--line);padding:23px 0;gap:18px}
.harbor-site .building-list>a:last-child{border-bottom:1px solid var(--line)}
.harbor-site .building-list>a>span{font-size:9px;color:#88847c}
.harbor-site .building-list>a>strong{font-family:var(--serif);font-size:30px;font-weight:400}
.harbor-site .building-list>a>em{font-family:var(--sans);font-size:11px;text-transform:uppercase;letter-spacing:.1em;font-style:normal}
.harbor-site .building-list>a>small{font-size:12px;color:#666158}
.harbor-site .building-list>a>b{font-weight:400}
.harbor-site .lead-page{min-height:calc(100svh - 92px);display:grid;grid-template-columns:1fr 1fr}
.harbor-site .lead-page-image img{height:100%;object-fit:cover}
.harbor-site .lead-page-copy{padding:8vw;display:flex;flex-direction:column;justify-content:center}
.harbor-site .lead-page-copy h1{font-size:clamp(58px,6.8vw,100px);margin-bottom:28px}
.harbor-site .lead-page-copy>p{font-family:var(--serif);font-size:20px}
.harbor-site .lead-page-copy>small{font-size:10px;color:#777269;margin-top:18px;max-width:620px}
.harbor-site .lead-form{display:grid;grid-template-columns:1fr 1fr;gap:18px 14px;margin-top:36px}
.harbor-site .lead-form label{display:flex;flex-direction:column;gap:7px}
.harbor-site .lead-form label.full{grid-column:1/3}
.harbor-site .lead-form label span{font-size:9px;text-transform:uppercase;letter-spacing:.12em;font-weight:700}
.harbor-site .lead-form input,.harbor-site .lead-form textarea{border:0;border-bottom:1px solid var(--line);background:transparent;padding:10px 0 12px;outline:none;resize:none}
.harbor-site .lead-form input:focus,.harbor-site .lead-form textarea:focus{border-color:var(--ink)}
.harbor-site .lead-form .button{margin-top:6px}
.harbor-site .form-success{margin-top:30px;border-top:1px solid currentColor;border-bottom:1px solid currentColor;padding:22px 0;font-family:var(--serif);font-size:20px}
.harbor-site .reverse-lead .lead-page-image{order:2}
.harbor-site .reverse-lead .lead-page-copy{order:1}
.harbor-site .contact-page{min-height:calc(100svh - 92px);display:grid;grid-template-columns:1fr 1fr;gap:10vw;align-items:center;padding-top:90px;padding-bottom:90px}
.harbor-site .contact-copy h1{font-size:clamp(62px,7vw,108px)}
.harbor-site .contact-copy>p{font-family:var(--serif);font-size:21px}
.harbor-site .contact-details{display:flex;flex-direction:column;margin-top:40px;border-top:1px solid var(--line)}
.harbor-site .contact-details>*{padding:12px 0;border-bottom:1px solid var(--line);font-size:13px}
.harbor-site .contact-form-wrap{background:var(--paper-2);padding:55px}
.harbor-site .contact-form-wrap .lead-form{margin-top:0}
.harbor-site .property-hero{height:calc(100svh - 92px);min-height:700px;position:relative;color:white}
.harbor-site .property-hero>img{height:100%;object-fit:cover}
.harbor-site .property-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.62),transparent 65%)}
.harbor-site .property-title{position:absolute;left:50%;transform:translateX(-50%);bottom:55px}
.harbor-site .property-title h1{font-size:clamp(56px,7vw,110px);max-width:1050px;margin-bottom:26px}
.harbor-site .property-title>div{display:flex;gap:25px;align-items:baseline}
.harbor-site .property-title strong{font-family:var(--serif);font-size:28px;font-weight:400}
.harbor-site .property-title span{font-size:10px;text-transform:uppercase;letter-spacing:.1em}
.harbor-site .property-intro{display:grid;grid-template-columns:1fr 1fr;gap:10vw}
.harbor-site .property-intro h2{font-size:clamp(48px,5vw,78px)}
.harbor-site .property-intro>div:last-child p{font-size:18px}
.harbor-site .property-intro .button{margin-top:20px}
.harbor-site .property-gallery{display:grid;grid-template-columns:1.25fr .75fr;grid-template-rows:420px 420px;gap:10px;padding:10px}
.harbor-site .property-gallery img{height:100%;object-fit:cover}
.harbor-site .property-gallery img:first-child{grid-row:1/3}
.harbor-site .property-facts{display:grid;grid-template-columns:repeat(4,1fr)}
.harbor-site .property-facts>div{border-top:1px solid var(--line);border-bottom:1px solid var(--line);border-right:1px solid var(--line);padding:30px}
.harbor-site .property-facts>div:last-child{border-right:0}
.harbor-site .property-facts span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px}
.harbor-site .property-facts strong{font-family:var(--serif);font-size:24px;font-weight:400}
.harbor-site .article-header{padding-top:110px;padding-bottom:70px;text-align:center}
.harbor-site .article-header h1{font-size:clamp(58px,7vw,105px);max-width:1100px;margin:0 auto 25px}
.harbor-site .article-header>p:last-child{font-family:var(--serif);font-size:22px;max-width:760px;margin-inline:auto}
.harbor-site .article-image{width:min(1450px,calc(100% - 24px));margin:0 auto}
.harbor-site .article-image img{height:min(70vh,780px);object-fit:cover}
.harbor-site .article-body{width:min(760px,calc(100% - 48px));margin:80px auto 120px}
.harbor-site .article-body p{font-size:18px;line-height:1.8}
.harbor-site .article-body .dropcap:first-letter{font-family:var(--serif);font-size:78px;float:left;line-height:.75;padding:10px 10px 0 0}
.harbor-site .article-body h2{font-size:46px;margin-top:55px;margin-bottom:20px}
.harbor-site .article-body blockquote{font-family:var(--serif);font-size:35px;font-style:italic;border-left:1px solid var(--ink);margin:50px 0;padding-left:28px}
.harbor-site .article-cta{border-top:1px solid var(--line);margin-top:60px;padding-top:35px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.harbor-site .article-cta h3{font-size:29px;margin:0}
.harbor-site .not-found{min-height:70vh;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
.harbor-site .not-found h1{font-size:clamp(70px,9vw,130px);max-width:900px;margin-bottom:20px}
.harbor-site .not-found .button{margin-top:25px}
/* Footer */
.harbor-site .footer{background:#11130f;color:white}
.harbor-site .footer-cta{padding-top:95px;padding-bottom:80px;display:grid;grid-template-columns:.9fr 1.1fr;gap:8vw;border-bottom:1px solid var(--light-line)}
.harbor-site .footer-cta h2{font-size:clamp(50px,5.4vw,82px);margin:0}
.harbor-site .footer .lead-form{margin-top:0}
.harbor-site .footer .lead-form input,.harbor-site .footer .lead-form textarea{border-color:var(--light-line);color:white}
.harbor-site .footer .lead-form input::placeholder,.harbor-site .footer .lead-form textarea::placeholder{color:rgba(255,255,255,.4)}
.harbor-site .footer .compact{grid-template-columns:1fr 1fr}
.harbor-site .footer .compact label:last-of-type{grid-column:1/3}
.harbor-site .footer-bottom{padding:65px 0;display:grid;grid-template-columns:.7fr 1.3fr;gap:8vw}
.harbor-site .footer-identity{display:flex;gap:18px;align-items:flex-start}
.harbor-site .monogram{width:64px;height:64px;border:1px solid rgba(255,255,255,.5);border-radius:50%;display:grid;place-items:center;font-family:var(--serif);font-style:italic}
.harbor-site .footer-identity>div:last-child{display:flex;flex-direction:column}
.harbor-site .footer-identity strong{font-family:var(--serif);font-size:26px;font-weight:400}
.harbor-site .footer-identity span{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.5)}
.harbor-site .footer-links{display:grid;grid-template-columns:repeat(3,1fr);gap:35px}
.harbor-site .footer-links>div{display:flex;flex-direction:column}
.harbor-site .footer-links span{font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.45);margin-bottom:12px}
.harbor-site .footer-links a{font-family:var(--serif);font-size:17px;margin:2px 0}
.harbor-site .legal{border-top:1px solid var(--light-line);padding:20px 0 24px;display:flex;justify-content:space-between;gap:25px;color:rgba(255,255,255,.4);font-size:9px;text-transform:uppercase;letter-spacing:.08em}
@media(max-width:980px){
.harbor-site .shell{width:min(100% - 40px,1320px)}
.harbor-site .section-pad{padding-top:85px;padding-bottom:85px}
.harbor-site .site-header{padding:0 20px;grid-template-columns:1fr auto}
.harbor-site .desktop-nav,.harbor-site .desktop-contact{display:none}
.harbor-site .hero-side-note{display:none}
.harbor-site .home-hero{min-height:640px}
.harbor-site .hero-copy{padding-bottom:45px}
.harbor-site .hero-copy h1{font-size:clamp(57px,11vw,105px)}
.harbor-site .intro{grid-template-columns:1fr;gap:65px}
.harbor-site .intro-number{font-size:105px}
.harbor-site .feature-split,.harbor-site .feature-split.reverse{grid-template-columns:1fr;min-height:0}
.harbor-site .feature-split .feature-image,.harbor-site .feature-split.reverse .feature-image{order:1;min-height:520px}
.harbor-site .feature-split .feature-copy,.harbor-site .feature-split.reverse .feature-copy{order:2;padding:80px 40px}
.harbor-site .section-head.split{grid-template-columns:1fr;gap:28px}
.harbor-site .section-head.split>p,.harbor-site .section-head.split>a{justify-self:start}
.harbor-site .listing-grid{grid-template-columns:1fr 1fr}
.harbor-site .testimonial-grid{grid-template-columns:1fr}
.harbor-site .testimonial-card{border-right:0;border-bottom:1px solid var(--line);min-height:330px}
.harbor-site .testimonial-card:last-child{border-bottom:0}
.harbor-site .buy-section{grid-template-columns:1fr;gap:60px}
.harbor-site .buy-copy{max-width:750px}
.harbor-site .post-grid{grid-template-columns:1fr 1fr}
.harbor-site .post-card:last-child{display:none}
.harbor-site .page-hero{grid-template-columns:1fr;min-height:0}
.harbor-site .page-hero-copy{padding:90px 40px}
.harbor-site .page-hero-image{height:620px}
.harbor-site .two-col-copy,.harbor-site .image-text,.harbor-site .soft-cta{grid-template-columns:1fr;gap:55px}
.harbor-site .two-col-copy>div:last-child{padding-top:0}
.harbor-site .stats-grid{grid-template-columns:1fr 1fr}
.harbor-site .stats-grid>div:nth-child(2){border-right:0}
.harbor-site .stats-grid>div:nth-child(-n+2){border-bottom:1px solid var(--light-line)}
.harbor-site .image-text img{max-height:700px}
.harbor-site .process-list article{grid-template-columns:65px .75fr 1.25fr}
.harbor-site .visual-grid{grid-template-columns:1fr 1fr;grid-template-rows:520px 390px}
.harbor-site .visual-grid .wide{grid-row:auto;grid-column:1/3}
.harbor-site .review-wall{grid-template-columns:1fr}
.harbor-site .review-wall article:nth-child(even){border-left:0;padding-left:0;padding-right:40px}
.harbor-site .journal-row{grid-template-columns:40px 180px 1fr 20px}
.harbor-site .building-list>a{grid-template-columns:40px 1fr .8fr 30px}
.harbor-site .building-list>a>small{display:none}
.harbor-site .lead-page{grid-template-columns:1fr}
.harbor-site .lead-page-image{height:560px}
.harbor-site .reverse-lead .lead-page-image{order:1}
.harbor-site .reverse-lead .lead-page-copy{order:2}
.harbor-site .contact-page{grid-template-columns:1fr;gap:55px}
.harbor-site .property-intro{grid-template-columns:1fr;gap:35px}
.harbor-site .property-gallery{grid-template-rows:330px 330px}
.harbor-site .property-facts{grid-template-columns:1fr 1fr}
.harbor-site .property-facts>div:nth-child(2){border-right:0}
.harbor-site .property-facts>div:nth-child(-n+2){border-bottom:0}
.harbor-site .footer-cta,.harbor-site .footer-bottom{grid-template-columns:1fr;gap:50px}
.harbor-site .footer-links{max-width:680px}
.harbor-site .menu-grid{grid-template-columns:1fr}
.harbor-site .menu-secondary{display:none}
}
@media(max-width:640px){
.harbor-site .shell{width:calc(100% - 28px)}
.harbor-site .section-pad{padding-top:68px;padding-bottom:68px}
.harbor-site .site-header{height:78px;padding:0 14px}
.harbor-site .brand-mark{width:34px;height:34px}
.harbor-site .brand-name{font-size:16px}
.harbor-site .menu-panel{padding:20px 18px}
.harbor-site .menu-primary a{grid-template-columns:32px 1fr auto;font-size:42px;padding:15px 0}
.harbor-site .home-hero{height:calc(100svh - 78px);min-height:650px}
.harbor-site .hero-copy{padding-bottom:32px}
.harbor-site .hero-copy h1{font-size:56px}
.harbor-site .hero-copy>p:not(.kicker){font-size:18px}
.harbor-site .hero-actions{flex-direction:column;align-items:flex-start}
.harbor-site .button{min-width:185px}
.harbor-site .intro-number{font-size:90px}
.harbor-site .intro-copy h2{font-size:46px}
.harbor-site .feature-split .feature-image,.harbor-site .feature-split.reverse .feature-image{min-height:420px}
.harbor-site .feature-split .feature-copy,.harbor-site .feature-split.reverse .feature-copy{padding:65px 22px}
.harbor-site .feature-copy h2{font-size:48px}
.harbor-site .section-head{margin-bottom:38px}
.harbor-site .section-head h2{font-size:46px}
.harbor-site .listing-grid,.harbor-site .home-grid{grid-template-columns:1fr}
.harbor-site .listing-card.large{grid-column:auto}
.harbor-site .listing-card.large .listing-image-wrap,.harbor-site .listing-card:not(.large) .listing-image-wrap{aspect-ratio:4/3}
.harbor-site .listing-meta{flex-direction:column;gap:10px}
.harbor-site .listing-price{text-align:left}
.harbor-site .testimonial-card{padding:30px 18px}
.harbor-site .testimonial-card>p{font-size:23px}
.harbor-site .buy-main{width:90%}
.harbor-site .buy-small{width:52%;border-width:8px}
.harbor-site .neighbourhood-list a{grid-template-columns:42px 1fr auto}
.harbor-site .neighbourhood-list strong{font-size:29px}
.harbor-site .post-grid{grid-template-columns:1fr}
.harbor-site .post-card:last-child{display:block}
.harbor-site .page-hero-copy{padding:70px 20px}
.harbor-site .page-hero-copy h1{font-size:53px}
.harbor-site .page-hero-image{height:470px}
.harbor-site .two-col-copy h2,.harbor-site .image-text h2{font-size:45px}
.harbor-site .stats-grid{grid-template-columns:1fr}
.harbor-site .stats-grid>div{border-right:0!important;border-bottom:1px solid var(--light-line)!important}
.harbor-site .stats-grid>div:last-child{border-bottom:0!important}
.harbor-site .process-list article{grid-template-columns:42px 1fr;gap:14px}
.harbor-site .process-list article p{grid-column:2}
.harbor-site .process-list h3{font-size:34px}
.harbor-site .soft-cta h2{font-size:44px}
.harbor-site .visual-grid{grid-template-columns:1fr;grid-template-rows:380px 320px 380px;padding:7px;gap:7px}
.harbor-site .visual-grid .wide{grid-column:auto}
.harbor-site .visual-quote{padding:30px}
.harbor-site .visual-quote h2{font-size:40px}
.harbor-site .archive-hero{padding-top:80px}
.harbor-site .archive-hero h1{font-size:58px}
.harbor-site .filter-row{overflow-x:auto}
.harbor-site .journal-row{grid-template-columns:30px 1fr 20px;gap:14px}
.harbor-site .journal-row img{grid-column:2;height:200px}
.harbor-site .journal-row>div{grid-column:2}
.harbor-site .journal-row b{grid-column:3;grid-row:1/4}
.harbor-site .journal-row h2{font-size:35px}
.harbor-site .building-list>a{grid-template-columns:30px 1fr 20px;gap:10px}
.harbor-site .building-list>a>em{grid-column:2}
.harbor-site .building-list>a>b{grid-column:3;grid-row:1/3}
.harbor-site .lead-page-image{height:420px}
.harbor-site .lead-page-copy{padding:65px 20px}
.harbor-site .lead-page-copy h1{font-size:52px}
.harbor-site .lead-form,.harbor-site .footer .compact{grid-template-columns:1fr}
.harbor-site .lead-form label.full,.harbor-site .footer .compact label:last-of-type{grid-column:auto}
.harbor-site .contact-page{padding-top:65px;padding-bottom:65px}
.harbor-site .contact-copy h1{font-size:55px}
.harbor-site .contact-form-wrap{padding:35px 20px;margin-inline:-4px}
.harbor-site .property-hero{height:72svh;min-height:560px}
.harbor-site .property-title{bottom:35px}
.harbor-site .property-title h1{font-size:52px}
.harbor-site .property-title>div{flex-direction:column;gap:5px}
.harbor-site .property-gallery{display:block;padding:7px}
.harbor-site .property-gallery img{height:350px;margin-bottom:7px}
.harbor-site .property-facts{grid-template-columns:1fr}
.harbor-site .property-facts>div{border-right:0;border-bottom:0}
.harbor-site .property-facts>div:last-child{border-bottom:1px solid var(--line)}
.harbor-site .article-header{padding-top:80px}
.harbor-site .article-header h1{font-size:54px}
.harbor-site .article-image img{height:420px}
.harbor-site .article-body{margin-top:55px}
.harbor-site .article-body h2{font-size:39px}
.harbor-site .article-body blockquote{font-size:29px}
.harbor-site .article-cta{align-items:flex-start;flex-direction:column}
.harbor-site .footer-cta{padding-top:70px}
.harbor-site .footer-cta h2{font-size:46px}
.harbor-site .footer-links{grid-template-columns:1fr 1fr;gap:35px}
.harbor-site .footer-links>div:first-child{grid-column:1/3}
.harbor-site .legal{flex-direction:column;gap:7px}
.harbor-site .review-wall article{padding-right:0}
.harbor-site .review-wall article:nth-child(even){padding-right:0}
.harbor-site .review-wall blockquote{font-size:26px}
}
.harbor-site .legal-page{padding-top:120px;padding-bottom:140px;display:grid;grid-template-columns:.7fr 1.3fr;gap:9vw}
.harbor-site .legal-page h1{font-size:clamp(58px,7vw,100px)}
.harbor-site .legal-page>div{padding-top:60px}
.harbor-site .legal-page h2{font-size:34px;margin:42px 0 14px}
.harbor-site .legal-page h2:first-child{margin-top:0}
.harbor-site .legal-page p{font-size:17px}
@media(max-width:760px){
.harbor-site .legal-page{grid-template-columns:1fr;gap:10px;padding-top:80px}
.harbor-site .legal-page>div{padding-top:20px}
}
`;
