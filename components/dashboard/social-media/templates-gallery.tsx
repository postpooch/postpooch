"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useRef,
  useState,
} from "react";

import type { EditorTemplateCard } from "@/lib/social-templates/types";

import { TEMPLATE_PILLARS, type TemplatePillar } from "./templates";

type PillarFilter = TemplatePillar | "all";
type GalleryView = "templates" | "projects";

type ProjectSummary = {
  id: string;
  createdAt: string;
  name: string;
};

type ProjectsResponse = {
  projects?: ProjectSummary[];
  nextCursor?: string | null;
  error?: string;
};

const projectDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type TemplatesGalleryProps = {
  templates: EditorTemplateCard[];
  templatesError?: string;
};

/**
 * Template picker — matches website template discovery:
 * quiet filters, media-first grid, teal selection language.
 */
export function TemplatesGallery({
  templates: catalog,
  templatesError = "",
}: TemplatesGalleryProps) {
  const router = useRouter();
  const projectsRequestRef = useRef(false);
  const [query, setQuery] = useState("");
  const [pillar, setPillar] = useState<PillarFilter>("all");
  const [view, setView] = useState<GalleryView>("templates");
  const [creatingBlank, setCreatingBlank] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [nextProjectsCursor, setNextProjectsCursor] = useState<string | null>(
    null,
  );
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const loadProjects = useCallback(
    async (cursor?: string) => {
      if (projectsRequestRef.current) return;
      projectsRequestRef.current = true;
      setProjectsLoading(true);
      setProjectsError("");

      try {
        const endpoint = new URL(
          "/api/post_projects/get_post_projects",
          window.location.origin,
        );
        if (cursor) endpoint.searchParams.set("cursor", cursor);

        const response = await fetch(endpoint, { cache: "no-store" });
        const result = (await response.json()) as ProjectsResponse;

        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!response.ok || !Array.isArray(result.projects)) {
          throw new Error(result.error ?? "Unable to load projects right now.");
        }

        setProjects((current) =>
          cursor ? [...current, ...result.projects!] : result.projects!,
        );
        setNextProjectsCursor(result.nextCursor ?? null);
        setProjectsLoaded(true);
      } catch (error) {
        setProjectsError(
          error instanceof Error
            ? error.message
            : "Unable to load projects right now.",
        );
      } finally {
        projectsRequestRef.current = false;
        setProjectsLoading(false);
      }
    },
    [router],
  );

  function chooseView(nextView: GalleryView) {
    setView(nextView);
    setQuery("");
    setCreationError("");
    setProjectsError("");
    if (nextView === "projects" && !projectsLoaded) {
      void loadProjects();
    }
  }

  async function createBlankCanvas() {
    if (creatingBlank) return;

    setCreatingBlank(true);
    setCreationError("");

    try {
      const response = await fetch(
        "/api/post_projects/make_new_post_project",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        },
      );
      const result = (await response.json()) as { id?: string; error?: string };

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok || !result.id) {
        throw new Error(result.error ?? "Unable to create a blank canvas.");
      }

      router.push(`/post-design/${result.id}`);
    } catch (error) {
      setCreationError(
        error instanceof Error
          ? error.message
          : "Unable to create a blank canvas.",
      );
      setCreatingBlank(false);
    }
  }

  // public.templates has no pillar column yet, so category tabs stay visual only.
  const templates = catalog.filter((template) => {
    if (!deferredQuery) return true;

    const haystack = [template.name, template.description]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredQuery);
  });

  const showBlank =
    !deferredQuery || "blank canvas custom square".includes(deferredQuery);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(deferredQuery),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          role="tablist"
          aria-label="Gallery view"
          className="flex shrink-0 rounded-[10px] bg-pp-mist p-1"
        >
          {(["templates", "projects"] as const).map((item) => {
            const active = view === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => chooseView(item)}
                className={[
                  "rounded-[7px] px-3 py-1.5 text-xs font-semibold capitalize tracking-[-0.01em] transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                  active
                    ? "bg-white text-pp-ink shadow-sm"
                    : "text-pp-stone hover:text-pp-ink",
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-0 flex-1">
          <label htmlFor="gallery-search" className="sr-only">
            Search {view}
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-pp-stone" />
          <input
            id="gallery-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${view}`}
            autoComplete="off"
            className={[
              "h-10 w-full rounded-[10px] border border-pp-sand bg-white py-0 pr-10 pl-10",
              "text-[13px] tracking-[-0.01em] text-pp-ink outline-none",
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
              className="absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-[8px] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              <ClearIcon className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {view === "templates" ? (
        <div
          role="tablist"
          aria-label="Template category"
          className="flex min-w-0 flex-wrap gap-1"
        >
          {TEMPLATE_PILLARS.map((item) => {
            const active = pillar === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPillar(item.id)}
                className={[
                  "flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-[13px] font-medium tracking-[-0.01em] transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                  active
                    ? "bg-white text-pp-ink shadow-sm ring-1 ring-pp-sand/70"
                    : "text-pp-stone hover:bg-white/70 hover:text-pp-ink",
                ].join(" ")}
              >
                <CategoryIcon id={item.id} className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
          Newest first
        </p>
      )}

      <ul
        className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
        aria-live="polite"
        aria-busy={view === "projects" && projectsLoading}
        aria-label={
          view === "templates"
            ? templates.length === 1
              ? "1 template"
              : `${templates.length} templates`
            : filteredProjects.length === 1
              ? "1 project"
              : `${filteredProjects.length} projects`
        }
      >
        {view === "templates" ? (
          <>
            {showBlank ? (
              <li
                className="pp-template-card"
                style={{ animationDelay: "0ms" }}
              >
                <button
                  type="button"
                  onClick={createBlankCanvas}
                  disabled={creatingBlank}
                  className="group w-full cursor-pointer rounded-[18px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pp-teal"
                >
                  <div className="relative overflow-hidden rounded-[18px] bg-pp-mist ring-1 ring-pp-sand/60 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)] group-active:scale-[0.99]">
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <span className="flex size-12 items-center justify-center rounded-[10px] bg-white text-pp-teal shadow-card-sm ring-1 ring-pp-sand/80">
                        {creatingBlank ? (
                          <span className="size-4 animate-spin rounded-full border-2 border-pp-ink/20 border-t-pp-ink/70" />
                        ) : (
                          <BlankPlusIcon />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3.5 px-0.5">
                    <p className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink transition-colors duration-200 group-hover:text-pp-teal-dark">
                      {creatingBlank ? "Setting up…" : "Blank canvas"}
                    </p>
                    <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                      Custom · Square
                    </p>
                  </div>
                </button>
              </li>
            ) : null}

            {templates.map((template, index) => (
              <li
                key={template.id}
                className="pp-template-card"
                style={{
                  animationDelay: `${Math.min(index + (showBlank ? 1 : 0), 12) * 40}ms`,
                }}
              >
                <Link
                  href={`/dashboard/social-media/social-editor/canvas?template=${template.id}`}
                  className="group block rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pp-teal"
                >
                  <div className="relative overflow-hidden rounded-[18px] bg-pp-mist ring-1 ring-pp-sand/60 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)] group-active:scale-[0.99]">
                    <div className="flex aspect-[4/3] items-center justify-center p-5">
                      <div className="w-full max-w-[78%]">
                        <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-pp-white shadow-[0_2px_8px_rgba(36,25,20,0.08)] ring-1 ring-pp-sand/70">
                          <Image
                            src={template.previewUrl}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 40vw, (max-width: 1280px) 25vw, 18vw"
                            className="object-contain"
                            priority={index < 3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 px-0.5">
                    <p className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink transition-colors duration-200 group-hover:text-pp-teal-dark">
                      {template.name}
                    </p>
                    <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                      Template
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </>
        ) : projectsLoading && !projectsLoaded ? (
          Array.from({ length: 4 }, (_, index) => (
            <li key={index} aria-hidden>
              <div className="aspect-[4/3] rounded-[18px] bg-pp-mist ring-1 ring-pp-sand/60" />
              <div className="mt-3.5 h-4 w-2/3 rounded-[8px] bg-pp-sand/60" />
              <div className="mt-2 h-3 w-1/2 rounded-[8px] bg-pp-sand/40" />
            </li>
          ))
        ) : (
          filteredProjects.map((project, index) => (
            <li
              key={project.id}
              className="pp-template-card"
              style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
            >
              <Link
                href={`/post-design/${project.id}`}
                className="group block rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pp-teal"
              >
                <div className="relative overflow-hidden rounded-[18px] bg-pp-mist ring-1 ring-pp-sand/60 transition-[box-shadow,transform,ring-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)] group-active:scale-[0.99]">
                  <ProjectPlaceholderThumb />
                </div>
                <div className="mt-3.5 px-0.5">
                  <p className="truncate text-[15px] font-semibold leading-snug tracking-[-0.015em] text-pp-ink transition-colors duration-200 group-hover:text-pp-teal-dark">
                    {project.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                    Draft · {projectDateFormatter.format(new Date(project.createdAt))}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>

      {creationError ? (
        <p role="alert" className="text-[13px] font-medium tracking-[-0.01em] text-pp-coral">
          {creationError}
        </p>
      ) : null}

      {view === "templates" && templatesError ? (
        <p role="alert" className="text-[13px] font-medium tracking-[-0.01em] text-pp-coral">
          {templatesError}
        </p>
      ) : null}

      {view === "templates" && templates.length === 0 && !showBlank && !templatesError ? (
        <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-9 text-center">
          <h2 className="text-sm font-semibold text-pp-ink">No matching templates</h2>
          <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
            Try another word or clear the filter.
          </p>
        </div>
      ) : null}

      {view === "projects" && projectsError ? (
        <div className="flex items-center gap-3" role="alert">
          <p className="text-[13px] font-medium tracking-[-0.01em] text-pp-coral">
            {projectsError}
          </p>
          <button
            type="button"
            onClick={() => void loadProjects()}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-pp-teal transition hover:bg-pp-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
          >
            Try again
          </button>
        </div>
      ) : null}

      {view === "projects" &&
      projectsLoaded &&
      !projectsLoading &&
      filteredProjects.length === 0 &&
      !projectsError ? (
        <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-9 text-center">
          <h2 className="text-sm font-semibold text-pp-ink">
            {deferredQuery ? "No matching projects" : "No projects yet"}
          </h2>
          <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
            {deferredQuery
              ? "Try another search or load more projects."
              : "Choose Blank canvas or a template to start your first post."}
          </p>
        </div>
      ) : null}

      {view === "projects" && nextProjectsCursor ? (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={projectsLoading}
            onClick={() => void loadProjects(nextProjectsCursor)}
            className="inline-flex h-9 items-center justify-center rounded-[10px] border border-pp-sand bg-white px-4 text-xs font-semibold tracking-[-0.01em] text-pp-ink transition hover:bg-pp-mist active:scale-[0.98] disabled:cursor-wait disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
          >
            {projectsLoading ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CategoryIcon({
  id,
  className,
}: {
  id: TemplatePillar | "all";
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
    case "property":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4.5l8 7" />
          <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case "market":
      return (
        <svg {...common}>
          <path d="M4 16.5 9 11.5l3.5 3.5L20 7.5" />
          <path d="M14.5 7.5H20V13" />
        </svg>
      );
    case "education":
      return (
        <svg {...common}>
          <path d="M12 6.8C9.2 5 6.8 4.6 4.5 5.7v10.4c2.3-1.1 4.7-.7 7.5 1.1" />
          <path d="M12 6.8c2.8-1.8 5.2-2.2 7.5-1.1v10.4c-2.3-1.1-4.7-.7-7.5 1.1" />
          <path d="M12 6.8v10.4" />
        </svg>
      );
    case "community":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3.2" />
          <path d="M3.5 19.5c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" />
          <path d="M15.5 5.8a3.2 3.2 0 0 1 0 5.4" />
          <path d="M17.5 14.9c1.8.7 2.8 2.3 3.1 4.6" />
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

function BlankPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Static Canva-style placeholder — no fabric preview or design fetch. */
function ProjectPlaceholderThumb() {
  return (
    <div className="flex aspect-[4/3] items-center justify-center p-5">
      <div className="w-full max-w-[78%]">
        <div className="relative mx-auto aspect-square w-full max-w-[140px] overflow-hidden rounded-[14px] bg-pp-white shadow-[0_2px_8px_rgba(36,25,20,0.08)] ring-1 ring-pp-sand/70">
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-pp-white via-pp-white to-pp-mist/80">
            <span className="flex size-10 items-center justify-center rounded-[10px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80">
              <ProjectDocIcon className="size-5" />
            </span>
            <span className="text-[10px] font-medium tracking-[-0.01em] text-pp-stone">
              Social post
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDocIcon({ className }: { className?: string }) {
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
      <path d="M8 3h6l4 4v14H8z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h6M10 17h4" />
    </svg>
  );
}
