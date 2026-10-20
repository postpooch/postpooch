import Link from "next/link";
import type { DashboardNavItem } from "./nav-config";
import { NavIcon } from "./icons";

export type MapNodeState = "current" | "available";

type MapNodeProps = {
  item: DashboardNavItem;
  state: MapNodeState;
  side: "left" | "right";
  index: number;
};

export function MapNode({ item, state, side, index }: MapNodeProps) {
  const isCurrent = state === "current";

  return (
    <div
      className={[
        "relative flex w-full items-center justify-center",
        side === "left"
          ? "sm:justify-start sm:pr-[12%]"
          : "sm:justify-end sm:pl-[12%]",
        "motion-safe:animate-pp-map-in",
      ].join(" ")}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Soft hub where node meets the trail */}
      <span
        className={[
          "pointer-events-none absolute top-[36px] left-1/2 size-2.5 -translate-x-1/2 rounded-full sm:top-[40px]",
          isCurrent ? "bg-pp-teal" : "bg-pp-sand",
        ].join(" ")}
        aria-hidden
      />

      <Link
        href={item.href}
        aria-current={isCurrent ? "step" : undefined}
        className={[
          "group relative flex w-full max-w-[240px] flex-col items-center gap-3 rounded-marketing p-1.5 outline-offset-4 transition-transform duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-pp-teal",
          "motion-safe:hover:-translate-y-0.5",
          side === "left" ? "sm:items-start" : "sm:items-end",
        ].join(" ")}
      >
        <span
          className={[
            "relative flex size-[68px] items-center justify-center rounded-full transition-[background-color,border-color,box-shadow,color] duration-200 ease-out sm:size-[76px]",
            isCurrent
              ? "bg-pp-teal text-pp-white shadow-card group-hover:bg-pp-teal-dark"
              : "border border-pp-sand/90 bg-pp-white text-pp-ink shadow-card-sm group-hover:border-pp-caramel/70 group-hover:bg-pp-cream",
          ].join(" ")}
        >
          {isCurrent ? (
            <span
              className="absolute -inset-2 rounded-full border border-pp-teal/30"
              aria-hidden
            />
          ) : null}
          <NavIcon id={item.id} className="size-7 sm:size-[30px]" />
        </span>

        <span
          className={[
            "text-center sm:max-w-[190px]",
            side === "left" ? "sm:text-left" : "sm:text-right",
          ].join(" ")}
        >
          <span className="block text-[15px] font-semibold tracking-tight text-pp-ink">
            {item.label}
          </span>
          <span className="mt-1 block text-sm leading-5 text-pp-stone">
            {item.mapWhy}
          </span>
          {isCurrent ? (
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-pp-teal">
              <span
                className="size-1.5 rounded-full bg-pp-teal"
                aria-hidden
              />
              Up next
            </span>
          ) : null}
        </span>
      </Link>
    </div>
  );
}
