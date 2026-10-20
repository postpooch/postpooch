import Image from "next/image";
import type { TemplateFormat, TemplatePreviewVariant } from "./templates";

const AVATAR_SRC =
  "/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp";

const FORMAT_ASPECT: Record<TemplateFormat, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  story: "aspect-[9/16]",
};

type PreviewProps = {
  variant: TemplatePreviewVariant;
  format: TemplateFormat;
};

/** Miniature social post compositions — the template is the product. */
export function TemplatePreview({ variant, format }: PreviewProps) {
  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-[14px] bg-pp-white shadow-[0_2px_8px_rgba(36,25,20,0.08)] ring-1 ring-pp-sand/70",
        FORMAT_ASPECT[format],
      ].join(" ")}
    >
      <PreviewBody variant={variant} />
    </div>
  );
}

function PreviewBody({ variant }: { variant: TemplatePreviewVariant }) {
  switch (variant) {
    case "just-listed":
      return <JustListedPreview />;
    case "open-house":
      return <OpenHousePreview />;
    case "just-sold":
      return <JustSoldPreview />;
    case "property-feature":
      return <PropertyFeaturePreview />;
    case "market-update":
      return <MarketUpdatePreview />;
    case "one-stat":
      return <OneStatPreview />;
    case "market-compare":
      return <MarketComparePreview />;
    case "what-this-means":
      return <WhatThisMeansPreview />;
    case "agent-tip":
      return <AgentTipPreview />;
    case "checklist":
      return <ChecklistPreview />;
    case "myth-reality":
      return <MythRealityPreview />;
    case "steps":
      return <StepsPreview />;
    case "neighborhood":
      return <NeighborhoodPreview />;
    case "local-business":
      return <LocalBusinessPreview />;
    case "testimonial":
      return <TestimonialPreview />;
    case "consultation":
      return <ConsultationPreview />;
  }
}

function AgentFooter({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "flex items-center gap-1.5 border-t border-pp-sand/70 bg-pp-white",
        compact ? "px-2 py-1.5" : "px-2.5 py-2",
      ].join(" ")}
    >
      <Image
        src={AVATAR_SRC}
        alt=""
        width={20}
        height={20}
        className={compact ? "size-4 rounded-full" : "size-5 rounded-full"}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[8px] font-semibold leading-tight text-pp-ink">
          Alex Rivera
        </p>
        {!compact ? (
          <p className="truncate text-[7px] leading-tight text-pp-stone">
            Riverside Realty
          </p>
        ) : null}
      </div>
    </div>
  );
}

function HouseArt() {
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
      <rect x="62" y="72" width="16" height="14" rx="4" fill="#356F8F" />
      <rect x="122" y="72" width="16" height="14" rx="4" fill="#356F8F" />
    </svg>
  );
}

function MapArt() {
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

function JustListedPreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <HouseArt />
        <span className="absolute left-2 top-2 rounded-pill bg-pp-caramel px-2 py-0.5 text-[7px] font-bold text-pp-ink">
          Just listed
        </span>
      </div>
      <div className="px-2.5 py-2">
        <p className="text-[9px] font-bold leading-tight text-pp-ink">
          128 Maple Street
        </p>
        <p className="mt-0.5 text-[7px] text-pp-stone">3 bd · 2 ba · Oakwood</p>
      </div>
      <AgentFooter />
    </div>
  );
}

function OpenHousePreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-[1.15]">
        <HouseArt />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-pp-cream px-2.5 py-2.5">
        <div>
          <p className="text-[7px] font-bold uppercase tracking-wide text-pp-teal">
            Open house
          </p>
          <p className="mt-1 text-[10px] font-bold leading-snug text-pp-ink">
            Saturday · 1–3 PM
          </p>
          <p className="mt-1 text-[7px] leading-snug text-pp-stone">
            128 Maple Street, Oakwood
          </p>
        </div>
        <p className="text-[8px] font-semibold text-pp-teal">Stop by →</p>
      </div>
      <AgentFooter compact />
    </div>
  );
}

function JustSoldPreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <HouseArt />
        <div className="absolute inset-0 flex items-center justify-center bg-pp-ink/35">
          <span className="rounded-pill bg-pp-teal px-3 py-1 text-[8px] font-bold tracking-wide text-pp-white">
            Just sold
          </span>
        </div>
      </div>
      <div className="px-2.5 py-2">
        <p className="text-[9px] font-bold leading-tight text-pp-ink">
          Welcomed home in Oakwood
        </p>
        <p className="mt-0.5 text-[7px] text-pp-stone">Closed this week</p>
      </div>
      <AgentFooter />
    </div>
  );
}

