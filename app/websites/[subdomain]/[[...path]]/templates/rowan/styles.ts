/** Scoped Rowan template CSS — all selectors under .rowan-site */
export const ROWAN_CSS = `

.rowan-site {
  --ink: #171a18;
  --paper: #f1efe7;
  --paper-2: #e9e5da;
  --forest: #173f32;
  --forest-2: #0d2e25;
  --accent: #c8d76c;
  --accent-warm: #c67b5c;
  --line: rgba(23, 26, 24, 0.2);
  --line-light: rgba(255, 255, 255, 0.24);
  --muted: #666a64;
  --white: #fffdf8;
  --shell: min(1360px, calc(100vw - 56px));
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}
.rowan-site *, .rowan-site *::before, .rowan-site *::after { box-sizing: border-box; }
.rowan-site ::selection { background: var(--accent); color: var(--ink); }
.rowan-site a { color: inherit; text-decoration: none; }
.rowan-site img { display: block; width: 100%; }
.rowan-site button,
.rowan-site input,
.rowan-site select,
.rowan-site textarea {
  font: inherit;
  font-family: Arial, Helvetica, sans-serif;
}
.rowan-site button { color: inherit; }
.rowan-site main { flex: 1; }





















.rowan-site .shell{
  width: var(--shell);
  margin-inline: auto;
}

.rowan-site .section-pad{
  padding-block: clamp(90px, 10vw, 170px);
}

.rowan-site .eyebrow{
  margin: 0 0 18px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
  line-height: 1.2;
  text-transform: uppercase;
}

.rowan-site .eyebrow--light{
  color: rgba(255, 255, 255, 0.78);
}

.rowan-site .eyebrow--accent{
  color: var(--accent);
}

.rowan-site .button{
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 0;
  padding: 12px 18px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
  cursor: pointer;
}

.rowan-site .button:hover{
  transform: translateY(-2px);
}

.rowan-site .button--light{
  background: var(--paper);
  border-color: var(--paper);
  color: var(--ink);
}

.rowan-site .button--light:hover{
  background: var(--accent);
  border-color: var(--accent);
}

.rowan-site .button--dark{
  background: var(--ink);
  border-color: var(--ink);
  color: var(--white);
}

.rowan-site .button--dark:hover{
  background: var(--forest);
  border-color: var(--forest);
}

.rowan-site .button--accent{
  background: var(--accent);
  border-color: var(--accent);
  color: var(--ink);
}

.rowan-site .button--accent:hover{
  background: var(--white);
  border-color: var(--white);
}

.rowan-site .button--small{
  min-height: 38px;
  padding: 9px 13px;
  font-size: 11px;
}

.rowan-site .text-link{
  display: inline-flex;
  width: fit-content;
  border-bottom: 1px solid currentColor;
  padding-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
  transition: opacity 160ms ease, transform 160ms ease;
}

.rowan-site .text-link:hover{
  opacity: 0.68;
  transform: translateX(3px);
}

.rowan-site .text-link--light{
  color: var(--white);
}

/* Header */
.rowan-site .site-header{
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  padding: 14px 18px 0;
  color: var(--ink);
  pointer-events: none;
}

.rowan-site .site-header__bar{
  position: relative;
  z-index: 3;
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: rgba(241, 239, 231, 0.94);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 36px) calc(100% - 8px), calc(100% - 44px) 100%, 0 100%);
  padding: 8px 12px 12px 16px;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 30px rgba(15, 19, 17, 0.06);
  pointer-events: auto;
  transition: transform 220ms ease, background 220ms ease;
}

.rowan-site .site-header.is-scrolled .site-header__bar{
  background: rgba(241, 239, 231, 0.97);
}

.rowan-site .site-header--dark .site-header__bar{
  background: rgba(241, 239, 231, 0.96);
}

.rowan-site .wordmark{
  display: inline-flex;
  width: fit-content;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
}

.rowan-site .wordmark span{
  font-size: 13px;
  font-weight: 700;
}

.rowan-site .wordmark small{
  color: #6d7069;
  font-size: 7px;
  letter-spacing: 0.11em;
}

.rowan-site .site-header__center{
  display: flex;
  gap: 30px;
  font-size: 11px;
}

.rowan-site .site-header__center a{
  transition: opacity 160ms ease;
}

.rowan-site .site-header__center a:hover{
  opacity: 0.58;
}

.rowan-site .menu-button{
  display: flex;
  width: 36px;
  height: 30px;
  justify-self: end;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.rowan-site .menu-button span{
  display: block;
  width: 17px;
  height: 1px;
  background: var(--ink);
  transition: transform 180ms ease;
}

.rowan-site .menu-button.is-open span:first-child{
  transform: translateY(3px) rotate(45deg);
}

.rowan-site .menu-button.is-open span:last-child{
  transform: translateY(-3px) rotate(-45deg);
}

.rowan-site .menu-panel{
  position: fixed;
  inset: 0;
  z-index: 2;
  background: var(--forest-2);
  color: var(--white);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-18px);
  transition: opacity 250ms ease, visibility 250ms ease, transform 250ms ease;
}

.rowan-site .menu-panel.is-open{
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
}

.rowan-site .menu-panel__inner{
  display: flex;
  width: min(980px, calc(100vw - 70px));
  min-height: 100vh;
  margin-inline: auto;
  flex-direction: column;
  justify-content: center;
  padding-top: 70px;
}

.rowan-site .menu-panel nav{
  border-top: 1px solid var(--line-light);
}

.rowan-site .menu-panel nav a{
  display: grid;
  grid-template-columns: 70px 1fr auto;
  align-items: center;
  border-bottom: 1px solid var(--line-light);
  padding: 14px 0;
  transition: color 160ms ease, padding 160ms ease;
}

.rowan-site .menu-panel nav a:hover{
  color: var(--accent);
  padding-left: 9px;
}

.rowan-site .menu-panel nav a > span:nth-child(2){
  font-size: clamp(34px, 6vw, 76px);
  font-weight: 400;
  letter-spacing: -0.05em;
  line-height: 1;
}

.rowan-site .menu-panel__index{
  color: rgba(255, 255, 255, 0.55);
  font-size: 10px;
}

.rowan-site .menu-panel__arrow{
  font-size: 18px;
}

.rowan-site .menu-panel__meta{
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 11px;
}

/* Hero */
.rowan-site .hero{
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: center;
  overflow: hidden;
  background: #28312c;
  color: var(--white);
}

.rowan-site .hero__image, .rowan-site .hero__scrim{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.rowan-site .hero__image{
  object-fit: cover;
  object-position: 50% 52%;
  animation: heroZoom 16s ease-out both;
}

@keyframes heroZoom {
  from { transform: scale(1.045); }
  to { transform: scale(1); }
}

.rowan-site .hero__scrim{
  background:
    linear-gradient(180deg, rgba(6, 14, 10, 0.42), rgba(6, 14, 10, 0.18) 38%, rgba(6, 14, 10, 0.58)),
    linear-gradient(90deg, rgba(4, 13, 9, 0.25), transparent 62%);
}

.rowan-site .hero__content{
  position: relative;
  z-index: 1;
  padding-top: 94px;
  padding-bottom: 88px;
}

.rowan-site .hero__kicker{
  margin: 0 0 30px;
  max-width: 420px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.rowan-site .hero h1{
  max-width: 1120px;
  margin: 0;
  font-size: clamp(68px, 10vw, 158px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.82;
}

.rowan-site .hero__accent{
  display: block;
  color: var(--accent);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.78em;
  font-style: italic;
  letter-spacing: -0.06em;
}

.rowan-site .hero__subhead{
  max-width: 530px;
  margin: 34px 0 0;
  font-size: clamp(16px, 1.4vw, 21px);
  line-height: 1.35;
}

.rowan-site .hero__actions{
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 36px;
}

.rowan-site .hero__footer{
  position: absolute;
  z-index: 1;
  bottom: 18px;
  left: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.rowan-site .hero__footer span:nth-child(2){
  justify-self: center;
}

/* Statement */
.rowan-site .statement{
  overflow: hidden;
  background: var(--paper);
}

.rowan-site .statement__inner > h2{
  max-width: 1220px;
  margin: 0;
  font-size: clamp(50px, 7.7vw, 112px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.94;
}

.rowan-site .statement__inner > h2 em{
  color: var(--forest);
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}

.rowan-site .statement__grid{
  display: grid;
  grid-template-columns: minmax(260px, 0.76fr) 1.7fr;
  gap: clamp(50px, 8vw, 130px);
  align-items: end;
  margin-top: clamp(70px, 10vw, 150px);
}

.rowan-site .statement__copy{
  max-width: 410px;
  padding-bottom: 30px;
}

.rowan-site .statement__copy p{
  margin: 0 0 30px;
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.55;
}

.rowan-site .statement__collage{
  position: relative;
  height: clamp(500px, 56vw, 760px);
}

.rowan-site .statement__frame{
  position: absolute;
  overflow: hidden;
  box-shadow: 0 18px 55px rgba(20, 25, 21, 0.1);
}

.rowan-site .statement__frame img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rowan-site .statement__frame--one{
  top: 0;
  right: 8%;
  width: 55%;
  height: 62%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%, 0 87%);
}

.rowan-site .statement__frame--two{
  bottom: 0;
  left: 0;
  width: 48%;
  height: 47%;
}

.rowan-site .statement__frame--three{
  right: 0;
  bottom: 6%;
  width: 32%;
  height: 35%;
  border: 9px solid var(--paper);
}

/* Projects */
.rowan-site .projects{
  position: relative;
  background: var(--paper);
  padding-bottom: clamp(100px, 11vw, 180px);
}

.rowan-site .projects__mast{
  position: relative;
  background: var(--forest);
  color: var(--white);
  padding: clamp(90px, 9vw, 145px) 0 88px;
  clip-path: polygon(0 0, 100% 0, 100% 86%, 91% 86%, 89% 100%, 10% 100%, 8% 86%, 0 86%);
}

.rowan-site .projects__mast-inner{
  display: grid;
  grid-template-columns: 1.4fr 0.7fr;
  gap: 80px;
  align-items: end;
}

.rowan-site .projects__mast h2{
  margin: 0;
  font-size: clamp(52px, 7vw, 106px);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 0.92;
}

.rowan-site .projects__mast h2 sup, .rowan-site .sell h2 sup{
  color: var(--accent);
  font-size: 0.22em;
  font-weight: 700;
  letter-spacing: 0;
  vertical-align: top;
}

.rowan-site .projects__mast-inner > p{
  max-width: 470px;
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
}

.rowan-site .projects__list{
  padding-top: 62px;
}

.rowan-site .project-card{
  border-top: 1px solid var(--line);
  padding: 38px 0 56px;
}

.rowan-site .project-card:last-child{
  border-bottom: 1px solid var(--line);
}

.rowan-site .project-card__heading{
  display: grid;
  grid-template-columns: 56px 1fr;
  margin-bottom: 24px;
}

.rowan-site .project-card__heading h3{
  margin: 0;
  font-size: clamp(38px, 4.4vw, 66px);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.95;
}

.rowan-site .project-card__heading p, .rowan-site .project-card__number{
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 10px;
}

.rowan-site .project-card__body{
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(300px, 0.8fr);
  gap: 16px;
}

.rowan-site .project-card__images{
  display: grid;
  grid-template-columns: 1.35fr 0.72fr 0.72fr;
  gap: 8px;
  height: 300px;
}

.rowan-site .project-card__image{
  overflow: hidden;
  background: #d9d5c8;
}

.rowan-site .project-card__image img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(.2,.7,.2,1);
}

.rowan-site .project-card:hover .project-card__image img{
  transform: scale(1.035);
}

.rowan-site .project-card__image--crop-one img{
  object-position: 36% center;
  transform: scale(1.15);
}

.rowan-site .project-card:hover .project-card__image--crop-one img{
  transform: scale(1.19);
}

.rowan-site .project-card__image--crop-two img{
  object-position: 73% center;
  transform: scale(1.22);
}

.rowan-site .project-card:hover .project-card__image--crop-two img{
  transform: scale(1.26);
}

.rowan-site .project-card__details{
  display: flex;
  min-height: 300px;
  flex-direction: column;
  justify-content: space-between;
  background: var(--paper-2);
  padding: 26px;
}

.rowan-site .project-card__price{
  margin: 0 0 28px;
  font-size: 15px;
  font-weight: 700;
}

.rowan-site .project-card__details ul{
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rowan-site .project-card__details li{
  display: grid;
  grid-template-columns: 34px 1fr;
  color: #454a45;
  font-size: 12px;
}

.rowan-site .project-card__details li span{
  color: #92968e;
  font-size: 9px;
}

.rowan-site .project-card__details .button{
  align-self: flex-end;
}

/* Buy */
.rowan-site .buy{
  background: var(--paper-2);
}

.rowan-site .buy__banner{
  position: relative;
  height: min(72vh, 720px);
  min-height: 480px;
  overflow: hidden;
  color: var(--white);
}

.rowan-site .buy__banner > img, .rowan-site .buy__banner-scrim{
  position: absolute;
  inset: 0;
  height: 100%;
  object-fit: cover;
}

.rowan-site .buy__banner > img{
  object-position: 50% 52%;
}

.rowan-site .buy__banner-scrim{
  background: linear-gradient(180deg, rgba(6, 16, 11, 0.2), rgba(6, 16, 11, 0.54));
}

.rowan-site .buy__banner-content{
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 52px;
}

.rowan-site .buy__banner h2{
  max-width: 1050px;
  margin: 0;
  font-size: clamp(52px, 7.4vw, 108px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.92;
}

.rowan-site .buy__banner h2 em{
  color: var(--accent);
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}

.rowan-site .buy__arrow{
  position: absolute;
  right: 0;
  bottom: 45px;
  color: var(--accent);
  font-size: 70px;
  font-weight: 200;
}

.rowan-site .buy__content{
  display: grid;
  grid-template-columns: 0.78fr 1.1fr;
  gap: clamp(60px, 10vw, 150px);
}

.rowan-site .buy__copy{
  align-self: start;
  position: sticky;
  top: 100px;
}

.rowan-site .buy__copy h3{
  max-width: 520px;
  margin: 0 0 30px;
  font-size: clamp(42px, 4.5vw, 66px);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.rowan-site .buy__copy > p:not(.eyebrow){
  max-width: 500px;
  color: #4f544f;
  font-size: 16px;
  line-height: 1.62;
}

.rowan-site .buy__copy .button{
  margin-top: 18px;
}

.rowan-site .buy__aside{
  display: grid;
  gap: 20px;
}

.rowan-site .buy__image-wrap{
  height: 560px;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 92%, 93% 100%, 0 100%);
}

.rowan-site .buy__image-wrap img{
  height: 100%;
  object-fit: cover;
}

.rowan-site .newsletter-card{
  background: var(--paper);
  padding: clamp(28px, 4vw, 54px);
}

.rowan-site .newsletter-card h4{
  max-width: 600px;
  margin: 0 0 12px;
  font-size: clamp(28px, 3.2vw, 44px);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1;
}

.rowan-site .newsletter-card > p:not(.eyebrow){
  margin: 0 0 30px;
  color: var(--muted);
  font-size: 13px;
}

.rowan-site .newsletter-form{
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;
  align-items: end;
}

.rowan-site .newsletter-form label, .rowan-site .lead-form label{
  display: grid;
  gap: 8px;
}

.rowan-site .newsletter-form label > span, .rowan-site .lead-form label > span{
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.rowan-site .newsletter-form input, .rowan-site .newsletter-form select{
  width: 100%;
  min-height: 46px;
  border: 0;
  border-bottom: 1px solid var(--line);
  outline: none;
  background: transparent;
  color: var(--ink);
}

/* Sell */
.rowan-site .sell{
  position: relative;
  overflow: hidden;
  background: var(--forest);
  color: var(--white);
}

.rowan-site .sell::before, .rowan-site .sell::after{
  position: absolute;
  z-index: 1;
  width: 85px;
  height: 26px;
  background: var(--paper-2);
  content: "";
}

.rowan-site .sell::before{
  top: -1px;
  left: 9%;
  clip-path: polygon(0 0, 100% 0, 82% 100%, 18% 100%);
}

.rowan-site .sell::after{
  right: 9%;
  bottom: -1px;
  clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%);
}

.rowan-site .sell__inner{
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(460px, 1fr);
  gap: clamp(70px, 10vw, 150px);
}

.rowan-site .sell__intro{
  align-self: start;
  position: sticky;
  top: 100px;
}

.rowan-site .sell__intro h2{
  margin: 0 0 30px;
  font-size: clamp(52px, 6.7vw, 96px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.9;
}

.rowan-site .sell__intro h2 span{
  color: var(--accent);
}

.rowan-site .sell__intro > p:not(.eyebrow){
  max-width: 500px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  line-height: 1.6;
}

.rowan-site .sell__intro .button{
  margin-top: 24px;
}

.rowan-site .sell__steps{
  border-top: 1px solid var(--line-light);
}

.rowan-site .sell-step{
  display: grid;
  grid-template-columns: 48px 1fr;
  border-bottom: 1px solid var(--line-light);
  padding: 26px 0 30px;
}

.rowan-site .sell-step > span{
  color: rgba(255, 255, 255, 0.42);
  font-size: 10px;
}

.rowan-site .sell-step h3{
  margin: 0;
  font-size: clamp(26px, 2.6vw, 40px);
  font-weight: 400;
  letter-spacing: -0.04em;
}

.rowan-site .sell-step p{
  max-width: 520px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  line-height: 1.55;
}

/* Testimonials */
.rowan-site .results{
  background: var(--paper);
}

.rowan-site .results__heading{
  display: grid;
  grid-template-columns: 0.55fr 1.45fr;
  gap: 60px;
  align-items: end;
  margin-bottom: 80px;
}

.rowan-site .results__heading h2{
  max-width: 850px;
  margin: 0;
  font-size: clamp(48px, 6vw, 88px);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.rowan-site .results__grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.rowan-site .testimonial{
  display: flex;
  min-height: 430px;
  margin: 0;
  flex-direction: column;
  border-right: 1px solid var(--line);
  padding: 28px 30px 32px 0;
}

.rowan-site .testimonial + .testimonial{
  padding-left: 30px;
}

.rowan-site .testimonial:last-child{
  border-right: 0;
  padding-right: 0;
}

.rowan-site .testimonial__index{
  color: #8d9089;
  font-size: 10px;
}

.rowan-site .testimonial > p{
  margin: 50px 0 auto;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(22px, 2.2vw, 34px);
  font-style: italic;
  line-height: 1.25;
}

.rowan-site .testimonial footer{
  display: grid;
  gap: 2px;
  margin-top: 45px;
  font-size: 11px;
}

.rowan-site .testimonial footer span{
  color: var(--muted);
}

/* About */
.rowan-site .about{
  background: var(--paper-2);
}

.rowan-site .about__inner{
  display: grid;
  grid-template-columns: 1.05fr 0.78fr;
  gap: clamp(70px, 10vw, 160px);
  align-items: center;
}

.rowan-site .about__visual{
  position: relative;
  min-height: 740px;
}

.rowan-site .about__label{
  position: absolute;
  z-index: 2;
  top: 8%;
  left: -14px;
  color: var(--forest);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(50px, 6.5vw, 90px);
  font-style: italic;
  line-height: 0.85;
  transform: rotate(-6deg);
}

.rowan-site .about__image-shape{
  position: absolute;
  inset: 70px 0 0 7%;
  overflow: hidden;
  background: #d5d2c7;
  clip-path: polygon(14% 0, 100% 0, 93% 100%, 0 100%, 0 16%);
}

.rowan-site .about__image-shape img{
  height: 100%;
  object-fit: cover;
  object-position: 54% center;
  filter: saturate(0.72) contrast(0.96);
}

.rowan-site .about__copy h2{
  margin: 0;
  font-size: clamp(55px, 7vw, 104px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.87;
}

.rowan-site .about__role{
  margin: 12px 0 42px;
  color: var(--muted);
  font-size: 11px;
}

.rowan-site .about__lead{
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(22px, 2.1vw, 31px) !important;
  font-style: italic;
  line-height: 1.35 !important;
}

.rowan-site .about__copy > p:not(.eyebrow):not(.about__role){
  max-width: 560px;
  color: #4e534e;
  font-size: 15px;
  line-height: 1.6;
}

.rowan-site .about__copy .text-link{
  margin-top: 22px;
}

.rowan-site .about__tags{
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 70px;
  color: #777b75;
  font-size: 10px;
}

/* Contact */
.rowan-site .contact{
  background: #101612;
  color: var(--white);
}

.rowan-site .contact__inner{
  display: grid;
  grid-template-columns: 0.85fr 1.1fr;
  gap: clamp(70px, 11vw, 170px);
}

.rowan-site .contact__intro h2{
  max-width: 690px;
  margin: 0 0 32px;
  font-size: clamp(58px, 7.4vw, 108px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.88;
}

.rowan-site .contact__intro > p:not(.eyebrow){
  max-width: 500px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 16px;
  line-height: 1.58;
}

.rowan-site .contact__direct{
  display: grid;
  gap: 5px;
  margin-top: 62px;
  font-size: 13px;
}

.rowan-site .contact__direct > span{
  margin-bottom: 7px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.rowan-site .contact__direct a{
  width: fit-content;
  border-bottom: 1px solid transparent;
}

.rowan-site .contact__direct a:hover{
  border-bottom-color: currentColor;
}

.rowan-site .contact__form{
  align-self: end;
}

.rowan-site .lead-form{
  display: grid;
  gap: 28px;
}

.rowan-site .lead-form__grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px 18px;
}

.rowan-site .lead-form label > span{
  color: rgba(255, 255, 255, 0.55);
}

.rowan-site .lead-form input, .rowan-site .lead-form select, .rowan-site .lead-form textarea{
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 0;
  outline: none;
  background: transparent;
  color: var(--white);
  padding: 10px 0;
  transition: border-color 160ms ease;
}

.rowan-site .lead-form select option{
  color: var(--ink);
}

.rowan-site .lead-form input:focus, .rowan-site .lead-form select:focus, .rowan-site .lead-form textarea:focus{
  border-color: var(--accent);
}

.rowan-site .lead-form textarea{
  resize: vertical;
}

.rowan-site .lead-form input::placeholder, .rowan-site .lead-form textarea::placeholder{
  color: rgba(255, 255, 255, 0.28);
}

.rowan-site .lead-form .button{
  justify-self: start;
}

.rowan-site .form-success{
  border-top: 1px solid var(--line-light);
  border-bottom: 1px solid var(--line-light);
  padding: 35px 0;
}

.rowan-site .form-success > span{
  display: block;
  margin-bottom: 10px;
  color: var(--accent);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  font-style: italic;
}

.rowan-site .form-success p{
  max-width: 550px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 13px;
}

.rowan-site .form-success button.text-link{
  border-top: 0;
  border-right: 0;
  border-left: 0;
  background: transparent;
  color: var(--white);
  cursor: pointer;
}

.rowan-site .form-success--compact{
  border-color: var(--line);
  color: var(--ink);
}

.rowan-site .form-success--compact > span{
  color: var(--forest);
}

.rowan-site .form-success--compact p{
  color: var(--muted);
}

.rowan-site .form-success--compact button.text-link{
  color: var(--ink);
}

/* Footer */
.rowan-site .footer{
  background: var(--paper);
  color: var(--ink);
  padding: 72px 28px 22px;
}

.rowan-site .footer__top{
  display: grid;
  width: min(1360px, 100%);
  margin-inline: auto;
  grid-template-columns: 1.3fr 0.6fr 0.8fr;
  gap: 70px;
  border-top: 1px solid var(--line);
  padding-top: 38px;
}

.rowan-site .footer__top h2{
  margin: 0;
  font-size: clamp(34px, 4vw, 56px);
  font-weight: 400;
  letter-spacing: -0.05em;
}

.rowan-site .footer__top > div:first-child > p:last-child{
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.rowan-site .footer__links, .rowan-site .footer__contact{
  display: grid;
  align-content: start;
  gap: 8px;
  font-size: 11px;
}

.rowan-site .footer__links a:hover, .rowan-site .footer__contact a:hover{
  text-decoration: underline;
}

.rowan-site .footer__contact span{
  margin-top: 10px;
  color: var(--muted);
}

.rowan-site .footer__bottom{
  display: grid;
  width: min(1360px, 100%);
  margin: 70px auto 0;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  border-top: 1px solid var(--line);
  padding-top: 16px;
  color: #777a75;
  font-size: 9px;
}

.rowan-site .footer__bottom > :last-child{
  justify-self: end;
}

/* Project detail */
.rowan-site .project-page, .rowan-site .legal-page{
  background: var(--paper);
}

.rowan-site .project-hero{
  position: relative;
  height: 86vh;
  min-height: 620px;
  overflow: hidden;
  background: #1c211e;
  color: var(--white);
}

.rowan-site .project-hero > img, .rowan-site .project-hero__scrim{
  position: absolute;
  inset: 0;
  height: 100%;
  object-fit: cover;
}

.rowan-site .project-hero__scrim{
  background: linear-gradient(180deg, rgba(5, 10, 8, 0.2), rgba(5, 10, 8, 0.68));
}

.rowan-site .project-hero__content{
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 50px;
}

.rowan-site .project-hero h1{
  margin: 0;
  font-size: clamp(80px, 12vw, 180px);
  font-weight: 400;
  letter-spacing: -0.07em;
  line-height: 0.78;
}

.rowan-site .project-hero__meta{
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  border-top: 1px solid var(--line-light);
  padding-top: 14px;
  font-size: 12px;
}

.rowan-site .project-summary__grid{
  display: grid;
  grid-template-columns: 1.4fr 0.65fr;
  gap: 100px;
}

.rowan-site .project-summary h2{
  max-width: 900px;
  margin: 0;
  font-size: clamp(48px, 6vw, 86px);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.rowan-site .project-summary__facts{
  border-top: 1px solid var(--line);
}

.rowan-site .project-summary__facts > div{
  display: grid;
  grid-template-columns: 50px 1fr;
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
}

.rowan-site .project-summary__facts span{
  color: #90938d;
  font-size: 9px;
}

.rowan-site .project-summary__facts p{
  margin: 0;
  font-size: 13px;
}

.rowan-site .project-editorial{
  padding-bottom: clamp(110px, 12vw, 190px);
}

.rowan-site .project-editorial__grid{
  display: grid;
  grid-template-columns: 1.15fr 0.65fr;
  gap: clamp(60px, 9vw, 130px);
  align-items: start;
}

.rowan-site .project-editorial__image{
  overflow: hidden;
}

.rowan-site .project-editorial__image img{
  height: 100%;
  object-fit: cover;
}

.rowan-site .project-editorial__image--main{
  height: 730px;
  clip-path: polygon(0 0, 100% 0, 100% 94%, 93% 100%, 0 100%);
}

.rowan-site .project-editorial__copy{
  padding-top: 100px;
}

.rowan-site .project-editorial__copy > p:not(.eyebrow){
  margin: 0 0 22px;
  color: #4d524d;
  font-size: 16px;
  line-height: 1.65;
}

.rowan-site .project-editorial__copy .button{
  margin-top: 20px;
}

.rowan-site .project-editorial__image--secondary{
  grid-column: 2;
  width: 84%;
  height: 430px;
  margin-top: -80px;
}

.rowan-site .project-next{
  background: var(--forest);
  color: var(--white);
}

.rowan-site .project-next a{
  display: grid;
  width: min(1360px, calc(100vw - 56px));
  min-height: 280px;
  margin-inline: auto;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  align-items: end;
  padding: 60px 0;
}

.rowan-site .project-next a .eyebrow{
  grid-column: 1 / -1;
  align-self: start;
}

.rowan-site .project-next strong{
  font-size: clamp(58px, 8vw, 118px);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.82;
}

.rowan-site .project-next a > span:last-child{
  color: var(--accent);
  font-size: 48px;
}

/* Legal */
.rowan-site .legal-hero{
  padding: 180px 0 90px;
  background: var(--forest);
  color: var(--white);
}

.rowan-site .legal-hero h1{
  margin: 0;
  font-size: clamp(68px, 10vw, 140px);
  font-weight: 400;
  letter-spacing: -0.07em;
  line-height: 0.84;
}

.rowan-site .legal-hero > .shell > p:last-child{
  margin: 28px 0 0;
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
}

.rowan-site .legal-content__inner{
  display: grid;
  grid-template-columns: 0.55fr 1.2fr;
  gap: 100px;
}

.rowan-site .legal-content aside{
  position: sticky;
  top: 110px;
  align-self: start;
  color: var(--muted);
  font-size: 13px;
}

.rowan-site .legal-content aside .text-link{
  margin-top: 16px;
  color: var(--ink);
}

.rowan-site .legal-content article{
  max-width: 800px;
}

.rowan-site .legal-content article h2{
  margin: 0 0 16px;
  font-size: clamp(30px, 3vw, 46px);
  font-weight: 400;
  letter-spacing: -0.045em;
}

.rowan-site .legal-content article h2:not(:first-child){
  margin-top: 64px;
}

.rowan-site .legal-content article p{
  color: #545954;
  font-size: 16px;
  line-height: 1.72;
}

/* Responsive */
@media (max-width: 1020px) {
  .rowan-site{
    --shell: min(100% - 38px, 920px);
  }

  .rowan-site .site-header__center{
    display: none;
  }

  .rowan-site .site-header__bar{
    grid-template-columns: 1fr auto;
  }

  .rowan-site .statement__grid, .rowan-site .projects__mast-inner, .rowan-site .buy__content, .rowan-site .sell__inner, .rowan-site .about__inner, .rowan-site .contact__inner, .rowan-site .project-summary__grid, .rowan-site .project-editorial__grid, .rowan-site .legal-content__inner{
    grid-template-columns: 1fr;
  }

  .rowan-site .statement__copy{
    max-width: 620px;
  }

  .rowan-site .projects__mast-inner{
    gap: 30px;
  }

  .rowan-site .project-card__body{
    grid-template-columns: 1fr;
  }

  .rowan-site .project-card__details{
    min-height: 220px;
  }

  .rowan-site .buy__copy, .rowan-site .sell__intro, .rowan-site .legal-content aside{
    position: static;
  }

  .rowan-site .buy__aside{
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }

  .rowan-site .buy__image-wrap{
    height: 100%;
    min-height: 520px;
  }

  .rowan-site .newsletter-form{
    grid-template-columns: 1fr;
  }

  .rowan-site .results__heading{
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .rowan-site .results__grid{
    grid-template-columns: 1fr;
  }

  .rowan-site .testimonial, .rowan-site .testimonial + .testimonial, .rowan-site .testimonial:last-child{
    min-height: 330px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 28px 0;
  }

  .rowan-site .testimonial:last-child{
    border-bottom: 0;
  }

  .rowan-site .about__visual{
    min-height: 650px;
  }

  .rowan-site .contact__inner{
    gap: 90px;
  }

  .rowan-site .footer__top{
    grid-template-columns: 1fr 0.5fr 0.8fr;
  }

  .rowan-site .project-editorial__copy{
    max-width: 720px;
    padding-top: 0;
  }

  .rowan-site .project-editorial__image--secondary{
    grid-column: auto;
    width: 70%;
    height: 460px;
    margin: 0 0 0 auto;
  }
}

@media (max-width: 720px) {
  .rowan-site{
    --shell: calc(100vw - 28px);
  }

  .rowan-site{
    font-size: 15px;
  }

  .rowan-site .section-pad{
    padding-block: 82px;
  }

  .rowan-site .site-header{
    padding: 8px 8px 0;
  }

  .rowan-site .site-header__bar{
    min-height: 44px;
    padding: 7px 9px 11px 12px;
  }

  .rowan-site .menu-panel__inner{
    width: calc(100vw - 36px);
  }

  .rowan-site .menu-panel nav a{
    grid-template-columns: 44px 1fr auto;
  }

  .rowan-site .menu-panel nav a > span:nth-child(2){
    font-size: 44px;
  }

  .rowan-site .menu-panel__meta{
    flex-direction: column;
    gap: 8px;
  }

  .rowan-site .hero{
    min-height: 820px;
  }

  .rowan-site .hero__image{
    object-position: 58% center;
  }

  .rowan-site .hero__content{
    padding-top: 110px;
    padding-bottom: 130px;
  }

  .rowan-site .hero h1{
    font-size: clamp(64px, 19vw, 96px);
    line-height: 0.82;
  }

  .rowan-site .hero__subhead{
    font-size: 16px;
  }

  .rowan-site .hero__actions{
    align-items: flex-start;
    flex-direction: column;
  }

  .rowan-site .hero__footer{
    grid-template-columns: 1fr auto;
  }

  .rowan-site .hero__footer span:nth-child(2){
    display: none;
  }

  .rowan-site .statement__inner > h2{
    font-size: clamp(48px, 14vw, 74px);
  }

  .rowan-site .statement__grid{
    gap: 52px;
    margin-top: 70px;
  }

  .rowan-site .statement__collage{
    height: 560px;
  }

  .rowan-site .statement__frame--one{
    right: 0;
    width: 73%;
    height: 56%;
  }

  .rowan-site .statement__frame--two{
    width: 63%;
    height: 42%;
  }

  .rowan-site .statement__frame--three{
    right: 0;
    bottom: 8%;
    width: 42%;
    height: 29%;
    border-width: 6px;
  }

  .rowan-site .projects__mast{
    padding: 85px 0 74px;
    clip-path: polygon(0 0, 100% 0, 100% 94%, 88% 94%, 84% 100%, 14% 100%, 10% 94%, 0 94%);
  }

  .rowan-site .projects__mast h2{
    font-size: 54px;
  }

  .rowan-site .projects__list{
    padding-top: 38px;
  }

  .rowan-site .project-card{
    padding: 28px 0 38px;
  }

  .rowan-site .project-card__heading{
    grid-template-columns: 40px 1fr;
  }

  .rowan-site .project-card__heading h3{
    font-size: 43px;
  }

  .rowan-site .project-card__images{
    grid-template-columns: 1fr 0.6fr;
    height: 260px;
  }

  .rowan-site .project-card__image--crop-two{
    display: none;
  }

  .rowan-site .project-card__details{
    min-height: 230px;
    padding: 22px;
  }

  .rowan-site .buy__banner{
    min-height: 600px;
  }

  .rowan-site .buy__banner h2{
    font-size: 56px;
  }

  .rowan-site .buy__arrow{
    display: none;
  }

  .rowan-site .buy__aside{
    grid-template-columns: 1fr;
  }

  .rowan-site .buy__image-wrap{
    min-height: 440px;
  }

  .rowan-site .sell__inner{
    gap: 70px;
  }

  .rowan-site .sell__intro h2{
    font-size: 60px;
  }

  .rowan-site .sell-step{
    grid-template-columns: 36px 1fr;
  }

  .rowan-site .results__heading{
    margin-bottom: 50px;
  }

  .rowan-site .results__heading h2{
    font-size: 54px;
  }

  .rowan-site .testimonial > p{
    margin-top: 34px;
    font-size: 27px;
  }

  .rowan-site .about__visual{
    min-height: 560px;
  }

  .rowan-site .about__label{
    top: 4%;
    left: 0;
    font-size: 58px;
  }

  .rowan-site .about__image-shape{
    inset: 78px 0 0 0;
  }

  .rowan-site .about__copy h2{
    font-size: 70px;
  }

  .rowan-site .contact__intro h2{
    font-size: 63px;
  }

  .rowan-site .lead-form__grid{
    grid-template-columns: 1fr;
  }

  .rowan-site .footer{
    padding: 58px 14px 18px;
  }

  .rowan-site .footer__top{
    grid-template-columns: 1fr 1fr;
    gap: 45px 25px;
  }

  .rowan-site .footer__top > div:first-child{
    grid-column: 1 / -1;
  }

  .rowan-site .footer__bottom{
    grid-template-columns: 1fr;
    margin-top: 55px;
  }

  .rowan-site .footer__bottom > :last-child{
    justify-self: start;
  }

  .rowan-site .project-hero{
    height: 78vh;
    min-height: 650px;
  }

  .rowan-site .project-hero h1{
    font-size: 78px;
  }

  .rowan-site .project-hero__meta{
    gap: 20px;
    flex-direction: column;
  }

  .rowan-site .project-summary h2{
    font-size: 48px;
  }

  .rowan-site .project-editorial__image--main{
    height: 520px;
  }

  .rowan-site .project-editorial__image--secondary{
    width: 88%;
    height: 350px;
  }

  .rowan-site .project-next a{
    width: calc(100vw - 28px);
    min-height: 240px;
    padding: 45px 0;
  }

  .rowan-site .project-next strong{
    font-size: 60px;
  }

  .rowan-site .legal-hero{
    padding: 150px 0 70px;
  }

  .rowan-site .legal-hero h1{
    font-size: 72px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rowan-site{
    scroll-behavior: auto;
  }

  .rowan-site, .rowan-site *, .rowan-site *::before, .rowan-site *::after{
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Listing index and detail pages */
.rowan-site .featured-listings{
  padding-bottom: clamp(90px, 10vw, 150px);
}

.rowan-site .featured-listings__heading{
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
  border-top: 1px solid var(--line);
  padding-top: 34px;
  margin-bottom: 38px;
}

.rowan-site .featured-listings__heading h3{
  margin: 0;
  font-size: clamp(38px, 4.8vw, 68px);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.95;
}

.rowan-site .featured-listings__grid, .rowan-site .listings-index__grid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(38px, 5vw, 78px) 18px;
}

.rowan-site .listing-card{
  min-width: 0;
}

.rowan-site .listing-card__image{
  position: relative;
  display: block;
  height: clamp(350px, 39vw, 570px);
  overflow: hidden;
  background: #d5d2c8;
}

.rowan-site .listing-card--compact .listing-card__image{
  height: clamp(240px, 27vw, 390px);
}

.rowan-site .listing-card__image img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 650ms cubic-bezier(.2,.7,.2,1);
}

.rowan-site .listing-card__image:hover img{
  transform: scale(1.025);
}

.rowan-site .listing-card__image > span{
  position: absolute;
  left: 14px;
  bottom: 14px;
  background: rgba(241, 239, 231, 0.94);
  padding: 7px 10px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.rowan-site .listing-card__body{
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: end;
  border-bottom: 1px solid var(--line);
  padding: 17px 0 15px;
}

.rowan-site .listing-card__location{
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .07em;
}

.rowan-site .listing-card h3{
  margin: 0;
  font-size: clamp(22px, 2.2vw, 34px);
  font-weight: 400;
  letter-spacing: -.04em;
  line-height: 1;
}

.rowan-site .listing-card__price{
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.rowan-site .listing-card__facts{
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 11px;
  color: var(--muted);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .045em;
}

.rowan-site .listings-hero{
  background: var(--forest);
  color: var(--white);
  padding: 160px 0 80px;
}

.rowan-site .listings-hero__inner h1{
  max-width: 1120px;
  margin: 0;
  font-size: clamp(62px, 9vw, 138px);
  font-weight: 400;
  letter-spacing: -.07em;
  line-height: .84;
}

.rowan-site .listings-hero__inner h1 em{
  display: block;
  color: var(--accent);
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}

.rowan-site .listings-hero__meta{
  display: grid;
  grid-template-columns: minmax(260px, 520px) auto;
  justify-content: space-between;
  gap: 30px;
  align-items: end;
  margin-top: 56px;
  border-top: 1px solid var(--line-light);
  padding-top: 20px;
  color: rgba(255,255,255,.7);
  font-size: 12px;
}

.rowan-site .listings-hero__meta p{
  margin: 0;
}

.rowan-site .listings-index{
  background: var(--paper);
}

.rowan-site .listing-hero{
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: end;
  overflow: hidden;
  color: var(--white);
  background: #27332e;
}

.rowan-site .listing-hero > img, .rowan-site .listing-hero__scrim{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.rowan-site .listing-hero > img{
  object-fit: cover;
}

.rowan-site .listing-hero__scrim{
  background: linear-gradient(180deg, rgba(8,15,12,.12), rgba(8,15,12,.68));
}

.rowan-site .listing-hero__content{
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 30px;
  align-items: end;
  padding-bottom: 42px;
}

.rowan-site .listing-hero h1{
  max-width: 1040px;
  margin: 0;
  font-size: clamp(58px, 8vw, 126px);
  font-weight: 400;
  letter-spacing: -.07em;
  line-height: .86;
}

.rowan-site .listing-hero__location{
  margin: 15px 0 0;
  color: rgba(255,255,255,.7);
  font-size: 12px;
}

.rowan-site .listing-hero__content > strong{
  padding-bottom: 8px;
  font-size: clamp(18px, 2vw, 28px);
  font-weight: 400;
}

.rowan-site .listing-overview{
  background: var(--paper);
}

.rowan-site .listing-overview__grid{
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, .7fr);
  gap: clamp(70px, 10vw, 150px);
  align-items: end;
}

.rowan-site .listing-overview__intro h2{
  max-width: 920px;
  margin: 0;
  font-size: clamp(40px, 5vw, 72px);
  font-weight: 400;
  letter-spacing: -.055em;
  line-height: .98;
}

.rowan-site .listing-overview__facts{
  border-top: 1px solid var(--line);
}

.rowan-site .listing-overview__facts > div{
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid var(--line);
  padding: 15px 0;
}

.rowan-site .listing-overview__facts span{
  color: var(--muted);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.rowan-site .listing-overview__facts strong{
  font-size: 13px;
}

.rowan-site .listing-gallery{
  display: grid;
  grid-template-columns: 1.7fr .8fr;
  grid-template-rows: repeat(2, 300px);
  gap: 10px;
  padding-bottom: 30px;
}

.rowan-site .listing-gallery > div{
  overflow: hidden;
}

.rowan-site .listing-gallery img{
  height: 100%;
  object-fit: cover;
}

.rowan-site .listing-gallery__large{
  grid-row: 1 / 3;
}

.rowan-site .listing-detail{
  background: var(--paper);
}

.rowan-site .listing-detail__grid{
  display: grid;
  grid-template-columns: 1fr .8fr;
  gap: clamp(60px, 10vw, 160px);
}

.rowan-site .listing-detail h2{
  max-width: 650px;
  margin: 0;
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 400;
  letter-spacing: -.06em;
  line-height: .96;
}

.rowan-site .listing-detail__copy{
  max-width: 620px;
  color: #4f544f;
  font-size: 16px;
  line-height: 1.65;
}

.rowan-site .listing-detail__copy p:first-child{
  margin-top: 28px;
}

.rowan-site .listing-inquiry{
  background: var(--forest);
  color: var(--white);
}

.rowan-site .listing-inquiry__grid{
  display: grid;
  grid-template-columns: .75fr 1fr;
  gap: clamp(60px, 10vw, 160px);
}

.rowan-site .listing-inquiry h2{
  max-width: 600px;
  margin: 0 0 22px;
  font-size: clamp(46px, 6vw, 82px);
  font-weight: 400;
  letter-spacing: -.06em;
  line-height: .92;
}

.rowan-site .listing-inquiry__grid > div > p:not(.eyebrow){
  max-width: 490px;
  color: rgba(255,255,255,.66);
}

.rowan-site .listing-next{
  background: var(--forest-2);
  color: var(--white);
  border-top: 1px solid var(--line-light);
}

.rowan-site .listing-next a{
  display: grid;
  width: var(--shell);
  margin-inline: auto;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 52px 0;
}

.rowan-site .listing-next .eyebrow{
  grid-column: 1 / 3;
}

.rowan-site .listing-next strong{
  font-size: clamp(34px, 5vw, 72px);
  font-weight: 400;
  letter-spacing: -.055em;
}

.rowan-site .not-found{
  min-height: 75vh;
  padding-top: 180px;
}

.rowan-site .not-found h1{
  max-width: 900px;
  margin: 0 0 28px;
  font-size: clamp(54px, 8vw, 116px);
  font-weight: 400;
  letter-spacing: -.065em;
  line-height: .9;
}

.rowan-site .not-found p:not(.eyebrow){
  max-width: 520px;
  margin-bottom: 30px;
  color: var(--muted);
}

@media (max-width: 900px) {
  .rowan-site .featured-listings__grid, .rowan-site .listings-index__grid{
    grid-template-columns: 1fr;
  }

  .rowan-site .listing-card__image, .rowan-site .listing-card--compact .listing-card__image{
    height: min(70vw, 540px);
  }

  .rowan-site .listings-hero__meta, .rowan-site .listing-overview__grid, .rowan-site .listing-detail__grid, .rowan-site .listing-inquiry__grid{
    grid-template-columns: 1fr;
  }

  .rowan-site .listing-hero__content{
    grid-template-columns: 1fr;
  }

  .rowan-site .listing-gallery{
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 450px 240px;
  }

  .rowan-site .listing-gallery__large{
    grid-column: 1 / 3;
    grid-row: auto;
  }
}

@media (max-width: 640px) {
  .rowan-site .featured-listings__heading{
    align-items: start;
    flex-direction: column;
  }

  .rowan-site .listings-hero{
    padding-top: 130px;
  }

  .rowan-site .listing-card__body{
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .rowan-site .listing-gallery{
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 380px 230px 230px;
    gap: 5px;
  }

  .rowan-site .listing-gallery__large{
    grid-column: auto;
  }

  .rowan-site .listing-next a{
    grid-template-columns: 1fr auto;
    padding-block: 38px;
  }
}

.rowan-site .journal-index .journal-row{
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 40px;
  align-items: start;
  padding: 36px 0;
  border-bottom: 1px solid rgba(20, 18, 16, 0.16);
  color: inherit;
}

.rowan-site .journal-index .journal-row span{
  font-size: 11px;
  letter-spacing: 0.14em;
}

.rowan-site .journal-index .journal-row small{
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.rowan-site .journal-index .journal-row h2{
  font-family: inherit;
  font-size: clamp(28px, 3.4vw, 46px);
  font-weight: 400;
  line-height: 1.05;
  margin: 0 0 12px;
}

.rowan-site .journal-index .journal-row p{
  margin: 0;
  max-width: 640px;
  font-size: 15px;
  line-height: 1.6;
}

.rowan-site .journal-index .journal-row b{
  font-weight: 400;
  font-size: 18px;
}

.rowan-site .journal-article .legal-content p{
  font-size: 17px;
  line-height: 1.75;
  margin: 0 0 22px;
}

`;
