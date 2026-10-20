import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/landing/wordmark";

const MASCOT_SRC =
  "/postpooch_web_mascot_assets/master/postpooch-mascot-with-shadow.webp";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 overflow-hidden bg-pp-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(249,177,119,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(37,111,104,0.12),_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-pp-sand/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-pp-peach/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 lg:px-8 lg:py-12">
        <Wordmark size="lg" />

        <div className="mt-10 grid flex-1 items-center gap-12 lg:mt-0 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="hidden lg:block">
            <p className="font-display text-4xl font-bold leading-tight tracking-tight text-pp-ink xl:text-5xl">
              Your posts,
              <br />
              fetched.
            </p>
            <p className="mt-4 max-w-md text-lg leading-8 text-pp-stone">
              Automated social content for real estate agents — stay top of feed
              without living in Canva.
            </p>
            <div className="relative mt-10 max-w-sm">
              <div
                aria-hidden
                className="absolute inset-x-8 bottom-0 top-8 rounded-t-[999px] bg-pp-sand/70"
              />
              <Image
                src={MASCOT_SRC}
                alt=""
                width={790}
                height={835}
                priority
                className="relative z-10 w-full max-w-[280px] animate-float"
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <div className="rounded-marketing border border-pp-sand/80 bg-pp-white/90 p-7 shadow-card backdrop-blur-sm sm:p-9">
              <h1 className="font-display text-2xl font-bold tracking-tight text-pp-ink sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-pp-stone">{subtitle}</p>

              <div className="mt-7">{children}</div>
            </div>

            <p className="mt-6 text-center text-xs text-pp-stone">
              <Link href="/" className="underline-offset-2 hover:text-pp-teal hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
