"use client";

import { Loader2, MapPin, Plus, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

export type SocialMediaCity = {
  id: string;
  cityName: string;
  stateCode: string;
  color: string | null;
};

type SearchResult = SocialMediaCity & { label: string };

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 250;
const DEFAULT_CITY_COLOR = "#256f68";

function cityTone(color: string | null) {
  const hex = color?.trim() || DEFAULT_CITY_COLOR;
  return { bg: `${hex}22`, fg: hex };
}

function cityLabel(city: Pick<SocialMediaCity, "cityName" | "stateCode">) {
  return `${city.cityName}, ${city.stateCode}`;
}

async function readCityResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as { data?: T; error?: string } | null;
  if (!response.ok || !body?.data) {
    throw new Error(body?.error ?? "Something went wrong. Please try again.");
  }
  return body.data;
}

const inputShellClass =
  "rounded-[12px] border border-pp-sand/90 bg-pp-white transition focus-within:border-pp-teal focus-within:ring-2 focus-within:ring-pp-teal/10";

const chipRemoveClass =
  "flex size-4 shrink-0 items-center justify-center rounded-full opacity-50 transition hover:bg-white/40 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

export function CityPicker({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value?: SocialMediaCity[];
  onChange?: (cities: SocialMediaCity[]) => void;
}) {
  const listboxId = useId();
  const inputId = useId();
  const labelId = useId();
  const errorId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localSelected, setLocalSelected] = useState<SocialMediaCity[]>([]);
  const selected = value ?? localSelected;
  const setSelected = useCallback((update: SocialMediaCity[] | ((current: SocialMediaCity[]) => SocialMediaCity[])) => {
    const next = typeof update === "function" ? update(selected) : update;
    if (onChange) onChange(next);
    else setLocalSelected(next);
  }, [onChange, selected]);
  const [loadFailed, setLoadFailed] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedIds = useMemo(() => new Set(selected.map((city) => city.id)), [selected]);

  // Show the realtor's cities on load.
  useEffect(() => {
    if (value) return;
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch("/api/social_media/cities", { signal: controller.signal, cache: "no-store" });
        setLocalSelected(await readCityResponse<SocialMediaCity[]>(response));
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setLoadFailed(true);
      }
    })();
    return () => controller.abort();
  }, [value]);

  // Debounced search against the US city table.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/social_media/cities/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        setResults(await readCityResponse<SearchResult[]>(response));
        setSearching(false);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setResults([]);
        setSearching(false);
        setError("We couldn't search cities just now. Try again in a moment.");
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const showResults = open && query.trim().length >= MIN_QUERY_LENGTH;
  const filteredResults = useMemo(
    () => results.filter((city) => !selectedIds.has(city.id)),
    [results, selectedIds],
  );

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const setPending = useCallback((cityId: string, pending: boolean) => {
    setPendingIds((current) =>
      pending ? [...current, cityId] : current.filter((id) => id !== cityId),
    );
  }, []);

  const addCity = useCallback(
    async (city: SearchResult) => {
      if (selectedIds.has(city.id)) return;

      const optimistic: SocialMediaCity = {
        id: city.id,
        cityName: city.cityName,
        stateCode: city.stateCode,
        color: city.color,
      };
      setSelected((current) => [...current, optimistic]);
      setQuery("");
      setResults([]);
      setOpen(false);
      setError(null);
      setPending(city.id, true);

      if (onChange) {
        setPending(city.id, false);
        inputRef.current?.focus();
        return;
      }

      try {
        const response = await fetch("/api/social_media/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityId: city.id }),
        });
        const saved = await readCityResponse<SocialMediaCity>(response);
        setSelected((current) => current.map((entry) => (entry.id === city.id ? saved : entry)));
      } catch (addError) {
        setSelected((current) => current.filter((entry) => entry.id !== city.id));
        setError(addError instanceof Error ? addError.message : "Unable to add that city. Try again.");
      } finally {
        setPending(city.id, false);
        inputRef.current?.focus();
      }
    },
    [onChange, selectedIds, setPending, setSelected],
  );

  const removeCity = useCallback(
    async (city: SocialMediaCity) => {
      setError(null);
      setPending(city.id, true);

      if (onChange) {
        setSelected((current) => current.filter((entry) => entry.id !== city.id));
        setPending(city.id, false);
        return;
      }

      try {
        const response = await fetch(`/api/social_media/cities/${city.id}`, { method: "DELETE" });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "Unable to remove that city. Try again.");
        }
        setSelected((current) => current.filter((entry) => entry.id !== city.id));
      } catch (removeError) {
        setError(removeError instanceof Error ? removeError.message : "Unable to remove that city. Try again.");
      } finally {
        setPending(city.id, false);
      }
    },
    [onChange, setPending, setSelected],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (!filteredResults.length) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + delta + filteredResults.length) % filteredResults.length);
      return;
    }

    if (event.key === "Enter") {
      const active = filteredResults[activeIndex] ?? filteredResults[0];
      if (open && active) {
        event.preventDefault();
        void addCity(active);
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-[13px] font-semibold tracking-[-0.01em] text-pp-ink">
          {label}
        </span>
        {hint ? <span className="text-[12px] font-normal text-pp-stone">{hint}</span> : null}
      </div>

      <div
        className={[
          "mt-2 flex min-h-[46px] flex-wrap items-center gap-1.5 px-2 py-1.5",
          inputShellClass,
          error ? "border-red-400/70 focus-within:border-red-400" : "",
        ].join(" ")}
      >
        {selected.map((city) => {
          const pending = pendingIds.includes(city.id);
          const tone = cityTone(city.color);
          return (
            <span
              key={city.id}
              className={[
                "inline-flex max-w-full items-center gap-1.5 rounded-full border py-1 pl-2.5 pr-1.5 text-[12px] font-medium transition",
                pending ? "opacity-55" : "",
              ].join(" ")}
              style={{ backgroundColor: tone.bg, borderColor: `${tone.fg}33`, color: tone.fg }}
            >
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: tone.fg }} />
              <span className="truncate">{cityLabel(city)}</span>
              {pending ? (
                <Loader2 className="mr-1 size-3 shrink-0 animate-spin" aria-hidden />
              ) : (
                <button
                  type="button"
                  onClick={() => void removeCity(city)}
                  className={chipRemoveClass}
                  aria-label={`Remove ${cityLabel(city)}`}
                >
                  <X className="size-3" />
                </button>
              )}
            </span>
          );
        })}

        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
            setError(null);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length ? "Add another city" : "Start typing a city…"}
          aria-labelledby={labelId}
          aria-controls={listboxId}
          aria-expanded={showResults}
          aria-autocomplete="list"
          aria-activedescendant={
            showResults && filteredResults[activeIndex] ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          className="min-w-[9rem] flex-1 bg-transparent px-1.5 py-1 text-[14px] text-pp-ink outline-none placeholder:text-pp-stone/65"
        />
      </div>

      {loadFailed ? (
        <p className="mt-2 text-[12px] leading-5 text-pp-stone">
          We couldn&apos;t load your cities. Refresh the page to try again.
        </p>
      ) : null}

      {showResults ? (
        <div className="absolute top-full left-0 z-40 mt-1.5 w-full min-w-[16rem] overflow-hidden rounded-[12px] border border-pp-sand/80 bg-white shadow-[0_18px_50px_rgba(36,25,20,0.14)]">
          <ul id={listboxId} role="listbox" aria-labelledby={labelId} className="max-h-60 overflow-y-auto p-1.5">
            {!searching && filteredResults.length
              ? filteredResults.map((city, index) => {
                  const active = index === activeIndex;
                  const tone = cityTone(city.color);
                  return (
                    <li
                      key={city.id}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={active}
                      onPointerEnter={() => setActiveIndex(index)}
                      onPointerDown={(event) => {
                        // Choose on pointerdown so the option is picked before blur closes the list.
                        event.preventDefault();
                        void addCity(city);
                      }}
                      className={[
                        "flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-2 transition-colors",
                        active ? "bg-pp-mist/70" : "",
                      ].join(" ")}
                    >
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-[8px]"
                        style={{ backgroundColor: `${tone.fg}1a`, color: tone.fg }}
                      >
                        {active ? <Plus className="size-3.5" /> : <MapPin className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-pp-ink">
                        {city.cityName}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-pp-mist px-1.5 py-0.5 text-[10px] font-semibold text-pp-stone">
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: tone.fg }} />
                        {city.stateCode}
                      </span>
                    </li>
                  );
                })
              : null}

            {searching ? (
              <li role="option" aria-selected={false} aria-disabled="true" className="flex items-center gap-2.5 px-2.5 py-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-pp-mist text-pp-stone">
                  <Loader2 className="size-3.5 animate-spin" />
                </span>
                <span className="text-[12px] text-pp-stone">Searching…</span>
              </li>
            ) : null}

            {!searching && !filteredResults.length ? (
              <li role="option" aria-selected={false} aria-disabled="true" className="px-2.5 py-2.5">
                <span className="text-[12px] leading-5 text-pp-stone">
                  No cities found for “{query.trim()}”. Check the spelling and try again.
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p id={errorId} role="status" className="mt-2 text-[12px] font-medium leading-5 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
