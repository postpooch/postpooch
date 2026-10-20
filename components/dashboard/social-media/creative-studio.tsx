"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Check,
  Facebook,
  FileImage,
  Instagram,
  Link2,
  LoaderCircle,
  Menu,
  MessageSquareText,
  Paperclip,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  SendHorizontal,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  platformDisplayName,
  type ConnectablePlatform,
} from "@/lib/zernio/platforms";
import { CreativeProfile } from "./creative-profile";

type NoteState =
  | "processing"
  | "applied"
  | "no_change"
  | "needs_review"
  | "conflict"
  | "infrastructure_failure"
  | null;

type CreativeNote = {
  id: string;
  body: string;
  createdAt: string;
  state: NoteState;
};

export type StudioConnections = Record<ConnectablePlatform, boolean>;

const NOTE_STARTERS = [
  "I have an open house coming up next weekend.",
  "Use fewer emojis and keep the writing conversational.",
  "The tone of my last market update felt exactly right.",
];

const CHANNELS: Array<{
  id: ConnectablePlatform;
  description: string;
  icon: typeof Instagram;
}> = [
  { id: "instagram", description: "Feed posts and Reels", icon: Instagram },
  { id: "facebook", description: "Page posts", icon: Facebook },
];

const serif = "[font-family:var(--font-source-serif),Georgia,serif]";

function noteStateLabel(state: NoteState) {
  if (state === "processing") return "Learning";
  if (state === "applied") return "Remembered";
  if (state === "no_change") return "Already known";
  if (state === "needs_review") return "Needs clarification";
  if (state === "conflict") return "Needs another try";
  if (state === "infrastructure_failure") return "Could not process";
  return "Saved";
}

function noteStateTone(state: NoteState) {
  if (state === "applied" || state === "no_change") return "bg-[#62766b]";
  if (
    state === "needs_review" ||
    state === "conflict" ||
    state === "infrastructure_failure"
  ) {
    return "bg-[#b45f43]";
  }
  return "bg-[#a09a8e]";
}

