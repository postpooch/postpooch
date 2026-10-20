"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  SCHEDULE_PLATFORMS,
  defaultSchedulePlatforms,
  normalizeSchedulePlatforms,
  type ConnectedSchedulePlatforms,
  type SchedulePlatform,
} from "@/lib/schedule-platforms";
import {
  MAX_AUTOMATIC_SCHEDULES,
  SCHEDULE_DAYS,
  sortPostingSlots,
  type PostingSlot,
  type ScheduleDayId,
} from "@/lib/schedule-slots";
import { CloseIcon } from "../icons";
import { LoadingIndicator } from "@/components/dashboard/website/loading-indicator";

const MAX_SLOTS = MAX_AUTOMATIC_SCHEDULES;

const DAYS = SCHEDULE_DAYS;

type DayId = ScheduleDayId;

type TimePeriod = "morning" | "afternoon" | "evening";

type TimeSlot = {
  minutes: number;
  label: string;
  period: TimePeriod;
};

/** Half-hour slots from midnight through 11:30 PM */
const TIME_SLOTS: TimeSlot[] = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period: TimePeriod =
    hours < 12 ? "morning" : hours < 17 ? "afternoon" : "evening";
  return {
    minutes: totalMinutes,
    label: formatTime(hours, minutes),
    period,
  };
});

const PERIOD_LABELS: Record<TimePeriod, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const PLATFORM_SHORT: Record<SchedulePlatform, string> = {
  Instagram: "IG",
  Facebook: "FB",
};

export type { PostingSlot };

