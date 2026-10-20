"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { ArrowRightIcon } from "./icons";
import { MapNode } from "./map-node";
import {
  getNavItem,
  getPresenceMapItems,
  SUGGESTED_NEXT_ID,
  type DashboardNavId,
} from "./nav-config";

const MASCOT_SRC =
  "/postpooch_web_mascot_assets/responsive/with-shadow/webp/postpooch-mascot-with-shadow-256w.webp";

const TRAIL_INSET_PX = 32; // matches top-8 / bottom-8

export function PresenceMap() {
  const items = getPresenceMapItems();
  const next = getNavItem(SUGGESTED_NEXT_ID);
  const trailRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [fillHeight, setFillHeight] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<DashboardNavId>(SUGGESTED_NEXT_ID);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = trailRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const trailHeight = rect.height - TRAIL_INSET_PX * 2;
    if (trailHeight <= 0) return;

    const y = event.clientY - rect.top - TRAIL_INSET_PX;
    setFillHeight(Math.min(trailHeight, Math.max(0, y)));

    let closestId = activeId;
    let closestDist = Infinity;
    for (let i = 0; i < items.length; i++) {
      const node = nodeRefs.current[i];
      if (!node) continue;
      const nodeRect = node.getBoundingClientRect();
      const cx = nodeRect.left + nodeRect.width / 2;
      const cy = nodeRect.top + nodeRect.height / 2;
      const dist = Math.hypot(event.clientX - cx, event.clientY - cy);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = items[i].id;
      }
    }
    if (closestId !== activeId) setActiveId(closestId);
  }

  return (
    <section aria-label="Presence path" className="relative mx-auto w-full max-w-xl pb-28 sm:pb-24">
      {/* Guide moment — restrained, not a second hero */}
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <Image
          src={MASCOT_SRC}
          alt=""
          width={96}
          height={96}
          className="h-20 w-auto sm:h-24 motion-safe:animate-float"
          priority
        />
        <p className="max-w-[16rem] text-sm leading-6 text-pp-stone">
          Follow the path to keep your market presence ready.
        </p>
      </div>

      <div
        ref={trailRef}
        className="relative"
        onMouseMove={handleMouseMove}
      >
        {/* Quiet trail — structure without Duolingo candy thickness */}
        <div
          className="pointer-events-none absolute top-8 bottom-8 left-1/2 w-1 -translate-x-1/2 rounded-pill bg-pp-sand"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-8 left-1/2 w-1 -translate-x-1/2 rounded-pill bg-pp-teal/45 transition-[height] duration-75 ease-out motion-reduce:transition-none"
          style={{
            height:
              fillHeight == null
                ? "18%"
                : `${fillHeight}px`,
          }}
          aria-hidden
        />

        <ol className="relative flex flex-col gap-11 sm:gap-14">
          {items.map((item, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            const state = item.id === activeId ? "current" : "available";
            return (
              <li
                key={item.id}
                ref={(node) => {
                  nodeRefs.current[index] = node;
                }}
              >
                <MapNode
                  item={item}
                  state={state}
                  side={side}
                  index={index}
                />
              </li>
            );
          })}
        </ol>
      </div>

      {/* Airbnb sticky confirmation — one clear next step */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pp-sand/80 bg-pp-cream/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:static lg:mt-12 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 lg:justify-center">
          <div className="min-w-0 lg:hidden">
            <p className="truncate text-sm font-medium text-pp-ink">
              {next.label}
            </p>
            <p className="truncate text-xs text-pp-stone">{next.mapWhy}</p>
          </div>
          <Link
            href={next.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-pp-teal px-6 py-2.5 text-sm font-semibold text-pp-white shadow-card-sm transition-[background-color,transform] duration-200 ease-out hover:bg-pp-teal-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal lg:px-7 lg:py-3.5"
          >
            Continue
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
