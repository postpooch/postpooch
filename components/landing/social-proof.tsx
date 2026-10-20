"use client";

import { LogoMarquee, StatCounter } from "performative-ui";

const PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "Google Business",
  "Email newsletters",
  "Stories & Reels",
].map((label) => ({
  kind: "node" as const,
  key: label,
  node: <span className="pui-marquee__text">{label}</span>,
}));

const STATS = [
  { target: 15, suffix: " min", label: "to review a full week" },
  { target: 5, suffix: "+", label: "posts prepared weekly" },
  { target: 14, suffix: "-day", label: "free trial, no card" },
  { target: 1, suffix: "", label: "brand kit for every post" },
];

export function SocialProof() {
  return (
    <section aria-label="Social proof" className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-pp-stone">
          Publish once, show up everywhere
        </p>

        <div className="mt-5">
          <LogoMarquee
            logos={PLATFORMS}
            speed={38}
            gap={48}
            fade
            pauseOnHover
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 rounded-[24px] border border-pp-sand/70 bg-white/80 px-5 py-8 shadow-[0_12px_40px_rgba(36,25,20,0.06)] backdrop-blur-sm sm:grid-cols-4 sm:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[32px] font-semibold tracking-[-0.04em] text-pp-ink sm:text-[36px]">
                <StatCounter target={stat.target} durationMs={1400} />
                <span className="text-pp-teal">{stat.suffix}</span>
              </p>
              <p className="mt-1.5 text-[12px] leading-4 tracking-[-0.01em] text-pp-stone">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
