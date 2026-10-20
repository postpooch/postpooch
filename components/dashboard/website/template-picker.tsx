"use client";

import Image from "next/image";
import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { WebsiteTemplate } from "@/app/websites/website-templates";

export type WebsiteTemplateOption = WebsiteTemplate & {
  previewUrl: string;
};

type TemplatePickerProps = {
  templates: WebsiteTemplateOption[];
  currentTemplateId?: string | null;
};

/**
 * Website template discovery — Apple hierarchy + Airbnb media grid.
 *
 * Concrete principles applied:
 * - Photo is the product: large equal-aspect previews, text secondary below
 * - No chrome cards: rounded media only; metadata sits in open space
 * - One quiet header; the grid does the work
 * - Soft hover (scale + lift), staggered entrance — presence, not noise
 * - Selection is a thin ring + dock CTA, not badges or clutter
 */
export function TemplatePicker({ templates, currentTemplateId = null }: TemplatePickerProps) {
  const router = useRouter();
  const listId = useId();
  const [selectedId, setSelectedId] = useState<string | null>(currentTemplateId);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = templates.find((template) => template.id === selectedId);

  async function useTemplate() {
    if (!selected) return;
    if (
      currentTemplateId &&
      currentTemplateId !== selected.id &&
      !window.confirm(
        "Switching templates changes how your site looks. Your work on each template is saved separately. Continue?",
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/websites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template: selected.id }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(payload.error || "Unable to use this template.");
        router.push("/dashboard/website");
        router.refresh();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Unable to use this template.");
      }
    });
  }

  return (
    <div className="relative pb-28">
      <header className="relative overflow-hidden rounded-[30px] border border-pp-sand/70 bg-gradient-to-br from-pp-white via-pp-white to-pp-mist/65 px-6 py-8 shadow-[0_20px_70px_rgba(36,25,20,0.08)] sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pp-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pp-sand/45 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
            Website design
          </p>
          <h1 className="mt-3 max-w-3xl text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
            Find the perfect first impression for your brand
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
            Start with a layout style you love, then customize every detail in
            the editor.
          </p>

          <div className="mt-7 rounded-[999px] border border-pp-sand/80 bg-pp-white/95 p-2 shadow-[0_8px_28px_rgba(36,25,20,0.09)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
              <div className="min-w-0 flex-1 rounded-full bg-pp-cream px-4 py-3 text-[14px] font-medium tracking-[-0.01em] text-pp-ink">
                Explore templates
              </div>
              <div className="rounded-full border border-pp-sand/90 px-4 py-3 text-[13px] font-medium tracking-[-0.01em] text-pp-stone">
                {templates.length} styles
              </div>
              <div className="rounded-full border border-pp-sand/90 px-4 py-3 text-[13px] font-medium tracking-[-0.01em] text-pp-stone">
                Mobile-ready
              </div>
              <div className="rounded-full bg-pp-teal px-5 py-3 text-[13px] font-semibold tracking-[-0.01em] text-pp-white">
                Curated picks
              </div>
            </div>
          </div>
        </div>
      </header>

      <ul
        id={listId}
        role="listbox"
        aria-label="Website templates"
        aria-activedescendant={
          selectedId ? `${listId}-${selectedId}` : undefined
        }
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
      >
        {templates.map((template, index) => {
          const isSelected = selectedId === template.id;

          return (
            <li
              key={template.id}
              id={`${listId}-${template.id}`}
              role="option"
              aria-selected={isSelected}
              className="pp-template-card"
              style={{
                animationDelay: `${Math.min(index, 11) * 45}ms`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setSelectedId(template.id);
                  });
                }}
                className="group w-full cursor-pointer rounded-[18px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pp-teal"
              >
                <div
                  className={[
                    "relative overflow-hidden rounded-[18px] bg-pp-mist",
                    "ring-1 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                    "group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)]",
                    "group-active:scale-[0.99]",
                    isSelected
                      ? "ring-2 ring-pp-teal shadow-[0_12px_32px_rgba(36,25,20,0.1)]"
                      : "ring-pp-sand/60",
                  ].join(" ")}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={template.previewUrl}
                      alt={`${template.name} website template preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className={[
                        "object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                        "group-hover:scale-[1.03]",
                        isSelected ? "scale-[1.02]" : "",
                      ].join(" ")}
                      priority={index < 3}
                    />
                  </div>
                </div>

                <div className="mt-3.5 px-0.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink transition-colors duration-200 group-hover:text-pp-teal-dark">
                      {template.name}
                    </p>
                    {isSelected ? (
                      <span className="shrink-0 text-[12px] font-medium tracking-[-0.01em] text-pp-teal">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                    {template.mood}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5 pt-10",
          "bg-gradient-to-t from-pp-cream via-pp-cream/95 to-transparent",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          selected
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        ].join(" ")}
        aria-hidden={!selected}
      >
        {selected ? (
          <div
            className={[
              "flex w-full max-w-xl items-center gap-4",
              "rounded-[20px] bg-pp-white/95 px-4 py-3 shadow-[0_8px_40px_rgba(36,25,20,0.12)]",
              "ring-1 ring-pp-sand/70 backdrop-blur-md sm:px-5",
            ].join(" ")}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                {selected.name}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[13px] tracking-[-0.01em] text-pp-stone">
                {selected.blurb}
              </p>
            </div>
            <button
              type="button"
              onClick={useTemplate}
              disabled={isPending}
              className={[
                "shrink-0 rounded-[12px] bg-pp-teal px-5 py-2.5",
                "text-sm font-semibold tracking-[-0.01em] text-pp-white",
                "transition-[background-color,transform] duration-200 ease-out",
                "hover:bg-pp-teal-dark active:scale-[0.98]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
              ].join(" ")}
            >
              {isPending ? "Setting up…" : currentTemplateId === selected.id ? "Return to editor" : "Use template"}
            </button>
          </div>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-pp-coral px-4 py-2 text-sm font-medium text-white shadow-card">
          {error}
        </p>
      ) : null}
    </div>
  );
}
