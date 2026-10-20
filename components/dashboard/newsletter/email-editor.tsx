"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type {
  Template,
  TemplatePatch,
  TemplaticalEditor,
} from "@templatical/editor";

import { newsletterComposeHref } from "@/lib/newsletter-emails/paths";

import { ComposeStageNav } from "./compose/stage-nav";
import {
  NEWSLETTER_BLOCK_DEFAULTS,
  NEWSLETTER_COLOR_PRESETS,
  NEWSLETTER_TEMPLATE_DEFAULTS,
} from "./editor-theme";

import "@templatical/editor/style.css";

/**
 * Built-in block types available without Templatical Cloud.
 * `countdown` needs Cloud-side GIF rendering, so it is omitted.
 */
const OSS_PALETTE_BLOCKS = [
  "section",
  "title",
  "paragraph",
  "image",
  "button",
  "divider",
  "spacer",
  "social",
  "menu",
  "table",
  "html",
  "video",
] as const;

export type NewsletterEmailEditorProps = {
  emailId: string;
  title: string;
  detail: string;
};

function slugifyFilename(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "newsletter";
}

function downloadTextFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function readTemplateResponse(response: Response): Promise<Template> {
  const body = (await response.json()) as Partial<Template> & {
    error?: string;
  };
  if (!response.ok || !body.id || !body.content) {
    throw new Error(body.error ?? "The email could not be saved.");
  }
  return body as Template;
}

async function loadEmailDocument(emailId: string): Promise<Template> {
  const response = await fetch(
    `/api/newsletter_emails/${encodeURIComponent(emailId)}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    },
  );
  return readTemplateResponse(response);
}

async function saveEmailDocument(
  emailId: string,
  patch: TemplatePatch,
): Promise<Template> {
  const response = await fetch(
    `/api/newsletter_emails/${encodeURIComponent(emailId)}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    },
  );
  return readTemplateResponse(response);
}

/**
 * Self-hosted Templatical email editor (OSS `init()` only — no Cloud/AI APIs).
 * Mounts into a Shadow DOM host so PostPooch CSS cannot leak in.
 */