function formatNoteDate(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const noteDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round(
    (today.getTime() - noteDay.getTime()) / 86_400_000,
  );

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) {
    return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
      date,
    );
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function StudioDialog({
  open,
  onOpenChange,
  title,
  description,
  size = "max-w-4xl",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  size?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#141413]/45 data-[state=closed]:animate-[pp-dialog-overlay-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-overlay-in_180ms_ease-out_both]" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 z-[71] flex max-h-[min(88dvh,860px)] w-[calc(100%-1.5rem)] ${size} -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-[#cccbc8] bg-[#faf9f5] outline-none data-[state=closed]:animate-[pp-dialog-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]`}
        >
          <div className="flex shrink-0 items-start justify-between gap-5 border-b border-[#cccbc8] px-5 py-4 sm:px-7 sm:py-5">
            <div>
              <Dialog.Title
                className={`text-[25px] leading-tight text-[#141413] ${serif}`}
              >
                {title}
              </Dialog.Title>
              <Dialog.Description
                className={`mt-1 text-[15px] leading-6 text-[#74736c] ${serif}`}
              >
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#cccbc8] text-[#74736c] transition-colors hover:bg-[#f0eee6] hover:text-[#141413] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757]">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function NotesSidebar({
  notes,
  loading,
  loadError,
  selectedNoteId,
  onNewNote,
  onSelectNote,
  onClose,
  onCollapse,
}: {
  notes: CreativeNote[];
  loading: boolean;
  loadError: string;
  selectedNoteId: string | null;
  onNewNote: () => void;
  onSelectNote: (note: CreativeNote) => void;
  onClose?: () => void;
  onCollapse?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#e9e4da]">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#141413]">
            Notes
          </p>
          <p className="mt-0.5 text-[12px] text-[#74736c]">
            past notes
          </p>
        </div>
        {onClose || onCollapse ? (
          <button
            type="button"
            onClick={onClose ?? onCollapse}
            className="inline-flex size-9 items-center justify-center rounded-[12px] border border-[#cccbc8] text-[#74736c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757]"
          >
            {onClose ? (
              <X className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
            <span className="sr-only">
              {onClose ? "Close note history" : "Collapse note history"}
            </span>
          </button>
        ) : null}
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={onNewNote}
          className="flex w-full items-center gap-3 rounded-b-[8px] bg-[#141413] px-4 py-3 text-left text-[13px] font-semibold text-[#faf9f5] transition-colors hover:bg-[#3d3d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757]"
        >
          <Plus className="size-4" />
          New note
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-[#cccbc8]">
        <p className="px-5 pt-5 pb-2 text-[12px] font-semibold text-[#74736c]">
          Recent notes
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 [scrollbar-color:#cccbc8_transparent] [scrollbar-width:thin]">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-4 text-[12px] text-[#74736c]">
              <LoaderCircle className="size-3.5 animate-spin" />
              Loading your notes…
            </div>
          ) : null}
          {!loading && loadError ? (
            <p
              role="alert"
              className="px-3 py-4 text-[12px] leading-5 text-[#9f4f38]"
            >
              {loadError}
            </p>
          ) : null}
          {!loading && !loadError && notes.length === 0 ? (
            <div className="px-3 py-6">
              <p className={`text-[17px] text-[#141413] ${serif}`}>
                No notes yet.
              </p>
              <p
                className={`mt-1 text-[14px] leading-5 text-[#74736c] ${serif}`}
              >
                The first thing you share will appear here.
              </p>
            </div>
          ) : null}
          <ol className="space-y-1">
            {notes.map((note) => {
              const active = selectedNoteId === note.id;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelectNote(note)}
                    className={[
                      "w-full rounded-[12px] border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#d97757]",
                      active
                        ? "border-[#cccbc8] bg-[#faf9f5]"
                        : "border-transparent hover:bg-[#f0eee6]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <time className="text-[11px] font-medium text-[#74736c]">
                        {formatNoteDate(note.createdAt)}
                      </time>
                      <span className="flex items-center gap-1.5 text-[10px] text-[#74736c]">
                        <span
                          className={`size-1.5 rounded-full ${noteStateTone(note.state)}`}
                        />
                        {noteStateLabel(note.state)}
                      </span>
                    </div>
                    <p
                      className={`mt-1.5 line-clamp-2 text-[14px] leading-5 text-[#141413] ${serif}`}
                    >
                      {note.body}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <p
        className={`border-t border-[#cccbc8] px-5 py-4 text-[13px] leading-5 text-[#74736c] ${serif}`}
      >
        Notes teach your creative team what to remember for future posts.
      </p>
    </div>
  );
}

function NoteComposer({
  onSubmit,
  submitting,
}: {
  onSubmit: (
    body: string,
    files: File[],
    purpose: string,
  ) => Promise<boolean>;
  submitting: boolean;
}) {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [purpose, setPurpose] = useState("other");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!body.trim() || submitting) return;
    const saved = await onSubmit(body.trim(), files, purpose);
    if (!saved) return;
    setBody("");
    setFiles([]);
    setPurpose("other");
    if (fileInputRef.current) fileInputRef.current.value = "";
    textareaRef.current?.focus();
  }

  function handleShortcut(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void submit();
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-center px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl text-center">
        <h1
          className={`text-[36px] leading-[1.08] tracking-[-0.025em] text-[#141413] sm:text-[48px] ${serif}`}
        >
          Control your posts
        </h1>
        <p
          className={`mx-auto mt-4 max-w-xl text-[17px] leading-7 text-[#5f5e58] sm:text-[19px] ${serif}`}
        >
          Share a passing thought, a lasting preference, or something new in
          your business. Write it exactly as you would say it.
        </p>
      </div>

      <form onSubmit={submit} className="mt-9 w-full">
        <div className="overflow-hidden rounded-[24px] border border-[#aaa79f] bg-[#faf9f5] transition-colors focus-within:border-[#141413]">
          <label htmlFor="studio-note" className="sr-only">
            A note for your content team
          </label>
          <textarea
            ref={textareaRef}
            id="studio-note"
            value={body}
            maxLength={4000}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={handleShortcut}
            placeholder="Tell us what is changing, what you liked, or what you want to see more often…"
            className={`min-h-48 w-full resize-none bg-transparent px-5 pt-5 pb-3 text-[19px] leading-7 text-[#141413] outline-none placeholder:text-[#98968e] sm:min-h-52 sm:px-6 sm:pt-6 sm:text-[20px] ${serif}`}
          />

          {files.length ? (
            <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-[12px] border border-[#cccbc8] bg-[#f0eee6] px-3 py-2.5 sm:mx-6">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileImage className="size-4 shrink-0 text-[#74736c]" />
                <p className="truncate text-[12px] text-[#3d3d3a]">
                  {files.length === 1
                    ? files[0].name
                    : `${files.length} images attached`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <select
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  aria-label="Image purpose"
                  className="h-8 rounded-[8px] border border-[#cccbc8] bg-[#faf9f5] px-2 text-[11px] text-[#3d3d3a] outline-none focus:border-[#141413]"
                >
                  <option value="headshot">Headshot</option>
                  <option value="logo">Logo</option>
                  <option value="office">Office</option>
                  <option value="listing">Listing</option>
                  <option value="community">Community</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#74736c] hover:bg-[#e3dacc] hover:text-[#141413] focus-visible:outline-2 focus-visible:outline-[#d97757]"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Remove attachments</span>
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 border-t border-[#dedbd4] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-2 text-[12px] font-medium text-[#5f5e58] transition-colors hover:bg-[#f0eee6] hover:text-[#141413] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#d97757]">
                <Paperclip className="size-4" />
                <span className="hidden sm:inline">Attach images</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(event) =>
                    setFiles(
                      Array.from(event.target.files ?? []).slice(0, 10),
                    )
                  }
                />
              </label>
              <span className="hidden text-[11px] text-[#98968e] sm:block">
                ⌘ Enter to send
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] tabular-nums text-[#98968e] sm:block">
                {body.length}/4000
              </span>
              <button
                type="submit"
                disabled={!body.trim() || submitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-b-[8px] bg-[#d97757] px-4 text-[12px] font-semibold text-[#141413] transition-colors hover:bg-[#c6613f] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141413]"
              >
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <SendHorizontal className="size-4" />
                )}
                {submitting ? "Saving" : "Share note"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-6 w-full">
        <p className="text-center text-[12px] font-medium text-[#74736c]">
          Not sure where to begin?
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {NOTE_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => {
                setBody(starter);
                textareaRef.current?.focus();
              }}
              className={`border-t border-[#cccbc8] px-2 py-3 text-left text-[14px] leading-5 text-[#5f5e58] transition-colors hover:border-[#141413] hover:text-[#141413] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757] ${serif}`}
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      <p
        className={`mt-8 flex items-center gap-2 text-[13px] text-[#74736c] ${serif}`}
      >
        <MessageSquareText className="size-3.5" />
        Postpooch decides what to remember and when it should influence a post.
      </p>
    </div>
  );
}

function NoteDetail({
  note,
  onBack,
  onRetry,
}: {
  note: CreativeNote;
  onBack: () => void;
  onRetry: (id: string) => void;
}) {
  const retryable =
    note.state === "conflict" || note.state === "infrastructure_failure";

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10 sm:px-8 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#5f5e58] hover:text-[#141413] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d97757]"
      >
        <ArrowLeft className="size-4" />
        Back to a new note
      </button>

      <article className="mt-8 rounded-[24px] border border-[#cccbc8] bg-[#faf9f5] p-6 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dedbd4] pb-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#5f5e58]">
            <span
              className={`size-2 rounded-full ${noteStateTone(note.state)}`}
            />
            {noteStateLabel(note.state)}
          </div>
          <time className="text-[12px] text-[#74736c]">
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(note.createdAt))}
          </time>
        </div>
        <p
          className={`mt-7 whitespace-pre-wrap text-[24px] leading-[1.45] text-[#141413] sm:text-[28px] ${serif}`}
        >
          {note.body}
        </p>
        {retryable ? (
          <button
            type="button"
            onClick={() => onRetry(note.id)}
            className="mt-7 inline-flex h-10 items-center gap-2 rounded-b-[8px] bg-[#141413] px-4 text-[12px] font-semibold text-[#faf9f5] hover:bg-[#3d3d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757]"
          >
            <RefreshCw className="size-3.5" />
            Try processing again
          </button>
        ) : null}
      </article>
    </div>
  );
}

function ChannelsDialogContent({
  connected,
  onConnect,
  connecting,
  message,
}: {
  connected: StudioConnections;
  onConnect: (platform: ConnectablePlatform) => void;
  connecting: ConnectablePlatform | null;
  message: { tone: "success" | "error"; text: string } | null;
}) {
  return (
    <div className="p-5 sm:p-7">
      {message ? (
        <p
          role={message.tone === "error" ? "alert" : "status"}
          className={`mb-5 border-l-2 px-3 py-1 text-[13px] ${message.tone === "error" ? "border-[#b45f43] text-[#8e422f]" : "border-[#62766b] text-[#52675b]"}`}
        >
          {message.text}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const isConnected = connected[channel.id];
          const isConnecting = connecting === channel.id;
          return (
            <section
              key={channel.id}
              className="rounded-[24px] border border-[#cccbc8] bg-[#f0eee6] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex size-11 items-center justify-center rounded-[12px] border border-[#cccbc8] bg-[#faf9f5] text-[#141413]">
                  <Icon className="size-5" />
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#5f5e58]">
                  <span
                    className={`size-1.5 rounded-full ${isConnected ? "bg-[#62766b]" : "bg-[#a09a8e]"}`}
                  />
                  {isConnected ? "Connected" : "Not connected"}
                </span>
              </div>
              <h3 className={`mt-5 text-[22px] text-[#141413] ${serif}`}>
                {platformDisplayName(channel.id)}
              </h3>
              <p className={`mt-1 text-[15px] text-[#74736c] ${serif}`}>
                {channel.description}
              </p>
              {isConnected ? (
                <div className="mt-6 flex h-10 items-center gap-2 text-[12px] font-semibold text-[#52675b]">
                  <Check className="size-4" /> Ready to publish
                </div>
              ) : (
                <button
                  type="button"
                  disabled={connecting !== null}
                  onClick={() => onConnect(channel.id)}
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-b-[8px] bg-[#141413] px-4 text-[12px] font-semibold text-[#faf9f5] hover:bg-[#3d3d3a] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757]"
                >
                  {isConnecting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Link2 className="size-4" />
                  )}
                  {isConnecting ? "Opening…" : "Connect"}
                </button>
              )}
            </section>
          );
        })}
      </div>
      <p className={`mt-5 text-[14px] leading-6 text-[#74736c] ${serif}`}>
        Connecting a channel lets approved posts publish there. Your login
        details remain with the social platform.
      </p>
    </div>
  );
}

export function CreativeStudio({
  hasCompletedProfile,
  connections,
}: {
  hasCompletedProfile: boolean;
  connections: StudioConnections;
}) {
  const [profileComplete, setProfileComplete] = useState(hasCompletedProfile);
  const [notes, setNotes] = useState<CreativeNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [desktopHistoryOpen, setDesktopHistoryOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [connected, setConnected] = useState(connections);
  const [connecting, setConnecting] =
    useState<ConnectablePlatform | null>(null);
  const [channelMessage, setChannelMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? null;
  const connectedCount = Object.values(connected).filter(Boolean).length;

  function showToast(tone: "success" | "error", text: string) {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ tone, text });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3600);
  }

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/social_media/notes", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("We couldn’t load your note history.");
        const body = (await response.json()) as {
          data: Array<{
            id: string;
            note: string;
            createdAt: string;
            state: NoteState;
          }>;
        };
        setNotes(
          body.data.map((note) => ({
            id: note.id,
            body: note.note,
            createdAt: note.createdAt,
            state: note.state,
          })),
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "We couldn’t load your note history.",
        );
      } finally {
        if (!controller.signal.aborted) setLoadingNotes(false);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get(
      "connected",
    ) as ConnectablePlatform | null;
    const errorPlatform = params.get("platform") as ConnectablePlatform | null;
    if (
      connectedPlatform === "instagram" ||
      connectedPlatform === "facebook"
    ) {
      window.history.replaceState({}, "", "/dashboard/social-media/studio");
      const timer = window.setTimeout(() => {
        setConnected((current) => ({
          ...current,
          [connectedPlatform]: true,
        }));
        setChannelMessage({
          tone: "success",
          text: `${platformDisplayName(connectedPlatform)} is connected.`,
        });
        setChannelsOpen(true);
      }, 0);
      return () => window.clearTimeout(timer);
    } else if (params.has("connect_error")) {
      const label =
        errorPlatform === "instagram" || errorPlatform === "facebook"
          ? platformDisplayName(errorPlatform)
          : "channel";
      window.history.replaceState({}, "", "/dashboard/social-media/studio");
      const timer = window.setTimeout(() => {
        setChannelMessage({
          tone: "error",
          text: `We couldn’t connect your ${label}. Please try again.`,
        });
        setChannelsOpen(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    },
    [],
  );

  async function addNote(body: string, files: File[], purpose: string) {
    setSubmitting(true);
    try {
      const assetIds: string[] = [];
      for (const file of files) {
        const form = new FormData();
        form.set("image", file);
        form.set("purpose", purpose);
        const upload = await fetch("/api/social_media/assets", {
          method: "POST",
          body: form,
        });
        const uploaded = (await upload.json().catch(() => null)) as {
          asset?: { id?: string };
          error?: string;
        } | null;
        if (!upload.ok || !uploaded?.asset?.id) {
          throw new Error(
            uploaded?.error ?? "We couldn’t upload an attached image.",
          );
        }
        assetIds.push(uploaded.asset.id);
      }

      const response = await fetch("/api/social_media/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: body,
          submissionKey: crypto.randomUUID(),
          assetIds,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        data?: { noteId?: string; state?: NoteState };
        error?: string | { message?: string };
      } | null;
      if (!result?.data?.noteId) {
        const message =
          typeof result?.error === "string"
            ? result.error
            : result?.error?.message;
        throw new Error(message ?? "We couldn’t save that note.");
      }

      setNotes((current) => [
        {
          id: result.data!.noteId!,
          body,
          createdAt: new Date().toISOString(),
          state: result.data!.state ?? "processing",
        },
        ...current,
      ]);
      setLoadError("");
      showToast(
        "success",
        result.data.state === "needs_review"
          ? "Note saved — a little more context may be needed."
          : "Note shared with your content team.",
      );
      return true;
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "We couldn’t save that note.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function retryNote(noteId: string) {
    try {
      const response = await fetch(`/api/social_media/notes/${noteId}/retry`, {
        method: "POST",
      });
      const body = (await response.json().catch(() => null)) as {
        data?: { state?: NoteState };
        error?: string;
      } | null;
      if (!body?.data?.state) {
        throw new Error(body?.error ?? "We couldn’t retry that note.");
      }
      setNotes((current) =>
        current.map((note) =>
          note.id === noteId ? { ...note, state: body.data!.state! } : note,
        ),
      );
      showToast(
        "success",
        body.data.state === "applied"
          ? "That note is now remembered."
          : "The note was processed again.",
      );
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "We couldn’t retry that note.",
      );
    }
  }

  async function connectChannel(platform: ConnectablePlatform) {
    if (connecting) return;
    setConnecting(platform);
    setChannelMessage(null);
    try {
      window.sessionStorage.setItem(
        "pp-social-connect-return",
        "/dashboard/social-media/studio",
      );
      const response = await fetch("/api/social_accounts/make_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const result = (await response.json()) as {
        authUrl?: string;
        error?: string;
      };
      if (response.status === 401) {
        window.location.assign("/auth/login");
        return;
      }
      if (!response.ok || !result.authUrl) {
        throw new Error(
          result.error ??
            `We couldn’t start the ${platformDisplayName(platform)} connection.`,
        );
      }
      window.location.assign(result.authUrl);
    } catch (error) {
      setChannelMessage({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "We couldn’t start that connection.",
      });
      setConnecting(null);
    }
  }

  if (!profileComplete) {
    return (
      <div className="min-h-dvh bg-[#f0eee6] px-5 py-10">
        <CreativeProfile
          mode="onboarding"
          onFinish={() => setProfileComplete(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-3.75rem)] overflow-hidden bg-[#f0eee6] text-[#141413] lg:min-h-dvh">
      <aside
        aria-hidden={!desktopHistoryOpen}
        inert={desktopHistoryOpen ? undefined : true}
        className={[
          "hidden shrink-0 overflow-hidden transition-[width,border-color] duration-200 ease-out lg:block",
          desktopHistoryOpen
            ? "w-[284px] border-r border-[#cccbc8]"
            : "w-0 border-r-0",
        ].join(" ")}
      >
        <div className="h-full w-[284px]">
          <NotesSidebar
            notes={notes}
            loading={loadingNotes}
            loadError={loadError}
            selectedNoteId={selectedNoteId}
            onNewNote={() => setSelectedNoteId(null)}
            onSelectNote={(note) => setSelectedNoteId(note.id)}
            onCollapse={() => setDesktopHistoryOpen(false)}
          />
        </div>
      </aside>

      {mobileHistoryOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close note history"
            className="absolute inset-0 bg-[#141413]/35"
            onClick={() => setMobileHistoryOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,320px)] border-r border-[#cccbc8]">
            <NotesSidebar
              notes={notes}
              loading={loadingNotes}
              loadError={loadError}
              selectedNoteId={selectedNoteId}
              onNewNote={() => {
                setSelectedNoteId(null);
                setMobileHistoryOpen(false);
              }}
              onSelectNote={(note) => {
                setSelectedNoteId(note.id);
                setMobileHistoryOpen(false);
              }}
              onClose={() => setMobileHistoryOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-[#cccbc8] bg-[#f0eee6] px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.matchMedia("(min-width: 1024px)").matches) {
                  setDesktopHistoryOpen(true);
                } else {
                  setMobileHistoryOpen(true);
                }
              }}
              className={[
                "size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#cccbc8] text-[#5f5e58] hover:bg-[#faf9f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757]",
                desktopHistoryOpen ? "inline-flex lg:hidden" : "inline-flex",
              ].join(" ")}
            >
              <Menu className="size-4 lg:hidden" />
              <PanelLeftOpen className="hidden size-4 lg:block" />
              <span className="sr-only">Open note history</span>
            </button>
            <p className={`truncate text-[18px] text-[#141413] ${serif}`}>
              Your content studio
            </p>
          </div>
          
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#aaa79f] px-3 text-[12px] font-semibold text-[#3d3d3a] transition-colors hover:bg-[#faf9f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757] sm:px-4"
            >
              <UserRound className="size-4" />
              <span className="hidden sm:inline">Basic facts</span>
              <span className="sm:hidden">Facts</span>
            </button>
            <button
              type="button"
              onClick={() => setChannelsOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#aaa79f] px-3 text-[12px] font-semibold text-[#3d3d3a] transition-colors hover:bg-[#faf9f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757] sm:px-4"
            >
              <Link2 className="size-4" />
              <span className="hidden sm:inline">Accounts</span>
              <span className="text-[10px] text-[#74736c]">
                {connectedCount}/2
              </span>
            </button>

            
            <button
              type="button"
              onClick={() => setChannelsOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#aaa79f] px-3 text-[12px] font-semibold text-[#3d3d3a] transition-colors hover:bg-[#faf9f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97757] sm:px-4"
            >
              <Link2 className="size-4" />
              <span className="hidden sm:inline">Editor</span>
              
            </button>


            
            
          </div>
          
        </header>

        <div className="flex min-h-0 flex-1 items-start overflow-y-auto lg:items-center">
          {selectedNote ? (
            <NoteDetail
              note={selectedNote}
              onBack={() => setSelectedNoteId(null)}
              onRetry={(id) => void retryNote(id)}
            />
          ) : (
            <NoteComposer onSubmit={addNote} submitting={submitting} />
          )}
        </div>
      </main>

      <StudioDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        title="Basic facts"
        description="The lasting details that shape every post."
        size="max-w-5xl"
      >
        <div className="p-4 sm:p-6">
          <CreativeProfile mode="edit" embedded />
        </div>
      </StudioDialog>

      <StudioDialog
        open={channelsOpen}
        onOpenChange={setChannelsOpen}
        title="Publishing channels"
        description="Choose where finished posts can be published."
        size="max-w-2xl"
      >
        <ChannelsDialogContent
          connected={connected}
          connecting={connecting}
          message={channelMessage}
          onConnect={(platform) => void connectChannel(platform)}
        />
      </StudioDialog>

      <div
        role="status"
        aria-live="polite"
        className={[
          "fixed right-4 bottom-4 z-[80] flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-[12px] border px-4 py-3 text-[13px] transition duration-200 sm:right-6 sm:bottom-6",
          toast?.tone === "error"
            ? "border-[#9f4f38] bg-[#f5e3c7] text-[#7d3e2d]"
            : "border-[#3d3d3a] bg-[#141413] text-[#faf9f5]",
          toast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        ].join(" ")}
      >
        {toast?.tone === "error" ? (
          <X className="size-4 shrink-0" />
        ) : (
          <Check className="size-4 shrink-0" />
        )}
        {toast?.text}
      </div>
    </div>
  );
}