function PropertyFeaturePreview() {
  return (
    <div className="flex h-full flex-col bg-pp-white">
      <div className="relative min-h-0 flex-[1.2]">
        <HouseArt />
      </div>
      <div className="flex flex-1 flex-col justify-center px-2.5 py-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-cocoa">
          Feature
        </p>
        <p className="mt-1 text-[10px] font-bold leading-snug text-pp-ink">
          Chef&apos;s kitchen with morning light
        </p>
        <p className="mt-1.5 text-[7px] leading-snug text-pp-stone">
          One detail worth the tour
        </p>
      </div>
      <AgentFooter compact />
    </div>
  );
}

function MarketUpdatePreview() {
  const bars = [38, 52, 44, 63, 56, 74];
  return (
    <div className="flex h-full flex-col bg-pp-white">
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-blue">
          Market · March
        </p>
        <div className="mt-2 flex items-end gap-1.5">
          <span className="text-[28px] font-semibold leading-none tabular-nums tracking-tight text-pp-ink">
            32
          </span>
          <span className="pb-0.5 text-[7px] font-medium leading-tight text-pp-stone">
            median days
            <br />
            on market
          </span>
        </div>
        <div className="mt-3 flex h-10 items-end gap-1">
          {bars.map((height, index) => (
            <span
              key={index}
              className={[
                "flex-1 rounded-t-sm",
                index === bars.length - 1 ? "bg-pp-blue" : "bg-pp-blue/25",
              ].join(" ")}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <p className="mt-2 text-[7px] leading-snug text-pp-stone">
          Well-priced homes are still moving.
        </p>
      </div>
      <AgentFooter />
    </div>
  );
}

function OneStatPreview() {
  return (
    <div className="flex h-full flex-col bg-pp-blue px-3 py-4 text-pp-white">
      <p className="text-[7px] font-semibold uppercase tracking-wide text-pp-white/70">
        This month
      </p>
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[36px] font-semibold leading-none tabular-nums tracking-tight">
          4.2%
        </p>
        <p className="mt-2 text-[10px] font-semibold leading-snug">
          Month-over-month inventory change
        </p>
        <p className="mt-2 text-[8px] leading-snug text-pp-white/75">
          What this means for buyers in your zip.
        </p>
      </div>
      <p className="text-[7px] text-pp-white/55">Source: local MLS</p>
    </div>
  );
}

function MarketComparePreview() {
  return (
    <div className="flex h-full flex-col bg-pp-white">
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-blue">
          Comparison
        </p>
        <p className="mt-1.5 text-[10px] font-bold leading-snug text-pp-ink">
          Oakwood · Feb vs Mar
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-control bg-pp-mist px-2 py-2">
            <p className="text-[7px] text-pp-stone">Last month</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-pp-ink">
              $612k
            </p>
          </div>
          <div className="rounded-control bg-[#E4EEF4] px-2 py-2">
            <p className="text-[7px] text-pp-blue">This month</p>
            <p className="mt-1 text-[16px] font-semibold tabular-nums text-pp-ink">
              $628k
            </p>
          </div>
        </div>
        <p className="mt-2.5 text-[7px] leading-snug text-pp-stone">
          Median sale price, single-family.
        </p>
      </div>
      <AgentFooter />
    </div>
  );
}

function WhatThisMeansPreview() {
  return (
    <div className="flex h-full flex-col bg-pp-mist">
      <div className="flex flex-1 flex-col justify-between px-2.5 py-3">
        <div>
          <p className="text-[7px] font-bold uppercase tracking-wide text-pp-blue">
            What this means
          </p>
          <p className="mt-2 text-[22px] font-semibold leading-none tabular-nums text-pp-ink">
            12
          </p>
          <p className="mt-1 text-[8px] font-medium text-pp-stone">
            new listings this week
          </p>
        </div>
        <div className="rounded-control bg-pp-white px-2.5 py-2 shadow-card-sm">
          <p className="text-[8px] font-semibold leading-snug text-pp-ink">
            More choices for buyers — still compete on condition and price.
          </p>
        </div>
      </div>
      <AgentFooter compact />
    </div>
  );
}

function AgentTipPreview() {
  return (
    <div className="flex h-full flex-col bg-pp-peach">
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-bark">
          Buyer tip
        </p>
        <p className="mt-2 text-[11px] font-bold leading-snug text-pp-ink">
          Before you tour, check these five things.
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {["Natural light", "Water pressure", "Walk the block"].map((tip) => (
            <li
              key={tip}
              className="flex items-center gap-1.5 rounded-control bg-pp-white/75 px-2 py-1"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-pp-teal" />
              <span className="text-[8px] font-medium text-pp-ink">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      <AgentFooter />
    </div>
  );
}

function ChecklistPreview() {
  const items = ["Gather docs", "Get pre-approved", "Tour weekends"];
  return (
    <div className="flex h-full flex-col bg-pp-cream">
      <div className="flex flex-1 flex-col px-2.5 py-3">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-bark">
          Checklist
        </p>
        <p className="mt-1.5 text-[11px] font-bold leading-snug text-pp-ink">
          First-time buyer prep
        </p>
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={item} className="flex items-start gap-2">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-pp-teal text-[8px] font-bold text-pp-white">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[9px] font-medium text-pp-ink">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <AgentFooter compact />
    </div>
  );
}

function MythRealityPreview() {
  return (
    <div className="flex h-full flex-col bg-pp-white">
      <div className="flex flex-1 flex-col gap-2 px-2.5 py-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-bark">
          Myth vs reality
        </p>
        <div className="rounded-control bg-pp-mist px-2 py-2">
          <p className="text-[7px] font-semibold text-pp-stone">Myth</p>
          <p className="mt-0.5 text-[8px] font-medium leading-snug text-pp-ink">
            You need 20% down to buy.
          </p>
        </div>
        <div className="rounded-control bg-[#E6EFEB] px-2 py-2">
          <p className="text-[7px] font-semibold text-pp-teal">Reality</p>
          <p className="mt-0.5 text-[8px] font-medium leading-snug text-pp-ink">
            Many programs start much lower — ask what fits you.
          </p>
        </div>
      </div>
      <AgentFooter />
    </div>
  );
}

function StepsPreview() {
  const steps = ["Offer", "Inspect", "Close"];
  return (
    <div className="flex h-full flex-col bg-pp-ink px-3 py-4 text-pp-cream">
      <p className="text-[7px] font-semibold uppercase tracking-wide text-pp-peach">
        How it works
      </p>
      <p className="mt-2 text-[12px] font-semibold leading-snug">
        From offer to keys
      </p>
      <ol className="mt-4 flex flex-1 flex-col justify-center gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-pp-teal text-[10px] font-bold text-pp-white">
              {i + 1}
            </span>
            <span className="text-[11px] font-medium">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NeighborhoodPreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <MapArt />
      </div>
      <div className="px-2.5 py-2">
        <p className="text-[9px] font-bold leading-tight text-pp-ink">
          Weekend guide: Oakwood
        </p>
        <p className="mt-0.5 text-[7px] text-pp-stone">
          3 local stops worth Saturday
        </p>
      </div>
      <AgentFooter />
    </div>
  );
}

function LocalBusinessPreview() {
  return (
    <div className="flex h-full flex-col bg-pp-white">
      <div className="flex min-h-0 flex-[1.1] items-center justify-center bg-[#F8E8DE]">
        <div className="flex size-14 items-center justify-center rounded-full bg-pp-white shadow-card-sm">
          <svg viewBox="0 0 24 24" className="size-6 text-pp-cocoa" aria-hidden>
            <path
              d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"
              fill="currentColor"
              opacity="0.9"
            />
            <path
              d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <path
              d="M7 5.5c.4-.8.4-1.6 0-2.4M10 5.5c.4-.8.4-1.6 0-2.4M13 5.5c.4-.8.4-1.6 0-2.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center px-2.5 py-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-cocoa">
          Local favorite
        </p>
        <p className="mt-1 text-[10px] font-bold leading-snug text-pp-ink">
          Harbor Roast · Maple Ave
        </p>
        <p className="mt-1 text-[7px] leading-snug text-pp-stone">
          Where neighbors start Saturday
        </p>
      </div>
      <AgentFooter compact />
    </div>
  );
}

function TestimonialPreview() {
  return (
    <div className="flex h-full flex-col bg-pp-cream">
      <div className="flex flex-1 flex-col justify-between px-2.5 py-3">
        <p className="text-[7px] font-bold uppercase tracking-wide text-pp-bark">
          Client note
        </p>
        <p className="text-[11px] font-semibold leading-snug text-pp-ink">
          “Alex made every step feel clear — we never felt rushed.”
        </p>
        <p className="text-[8px] font-medium text-pp-stone">— Jordan & Sam</p>
      </div>
      <AgentFooter />
    </div>
  );
}

function ConsultationPreview() {
  return (
    <div className="flex h-full flex-col items-start justify-between bg-pp-teal px-3 py-4 text-pp-white">
      <Image
        src="/postpooch_web_mascot_assets/responsive/transparent/webp/postpooch-mascot-transparent-128w.webp"
        alt=""
        width={48}
        height={48}
        className="h-10 w-auto"
      />
      <div>
        <p className="text-[12px] font-semibold leading-snug">
          Ready for a calm market conversation?
        </p>
        <p className="mt-2 text-[8px] leading-snug text-pp-white/80">
          Book a 20-minute consult — no pressure, just clarity.
        </p>
      </div>
      <span className="rounded-pill bg-pp-white px-3 py-1.5 text-[8px] font-bold text-pp-teal">
        Schedule a time
      </span>
    </div>
  );
}
