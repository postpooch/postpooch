"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { collectFabricImageUrls } from "@/lib/dummy/fabric-image-urls";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_SLIDES = 10;
const ACCEPTED_TYPES =
  "image/jpeg,image/png,image/gif,image/webp,image/avif,application/json,.json";

type Kind = "post" | "reel";

type Slide = {
  id: string;
  file: File;
  previewUrl: string;
  isJson: boolean;
};

type SeededTemplate = {
  id: string;
  previewPath: string;
  previewUrl: string;
  mediaCount: number;
  editorAccessible: boolean;
  automateAccessible: boolean;
};

type RecentTemplate = {
  id: string;
  caption: string;
  previewPath: string;
  previewUrl: string | null;
  mediaCount: number;
  editorAccessible: boolean;
  automateAccessible: boolean;
  createdAt: string;
};

function isJsonFrame(file: File) {
  const name = file.name.toLowerCase();
  return (
    file.type === "application/json" ||
    file.type === "text/json" ||
    name.endsWith(".json")
  );
}

function isImageFrame(file: File) {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|avif)$/i.test(file.name);
}

function isAllowedFrame(file: File) {
  return isImageFrame(file) || isJsonFrame(file);
}

function revokePreview(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

async function previewForFile(file: File): Promise<Omit<Slide, "id">> {
  if (isJsonFrame(file)) {
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const src = collectFabricImageUrls(parsed)[0] ?? "";
      return { file, previewUrl: src, isJson: true };
    } catch {
      return { file, previewUrl: "", isJson: true };
    }
  }
  return {
    file,
    previewUrl: URL.createObjectURL(file),
    isJson: false,
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function IosSwitch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0071e3]/25 ${
        checked ? "bg-[#34c759]" : "bg-[#e5e5ea]"
      }`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={`absolute top-[2px] size-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.28)] transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export function DummyTemplateSeeder({
  signedIn,
  initialRecents,
}: {
  signedIn: boolean;
  initialRecents: RecentTemplate[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const nameId = useId();
  const captionId = useId();
  const promptId = useId();

  const [kind, setKind] = useState<Kind>("post");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [editorAccessible, setEditorAccessible] = useState(true);
  const [automateAccessible, setAutomateAccessible] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<SeededTemplate | null>(null);
  const [recents, setRecents] = useState<RecentTemplate[]>(initialRecents);
  const [copied, setCopied] = useState(false);
  const slidesRef = useRef<Slide[]>([]);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    return () => {
      for (const slide of slidesRef.current) {
        revokePreview(slide.previewUrl);
      }
    };
  }, []);

  async function replaceSlides(files: File[]) {
    setError(null);
    setCreated(null);
    const next = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        ...(await previewForFile(file)),
      })),
    );
    setSlides((current) => {
      for (const slide of current) revokePreview(slide.previewUrl);
      return next;
    });
  }

  async function addFiles(incoming: File[]) {
    const frames = incoming.filter(isAllowedFrame);
    if (incoming.length > 0 && frames.length === 0) {
      setError("Choose JPEG, PNG, GIF, WebP, AVIF, or Fabric JSON.");
      return;
    }

    const oversized = frames.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversized) {
      setError("Images and JSON frames must be 20 MB or smaller.");
      return;
    }

    if (kind === "post") {
      const first = frames[0];
      if (first) await replaceSlides([first]);
      return;
    }

    setError(null);
    setCreated(null);
    const prepared = await Promise.all(
      frames.map(async (file) => ({
        id: crypto.randomUUID(),
        ...(await previewForFile(file)),
      })),
    );

    const room = MAX_SLIDES - slidesRef.current.length;
    if (room <= 0) {
      for (const slide of prepared) revokePreview(slide.previewUrl);
      setError(`Reels can have at most ${MAX_SLIDES} frames.`);
      return;
    }

    const nextFiles = prepared.slice(0, room);
    for (const extra of prepared.slice(room)) {
      revokePreview(extra.previewUrl);
    }
    setSlides((current) => [...current, ...nextFiles]);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    void addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(Array.from(event.dataTransfer.files));
  }

  function removeSlide(id: string) {
    setCreated(null);
    setSlides((current) => {
      const target = current.find((slide) => slide.id === id);
      if (target) revokePreview(target.previewUrl);
      return current.filter((slide) => slide.id !== id);
    });
  }

  function moveSlide(id: string, direction: -1 | 1) {
    setCreated(null);
    setSlides((current) => {
      const index = current.findIndex((slide) => slide.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      if (!item) return current;
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  function chooseKind(next: Kind) {
    setKind(next);
    setCreated(null);
    if (next === "post" && slides.length > 1) {
      setSlides((current) => {
        for (const slide of current.slice(1)) {
          revokePreview(slide.previewUrl);
        }
        return current.slice(0, 1);
      });
    }
  }

  function resetForm() {
    void replaceSlides([]);
    setName("");
    setCaption("");
    setAiPrompt("");
    setError(null);
    setCreated(null);
  }

  async function createTemplate() {
    if (!signedIn) {
      setError("Sign in to add templates.");
      return;
    }
    if (slides.length === 0) {
      inputRef.current?.click();
      return;
    }

    setIsUploading(true);
    setError(null);
    setCreated(null);

    try {
      const body = new FormData();
      for (const slide of slides) body.append("images", slide.file);
      if (name.trim()) body.append("name", name.trim());
      body.append("text", caption);
      body.append("ai_prompt", aiPrompt);
      body.append("editor_accessible", String(editorAccessible));
      body.append("automate_accessible", String(automateAccessible));

      const response = await fetch("/api/dummy", { method: "POST", body });
      const result = (await response.json()) as {
        template?: SeededTemplate;
        error?: string;
      };

      if (response.status === 401) {
        throw new Error("Sign in to add templates.");
      }
      if (!response.ok || !result.template) {
        throw new Error(result.error || "The template could not be created.");
      }

      setCreated(result.template);
      setSlides((current) => {
        for (const slide of current) revokePreview(slide.previewUrl);
        return [];
      });
      const recentsResponse = await fetch("/api/dummy", { cache: "no-store" });
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
    if (!created) return;
    await navigator.clipboard.writeText(created.previewPath);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const hero = slides[0];
  const totalBytes = slides.reduce((sum, slide) => sum + slide.file.size, 0);

  return (
    <main className="min-h-dvh bg-[#f5f5f7] font-sans text-[#1d1d1f] antialiased">
      <div className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
          Dev team
        </p>
        <header className="mt-3 text-center">
          <h1 className="text-[34px] font-semibold tracking-[-0.035em] sm:text-[40px]">
            Template seeder
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[17px] leading-6 text-[#6e6e73]">
            Drop in a Fabric JSON canvas, a raster image, or a reel of frames.
            Stock photos inside the JSON are copied to R2, then we snapshot the
            composed canvas for the picker.
          </p>
        </header>

        {!signedIn && (
          <div className="mt-8 rounded-[22px] border border-black/[0.06] bg-white px-5 py-4 text-[15px] text-[#6e6e73] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            Sign in with your postpooch account, then come back here to write
            to the live templates table.{" "}
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
            className="grid grid-cols-2 rounded-full bg-[#e8e8ed] p-1"
            role="tablist"
            aria-label="Template kind"
          >
            {(
              [
                ["post", "Single post"],
                ["reel", "Reel / carousel"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                aria-selected={kind === value}
                className={`rounded-full px-3 py-2 text-[13px] font-semibold transition ${
                  kind === value
                    ? "bg-white text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                    : "text-[#6e6e73] hover:text-[#1d1d1f]"
                }`}
                onClick={() => chooseKind(value)}
                role="tab"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className={`relative mt-3 flex min-h-[300px] items-center justify-center overflow-hidden rounded-[21px] border transition-all duration-300 ${
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
            {hero ? (
              <>
                {hero.previewUrl ? (
                  <div
                    aria-label={`Preview of ${hero.file.name}`}
                    className="absolute inset-0 bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url("${hero.previewUrl}")` }}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[#ececf0] px-8 text-center">
                    <p className="text-[15px] font-medium text-[#6e6e73]">
                      Fabric JSON
                      {hero.isJson ? " · inner images rehosted on save" : ""}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">
                      {hero.file.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-white/75">
                      {slides.length === 1
                        ? formatBytes(hero.file.size)
                        : `${slides.length} frames · ${formatBytes(totalBytes)}`}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium backdrop-blur-xl">
                    {hero.isJson ? "Fabric JSON" : "Preview frame"}
                  </span>
                </div>
              </>
            ) : (
              <button
                className="flex h-full w-full flex-col items-center justify-center px-6 py-16 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#0071e3]/20"
                onClick={() => inputRef.current?.click()}
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
                  {kind === "reel"
                    ? "Drop reel frames here"
                    : "Drop a Fabric JSON or image here"}
                </span>
                <span className="mt-1.5 text-[14px] text-[#6e6e73]">
                  or click to browse
                </span>
                <span className="mt-5 text-[12px] text-[#86868b]">
                  JPEG, PNG, GIF, WebP, AVIF, or Fabric JSON · Up to 20 MB each
                  {kind === "reel" ? ` · ${MAX_SLIDES} frames max` : ""}
                </span>
              </button>
            )}
            <input
              ref={inputRef}
              accept={ACCEPTED_TYPES}
              aria-hidden="true"
              className="sr-only"
              multiple={kind === "reel"}
              onChange={handleChange}
              tabIndex={-1}
              type="file"
            />
          </div>

          {kind === "reel" && slides.length > 0 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {slides.map((slide, index) => (
                <li
                  className="relative w-[88px] shrink-0"
                  key={slide.id}
                >
                  <div className="grid h-[110px] w-full place-items-center overflow-hidden rounded-[14px] border border-black/[0.08] bg-[#f2f2f7]">
                    {slide.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={`Frame ${index + 1}, ${slide.file.name}`}
                        className="h-[110px] w-full object-cover"
                        src={slide.previewUrl}
                      />
                    ) : (
                      <span className="px-1 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868b]">
                        JSON
                      </span>
                    )}
                  </div>
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-1.5 text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="mt-1 flex justify-center gap-1">
                    <button
                      aria-label="Move earlier"
                      className="rounded-md px-1.5 text-[11px] text-[#6e6e73] hover:bg-black/[0.04] disabled:opacity-30"
                      disabled={index === 0}
                      onClick={() => moveSlide(slide.id, -1)}
                      type="button"
                    >
                      ←
                    </button>
                    <button
                      aria-label={`Remove frame ${index + 1}`}
                      className="rounded-md px-1.5 text-[11px] text-[#6e6e73] hover:bg-black/[0.04]"
                      onClick={() => removeSlide(slide.id)}
                      type="button"
                    >
                      ✕
                    </button>
                    <button
                      aria-label="Move later"
                      className="rounded-md px-1.5 text-[11px] text-[#6e6e73] hover:bg-black/[0.04] disabled:opacity-30"
                      disabled={index === slides.length - 1}
                      onClick={() => moveSlide(slide.id, 1)}
                      type="button"
                    >
                      →
                    </button>
                  </div>
                </li>
              ))}
              {slides.length < MAX_SLIDES && (
                <li className="w-[88px] shrink-0">
                  <button
                    className="flex h-[110px] w-full items-center justify-center rounded-[14px] border border-dashed border-black/15 text-[12px] font-medium text-[#6e6e73] hover:bg-black/[0.03]"
                    onClick={() => inputRef.current?.click()}
                    type="button"
                  >
                    Add
                  </button>
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
                placeholder="just-listed"
                value={name}
              />
            </label>
            <div className="mx-4 h-px bg-black/[0.08]" />
            <label className="flex flex-col gap-1 px-4 py-3" htmlFor={captionId}>
              <span className="text-[12px] font-medium text-[#6e6e73]">
                Caption
              </span>
              <textarea
                className="min-h-[72px] resize-none bg-transparent text-[17px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                id={captionId}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Just listed. Open house Saturday."
                value={caption}
              />
            </label>
            <div className="mx-4 h-px bg-black/[0.08]" />
            <label className="flex flex-col gap-1 px-4 py-3" htmlFor={promptId}>
              <span className="text-[12px] font-medium text-[#6e6e73]">
                AI prompt
              </span>
              <textarea
                className="min-h-[64px] resize-none bg-transparent text-[17px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                id={promptId}
                onChange={(event) => setAiPrompt(event.target.value)}
                placeholder="Optional. Used later for automated captions."
                value={aiPrompt}
              />
            </label>
            <div className="mx-4 h-px bg-black/[0.08]" />
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-[17px] text-[#1d1d1f]">Show in editor</p>
                <p className="text-[13px] text-[#6e6e73]">
                  Agents can start a post from this template
                </p>
              </div>
              <IosSwitch
                checked={editorAccessible}
                label="Show in editor"
                onChange={setEditorAccessible}
              />
            </div>
            <div className="mx-4 h-px bg-black/[0.08]" />
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-[17px] text-[#1d1d1f]">Use for automation</p>
                <p className="text-[13px] text-[#6e6e73]">
                  Eligible for scheduled template posts
                </p>
              </div>
              <IosSwitch
                checked={automateAccessible}
                label="Use for automation"
                onChange={setAutomateAccessible}
              />
            </div>
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
                Template saved
                {created.mediaCount > 1
                  ? ` · ${created.mediaCount} frames`
                  : ""}
              </div>
              {created.previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Saved template preview"
                  className="mt-3 max-h-40 rounded-xl object-cover"
                  src={created.previewUrl}
                />
              )}
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
            </div>
          )}

          <div className="flex items-center gap-3 px-2 pb-1 pt-4">
            {(slides.length > 0 || created) && (
              <button
                className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#6e6e73] transition hover:bg-black/[0.04] hover:text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-black/5"
                disabled={isUploading}
                onClick={resetForm}
                type="button"
              >
                Clear
              </button>
            )}
            {kind === "post" && slides.length > 0 && (
              <button
                className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] transition hover:bg-[#0071e3]/10 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/15"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                Replace
              </button>
            )}
            <button
              className="ml-auto min-w-36 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0077ed] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20"
              disabled={slides.length === 0 || isUploading}
              onClick={() => void createTemplate()}
              type="button"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Saving
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
              Live rows from the templates table.
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
                        className="size-full object-cover"
                        src={template.previewUrl}
                      />
                    ) : null}
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="truncate text-[13px] font-semibold">
                      {template.caption.split(/\r?\n/, 1)[0] || "Template"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#86868b]">
                      {template.mediaCount === 1
                        ? "1 frame"
                        : `${template.mediaCount} frames`}
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
            social_media/templete_previews/
          </span>
          . Inner Fabric images go to{" "}
          <span className="font-medium text-[#6e6e73]">
            postpooch-images/social_media/media_inner_assets/
          </span>
          . This page is a temporary seeding tool.
        </p>
      </div>
    </main>
  );
}
