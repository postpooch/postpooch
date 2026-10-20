"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";

import type { NewsletterTemplateCard } from "@/lib/newsletter-templates/types";

import {
  NEWSLETTER_CATEGORIES,
  type NewsletterTemplateCategory,
} from "./templates";

const SKELETON_COUNT = 12;

type TemplatesResponse = {
  templates?: NewsletterTemplateCard[];
  nextCursor?: string | null;
  error?: string;
};

type NewsletterTemplatesGalleryProps = {
  initialTemplates: NewsletterTemplateCard[];
  initialNextCursor: string | null;
  templatesError?: string;
};

/**
 * Newsletter template discovery — matches social gallery language:
 * blank+ first, media-first grid, infinite scroll over newsletter_templates.
 */
export function NewsletterTemplatesGallery({
  initialTemplates,
  initialNextCursor,
  templatesError: initialError = "",
}: NewsletterTemplatesGalleryProps) {
  const listId = useId();
  const router = useRouter();
  const requestRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<NewsletterTemplateCategory>("all");
  const [, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const [templates, setTemplates] =
    useState<NewsletterTemplateCard[]>(initialTemplates);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(initialError);

  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [creationError, setCreationError] = useState("");

  const loadMore = useCallback(
    async (cursor: string) => {
      if (requestRef.current) return;
      requestRef.current = true;
      setLoadingMore(true);
      setLoadError("");

      try {
        const endpoint = new URL(
          "/api/newsletter_templates",
          window.location.origin,
        );
        endpoint.searchParams.set("cursor", cursor);

        const response = await fetch(endpoint, { cache: "no-store" });
        const result = (await response.json()) as TemplatesResponse;

        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!response.ok || !Array.isArray(result.templates)) {
          throw new Error(result.error ?? "Unable to load templates right now.");
        }

        setTemplates((current) => {
          const seen = new Set(current.map((item) => item.id));
          const appended = result.templates!.filter(
            (item) => !seen.has(item.id),
          );
          return [...current, ...appended];
        });
        setNextCursor(result.nextCursor ?? null);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load templates right now.",
        );
      } finally {
        requestRef.current = false;
        setLoadingMore(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (!nextCursor || requestRef.current) return;
        void loadMore(nextCursor);
      },
      { root: null, rootMargin: "480px 0px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, nextCursor]);

  async function startEmail(input: { blank: true } | { templateId: string }) {
    if (creatingId) return;

    const pendingKey = "templateId" in input ? input.templateId : "blank";
    setCreatingId(pendingKey);
    setCreationError("");

    try {
      const response = await fetch("/api/newsletter_emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          "templateId" in input
            ? { templateId: input.templateId }
            : { blank: true },
        ),
      });
      const result = (await response.json()) as { id?: string; error?: string };

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok || !result.id) {
        throw new Error(result.error ?? "Unable to start this email.");
      }

      router.push(
        `/dashboard/newsletter/editor?email=${encodeURIComponent(result.id)}`,
      );
    } catch (error) {
      setCreationError(
        error instanceof Error
          ? error.message
          : "Unable to start this email.",
      );
      setCreatingId(null);
    }
  }

  // Categories have no DB column yet — tabs stay visual only (same as social).
  const visibleTemplates = templates.filter((template) => {
    if (!deferredQuery) return true;
    return template.name.toLowerCase().includes(deferredQuery);
  });

  const showBlank =
    !deferredQuery ||
    "blank newsletter empty custom new".includes(deferredQuery);

  return (
    <div>
      <section className="mx-auto flex max-w-4xl flex-col items-center pt-1 text-center sm:pt-3">
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-pp-ink sm:text-[40px]">
          Templates
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-pp-stone sm:text-[14px]">
          Start with a design, then make every detail your own.
        </p>

        <div className="relative mt-6 w-full min-w-0 sm:mt-7">
          <label htmlFor="newsletter-search" className="sr-only">
            Search templates
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-pp-stone sm:left-5" />
          <input
            id="newsletter-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search newsletter templates"
            autoComplete="off"
            className={[
              "h-12 w-full rounded-[14px] border border-pp-sand bg-white py-0 pr-12 pl-12 sm:h-14 sm:pl-14",
              "text-[14px] tracking-[-0.01em] text-pp-ink outline-none",
              "placeholder:text-pp-stone",
              "transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10",
              "[&::-webkit-search-cancel-button]:hidden",
            ].join(" ")}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-[9px] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              <ClearIcon className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div
          role="tablist"
          aria-label="Template category"
          className="mt-3 flex min-w-0 flex-wrap justify-center gap-1.5 sm:mt-4 sm:gap-2"
        >
          {NEWSLETTER_CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  startTransition(() => {
                    setCategory(item.id);
                  });
                }}
                className={[
                  "flex items-center gap-2 rounded-[10px] border px-3 py-2 text-[12px] font-medium tracking-[-0.01em] transition sm:text-[13px]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                  active
                    ? "border-pp-sand bg-white text-pp-ink shadow-sm"
                    : "border-transparent text-pp-stone hover:border-pp-sand/80 hover:bg-white/70 hover:text-pp-ink",
                ].join(" ")}
              >
                <CategoryIcon id={item.id} className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-pp-ink sm:text-[24px]">
              Newsletter templates
            </h2>
            <p className="mt-1 text-[12px] text-pp-stone">
              Pick a layout to start editing.
            </p>
          </div>
          <span className="hidden text-[11px] text-pp-stone sm:block">
            {visibleTemplates.length + (showBlank ? 1 : 0)} available
          </span>
        </div>

        <ul
        id={listId}
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] sm:gap-x-5 sm:gap-y-9"
        aria-busy={loadingMore}
        aria-label={
          visibleTemplates.length === 1
            ? "1 template"
            : `${visibleTemplates.length} templates`
        }
        >
        {showBlank ? (
          <li
            className="pp-template-card"
            style={{ animationDelay: "0ms" }}
          >
            <button
              type="button"
              onClick={() => void startEmail({ blank: true })}
              disabled={creatingId !== null}
              className="group w-full cursor-pointer rounded-[18px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pp-teal disabled:cursor-wait"
            >
              <div className="relative overflow-hidden rounded-[18px] bg-pp-mist ring-1 ring-pp-sand/60 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)] group-active:scale-[0.99]">
                <div className="flex aspect-[4/5] items-center justify-center">
                  <span className="flex size-12 items-center justify-center rounded-[10px] bg-white text-pp-teal shadow-card-sm ring-1 ring-pp-sand/80">
                    {creatingId === "blank" ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-pp-ink/20 border-t-pp-ink/70" />
                    ) : (
                      <BlankPlusIcon />
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-3.5 px-0.5">
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink transition-colors duration-200 group-hover:text-pp-teal-dark">
                  {creatingId === "blank" ? "Setting up…" : "Blank newsletter"}
                </p>
                <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  Custom · Empty canvas
                </p>
              </div>
            </button>
          </li>
        ) : null}

        {visibleTemplates.map((template, index) => {
          const isCreating = creatingId === template.id;
          return (
          <li
            key={template.id}
            className="pp-template-card"
            style={{
              animationDelay: `${Math.min(index + (showBlank ? 1 : 0), 12) * 40}ms`,
            }}
          >
            <button
              type="button"
              onClick={() => void startEmail({ templateId: template.id })}
              disabled={creatingId !== null}
              className="group w-full cursor-pointer rounded-[18px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pp-teal disabled:cursor-wait"
            >
              <div className="relative overflow-hidden rounded-[18px] bg-pp-mist ring-1 ring-pp-sand/60 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)] group-active:scale-[0.99]">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ebebef]">
                  <Image
                    src={template.previewUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1280px) 24vw, 18vw"
                    className="object-cover object-top"
                    priority={index < 3}
                  />
                  {isCreating ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-pp-white/55 backdrop-blur-[1px]">
                      <span className="size-5 animate-spin rounded-full border-2 border-pp-ink/20 border-t-pp-ink/70" />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3.5 px-0.5">
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink transition-colors duration-200 group-hover:text-pp-teal-dark">
                  {isCreating ? "Setting up…" : template.name}
                </p>
                <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  Template
                </p>
              </div>
            </button>
          </li>
          );
        })}

        {loadingMore
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <li key={`skeleton-${index}`} aria-hidden>
                <div className="aspect-[4/5] rounded-[18px] bg-[#ebebef]" />
              </li>
            ))
          : null}
        </ul>
      </section>

      {nextCursor ? (
        <div
          ref={sentinelRef}
          className="h-px w-full"
          aria-hidden
        />
      ) : null}

      <div className="mt-8">
      {creationError ? (
        <p className="text-center text-[13px] tracking-[-0.01em] text-pp-coral">
          {creationError}
        </p>
      ) : null}

      {loadError ? (
        <p className="text-center text-[13px] tracking-[-0.01em] text-pp-stone">
          {loadError}
        </p>
      ) : null}

      {visibleTemplates.length === 0 && !showBlank && !loadError ? (
        <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-9 text-center">
          <h2 className="text-sm font-semibold text-pp-ink">
            No matching templates
          </h2>
          <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
            Try another word or clear the filter.
          </p>
        </div>
      ) : null}
      </div>
    </div>
  );
}

function BlankPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CategoryIcon({
  id,
  className,
}: {
  id: NewsletterTemplateCategory;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "all":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <rect x="13" y="13" width="7" height="7" rx="2" />
        </svg>
      );
    case "market":
      return (
        <svg {...common}>
          <path d="M4 16.5 9 11.5l3.5 3.5L20 7.5" />
          <path d="M14.5 7.5H20V13" />
        </svg>
      );
    case "listing":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4.5l8 7" />
          <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case "sold":
      return (
        <svg {...common}>
          <path d="M7 12.5 10.5 16 17 8.5" />
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "nurture":
      return (
        <svg {...common}>
          <path d="M12 6.8C9.2 5 6.8 4.6 4.5 5.7v10.4c2.3-1.1 4.7-.7 7.5 1.1" />
          <path d="M12 6.8c2.8-1.8 5.2-2.2 7.5-1.1v10.4c-2.3-1.1-4.7-.7-7.5 1.1" />
          <path d="M12 6.8v10.4" />
        </svg>
      );
    case "seasonal":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6" />
        </svg>
      );
  }
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.5 16.5 3 3" />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>
  );
}
