"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EditorIcon } from "./editor-icons";
import { PanelLabel } from "./editor-panel";
import type { QueueItem } from "./editor-types";

function DialogShell({
  title,
  description,
  onClose,
  children,
  width = "max-w-xl",
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-pp-ink/35 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90dvh] w-full ${width} overflow-y-auto rounded-marketing bg-white shadow-[0_24px_70px_rgba(36,25,20,0.25)]`}
      >
        <header className="flex items-start gap-4 border-b border-pp-sand/70 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm leading-5 text-pp-stone">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full text-pp-stone hover:bg-pp-mist hover:text-pp-ink"
          >
            <EditorIcon name="close" className="size-4" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function JsonDialog({
  value,
  error,
  onChange,
  onClose,
  onApply,
  onDownload,
}: {
  value: string;
  error: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
  onDownload: () => void;
}) {
  return (
    <DialogShell
      title="Fabric project JSON"
      description="Inspect, edit, import, or keep a portable source file."
      onClose={onClose}
      width="max-w-3xl"
    >
      <div className="p-6">
        <label htmlFor="fabric-json" className="sr-only">
          Fabric project JSON
        </label>
        <textarea
          id="fabric-json"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          className="h-[min(52vh,30rem)] w-full resize-none rounded-card border border-pp-sand bg-[#29221f] p-4 font-mono text-xs leading-5 text-[#fff7ef] outline-none focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/20"
        />
        {error ? <p className="mt-3 text-sm text-pp-coral">{error}</p> : null}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="h-11 rounded-pill border border-pp-sand px-5 text-sm font-semibold hover:bg-pp-mist"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={onApply}
            className="h-11 rounded-pill bg-pp-teal px-5 text-sm font-semibold text-white hover:bg-pp-teal-dark"
          >
            Apply to canvas
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

export function PublishDialog({
  onClose,
  onDownload,
  onPublish,
}: {
  onClose: () => void;
  onDownload: (format: "png" | "jpeg") => void;
  onPublish: (platforms: string[]) => void;
}) {
  const [platforms, setPlatforms] = useState(["Instagram", "Facebook"]);
  const [caption, setCaption] = useState("");

  return (
    <DialogShell
      title="Share your post"
      description="Download a polished file or send it to your connected accounts."
      onClose={onClose}
    >
      <div className="space-y-6 p-6">
        <section>
          <PanelLabel>Download</PanelLabel>
          <div className="grid grid-cols-2 gap-3">
            <DownloadChoice
              label="PNG"
              detail="Best for graphics"
              onClick={() => onDownload("png")}
            />
            <DownloadChoice
              label="JPG"
              detail="Smaller file"
              onClick={() => onDownload("jpeg")}
            />
          </div>
        </section>
        <section>
          <PanelLabel>Publish to</PanelLabel>
          <PlatformPicker value={platforms} onChange={setPlatforms} />
        </section>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Caption</span>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Add a helpful caption and your local perspective…"
            className="min-h-28 w-full rounded-card border border-pp-sand p-3 text-sm leading-6 outline-none placeholder:text-pp-stone focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/20"
          />
        </label>
        <button
          type="button"
          disabled={!platforms.length}
          onClick={() => onPublish(platforms)}
          className="h-12 w-full rounded-pill bg-pp-teal text-sm font-semibold text-white hover:bg-pp-teal-dark disabled:opacity-40"
        >
          Publish now
        </button>
        <p className="text-center text-xs leading-5 text-pp-stone">
          You’ll get a final platform confirmation before a live post is sent.
        </p>
      </div>
    </DialogShell>
  );
}

export function ScheduleDialog({
  queue,
  onAdd,
  onClose,
  onRemove,
}: {
  queue: QueueItem[];
  onAdd: (
    status: QueueItem["status"],
    date: string,
    platforms: string[],
  ) => void;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const [tab, setTab] = useState<"schedule" | "queue">("schedule");
  const [date, setDate] = useState(() => {
    const value = new Date(Date.now() + 86_400_000);
    value.setMinutes(0, 0, 0);
    return new Date(value.getTime() - value.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 16);
  });
  const [platforms, setPlatforms] = useState(["Instagram", "Facebook"]);

  return (
    <DialogShell
      title="Plan this post"
      description="Place it in your posting rhythm while the design is fresh."
      onClose={onClose}
    >
      <div className="border-b border-pp-sand/70 px-6 pt-4">
        <div className="flex gap-6" role="tablist">
          {(["schedule", "queue"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`border-b-2 px-0.5 pb-3 text-sm font-semibold capitalize ${
                tab === item
                  ? "border-pp-teal text-pp-ink"
                  : "border-transparent text-pp-stone"
              }`}
            >
              {item}
              {item === "queue" && queue.length ? ` (${queue.length})` : ""}
            </button>
          ))}
        </div>
      </div>
      {tab === "schedule" ? (
        <div className="space-y-6 p-6">
          <div className="rounded-card border border-pp-sand bg-pp-cream/55 p-4">
            <p className="text-sm font-semibold">Next available slot</p>
            <p className="mt-1 text-sm leading-5 text-pp-stone">
              Tuesday at 9:30 AM · based on your weekly posting schedule
            </p>
            <button
              type="button"
              disabled={!platforms.length}
              onClick={() =>
                onAdd("next", "Next available slot", platforms)
              }
              className="mt-4 h-10 rounded-pill bg-pp-ink px-4 text-sm font-semibold text-white hover:bg-pp-bark disabled:opacity-40"
            >
              Make this the next post
            </button>
          </div>
          <section>
            <PanelLabel>Connected accounts</PanelLabel>
            <PlatformPicker value={platforms} onChange={setPlatforms} />
          </section>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Choose a date and time
            </span>
            <input
              type="datetime-local"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-11 w-full rounded-control border border-pp-sand px-3 text-sm outline-none focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/20"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!platforms.length}
              onClick={() =>
                onAdd("queued", "Waiting for a schedule slot", platforms)
              }
              className="h-11 rounded-pill border border-pp-sand text-sm font-semibold hover:bg-pp-mist disabled:opacity-40"
            >
              Add to queue
            </button>
            <button
              type="button"
              disabled={!date || !platforms.length}
              onClick={() =>
                onAdd("scheduled", new Date(date).toISOString(), platforms)
              }
              className="h-11 rounded-pill bg-pp-teal text-sm font-semibold text-white hover:bg-pp-teal-dark disabled:opacity-40"
            >
              Schedule post
            </button>
          </div>
        </div>
      ) : (
        <QueueList queue={queue} onRemove={onRemove} />
      )}
    </DialogShell>
  );
}

function PlatformPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (platforms: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {["Instagram", "Facebook", "LinkedIn"].map((platform) => {
        const selected = value.includes(platform);
        return (
          <button
            key={platform}
            type="button"
            aria-pressed={selected}
            onClick={() =>
              onChange(
                selected
                  ? value.filter((item) => item !== platform)
                  : [...value, platform],
              )
            }
            className={`rounded-pill border px-3.5 py-2 text-sm font-medium ${
              selected
                ? "border-pp-teal bg-pp-teal/8 text-pp-teal-dark"
                : "border-pp-sand text-pp-stone"
            }`}
          >
            {selected ? "✓ " : ""}
            {platform}
          </button>
        );
      })}
    </div>
  );
}

function DownloadChoice({
  label,
  detail,
  onClick,
}: {
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-card border border-pp-sand p-4 text-left hover:bg-pp-mist"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-pp-cream text-pp-teal">
        <EditorIcon name="download" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="text-xs text-pp-stone">{detail}</span>
      </span>
    </button>
  );
}

function QueueList({
  queue,
  onRemove,
}: {
  queue: QueueItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="p-6">
      {queue.length ? (
        <div className="space-y-3">
          {queue.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-card border border-pp-sand/80 p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-pp-cream text-sm font-bold text-pp-cocoa">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="mt-0.5 truncate text-xs text-pp-stone">
                  {formatQueueDate(item.scheduledAt)} · {item.platforms.join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name} from queue`}
                className="flex size-9 items-center justify-center rounded-full text-pp-stone hover:bg-pp-coral/10 hover:text-pp-coral"
              >
                <EditorIcon name="trash" className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <Image
            src="/postpooch_web_mascot_assets/responsive/with-shadow/webp/postpooch-mascot-with-shadow-128w.webp"
            alt=""
            width={76}
            height={76}
            className="mx-auto h-[76px] w-auto"
          />
          <p className="mt-4 text-sm font-semibold">
            Your queue is ready for its first post
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-pp-stone">
            Schedule this design or add it to the queue for later.
          </p>
        </div>
      )}
      <Link
        href="/dashboard/social-media/social-schedule"
        className="mt-5 flex h-11 items-center justify-center rounded-pill border border-pp-sand text-sm font-semibold hover:bg-pp-mist"
      >
        Open the schedule
      </Link>
    </div>
  );
}

function formatQueueDate(value: string) {
  if (value === "Next available slot") return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
