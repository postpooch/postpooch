"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ComposeStageNav } from "./stage-nav";

const AVATAR_SRC =
  "/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp";

type ComposeFlowShellProps = {
  emailId: string;
  /** Primary top-right action (Send / Schedule). */
  primaryAction?: ReactNode;
  children: ReactNode;
};

/**
 * Full-bleed campaign review chrome: brand + stage stepper + send actions
 * over a cream canvas, matching the rest of the dashboard control room.
 */
export function ComposeFlowShell({
  emailId,
  primaryAction,
  children,
}: ComposeFlowShellProps) {
  return (
    <div className="flex h-[calc(100dvh-3.75rem)] flex-col bg-pp-cream text-pp-ink lg:h-dvh">
      <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-3 border-b border-pp-sand/80 bg-pp-white px-4 sm:gap-4 sm:px-6">
        <Link
          href="/dashboard/newsletter"
          aria-label="postpooch newsletter"
          className="inline-flex shrink-0 items-center gap-2 rounded-control outline-offset-4 focus-visible:outline-2 focus-visible:outline-pp-teal"
        >
          <Image
            src={AVATAR_SRC}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-full"
            priority
          />
          <span className="hidden font-display text-[18px] font-bold lowercase leading-none tracking-tight text-pp-ink sm:inline">
            postpooch
          </span>
        </Link>

        <ComposeStageNav emailId={emailId} activeStage="send" />

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/dashboard/newsletter"
            className="inline-flex cursor-pointer items-center justify-center rounded-[10px] px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
          >
            Finish later
          </Link>
          {primaryAction}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-10 lg:px-8 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