function formatTime(hours: number, minutes: number) {
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatMinutes(totalMinutes: number) {
  return formatTime(Math.floor(totalMinutes / 60), totalMinutes % 60);
}

function parseCustomTime(raw: string) {
  const value = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (!value) return null;

  const match12 = /^(\d{1,2})(?::(\d{2}))?([ap])\.?m?\.?$/.exec(value);
  if (match12) {
    let hours = Number(match12[1]);
    const minutes = match12[2] ? Number(match12[2]) : 0;
    if (hours < 1 || hours > 12 || minutes > 59) return null;
    hours = hours === 12 ? 0 : hours;
    return match12[3] === "a"
      ? hours * 60 + minutes
      : (hours + 12) * 60 + minutes;
  }

  const match24 = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (match24) {
    const hours = Number(match24[1]);
    const minutes = Number(match24[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  return null;
}

function slotKey(slot: Pick<PostingSlot, "day" | "minutes">) {
  return `${slot.day}-${slot.minutes}`;
}

function dayLabel(day: DayId) {
  return DAYS.find((d) => d.id === day)?.label ?? day;
}

function dayShort(day: DayId) {
  return DAYS.find((d) => d.id === day)?.short ?? day;
}

function slotLabel(slot: PostingSlot) {
  return `${dayLabel(slot.day)} at ${formatMinutes(slot.minutes)}`;
}

function normalizeSlots(
  slots: PostingSlot[],
  connected: ConnectedSchedulePlatforms,
) {
  const fallback = defaultSchedulePlatforms(connected);
  return sortPostingSlots(
    slots.map((slot) => {
      const platforms = normalizeSchedulePlatforms(slot.platforms ?? []).filter(
        (platform) => connected[platform],
      );
      return {
        day: slot.day,
        minutes: slot.minutes,
        platforms: platforms.length > 0 ? platforms : fallback,
      };
    }),
  ).slice(0, MAX_SLOTS);
}

const MASCOT_SRC =
  "/postpooch_web_mascot_assets/responsive/with-shadow/webp/postpooch-mascot-with-shadow-128w.webp";

function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 8.25 6.5 11.25 12.5 4.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WeeklySchedulePicker({
  initialSlots = [],
  connectedPlatforms,
}: {
  initialSlots?: PostingSlot[];
  connectedPlatforms: ConnectedSchedulePlatforms;
}) {
  const liveId = useId();
  const [selected, setSelected] = useState(() =>
    normalizeSlots(initialSlots, connectedPlatforms),
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeSlots(initialSlots, connectedPlatforms)),
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<DayId>("mon");
  const [customOpenDay, setCustomOpenDay] = useState<DayId | null>(null);
  const [customTimes, setCustomTimes] = useState<Partial<Record<DayId, string>>>(
    {},
  );
  const [customError, setCustomError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRequestId = useRef(0);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const selectedKeys = new Set(selected.map(slotKey));
  const currentDay = DAYS.find((d) => d.id === activeDay) ?? DAYS[0];
  const atCapacity = selected.length >= MAX_SLOTS;
  const dirty = JSON.stringify(selected) !== savedSnapshot;
  const remaining = MAX_SLOTS - selected.length;
  const progress = selected.length / MAX_SLOTS;
  const saving = saveState === "saving";
  const hasConnectedPlatform =
    connectedPlatforms.Instagram || connectedPlatforms.Facebook;
  const defaultPlatforms = defaultSchedulePlatforms(connectedPlatforms);

  function toggleSlot(day: DayId, minutes: number) {
    if (saving) return;
    const key = `${day}-${minutes}`;
    setSaveState("idle");
    setSaveError(null);

    if (selectedKeys.has(key)) {
      setSelected((prev) => prev.filter((s) => slotKey(s) !== key));
      return;
    }

    if (atCapacity) return;
    if (!hasConnectedPlatform) {
      setSaveError("Connect Instagram or Facebook before choosing times.");
      setSaveState("error");
      return;
    }

    setSelected((prev) =>
      normalizeSlots(
        [...prev, { day, minutes, platforms: defaultPlatforms }],
        connectedPlatforms,
      ),
    );
  }

  function removeSlot(slot: PostingSlot) {
    if (saving) return;
    setSaveState("idle");
    setSaveError(null);
    setSelected((prev) => prev.filter((s) => slotKey(s) !== slotKey(slot)));
  }

  function openCustomTime(day: DayId) {
    if (saving) return;
    setSaveState("idle");
    setSaveError(null);
    setCustomError(null);
    setCustomOpenDay(day);
  }

  function cancelCustomTime() {
    setCustomOpenDay(null);
    setCustomError(null);
  }

  function changeCustomTime(day: DayId, value: string) {
    setCustomError(null);
    setCustomTimes((prev) => ({ ...prev, [day]: value }));
  }

  function addCustomTime(day: DayId) {
    if (saving) return;
    const parsed = parseCustomTime(customTimes[day] ?? "");
    if (parsed === null) {
      setCustomError("Enter a time like 9:45 PM or 14:30.");
      return;
    }

    if (selectedKeys.has(`${day}-${parsed}`)) {
      setCustomError(
        `${formatMinutes(parsed)} on ${dayLabel(day)} is already selected.`,
      );
      return;
    }

    setCustomOpenDay(null);
    setCustomError(null);
    toggleSlot(day, parsed);
  }

  function clearAll() {
    if (saving) return;
    setSaveState("idle");
    setSaveError(null);
    setSelected([]);
  }

  function togglePlatform(slot: PostingSlot, platform: SchedulePlatform) {
    if (saving) return;
    if (!connectedPlatforms[platform]) return;

    setSaveState("idle");
    setSaveError(null);
    setSelected((prev) =>
      prev.map((entry) => {
        if (slotKey(entry) !== slotKey(slot)) return entry;

        const hasPlatform = entry.platforms.includes(platform);
        if (hasPlatform) {
          if (entry.platforms.length <= 1) return entry;
          return {
            ...entry,
            platforms: normalizeSchedulePlatforms(
              entry.platforms.filter((item) => item !== platform),
            ),
          };
        }

        return {
          ...entry,
          platforms: normalizeSchedulePlatforms([
            ...entry.platforms,
            platform,
          ]),
        };
      }),
    );
  }

  async function saveSchedule() {
    if (!dirty || saving) return;

    if (selected.some((slot) => slot.platforms.length === 0)) {
      setSaveState("error");
      setSaveError("Choose at least one platform for each posting time.");
      return;
    }

    const requestId = ++saveRequestId.current;
    const slotsToSave = selected;
    setSaveState("saving");
    setSaveError(null);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        "/api/trigger/update_social-post_schedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slots: slotsToSave, timezone }),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        schedules?: Array<{
          day: DayId;
          minutes: number;
          platforms: SchedulePlatform[];
        }>;
      } | null;

      if (requestId !== saveRequestId.current) return;

      if (!response.ok) {
        setSaveState("error");
        setSaveError(
          payload?.error?.trim() ||
            "Unable to save your posting schedule right now.",
        );
        return;
      }

      const nextSlots = normalizeSlots(
        Array.isArray(payload?.schedules)
          ? payload.schedules.map((slot) => ({
              day: slot.day,
              minutes: slot.minutes,
              platforms: slot.platforms,
            }))
          : slotsToSave,
        connectedPlatforms,
      );
      setSelected(nextSlots);
      setSavedSnapshot(JSON.stringify(nextSlots));
      setSaveState("saved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (requestId === saveRequestId.current) {
          setSaveState("idle");
        }
      }, 2400);
    } catch {
      if (requestId !== saveRequestId.current) return;
      setSaveState("error");
      setSaveError("Unable to save your posting schedule right now.");
    }
  }

  function onDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: DayId) {
    const index = DAYS.findIndex((d) => d.id === day);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActiveDay(DAYS[(index + 1) % DAYS.length].id);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveDay(DAYS[(index - 1 + DAYS.length) % DAYS.length].id);
    }
  }

  const statusCopy =
    !hasConnectedPlatform
      ? "Connect a channel to start scheduling"
      : selected.length === 0
        ? "When to schedule automatic posts to your social media"
        : remaining === 0
          ? "Week is set"
          : `${remaining} more to go`;

  return (
    <div className="flex flex-col gap-8 pb-28 lg:pb-0">
      <div
        className="flex items-center gap-4"
        aria-live="polite"
        id={liveId}
      >
        <ProgressRing
          value={progress}
          label={`${selected.length} of ${MAX_SLOTS}`}
        />
        <div>
          <p className="text-[15px] font-semibold tabular-nums tracking-[-0.015em] text-pp-ink">
            {selected.length}
            <span className="font-medium text-pp-stone">/{MAX_SLOTS}</span>
          </p>
          <p className="mt-0.5 text-[13px] tracking-[-0.01em] text-pp-stone">{statusCopy}</p>
        </div>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
        <section
          aria-label="Weekly posting times"
          aria-describedby={liveId}
          className="overflow-hidden rounded-[18px] bg-pp-white ring-1 ring-pp-sand/70"
        >
          <div className="border-b border-pp-sand/80 px-4 pt-4 sm:hidden">
            <div
              role="tablist"
              aria-label="Day of week"
              className="flex gap-1 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {DAYS.map((day) => {
                const count = selected.filter((s) => s.day === day.id).length;
                const isActive = activeDay === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveDay(day.id)}
                    onKeyDown={(e) => onDayKeyDown(e, day.id)}
                    className={[
                      "relative flex min-w-[3.5rem] flex-col items-center gap-1.5 rounded-[9px] px-3 py-2.5 transition",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                      isActive
                        ? "bg-white text-pp-ink shadow-sm ring-1 ring-pp-sand/70"
                        : "text-pp-stone hover:bg-white/70 hover:text-pp-ink",
                    ].join(" ")}
                  >
                    <span className="text-[13px] font-medium tracking-[-0.01em]">
                      {day.short}
                    </span>
                    <span
                      className={[
                        "size-1.5 rounded-full transition-colors duration-150",
                        count > 0
                          ? "bg-pp-teal"
                          : "bg-transparent",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sticky top-0 z-10 hidden border-b border-pp-sand/80 bg-white/95 backdrop-blur sm:grid sm:grid-cols-7">
            {DAYS.map((day, index) => {
              const count = selected.filter((s) => s.day === day.id).length;
              return (
                <div
                  key={day.id}
                  className={[
                    "px-2 py-4 text-center",
                    index > 0 ? "border-l border-pp-sand/70" : "",
                  ].join(" ")}
                >
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-pp-stone uppercase">
                    {day.short}
                  </p>
                  {count > 0 ? (
                    <p className="mt-1.5 text-[11px] font-medium tabular-nums text-pp-teal">
                      {count} selected
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-transparent" aria-hidden>
                      —
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sm:hidden">
            <DayTimeColumn
              day={currentDay}
              selectedKeys={selectedKeys}
              atCapacity={atCapacity || !hasConnectedPlatform}
              onToggle={toggleSlot}
              solo
              customSection={
                <CustomTimeSection
                  day={currentDay}
                  open={customOpenDay === currentDay.id}
                  timeValue={customTimes[currentDay.id] ?? ""}
                  error={customError}
                  isDisabled={atCapacity || !hasConnectedPlatform}
                  onOpen={openCustomTime}
                  onCancel={cancelCustomTime}
                  onTimeChange={changeCustomTime}
                  onAdd={addCustomTime}
                />
              }
            />
          </div>

          <div className="pp-schedule-scroll hidden max-h-[min(36rem,62vh)] overflow-y-auto overscroll-contain sm:grid sm:grid-cols-7">
            {DAYS.map((day, index) => (
              <DayTimeColumn
                key={day.id}
                day={day}
                selectedKeys={selectedKeys}
                atCapacity={atCapacity || !hasConnectedPlatform}
                onToggle={toggleSlot}
                bordered={index > 0}
                customSection={
                  <CustomTimeSection
                    day={day}
                    open={customOpenDay === day.id}
                    timeValue={customTimes[day.id] ?? ""}
                    error={customError}
                    isDisabled={atCapacity || !hasConnectedPlatform}
                    onOpen={openCustomTime}
                    onCancel={cancelCustomTime}
                    onTimeChange={changeCustomTime}
                    onAdd={addCustomTime}
                    stickyFooter
                  />
                }
              />
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-8">
          <div className="overflow-hidden rounded-[18px] bg-white ring-1 ring-pp-sand/70">
            <div className="flex items-start justify-between gap-3 border-b border-pp-sand/80 px-4 py-4">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-pp-teal">Your posting week</p>
                <h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-pp-ink">Your week</h3>
              </div>
              {selected.length > 0 ? (
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={saving}
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-pp-coral transition hover:bg-pp-coral/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal disabled:opacity-50"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="p-4">
            {selected.length === 0 ? (
              <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-pp-sand px-4 py-6">
                <Image
                  src={MASCOT_SRC}
                  alt=""
                  width={72}
                  height={72}
                  className="h-12 w-auto"
                />
                <p className="text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  {hasConnectedPlatform
                    ? "Tap any time in the week. Four steady slots keep your feed consistent."
                    : "Connect Instagram or Facebook first, then choose up to four weekly times."}
                </p>
              </div>
            ) : (
              <ol className="overflow-hidden rounded-2xl bg-white ring-1 ring-pp-sand/90">
                {selected.map((slot, i) => (
                  <li
                    key={slotKey(slot)}
                    className={[
                      "group flex items-center gap-2 p-2.5",
                      i < selected.length - 1 ? "border-b border-pp-sand/70" : "",
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-pp-ink">
                        {dayLabel(slot.day)}
                      </p>
                      <p className="mt-0.5 text-[11px] tabular-nums text-pp-stone">
                        {formatMinutes(slot.minutes)}
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 items-center gap-1"
                      role="group"
                      aria-label={`Platforms for ${slotLabel(slot)}`}
                    >
                      {SCHEDULE_PLATFORMS.map((platform) => {
                        const connected = connectedPlatforms[platform];
                        const selectedPlatform =
                          slot.platforms.includes(platform);
                        return (
                          <button
                            key={platform}
                            type="button"
                            disabled={saving || !connected}
                            aria-pressed={selectedPlatform}
                            title={
                              connected
                                ? selectedPlatform
                                  ? `Remove ${platform}`
                                  : `Add ${platform}`
                                : `Connect ${platform} to use it here`
                            }
                            aria-label={
                              connected
                                ? `${platform}${selectedPlatform ? ", selected" : ""}`
                                : `${platform}, not connected`
                            }
                            onClick={() => togglePlatform(slot, platform)}
                            className={[
                              "inline-flex h-7 min-w-7 items-center justify-center rounded-[8px] px-1.5 text-[10px] font-semibold tracking-wide transition",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                              !connected
                                ? "cursor-not-allowed bg-pp-mist text-pp-sand"
                                : selectedPlatform
                                  ? "bg-pp-teal text-pp-white"
                                  : "bg-pp-mist text-pp-stone hover:bg-pp-cream hover:text-pp-ink",
                            ].join(" ")}
                          >
                            {PLATFORM_SHORT[platform]}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSlot(slot)}
                      disabled={saving}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] text-pp-stone opacity-60 transition hover:bg-pp-mist hover:text-pp-ink group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal disabled:opacity-40"
                      aria-label={`Remove ${slotLabel(slot)}`}
                    >
                      <CloseIcon className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {selected.length > 0 && selected.length < MAX_SLOTS ? (
              <p className="mt-4 text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
                Add {remaining} more for a full weekly rhythm.
              </p>
            ) : null}

            {selected.length === MAX_SLOTS ? (
              <div className="mt-4 flex items-start gap-3 rounded-[10px] bg-pp-mist/80 px-3 py-3">
                <Image
                  src={MASCOT_SRC}
                  alt=""
                  width={40}
                  height={40}
                  className="mt-0.5 h-9 w-auto shrink-0"
                />
                <p className="text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
                  Four times locked in. Your week has a clear posting rhythm.
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-2">
              <SaveButton
                dirty={dirty}
                saveState={saveState}
                onSave={saveSchedule}
                fullWidth
              />
              {saveError ? (
                <p
                  className="text-center text-[12px] leading-5 text-pp-coral"
                  role="alert"
                >
                  {saveError}
                </p>
              ) : dirty && !saving ? (
                <p className="text-center text-[11px] font-medium text-pp-stone">
                  Unpublished changes
                </p>
              ) : null}
            </div>
            </div>
          </div>

          <p className="px-1 text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
            Times repeat every week. Choosing both channels posts the same
            content to Instagram and Facebook together.
          </p>
        </aside>
      </div>

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-30 flex flex-col items-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10 xl:hidden",
          "bg-gradient-to-t from-pp-cream via-pp-cream/95 to-transparent",
        ].join(" ")}
      >
        {saveError ? (
          <p className="mb-2 w-full max-w-xl text-[12px] font-medium text-pp-coral" role="alert">
            {saveError}
          </p>
        ) : null}
        <div className="flex w-full max-w-xl items-center gap-4 rounded-[20px] bg-pp-white/95 px-4 py-3 shadow-[0_8px_40px_rgba(36,25,20,0.12)] ring-1 ring-pp-sand/70 backdrop-blur-md sm:px-5">
          <div className="min-w-0 flex-1">
            {selected.length === 0 ? (
              <p className="truncate text-[13px] tracking-[-0.01em] text-pp-stone">
                Select up to {MAX_SLOTS} times
              </p>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {selected.map((slot) => (
                  <button
                    key={slotKey(slot)}
                    type="button"
                    onClick={() => removeSlot(slot)}
                    disabled={saving}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-pp-sand bg-white py-1.5 pr-2 pl-2.5 text-[12px] text-pp-ink transition hover:border-pp-coral/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal disabled:opacity-60"
                    aria-label={`Remove ${slotLabel(slot)}`}
                  >
                    <span className="font-semibold tracking-[-0.01em]">{dayShort(slot.day)}</span>
                    <span className="tabular-nums text-pp-stone">
                      {formatMinutes(slot.minutes).replace(" ", "")}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wide text-pp-teal">
                      {slot.platforms
                        .map((platform) => PLATFORM_SHORT[platform])
                        .join("+")}
                    </span>
                    <CloseIcon className="size-2.5 text-pp-stone" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <SaveButton
            dirty={dirty}
            saveState={saveState}
            onSave={saveSchedule}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  const size = 44;
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, value)));

  return (
    <div
      className="relative size-11 shrink-0"
      role="img"
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--pp-sand)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--pp-teal)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset,stroke] duration-300 ease-out"
        />
      </svg>
    </div>
  );
}

function SaveButton({
  dirty,
  saveState,
  onSave,
  fullWidth = false,
}: {
  dirty: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
  fullWidth?: boolean;
}) {
  const saving = saveState === "saving";
  const saved = saveState === "saved" && !dirty;
  const disabled = !dirty || saving;

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={disabled}
      aria-busy={saving}
      className={[
        "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-semibold tracking-[-0.01em] transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
        fullWidth ? "w-full" : "",
        dirty && !saving
          ? "bg-pp-teal text-white hover:bg-pp-teal-dark active:scale-[0.98]"
          : saving
            ? "bg-pp-teal text-white opacity-90"
            : saved
              ? "bg-pp-teal/12 text-pp-teal"
              : "cursor-not-allowed bg-pp-mist text-pp-stone",
      ].join(" ")}
    >
      {saving ? (
        <LoadingIndicator label="Saving…" tone="dark" className="gap-1.5" spinnerClassName="size-3.5" />
      ) : saved ? (
        <>
          <CheckMark className="size-4" />
          Saved
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}

function TimeSlotButton({
  day,
  time,
  isSelected,
  isDisabled,
  onToggle,
  solo,
}: {
  day: (typeof DAYS)[number];
  time: TimeSlot;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (day: DayId, minutes: number) => void;
  solo: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={isDisabled}
      onClick={() => onToggle(day.id, time.minutes)}
      aria-label={`${day.label} at ${time.label}${isDisabled ? ", limit reached" : ""}`}
      title={
        isDisabled
          ? "Remove a time to choose another"
          : `${day.label} at ${time.label}`
      }
      className={[
        "relative w-full rounded-[10px] text-center tabular-nums transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
        solo
          ? "px-2 py-3 text-[13px] leading-none"
          : "px-1 py-2.5 text-[12px] leading-none sm:text-[13px]",
        isSelected
          ? "bg-pp-teal font-semibold text-white shadow-sm hover:bg-pp-teal-dark"
          : isDisabled
            ? "cursor-not-allowed bg-transparent text-pp-sand opacity-50"
            : "bg-pp-mist/70 text-pp-ink hover:bg-white hover:shadow-sm active:scale-[0.97]",
      ].join(" ")}
    >
      <span className="inline-flex items-center justify-center gap-1">
        {isSelected && !solo ? (
          <CheckMark className="hidden size-3 opacity-90 lg:inline" />
        ) : null}
        {solo
          ? time.label
          : time.label.replace(" AM", "a").replace(" PM", "p")}
      </span>
    </button>
  );
}

function CustomTimeSection({
  day,
  open,
  timeValue,
  error,
  isDisabled,
  onOpen,
  onCancel,
  onTimeChange,
  onAdd,
  stickyFooter = false,
}: {
  day: (typeof DAYS)[number];
  open: boolean;
  timeValue: string;
  error: string | null;
  isDisabled: boolean;
  onOpen: (day: DayId) => void;
  onCancel: () => void;
  onTimeChange: (day: DayId, value: string) => void;
  onAdd: (day: DayId) => void;
  stickyFooter?: boolean;
}) {
  return (
    <div
      className={[
        "mt-1.5",
        stickyFooter ? "sticky bottom-0 bg-white pt-1 pb-3" : "",
      ].join(" ")}
    >
      {open ? (
        <div className="rounded-[10px] bg-pp-mist/70 p-1.5">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            placeholder="9:45 PM"
            aria-label={`Custom time for ${day.label}, e.g. 9:45 PM`}
            value={timeValue}
            onChange={(event) => onTimeChange(day.id, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAdd(day.id);
              }
              if (event.key === "Escape") {
                onCancel();
              }
            }}
            className="h-9 w-full rounded-[8px] bg-white px-2 text-center text-[13px] tabular-nums text-pp-ink ring-1 ring-pp-sand/80 placeholder:text-pp-stone focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pp-teal"
          />
          <div className="mt-1.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onAdd(day.id)}
              className="h-8 min-w-0 flex-1 rounded-[8px] bg-pp-teal text-[11px] font-semibold tracking-[-0.01em] text-white transition hover:bg-pp-teal-dark active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onCancel}
              aria-label={`Cancel custom time for ${day.label}`}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] text-pp-stone transition hover:bg-white hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              <CloseIcon className="size-3.5" />
            </button>
          </div>
          {error ? (
            <p className="mt-1 text-[10px] leading-3.5 text-pp-coral" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => onOpen(day.id)}
          aria-label={`${day.label}, add custom time`}
          title={isDisabled ? "Remove a time to choose another" : `${day.label} at any time`}
          className={[
            "relative w-full rounded-[10px] text-center tabular-nums transition",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
            "px-1 py-2.5 text-[12px] leading-none sm:text-[13px]",
            isDisabled
              ? "cursor-not-allowed bg-transparent text-pp-sand opacity-50"
              : "bg-pp-mist/70 text-pp-ink hover:bg-white hover:shadow-sm active:scale-[0.97]",
          ].join(" ")}
        >
          + Custom time
        </button>
      )}
    </div>
  );
}

function DayTimeColumn({
  day,
  selectedKeys,
  atCapacity,
  onToggle,
  bordered = false,
  solo = false,
  customSection,
}: {
  day: (typeof DAYS)[number];
  selectedKeys: Set<string>;
  atCapacity: boolean;
  onToggle: (day: DayId, minutes: number) => void;
  bordered?: boolean;
  solo?: boolean;
  customSection?: ReactNode;
}) {
  const periods = (["morning", "afternoon", "evening"] as const).map(
    (period) => ({
      period,
      slots: TIME_SLOTS.filter((t) => t.period === period),
    }),
  );

  return (
    <div
      className={[
        solo ? "px-4 py-4" : "px-1.5 pt-3 pb-0",
        bordered ? "border-l border-pp-sand/70" : "",
      ].join(" ")}
      aria-label={`Times for ${day.label}`}
    >
      {solo ? (
        <p className="mb-4 text-sm font-semibold text-pp-ink">{day.label}</p>
      ) : null}

      {solo ? (
        <div className="flex flex-col gap-5">
          {periods.map(({ period, slots }) => (
            <div key={period}>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-pp-stone uppercase">
                {PERIOD_LABELS[period]}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((time) => {
                  const key = slotKey({ day: day.id, minutes: time.minutes });
                  const isSelected = selectedKeys.has(key);
                  return (
                    <TimeSlotButton
                      key={key}
                      day={day}
                      time={time}
                      isSelected={isSelected}
                      isDisabled={!isSelected && atCapacity}
                      onToggle={onToggle}
                      solo
                    />
                  );
                })}
              </div>
            </div>
          ))}
          {customSection}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            {TIME_SLOTS.map((time) => {
              const key = slotKey({ day: day.id, minutes: time.minutes });
              const isSelected = selectedKeys.has(key);
              return (
                <TimeSlotButton
                  key={key}
                  day={day}
                  time={time}
                  isSelected={isSelected}
                  isDisabled={!isSelected && atCapacity}
                  onToggle={onToggle}
                  solo={false}
                />
              );
            })}
          </div>
          {customSection}
        </>
      )}
    </div>
  );
}
