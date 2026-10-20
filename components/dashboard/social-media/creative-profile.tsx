"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  MessageCircleMore,
  Palette,
  Sparkles,
  UserRound,
} from "lucide-react";

import { CityPicker, type SocialMediaCity } from "./city-picker";

const PROFILE_STEPS = [
  {
    id: "business",
    label: "About you",
    detail: "Your business and local expertise",
    icon: UserRound,
  },
  {
    id: "voice",
    label: "Voice",
    detail: "How your content should sound",
    icon: MessageCircleMore,
  },
  {
    id: "visuals",
    label: "Visual style",
    detail: "The look and feeling of your brand",
    icon: Palette,
  },
  {
    id: "schedule",
    label: "Posting rhythm",
    detail: "Four moments across your week",
    icon: CalendarDays,
  },
] as const;

const WEEK_DAYS = [
  { id: "mon", short: "Mon", label: "Monday" },
  { id: "tue", short: "Tue", label: "Tuesday" },
  { id: "wed", short: "Wed", label: "Wednesday" },
  { id: "thu", short: "Thu", label: "Thursday" },
  { id: "fri", short: "Fri", label: "Friday" },
  { id: "sat", short: "Sat", label: "Saturday" },
  { id: "sun", short: "Sun", label: "Sunday" },
] as const;

type DayId = (typeof WEEK_DAYS)[number]["id"];

const TONE_OPTIONS = [
  ["Warm & personal", "Neighborly, genuine, and easy to talk to"],
  ["Polished & expert", "Confident guidance with an elevated point of view"],
  ["Energetic & bold", "Upbeat, direct, and full of momentum"],
  ["Calm & concise", "Clear, considered, and never overdone"],
] as const;

const STYLE_OPTIONS = [
  ["Warm editorial", "Soft neutrals, natural light, refined type"],
  ["Modern minimal", "Crisp spacing, strong type, restrained color"],
  ["Bright local", "Optimistic color and community-led imagery"],
  ["Quiet luxury", "Rich neutrals, elegant details, premium tone"],
] as const;

const TIME_OPTIONS = [
  "8:00 AM",
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "3:00 PM",
  "5:30 PM",
  "7:00 PM",
];

const fieldClass =
  "mt-2 w-full rounded-[12px] border border-pp-sand/90 bg-pp-white px-3.5 py-3 text-[14px] text-pp-ink outline-none transition placeholder:text-pp-stone/65 focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold tracking-[-0.01em] text-pp-ink">
        {label}
      </span>
      {hint ? (
        <span className="ml-2 text-[12px] font-normal text-pp-stone">
          {hint}
        </span>
      ) : null}
      {children}
    </label>
  );
}

