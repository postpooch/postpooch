"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Aurora,
  EyebrowPill,
  FloatingSparkles,
  WordRoll,
} from "performative-ui";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "./icons";

const MASCOT_SRC =
  "/postpooch_web_mascot_assets/master/postpooch-mascot-with-shadow.webp";

const ROLL_WORDS = [
  "CRM",
  "Social Media",
  "Video Center",
  "Website",
  "Google Business",
];





export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="relative overflow-hidden rounded-[30px] border border-pp-sand/70 bg-gradient-to-br from-pp-white via-pp-white to-pp-mist/65 px-6 py-10 shadow-[0_20px_70px_rgba(36,25,20,0.08)] sm:px-9 sm:py-14">
          <Aurora
            animated
            repulsion={0.35}
            blur={50}
            blobs={[
              { color: "rgba(37, 111, 104, 0.42)", x: 78, y: 18, size: 52 },
              { color: "rgba(246, 177, 119, 0.5)", x: 18, y: 72, size: 56 },
              { color: "rgba(234, 217, 200, 0.7)", x: 55, y: 55, size: 46 },
              { color: "rgba(201, 130, 79, 0.35)", x: 88, y: 78, size: 40 },
            ]}
          />
          <FloatingSparkles
            count={28}
            glyphs={["✦", "·", "✦"]}
            durationS={[7, 12]}
            sizeRange={[10, 20]}
            className="opacity-70"
          />

          <div className="relative z-[1] grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
            <div className="max-w-xl">
              <div className="pp-apple-rise">
                <EyebrowPill
                  statusColor="var(--pp-teal)"
                  className="pp-hero-eyebrow"
                >
                 Online presence best friend for real estate agents
                </EyebrowPill>
              </div>

              <h1 className="pp-apple-rise pp-apple-rise-delay-1 pp-hero-display mt-4 text-pp-ink">
                Your online presence. Handled.
              </h1>

              <p className="pp-apple-rise pp-apple-rise-delay-2 pp-hero-body mt-4 max-w-xl text-pp-stone">

                Many realtors waste thousands of dollars on marketing.
                PostPoch handles <a href="#how-it-works" className="font-bold text-pp-ink underline decoration-pp-teal decoration-2 underline-offset-2 transition hover:text-pp-teal-dark">your social media</a> content → 4 unique <em>crafted</em> posts a week → so you can focus on what matters.
                <br />
                (but also → so much... <a href="#features" className="font-bold text-pp-ink underline decoration-pp-teal decoration-2 underline-offset-2 transition hover:text-pp-teal-dark">more</a>)
              
              </p>

              <div className="pp-apple-rise pp-apple-rise-delay-3 mt-7 rounded-[999px] border border-pp-sand/80 bg-pp-white/95 p-2 shadow-[0_8px_28px_rgba(36,25,20,0.09)] backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <Link
                    href="/signup"
                    className="pp-hero-button pp-hero-button--primary inline-flex items-center gap-2 rounded-full bg-pp-teal px-5 py-3 text-pp-white transition hover:bg-pp-teal-dark"
                  >
                    Start free trial
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="pp-hero-button pp-hero-button--secondary rounded-full border border-pp-sand/90 px-4 py-3 text-pp-stone transition hover:text-pp-ink"
                  >
                    See how it works
                  </a>
                  <div className="pp-hero-trial hidden min-w-0 flex-1 rounded-full bg-pp-cream px-4 py-3 text-pp-ink sm:block">
                    7-day free trial
                  </div>
                </div>
              </div>

              <p className="pp-hero-caption mt-4 text-pp-stone sm:hidden">
                14-day free trial · No credit card required · Cancel anytime
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="pp-apple-glow absolute inset-x-6 top-16 bottom-4 rounded-[999px] bg-[radial-gradient(ellipse_at_center,#ead9c8_0%,transparent_70%)]"
              />
              <div
                aria-hidden
                className="absolute top-8 -right-2 size-28 rounded-full bg-[radial-gradient(circle,#f6b177_0%,transparent_70%)] opacity-70"
              />

              <Image
                src={MASCOT_SRC}
                alt="Pooch, the postpooch dog mascot, sitting next to a week of prepared posts"
                width={790}
                height={835}
                priority
                className="relative z-10 mx-auto w-full max-w-[420px]"
              />

              <div className="absolute top-14 left-0 z-20 hidden animate-float rounded-[18px] bg-white/95 p-4 shadow-[0_12px_32px_rgba(36,25,20,0.1)] ring-1 ring-pp-sand/70 backdrop-blur-md sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[10px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80">
                    <CheckCircleIcon className="size-5" />
                  </span>
                  <div>
                    <p className="pp-hero-card-title text-pp-ink">
                      5 posts ready to review
                    </p>
                    <p className="pp-hero-card-sub text-pp-stone">
                      Prepared this morning
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-16 z-20 hidden animate-float-slow rounded-[18px] bg-white/95 p-4 shadow-[0_12px_32px_rgba(36,25,20,0.1)] ring-1 ring-pp-sand/70 backdrop-blur-md sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[10px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80">
                    <CalendarIcon className="size-5" />
                  </span>
                  <div>
                    <p className="pp-hero-card-title text-pp-ink">
                      Open house post
                    </p>
                    <p className="pp-hero-card-sub text-pp-teal">
                      Scheduled · Thu 9:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
