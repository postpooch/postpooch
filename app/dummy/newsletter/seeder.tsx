"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  useId,
  useRef,
  useState,
} from "react";

import { collectMjmlImageUrls } from "@/lib/dummy/mjml-image-urls";

const MAX_MJML_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MJML = ".mjml,text/xml,application/xml,text/plain,text/html";

type SeededTemplate = {
  id: string;
  previewPath: string;
  previewUrl: string;
  replacedImageCount: number;
  contentChars: number;
};

type RecentTemplate = {
  id: string;
  previewPath: string;
  previewUrl: string | null;
  contentChars: number;
  createdAt: string;
};

function isMjmlFile(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".mjml") || name.endsWith(".xml");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DummyNewsletterSeeder({
  signedIn,
  initialRecents,
}: {
  signedIn: boolean;
  initialRecents: RecentTemplate[];
}) {
  const mjmlInputRef = useRef<HTMLInputElement>(null);
  const nameId = useId();

  const [mjmlFile, setMjmlFile] = useState<File | null>(null);
  const [mjmlText, setMjmlText] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<SeededTemplate | null>(null);
  const [recents, setRecents] = useState<RecentTemplate[]>(initialRecents);
  const [copied, setCopied] = useState(false);

  async function applyMjmlFile(file: File | null) {
    setError(null);
    setCreated(null);
    if (!file) {
      setMjmlFile(null);
      setMjmlText("");
      setImageUrls([]);
      return;
    }

    if (file.size > MAX_MJML_BYTES) {
      setError("MJML files must be 5 MB or smaller.");
      return;
    }

    try {
      const text = await file.text();
      const urls = collectMjmlImageUrls(text);
      setMjmlFile(file);
      setMjmlText(text);
      setImageUrls(urls);
      if (!name.trim()) {
        const stem = file.name.replace(/\.[a-z0-9]+$/i, "");
        setName(stem);
      }
    } catch {
      setError("That MJML file could not be read.");
    }
  }

  async function addDroppedFiles(incoming: File[]) {
    const mjml = incoming.find(isMjmlFile);

    if (incoming.length > 0 && !mjml) {
      setError("Drop an .mjml file.");
      return;
    }

    if (mjml) await applyMjmlFile(mjml);
  }

  function handleMjmlChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    void applyMjmlFile(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addDroppedFiles(Array.from(event.dataTransfer.files));
  }

  function resetForm() {
    void applyMjmlFile(null);
    setName("");
    setError(null);
    setCreated(null);
  }

  async function createTemplate() {
    if (!signedIn) {
      setError("Sign in to add newsletter templates.");
      return;
    }
    if (!mjmlFile) {
      mjmlInputRef.current?.click();
      return;
    }

    setIsUploading(true);
    setError(null);
    setCreated(null);

    try {
      const body = new FormData();
      body.append("mjml", mjmlFile);
      if (name.trim()) body.append("name", name.trim());

      const response = await fetch("/api/dummy/newsletter", {
        method: "POST",
        body,
      });
      const result = (await response.json()) as {
        template?: SeededTemplate;
        error?: string;
      };

      if (response.status === 401) {
        throw new Error("Sign in to add newsletter templates.");
      }
      if (!response.ok || !result.template) {
        throw new Error(result.error || "The template could not be created.");
      }

      setCreated(result.template);
      void applyMjmlFile(null);

      const recentsResponse = await fetch("/api/dummy/newsletter", {
        cache: "no-store",
      });
      if (recentsResponse.ok) {
        const recentsResult = (await recentsResponse.json()) as {
          templates?: RecentTemplate[];
        };
        if (Array.isArray(recentsResult.templates)) {
          setRecents(recentsResult.templates);
        }
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The template could not be created.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function copyPreviewPath() {
    if (!created?.previewPath) return;
    await navigator.clipboard.writeText(created.previewPath);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const heroPreview = imageUrls[0] || created?.previewUrl || "";

  return (
    <main className="min-h-dvh bg-[#f5f5f7] font-sans text-[#1d1d1f] antialiased">
      <div className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
          Dev team
        </p>
        <header className="mt-3 text-center">
          <h1 className="text-[34px] font-semibold tracking-[-0.035em] sm:text-[40px]">
            Newsletter seeder
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[17px] leading-6 text-[#6e6e73]">
            Drop an MJML template. Stock photos are copied to R2, the MJML is
            rewritten, then Chromium screenshots the compiled email for the
            picker thumbnail in{" "}
            <span className="font-medium text-[#424245]">newsletter_templates</span>
            .
          </p>
          <p className="mt-3 text-[13px] text-[#86868b]">
            Also see{" "}
            <Link className="font-medium text-[#0071e3] hover:underline" href="/dummy">
              social template seeder
            </Link>
          </p>
        </header>

        {!signedIn && (
          <div className="mt-8 rounded-[22px] border border-black/[0.06] bg-white px-5 py-4 text-[15px] text-[#6e6e73] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            Sign in with your postpooch account, then come back here to write
            to the live newsletter_templates table.{" "}
            <Link
              className="font-semibold text-[#0071e3] hover:underline"
              href="/auth/login"
            >
              Log in
            </Link>
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-4">
          <div
            className={`relative mt-0 flex min-h-[300px] items-center justify-center overflow-hidden rounded-[21px] border transition-all duration-300 ${
              isDragging
                ? "border-[#0071e3] bg-[#f0f7ff] ring-4 ring-[#0071e3]/10"
                : "border-black/[0.08] bg-[#fafafa]"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            {mjmlFile ? (
              <>
                {heroPreview ? (
                  <div
                    aria-label={`Preview for ${mjmlFile.name}`}
                    className="absolute inset-0 bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url("${heroPreview}")` }}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[#ececf0] px-8 text-center">
                    <p className="text-[15px] font-medium text-[#6e6e73]">
                      MJML · screenshot rendered on save
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">
                      {mjmlFile.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-white/75">
                      {formatBytes(mjmlFile.size)}
                      {imageUrls.length > 0
                        ? ` · ${imageUrls.length} remote image${imageUrls.length === 1 ? "" : "s"}`
                        : " · no remote images"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium backdrop-blur-xl">
                    MJML
                  </span>
                </div>
              </>
            ) : (
              <button
                className="flex h-full w-full flex-col items-center justify-center px-6 py-16 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#0071e3]/20"
                onClick={() => mjmlInputRef.current?.click()}
                type="button"
              >
                <span className="mb-5 grid size-14 place-items-center rounded-full bg-[#e8e8ed] text-[#3a3a3c]">
                  <svg
                    aria-hidden="true"
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 16.5l4.2-4.2a2 2 0 0 1 2.8 0l1.4 1.4m-1-1 1.8-1.8a2 2 0 0 1 2.8 0l4 4M8.5 9A1.5 1.5 0 1 0 8.5 6a1.5 1.5 0 0 0 0 3ZM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <span className="text-[18px] font-semibold tracking-[-0.01em]">
                  Drop an MJML file here
                </span>
                <span className="mt-1.5 text-[14px] text-[#6e6e73]">
                  or click to browse
                </span>
                <span className="mt-5 text-[12px] text-[#86868b]">
                  .mjml up to 5 MB · picker preview is a live screenshot
                </span>
              </button>
            )}
            <input
              ref={mjmlInputRef}
              accept={ACCEPTED_MJML}
              aria-hidden="true"
              className="sr-only"
              onChange={handleMjmlChange}
              tabIndex={-1}
              type="file"
            />
          </div>

          {mjmlFile && imageUrls.length > 0 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {imageUrls.slice(0, 12).map((url) => (
                <li
                  className="relative h-[72px] w-[88px] shrink-0 overflow-hidden rounded-[14px] border border-black/[0.08] bg-[#f2f2f7]"
                  key={url}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="size-full object-cover"
                    src={url}
                  />
                </li>
              ))}
              {imageUrls.length > 12 && (
                <li className="grid h-[72px] w-[88px] shrink-0 place-items-center rounded-[14px] border border-black/[0.08] bg-[#f2f2f7] text-[12px] font-semibold text-[#6e6e73]">
                  +{imageUrls.length - 12}
                </li>
              )}
            </ul>
          )}

          <div className="mt-3 overflow-hidden rounded-[18px] bg-[#f2f2f7]">
            <label className="flex flex-col gap-1 px-4 py-3" htmlFor={nameId}>
              <span className="text-[12px] font-medium text-[#6e6e73]">
                Preview name
              </span>
              <input
                className="bg-transparent text-[17px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                id={nameId}
                onChange={(event) => setName(event.target.value)}
                placeholder="market-brief"
                value={name}
              />
            </label>
            <div className="mx-4 h-px bg-black/[0.08]" />
            <div className="px-4 py-3">
              <p className="text-[17px] text-[#1d1d1f]">Picker preview</p>
              <p className="mt-0.5 text-[13px] text-[#6e6e73]">
                On save we compile the MJML to HTML and screenshot the email
                with Chromium — same idea as the social Fabric render.
              </p>
            </div>
            {mjmlText ? (
              <>
                <div className="mx-4 h-px bg-black/[0.08]" />
                <div className="px-4 py-3">
                  <p className="text-[12px] font-medium text-[#6e6e73]">
                    MJML snippet
                  </p>
                  <pre className="mt-2 max-h-36 overflow-auto rounded-xl bg-white/70 p-3 font-mono text-[11px] leading-4 text-[#424245]">
                    {mjmlText.slice(0, 1_200)}
                    {mjmlText.length > 1_200 ? "…" : ""}
                  </pre>
                </div>
              </>
            ) : null}
          </div>

          {error && (
            <div
              className="mt-3 flex items-start gap-2.5 rounded-2xl bg-[#fff2f2] px-4 py-3 text-[14px] text-[#b42318]"
              role="alert"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-current text-[10px] font-bold"
              >
                !
              </span>
              {error}
            </div>
          )}

          {created && (
            <div className="mt-3 rounded-2xl bg-[#f2f8f4] p-4" role="status">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#237a3b]">
                <svg
                  aria-hidden="true"
                  className="size-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m5 12.5 4.2 4.2L19 7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  />
                </svg>
                Newsletter template saved
                {created.replacedImageCount > 0
                  ? ` · ${created.replacedImageCount} image${created.replacedImageCount === 1 ? "" : "s"} rehosted`
                  : ""}
              </div>
              {created.previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Saved newsletter preview"
                  className="mt-3 max-h-56 w-full rounded-xl object-cover object-top"
                  src={created.previewUrl}
                />
              )}
              {created.previewPath && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/80 p-2 pl-3">
                  <p className="min-w-0 flex-1 truncate font-mono text-[12px] text-[#424245]">
                    {created.previewPath}
                  </p>
                  <button
                    className="shrink-0 rounded-lg bg-[#e8e8ed] px-3 py-1.5 text-[12px] font-semibold text-[#1d1d1f] transition hover:bg-[#dedee3] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/15"
                    onClick={copyPreviewPath}
                    type="button"
                  >
                    {copied ? "Copied" : "Copy path"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 px-2 pb-1 pt-4">
            {(mjmlFile || created) && (
              <button
                className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#6e6e73] transition hover:bg-black/[0.04] hover:text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-black/5"
                disabled={isUploading}
                onClick={resetForm}
                type="button"
              >
                Clear
              </button>
            )}
            {mjmlFile && (
              <button
                className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] transition hover:bg-[#0071e3]/10 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/15"
                disabled={isUploading}
                onClick={() => mjmlInputRef.current?.click()}
                type="button"
              >
                Replace
              </button>
            )}
            <button
              className="ml-auto min-w-36 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0077ed] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20"
              disabled={!mjmlFile || isUploading}
              onClick={() => void createTemplate()}
              type="button"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Rendering
                </span>
              ) : (
                "Create template"
              )}
            </button>
          </div>
        </section>

        {recents.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
              Recently added
            </h2>
            <p className="mt-1 text-[14px] text-[#6e6e73]">
              Live rows from newsletter_templates.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {recents.map((template) => (
                <li
                  className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                  key={template.id}
                >
                  <div className="aspect-[4/5] bg-[#f2f2f7]">
                    {template.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt=""
                        className="size-full object-cover object-top"
                        src={template.previewUrl}
                      />
                    ) : null}
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="truncate font-mono text-[11px] text-[#86868b]">
                      {template.id.slice(0, 8)}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6e6e73]">
                      {template.contentChars.toLocaleString()} chars
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-8 text-center text-[12px] text-[#86868b]">
          Previews upload to{" "}
          <span className="font-medium text-[#6e6e73]">
            newsletter/template_previews/
          </span>
          . Inner MJML images go to{" "}
          <span className="font-medium text-[#6e6e73]">
            postpooch-images/newsletter/media_inner_assets/
          </span>
          . This page is a temporary seeding tool.
        </p>
      </div>
    </main>
  );
}
