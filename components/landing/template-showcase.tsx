import Image from "next/image";
import { CheckIcon, MapPinIcon } from "./icons";

const AVATAR_SRC =
  "/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp";

function HouseIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full" aria-hidden>
      <rect width="200" height="130" fill="#EAD9C8" />
      <circle cx="168" cy="26" r="14" fill="#F6B177" />
      <ellipse cx="100" cy="122" rx="72" ry="6" fill="#DEC7B2" />
      <path
        d="M42 66 100 22l58 44"
        fill="none"
        stroke="#241914"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="52" y="62" width="96" height="56" rx="8" fill="#FFF7EF" />
      <rect
        x="52"
        y="62"
        width="96"
        height="56"
        rx="8"
        fill="none"
        stroke="#241914"
        strokeWidth="5"
      />
      <rect x="86" y="86" width="28" height="32" rx="6" fill="#256F68" />
      <rect
        x="86"
        y="86"
        width="28"
        height="32"
        rx="6"
        fill="none"
        stroke="#241914"
        strokeWidth="4"
      />
      <rect x="62" y="72" width="16" height="14" rx="4" fill="#356F8F" />
      <rect x="122" y="72" width="16" height="14" rx="4" fill="#356F8F" />
      <circle cx="40" cy="112" r="10" fill="#256F68" opacity="0.55" />
      <circle cx="160" cy="114" r="8" fill="#256F68" opacity="0.4" />
    </svg>
  );
}

function MapIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full" aria-hidden>
      <rect width="200" height="130" fill="#F5F2EF" />
      <path
        d="M0 44 C60 36 120 58 200 40"
        fill="none"
        stroke="#EAD9C8"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M52 0 C60 50 40 90 58 130"
        fill="none"
        stroke="#EAD9C8"
        strokeWidth="12"
      />
      <path
        d="M130 0 C124 44 148 88 138 130"
        fill="none"
        stroke="#EAD9C8"
        strokeWidth="12"
      />
      <rect x="82" y="66" width="22" height="18" rx="5" fill="#C9824F" />
      <rect x="150" y="78" width="18" height="14" rx="4" fill="#356F8F" />
      <circle cx="34" cy="96" r="9" fill="#256F68" opacity="0.45" />
      <path
        d="M112 14c-11 0-18 8-18 17 0 12 18 27 18 27s18-15 18-27c0-9-7-17-18-17Z"
        fill="#256F68"
        stroke="#241914"
        strokeWidth="4"
      />
      <circle cx="112" cy="31" r="6" fill="#FFF7EF" />
    </svg>
  );
}

function AgentBar() {
  return (
    <div className="flex items-center gap-2.5 border-t border-pp-sand/70 px-4 py-2.5">
      <Image
        src={AVATAR_SRC}
        alt=""
        width={24}
        height={24}
        className="size-6 rounded-full"
      />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold tracking-[-0.01em] text-pp-ink">
          Alex Rivera
        </p>
        <p className="truncate text-[9px] tracking-[-0.01em] text-pp-stone">
          Riverside Realty · DRE 00000000
        </p>
      </div>
    </div>
  );
}

function JustListedCard() {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white ring-1 ring-pp-sand/60 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)]">
      <div className="relative">
        <div className="aspect-[4/3]">
          <HouseIllustration />
        </div>
        <span className="absolute top-3 left-3 rounded-[8px] bg-pp-caramel px-3 py-1 text-[10px] font-semibold tracking-[-0.01em] text-pp-ink">
          Just listed
        </span>
      </div>
      <div className="px-4 pt-3 pb-3">
        <p className="text-[13px] font-semibold tracking-[-0.015em] text-pp-ink">
          128 Maple Street
        </p>
        <p className="mt-0.5 text-[11px] tracking-[-0.01em] text-pp-stone">
          3 bd · 2 ba · Oakwood
        </p>
        <p className="mt-2 text-[11px] font-medium tracking-[-0.01em] text-pp-teal">
          Book a tour →
        </p>
      </div>
      <AgentBar />
    </article>
  );
}