function ChoiceGrid({
  options,
  value,
  onChange,
}: {
  options: readonly (readonly [string, string])[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      {options.map(([title, detail]) => {
        const selected = title === value;
        return (
          <button
            key={title}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(title)}
            className={[
              "flex min-h-20 items-start gap-3 rounded-[14px] border p-3.5 text-left transition",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
              selected
                ? "border-pp-teal bg-pp-teal/[0.06] shadow-[0_0_0_1px_rgba(37,111,104,0.08)]"
                : "border-pp-sand/80 bg-pp-white hover:border-pp-teal/35 hover:bg-pp-mist/45",
            ].join(" ")}
          >
            <span
              className={[
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition",
                selected
                  ? "border-pp-teal bg-pp-teal text-white"
                  : "border-pp-sand bg-white text-transparent",
              ].join(" ")}
            >
              <Check className="size-3" strokeWidth={2.5} />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-pp-ink">
                {title}
              </span>
              <span className="mt-1 block text-[12px] leading-[1.45] text-pp-stone">
                {detail}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

type ProfileIdentity = {
  display_name: string;
  professional_title: string;
  brokerage_name: string;
  target_audience: string;
  specialties: string;
  personal_context: string;
  primary_brand_color: string;
  secondary_brand_color: string;
};

function BusinessStep({ identity, setIdentity, cities, setCities }: {
  identity: ProfileIdentity;
  setIdentity: (update: (current: ProfileIdentity) => ProfileIdentity) => void;
  cities: SocialMediaCity[];
  setCities: (cities: SocialMediaCity[]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <input className={fieldClass} value={identity.display_name} onChange={(event) => setIdentity((current) => ({ ...current, display_name: event.target.value }))} />
        </Field>
        <Field label="Professional title">
          <input
            className={fieldClass}
            value={identity.professional_title}
            onChange={(event) => setIdentity((current) => ({ ...current, professional_title: event.target.value }))}
            placeholder="Realtor, broker, team lead…"
          />
        </Field>
      </div>
      <Field label="Brokerage or team" hint="Optional">
        <div className="relative">
          <BriefcaseBusiness className="pointer-events-none absolute top-[21px] left-3.5 size-4 text-pp-stone" />
          <input
            className={`${fieldClass} pl-10`}
            value={identity.brokerage_name}
            onChange={(event) => setIdentity((current) => ({ ...current, brokerage_name: event.target.value }))}
            placeholder="Your brokerage or team name"
          />
        </div>
      </Field>
      <CityPicker
        label="Markets you serve"
        hint="Search every US city"
        value={cities}
        onChange={setCities}
      />
      <Field label="Who do you most want to reach?">
        <textarea
          className={`${fieldClass} min-h-24 resize-y leading-6`}
          value={identity.target_audience}
          onChange={(event) => setIdentity((current) => ({ ...current, target_audience: event.target.value }))}
          placeholder="Tell us about the clients you love working with."
        />
      </Field>
      <Field label="Your specialties" hint="Separate with commas">
        <input
          className={fieldClass}
          value={identity.specialties}
          onChange={(event) => setIdentity((current) => ({ ...current, specialties: event.target.value }))}
        />
      </Field>
    </div>
  );
}

function VoiceStep({ tone, setTone, personalContext, setPersonalContext }: {
  tone: string;
  setTone: (v: string) => void;
  personalContext: string;
  setPersonalContext: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="What should you sound like?">
        <ChoiceGrid options={TONE_OPTIONS} value={tone} onChange={setTone} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Emoji preference">
          <select className={fieldClass} defaultValue="Light touch">
            <option>No emojis</option>
            <option>Light touch</option>
            <option>Use them freely</option>
          </select>
        </Field>
        <Field label="Point of view">
          <select className={fieldClass} defaultValue="First person — I / me">
            <option>First person — I / me</option>
            <option>Team voice — we / us</option>
            <option>Third person</option>
          </select>
        </Field>
      </div>
      <Field label="Words or phrases that feel like you" hint="Optional">
        <textarea
          className={`${fieldClass} min-h-20 resize-y leading-6`}
          placeholder="A favorite sign-off, phrases you use with clients, local expressions…"
        />
      </Field>
      <Field label="Anything we should never say?" hint="Optional">
        <textarea
          className={`${fieldClass} min-h-20 resize-y leading-6`}
          defaultValue="Avoid hype, clichés like “dream home,” and anything that sounds pushy or salesy."
        />
      </Field>
      <Field label="A little more about you" hint="Interests make the content more human">
        <textarea
          className={`${fieldClass} min-h-24 resize-y leading-6`}
          value={personalContext}
          onChange={(event) => setPersonalContext(event.target.value)}
          placeholder="Favorite local spots, hobbies, causes, family, pets, community ties…"
        />
      </Field>
    </div>
  );
}

function VisualStep({ style, setStyle, primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor }: {
  style: string;
  setStyle: (v: string) => void;
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (value: string) => void;
  setSecondaryColor: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Choose the closest visual direction">
        <ChoiceGrid options={STYLE_OPTIONS} value={style} onChange={setStyle} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Primary brand color">
          <div className="mt-2 flex h-[46px] items-center gap-3 rounded-[12px] border border-pp-sand/90 bg-white px-3.5">
            <input
              type="color"
              value={primaryColor || "#1F5B55"}
              onChange={(event) => setPrimaryColor(event.target.value.toUpperCase())}
              aria-label="Primary brand color"
              className="size-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
            />
            <span className="text-[13px] font-medium text-pp-ink">{primaryColor || "Not set"}</span>
          </div>
        </Field>
        <Field label="Secondary brand color" hint="Optional">
          <div className="mt-2 flex h-[46px] items-center gap-3 rounded-[12px] border border-pp-sand/90 bg-white px-3.5">
            <input
              type="color"
              value={secondaryColor || "#D9B896"}
              onChange={(event) => setSecondaryColor(event.target.value.toUpperCase())}
              aria-label="Secondary brand color"
              className="size-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
            />
            <span className="text-[13px] font-medium text-pp-ink">{secondaryColor || "Not set"}</span>
          </div>
        </Field>
      </div>
      <Field label="Photography direction">
        <select className={fieldClass} defaultValue="Natural, candid, and locally grounded">
          <option>Natural, candid, and locally grounded</option>
          <option>Bright, clean, and architectural</option>
          <option>Moody, editorial, and elevated</option>
          <option>Friendly, colorful, and people-focused</option>
        </select>
      </Field>
      <Field label="Visual notes" hint="Optional">
        <textarea
          className={`${fieldClass} min-h-24 resize-y leading-6`}
          placeholder="Tell us what you love—or what you never want to see—in your feed."
        />
      </Field>
      <div className="rounded-[14px] border border-dashed border-pp-sand bg-pp-mist/35 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-pp-ink">Brand files</p>
            <p className="mt-1 text-[12px] leading-5 text-pp-stone">
              Add a logo, headshot, or brand guide for future post designs.
            </p>
          </div>
          <label className="cursor-pointer rounded-[10px] border border-pp-sand bg-white px-3.5 py-2 text-[12px] font-semibold text-pp-ink transition hover:border-pp-teal/40 hover:bg-pp-mist focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-pp-teal">
            Choose files
            <input type="file" multiple className="sr-only" accept="image/*,.pdf" />
          </label>
        </div>
      </div>
    </div>
  );
}

function ScheduleStep({
  selectedDays,
  setSelectedDays,
}: {
  selectedDays: DayId[];
  setSelectedDays: (days: DayId[]) => void;
}) {
  function toggleDay(day: DayId) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((entry) => entry !== day));
    } else if (selectedDays.length < 4) {
      setSelectedDays([...selectedDays, day]);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold text-pp-ink">Choose four posting days</h3>
          <p className="mt-1 text-[12px] leading-5 text-pp-stone">
            Pick a steady rhythm. You can fine-tune exact times in Schedule later.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-pp-teal/10 px-3 py-1 text-[11px] font-semibold tabular-nums text-pp-teal">
          {selectedDays.length} of 4
        </span>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7" role="group" aria-label="Posting days">
        {WEEK_DAYS.map((day) => {
          const selected = selectedDays.includes(day.id);
          const disabled = selectedDays.length >= 4 && !selected;
          return (
            <button
              key={day.id}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggleDay(day.id)}
              className={[
                "flex min-h-20 flex-col items-center justify-center gap-2 rounded-[12px] border text-[12px] font-semibold transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                selected
                  ? "border-pp-teal bg-pp-teal text-white shadow-sm"
                  : disabled
                    ? "cursor-not-allowed border-pp-sand/60 bg-pp-mist/40 text-pp-stone/45"
                    : "border-pp-sand/80 bg-white text-pp-stone hover:border-pp-teal/35 hover:text-pp-ink",
              ].join(" ")}
            >
              <span>{day.short}</span>
              <span
                className={[
                  "flex size-5 items-center justify-center rounded-full",
                  selected ? "bg-white/18" : "bg-pp-mist",
                ].join(" ")}
              >
                {selected ? <Check className="size-3" strokeWidth={2.5} /> : <span className="size-1 rounded-full bg-pp-sand" />}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDays.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-[14px] border border-pp-sand/80 bg-white">
          {WEEK_DAYS.filter((day) => selectedDays.includes(day.id)).map((day, index, days) => (
            <div
              key={day.id}
              className={[
                "flex items-center gap-3 px-4 py-3",
                index < days.length - 1 ? "border-b border-pp-sand/70" : "",
              ].join(" ")}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-pp-teal/10 text-pp-teal">
                <CalendarDays className="size-4" />
              </div>
              <span className="min-w-0 flex-1 text-[13px] font-semibold text-pp-ink">
                {day.label}
              </span>
              <Clock3 className="size-3.5 text-pp-stone" />
              <select
                defaultValue={day.id === "sat" ? "10:30 AM" : "9:00 AM"}
                aria-label={`Posting time for ${day.label}`}
                className="rounded-[9px] border border-pp-sand bg-pp-mist/50 px-2.5 py-2 text-[12px] font-medium text-pp-ink outline-none focus:border-pp-teal"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 rounded-[14px] bg-pp-mist/70 p-4">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-pp-teal" />
          <p className="text-[12px] leading-5 text-pp-stone">
            Your four weekly posts will be varied across market insight, useful guidance,
            local life, and your personal point of view—always shaped by this profile and
            the notes you leave over time.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CreativeProfile({
  mode,
  onFinish,
  embedded = false,
}: {
  mode: "onboarding" | "edit";
  onFinish?: () => void;
  embedded?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [tone, setTone] = useState("Warm & personal");
  const [style, setStyle] = useState("Warm editorial");
  const [selectedDays, setSelectedDays] = useState<DayId[]>([
    "mon",
    "tue",
    "thu",
    "sat",
  ]);
  const [identity, setIdentity] = useState<ProfileIdentity>({
    display_name: "",
    professional_title: "",
    brokerage_name: "",
    target_audience: "",
    specialties: "",
    personal_context: "",
    primary_brand_color: "",
    secondary_brand_color: "",
  });
  const [cities, setCities] = useState<SocialMediaCity[]>([]);
  const [timeZone, setTimeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const currentStep = PROFILE_STEPS[step];
  const CurrentIcon = currentStep.icon;

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/social_media/profile", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const body = await response.json() as { data: { identity: Record<keyof Omit<ProfileIdentity, "specialties">, string | null> & { specialties: string[] }; cities: SocialMediaCity[]; timeZone: string; revision: number } };
        setIdentity({
          display_name: body.data.identity.display_name ?? "",
          professional_title: body.data.identity.professional_title ?? "",
          brokerage_name: body.data.identity.brokerage_name ?? "",
          target_audience: body.data.identity.target_audience ?? "",
          specialties: body.data.identity.specialties.join(", "),
          personal_context: body.data.identity.personal_context ?? "",
          primary_brand_color: body.data.identity.primary_brand_color ?? "",
          secondary_brand_color: body.data.identity.secondary_brand_color ?? "",
        });
        setCities(body.data.cities);
        const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(body.data.revision === 0 && body.data.timeZone === "UTC" && browserTimeZone
          ? browserTimeZone
          : body.data.timeZone);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSaveError("We couldn't load your saved creative facts.");
      }
    })();
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < PROFILE_STEPS.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const nullable = (value: string) => value.trim() || null;
      const response = await fetch("/api/social_media/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: {
            display_name: nullable(identity.display_name),
            professional_title: nullable(identity.professional_title),
            brokerage_name: nullable(identity.brokerage_name),
            target_audience: nullable(identity.target_audience),
            specialties: identity.specialties.split(",").map((value) => value.trim()).filter(Boolean),
            personal_context: nullable(identity.personal_context),
            primary_brand_color: nullable(identity.primary_brand_color),
            secondary_brand_color: nullable(identity.secondary_brand_color),
          },
          cityIds: cities.map((city) => city.id),
          timeZone,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to save your profile.");
      }
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save your profile.");
      return;
    } finally {
      setSaving(false);
    }
    window.setTimeout(() => {
      setSaved(false);
      onFinish?.();
    }, 650);
  }

  return (
    <div className={mode === "onboarding" ? "mx-auto w-full max-w-5xl" : "w-full"}>
      {!embedded ? (
        <div className="mb-7">
          <h2 className="text-[25px] font-semibold tracking-[-0.03em] text-pp-ink sm:text-[31px]">
            {mode === "onboarding"
              ? "Help us make your content feel like you"
              : "Keep your creative direction current"}
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-pp-stone">
            {mode === "onboarding"
              ? "Think of this as the kickoff with your design team. Give us the durable context; quick changes can become notes later."
              : "These are the lasting details behind every post. For a one-off thought or small adjustment, leave a note instead."}
          </p>
        </div>
      ) : null}

      <div
        className={[
          "grid overflow-hidden rounded-[22px] border border-pp-sand/80 bg-white shadow-[0_18px_50px_rgba(36,25,20,0.07)]",
          mode === "onboarding" ? "lg:grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-1",
        ].join(" ")}
      >
        <aside
          className={[
            "border-b border-pp-sand/70 bg-pp-mist/45 p-3",
            mode === "onboarding" ? "lg:border-r lg:border-b-0 lg:p-4" : "sm:p-4",
          ].join(" ")}
        >
          <div
            className={[
              "grid grid-cols-4 gap-1",
              mode === "onboarding" ? "lg:flex lg:flex-col lg:gap-1.5" : "sm:gap-2",
            ].join(" ")}
          >
            {PROFILE_STEPS.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const complete = index < step;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(index)}
                  className={[
                    "group flex min-w-0 items-center gap-3 rounded-[12px] p-2.5 text-left transition",
                    mode === "onboarding" ? "lg:p-3" : "sm:p-3",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                    active ? "bg-white shadow-sm ring-1 ring-pp-sand/70" : "hover:bg-white/65",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-8 shrink-0 items-center justify-center rounded-[9px] transition",
                      active || complete ? "bg-pp-teal text-white" : "bg-white text-pp-stone ring-1 ring-pp-sand/70",
                    ].join(" ")}
                  >
                    {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span
                    className={[
                      "hidden min-w-0",
                      mode === "onboarding" ? "lg:block" : "xl:block",
                    ].join(" ")}
                  >
                    <span className="block text-[12px] font-semibold text-pp-ink">{item.label}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-pp-stone">{item.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div
            className={[
              "mt-5 rounded-[12px] bg-white/65 p-3",
              mode === "onboarding" ? "hidden lg:block" : "hidden",
            ].join(" ")}
          >
            <p className="text-[11px] font-semibold text-pp-ink">Private by default</p>
            <p className="mt-1 text-[10px] leading-4 text-pp-stone">
              Your profile guides your content. It is never shown on a public post.
            </p>
          </div>
        </aside>

        <form onSubmit={submit} className="min-w-0">
          <div className="border-b border-pp-sand/70 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-[10px] bg-pp-teal/10 text-pp-teal">
                <CurrentIcon className="size-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-pp-stone">Step {step + 1} of {PROFILE_STEPS.length}</p>
                <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-pp-ink">{currentStep.label}</h3>
              </div>
            </div>
          </div>

          <div className="min-h-[430px] px-5 py-6 sm:px-7 sm:py-7">
            {step === 0 ? <BusinessStep identity={identity} setIdentity={setIdentity} cities={cities} setCities={setCities} /> : null}
            {step === 1 ? <VoiceStep tone={tone} setTone={setTone} personalContext={identity.personal_context} setPersonalContext={(value) => setIdentity((current) => ({ ...current, personal_context: value }))} /> : null}
            {step === 2 ? <VisualStep style={style} setStyle={setStyle} primaryColor={identity.primary_brand_color} secondaryColor={identity.secondary_brand_color} setPrimaryColor={(value) => setIdentity((current) => ({ ...current, primary_brand_color: value }))} setSecondaryColor={(value) => setIdentity((current) => ({ ...current, secondary_brand_color: value }))} /> : null}
            {step === 3 ? <ScheduleStep selectedDays={selectedDays} setSelectedDays={setSelectedDays} /> : null}
          </div>

          {saveError ? <p role="alert" className="px-5 pt-3 text-[12px] font-medium text-red-600 sm:px-7">{saveError}</p> : null}
          <div className="flex items-center justify-between gap-3 border-t border-pp-sand/70 bg-pp-mist/25 px-5 py-4 sm:px-7">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] px-3 text-[12px] font-semibold text-pp-stone transition hover:bg-white hover:text-pp-ink disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </button>
            <button
              type="submit"
              disabled={saved || saving || (step === PROFILE_STEPS.length - 1 && selectedDays.length !== 4)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-pp-teal px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-pp-teal-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              {saved ? (
                <>
                  <Check className="size-4" /> Saved
                </>
              ) : saving ? "Saving…" : step === PROFILE_STEPS.length - 1 ? (
                mode === "onboarding" ? "Finish setup" : "Save profile"
              ) : (
                <>
                  Continue <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