export function NewsletterEmailEditor({
  emailId,
  title,
  detail,
}: NewsletterEmailEditorProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<TemplaticalEditor | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [saveState, setSaveState] = useState("Loading draft…");
  const [navigationPending, setNavigationPending] = useState(false);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let cancelled = false;
    let mountedEditor: TemplaticalEditor | null = null;

    void (async () => {
      try {
        const { init } = await import("@templatical/editor");
        if (cancelled) return;

        const editor = await init({
          container: host,
          // White-label inside PostPooch — no Templatical marketing footer.
          branding: false,
          uiTheme: "light",
          // Skip optional @templatical/quality peer until we wire Issues.
          lint: { disabled: true },
          paletteBlocks: [...OSS_PALETTE_BLOCKS],
          // Chrome colors/radius/font come from `.pp-templatical-host` CSS vars.
          colors: {
            presets: [...NEWSLETTER_COLOR_PRESETS],
            allowCustom: true,
          },
          templateDefaults: { ...NEWSLETTER_TEMPLATE_DEFAULTS },
          blockDefaults: { ...NEWSLETTER_BLOCK_DEFAULTS },
          changeDebounce: 1500,
          templates: {
            load: (id) => loadEmailDocument(id),
            create: false,
            save: (id, patch) => saveEmailDocument(id, patch),
            autoSave: true,
            unsavedChangesGuard: true,
            nameField: false,
            onSaved() {
              setSaveState("Saved");
            },
          },
          onDirtyChange(isDirty) {
            setSaveState(isDirty ? "Saving changes…" : "Saved");
          },
          onError(error) {
            console.error("[newsletter-editor]", error);
          },
        });
        mountedEditor = editor;

        if (cancelled) {
          editor.unmount();
          return;
        }

        editorRef.current = editor;
        await editor.load(emailId);
        if (cancelled) {
          editor.unmount();
          return;
        }
        setSaveState("Saved");
        setStatus("ready");
      } catch (error) {
        mountedEditor?.unmount();
        mountedEditor = null;
        editorRef.current = null;
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load the email editor.",
        );
      }
    })();

    return () => {
      cancelled = true;
      mountedEditor?.unmount();
      editorRef.current = null;
    };
  }, [emailId]);

  async function flushAndNavigate(href: string) {
    const editor = editorRef.current;
    if (!editor || navigationPending) return;

    setNavigationPending(true);
    setExportNotice(null);
    try {
      if (editor.isDirty()) {
        setSaveState("Saving changes…");
        await editor.save();
      }
      router.push(href);
    } catch (error) {
      console.error("[newsletter-editor] navigation save", error);
      setExportNotice("Your latest changes could not be saved. Please try again.");
      setNavigationPending(false);
    }
  }

  async function downloadMjml() {
    const editor = editorRef.current;
    if (!editor || exporting) return;

    setExporting(true);
    setExportNotice(null);

    try {
      // Export only — the draft source of truth stays Templatical JSON.
      const mjml = await editor.toMjml();
      downloadTextFile(
        `${slugifyFilename(title)}.mjml`,
        mjml,
        "application/xml",
      );
    } catch (error) {
      console.error("[newsletter-editor] mjml export", error);
      setExportNotice(
        error instanceof Error
          ? error.message
          : "Unable to export MJML right now.",
      );
    } finally {
      setExporting(false);
    }
  }

  const navBusy = status !== "ready" || navigationPending;

  return (
    <div className="flex h-[calc(100dvh-3.75rem)] flex-col bg-white text-pp-ink lg:h-dvh">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center gap-3 border-b border-pp-sand/80 bg-white px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => void flushAndNavigate("/dashboard/newsletter")}
            disabled={navBusy}
            className="cursor-pointer rounded-lg px-2 py-1.5 text-sm font-medium text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal disabled:cursor-wait disabled:opacity-70"
          >
            Templates
          </button>
          <span className="h-5 w-px bg-pp-sand" aria-hidden />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.01em]">
              {title}
            </p>
            <p className="truncate text-[11px] text-pp-stone">
              {status === "ready" ? saveState : detail}
            </p>
          </div>
        </div>

        <ComposeStageNav
          emailId={emailId}
          activeStage="design"
          disabled={navBusy}
          onNavigate={(href) => void flushAndNavigate(href)}
        />

        <div className="flex min-w-0 flex-1 shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => void downloadMjml()}
            disabled={status !== "ready" || exporting}
            className={[
              "inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-3.5 py-2",
              "text-[13px] font-semibold tracking-[-0.01em]",
              "transition-[background-color,color,transform,opacity] duration-200 ease-out",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
              "active:scale-[0.98]",
              status === "ready" && !exporting
                ? "border border-pp-sand/90 bg-pp-white text-pp-ink hover:bg-pp-mist"
                : "cursor-not-allowed border border-pp-sand/70 bg-pp-mist text-pp-stone opacity-70",
            ].join(" ")}
          >
            {exporting ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-pp-ink/15 border-t-pp-ink/60" />
            ) : (
              <DownloadIcon className="size-3.5" />
            )}
            {exporting ? "Exporting…" : "Download MJML"}
          </button>
          <button
            type="button"
            onClick={() =>
              void flushAndNavigate(newsletterComposeHref(emailId))
            }
            disabled={navBusy}
            className={[
              "inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-pp-teal px-3.5 py-2",
              "text-[13px] font-semibold tracking-[-0.01em] text-pp-white",
              "transition-[background-color,transform] duration-200 ease-out",
              "hover:bg-pp-teal-dark active:scale-[0.98]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
              "disabled:cursor-wait disabled:opacity-70",
            ].join(" ")}
          >
            {navigationPending ? "Saving…" : "Next"}
            <ChevronRightIcon className="size-3.5" />
          </button>
        </div>
      </header>

      {exportNotice ? (
        <p
          role="alert"
          className="border-b border-pp-sand/80 bg-pp-cream px-4 py-2 text-[12px] font-medium tracking-[-0.01em] text-pp-coral sm:px-5"
        >
          {exportNotice}
        </p>
      ) : null}

      <div className="relative min-h-0 flex-1">
        {status === "loading" ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#ebe6e1]"
            aria-busy
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="size-5 animate-spin rounded-full border-2 border-pp-ink/20 border-t-pp-ink/70" />
              <p className="text-[13px] font-medium tracking-[-0.01em] text-pp-stone">
                Loading editor…
              </p>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#ebe6e1] p-6"
            role="alert"
          >
            <div className="max-w-sm rounded-[18px] bg-white px-6 py-8 text-center shadow-[0_18px_55px_rgba(36,25,20,.12)] ring-1 ring-pp-sand/70">
              <p className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                Editor failed to load
              </p>
              <p className="mt-2 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                {errorMessage}
              </p>
              <Link
                href="/dashboard/newsletter"
                className="mt-5 inline-flex rounded-[12px] bg-pp-teal px-4 py-2.5 text-sm font-semibold text-pp-white transition hover:bg-pp-teal-dark"
              >
                Back to templates
              </Link>
            </div>
          </div>
        ) : null}

        {/* Shadow-DOM host — must be a div (attachShadow-eligible). */}
        <div ref={containerRef} className="pp-templatical-host h-full w-full" />
      </div>
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M12 4v11" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