function MarketUpdateCard() {
  const bars = [38, 52, 44, 63, 56, 74];
  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] bg-white ring-1 ring-pp-sand/60 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)]">
      <div className="flex-1 px-4 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-teal">
          Market update · March
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-5xl font-semibold tabular-nums leading-none tracking-[-0.04em] text-pp-ink">
            32
          </span>
          <span className="pb-0.5 text-[11px] font-medium leading-tight tracking-[-0.01em] text-pp-stone">
            median days
            <br />
            on market
          </span>
        </div>
        <div className="mt-4 flex h-16 items-end gap-1.5">
          {bars.map((height, index) => (
            <span
              key={index}
              className={`flex-1 rounded-t-sm ${
                index === bars.length - 1 ? "bg-pp-teal" : "bg-pp-teal/30"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <p className="mt-3 text-[10.5px] leading-snug tracking-[-0.01em] text-pp-stone">
          What this means: well-priced homes are still moving. Source: local
          MLS.
        </p>
      </div>
      <AgentBar />
    </article>
  );
}

function AgentTipCard() {
  const tips = ["Check natural light", "Test water pressure", "Walk the block"];
  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] bg-pp-peach ring-1 ring-pp-sand/40 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)]">
      <div className="flex-1 px-4 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-bark">
          Buyer tip
        </p>
        <p className="mt-2 text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink">
          Before you tour a home, check these five things.
        </p>
        <ul className="mt-3 space-y-2">
          {tips.map((tip) => (
            <li
              key={tip}
              className="flex items-center gap-2 rounded-lg bg-white/70 px-2.5 py-1.5"
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-pp-teal text-white">
                <CheckIcon className="size-2.5" strokeWidth={2.5} />
              </span>
              <span className="text-[11px] font-medium tracking-[-0.01em] text-pp-ink">
                {tip}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] font-medium tracking-[-0.01em] text-pp-bark">
          Save this for your next tour
        </p>
      </div>
      <div className="border-t border-pp-sand/40">
        <AgentBar />
      </div>
    </article>
  );
}

function NeighborhoodCard() {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white ring-1 ring-pp-sand/60 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)]">
      <div className="relative">
        <div className="aspect-[4/3]">
          <MapIllustration />
        </div>
        <span className="absolute top-3 left-3 flex items-center gap-1 rounded-[8px] bg-pp-teal px-3 py-1 text-[10px] font-semibold tracking-[-0.01em] text-white">
          <MapPinIcon className="size-3" strokeWidth={2.25} />
          Community
        </span>
      </div>
      <div className="px-4 pt-3 pb-3">
        <p className="text-[13px] font-semibold tracking-[-0.015em] text-pp-ink">
          Weekend guide: Oakwood
        </p>
        <p className="mt-0.5 text-[11px] tracking-[-0.01em] text-pp-stone">
          3 local stops worth your Saturday
        </p>
        <p className="mt-2 text-[11px] font-medium tracking-[-0.01em] text-pp-teal">
          See the guide →
        </p>
      </div>
      <AgentBar />
    </article>
  );
}

const TEMPLATES = [
  { name: "Just listed", pillar: "Property", Card: JustListedCard },
  { name: "Market update", pillar: "Market", Card: MarketUpdateCard },
  { name: "Agent tip", pillar: "Education", Card: AgentTipCard },
  { name: "Neighborhood spotlight", pillar: "Community", Card: NeighborhoodCard },
];

export function TemplateShowcase() {
  return (
    <section id="templates" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
              Templates
            </p>
            <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
              A template for every market moment
            </h2>
            <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
              Twelve production-ready templates across property, market,
              education, and community — in square, portrait, and story
              formats. Start from a template or a blank canvas; either way,
              your brand is applied automatically.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map(({ name, pillar, Card }) => (
            <div key={name}>
              <Card />
              <p className="mt-3.5 px-0.5 text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                {name}
              </p>
              <p className="px-0.5 text-[13px] tracking-[-0.01em] text-pp-stone">
                {pillar} template
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[13px] tracking-[-0.01em] text-pp-stone">
          Sample content shown for illustration. Every post ships with your
          details, your market, and a protected compliance footer.
        </p>
      </div>
    </section>
  );
}
