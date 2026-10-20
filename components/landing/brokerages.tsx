import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "./icons";

const POINTS = [
  {
    title: "Brand controls that hold the line",
    copy: "Set approved colors, fonts, and logo use once. Every agent's posts stay on the brokerage brand automatically.",
  },
  {
    title: "Compliance baked in, not bolted on",
    copy: "Reserved zones for brokerage name, license details, and listing attribution — consistent across every office.",
  },
  {
    title: "Agents stay the visible experts",
    copy: "Each agent's voice, headshot, and service area lead their posts. The brokerage brand supports, never smothers.",
  },
];

export function Brokerages() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-pp-ink px-6 py-12 text-pp-cream shadow-[0_20px_70px_rgba(36,25,20,0.18)] sm:px-9 sm:py-16">
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-pp-teal/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-pp-sand/20 blur-3xl" />
          <div className="relative">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-peach">
                For teams and brokerages
              </p>
              <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[45px]">
                One brand standard. Every agent posting.
              </h2>
              <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-cream/70">
                Growing teams and multi-office brokerages get the same prepared
                workflow, plus the controls leadership needs to trust what goes
                out.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
              {POINTS.map((point) => (
                <div
                  key={point.title}
                  className="rounded-[18px] bg-white/[0.06] p-6 ring-1 ring-white/10"
                >
                  <span className="flex size-9 items-center justify-center rounded-[10px] bg-pp-peach/15 text-pp-peach">
                    <CheckIcon className="size-4" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.015em]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-5 tracking-[-0.01em] text-pp-cream/65">
                    {point.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[12px] bg-pp-teal px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] text-white transition hover:bg-pp-teal-dark"
              >
                Talk to us about your brokerage
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
