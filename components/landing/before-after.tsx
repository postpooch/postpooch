"use client";

import { BeforeAfter as PuiBeforeAfter, GradientText } from "performative-ui";

export function BeforeAfter() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
            The difference
          </p>
          <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
            Same expertise.{" "}
            <GradientText as="span">Far less scramble.</GradientText>
          </h2>
          <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
            Stop rebuilding posts from scratch every week. postpooch prepares
            the queue — you keep the voice.
          </p>
        </div>

        <div className="mt-10">
          <PuiBeforeAfter
            brand="with postpooch"
            beforeLabel="Before"
            afterLabel="After"
            before={[
              "Sunday night Canva sessions",
              "Blank captions and stock photos",
              "Listings only — then radio silence",
              "Brand colors that drift by office",
            ]}
            after={[
              "Week of posts waiting Monday morning",
              "Your headshot, colors, and tone baked in",
              "Balanced mix: expertise + property + community",
              "Compliance zones that stay put",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
