"use client";

import Image from "next/image";
import Link from "next/link";
import { Aurora, EyebrowPill } from "performative-ui";
import { ArrowRightIcon } from "./icons";

const MASCOT_SRC =
  "/postpooch_web_mascot_assets/master/postpooch-mascot-with-shadow.webp";

export function FinalCta() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="relative overflow-hidden rounded-[30px] border border-pp-sand/70 bg-gradient-to-br from-pp-white via-pp-white to-pp-mist/65 px-6 py-10 shadow-[0_20px_70px_rgba(36,25,20,0.08)] sm:px-9 sm:py-14">
          <Aurora
            blur={64}
            blobs={[
              { color: "rgba(37, 111, 104, 0.22)", x: 82, y: 20, size: 44 },
              { color: "rgba(246, 177, 119, 0.3)", x: 16, y: 78, size: 48 },
              { color: "rgba(234, 217, 200, 0.5)", x: 48, y: 48, size: 40 },
            ]}
          />

          <div className="relative z-[1] grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <EyebrowPill statusColor="var(--pp-teal)">Get started</EyebrowPill>
              <h2 className="mt-4 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
                Your next week of posts is ready.
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
                Review, tweak, or schedule all — and get back to the work that
                actually needs you. Your posts, fetched.
              </p>
              <div className="mt-7 rounded-[999px] border border-pp-sand/80 bg-pp-white/95 p-2 shadow-[0_8px_28px_rgba(36,25,20,0.09)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-pp-teal px-5 py-3 text-[13px] font-semibold tracking-[-0.01em] text-pp-white transition hover:bg-pp-teal-dark"
                  >
                    Start free trial
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                  <a
                    href="#templates"
                    className="rounded-full border border-pp-sand/90 px-4 py-3 text-[13px] font-medium tracking-[-0.01em] text-pp-stone transition hover:text-pp-ink"
                  >
                    Browse templates
                  </a>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[240px] lg:max-w-[280px]">
              <Image
                src={MASCOT_SRC}
                alt=""
                width={790}
                height={835}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
