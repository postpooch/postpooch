"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
  COMPOSE_MAIN_STAGES,
  composeStageHref,
  type ComposeMainStageId,
} from "./flow-config";

type ComposeStageNavProps = {
  emailId: string;
  activeStage: ComposeMainStageId;
  /**
   * When set, past/future stage clicks call this instead of a plain Link —
   * used by the editor to flush the draft before leaving.
   */
  onNavigate?: (href: string) => void;
  disabled?: boolean;
};

/**
 * Templates › Design › Send progress crumbs shared by editor + review chrome.
 */
export function ComposeStageNav({
  emailId,
  activeStage,
  onNavigate,
  disabled = false,
}: ComposeStageNavProps) {
  return (
    <nav
      aria-label="Campaign progress"
      className="mx-auto flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.08em] sm:text-[12px] sm:tracking-[0.1em]"
    >
      {COMPOSE_MAIN_STAGES.map((stage, index) => (
        <StageCrumb
          key={stage.id}
          stageId={stage.id}
          label={stage.label}
          href={composeStageHref(stage.id, emailId)}
          activeStage={activeStage}
          showDivider={index > 0}
          onNavigate={onNavigate}
          disabled={disabled}
        />
      ))}
    </nav>
  );
}

function StageCrumb({
  stageId,
  label,
  href,
  activeStage,
  showDivider,
  onNavigate,
  disabled,
}: {
  stageId: ComposeMainStageId;
  label: string;
  href: string;
  activeStage: ComposeMainStageId;
  showDivider: boolean;
  onNavigate?: (href: string) => void;
  disabled: boolean;
}) {
  const activeIndex = COMPOSE_MAIN_STAGES.findIndex((s) => s.id === activeStage);
  const stageIndex = COMPOSE_MAIN_STAGES.findIndex((s) => s.id === stageId);
  const isActive = stageId === activeStage;
  const isPast = stageIndex < activeIndex;
  const isFuture = stageIndex > activeIndex;

  const labelClass = [
    "rounded-sm uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
    isActive
      ? "text-pp-ink"
      : isPast
        ? "cursor-pointer text-pp-stone hover:text-pp-ink"
        : "cursor-pointer text-pp-sand hover:text-pp-stone",
  ].join(" ");

  let content: ReactNode;
  if (isActive) {
    content = (
      <span className={labelClass} aria-current="step">
        {label}
      </span>
    );
  } else if (onNavigate && (isPast || isFuture)) {
    content = (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onNavigate(href)}
        className={[
          labelClass,
          disabled ? "cursor-wait opacity-70" : "cursor-pointer",
        ].join(" ")}
      >
        {label}
      </button>
    );
  } else {
    content = (
      <Link href={href} className={`cursor-pointer ${labelClass}`}>
        {label}
      </Link>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {showDivider ? (
        <span className="text-pp-sand" aria-hidden>
          ›
        </span>
      ) : null}
      {content}
    </span>
  );
}
