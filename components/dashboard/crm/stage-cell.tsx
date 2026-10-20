"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import type { CrmStage } from "@/lib/crm/types";

const optionRowClass =
  "mx-1 flex w-[calc(100%-0.5rem)] items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left transition-colors duration-100 hover:bg-[#eceef2] focus-visible:bg-[#eceef2] focus-visible:outline-none";

function StagePill({ stage }: { stage: Pick<CrmStage, "name" | "color"> }) {
  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 truncate rounded-[4px] px-1.5 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: `${stage.color}22`, color: stage.color }}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: stage.color }} />
      {stage.name}
    </span>
  );
}

export function StageCell({
  contactId,
  stage,
  onChanged,
}: {
  contactId: string;
  stage: CrmStage | null;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 260;
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
      const top = Math.min(rect.bottom + 4, window.innerHeight - 24);
      setCoords({ top, left });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        const portal = document.getElementById(`stage-popover-${contactId}`);
        if (portal?.contains(event.target as Node)) return;
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [contactId, open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex min-h-8 w-full min-w-0 items-center overflow-hidden rounded-[4px] px-0.5 text-left hover:bg-[var(--crm-hover)]"
      >
        {stage ? <StagePill stage={stage} /> : <span className="text-[13px] text-[var(--crm-muted)]">—</span>}
      </button>
      {open && coords
        ? createPortal(
            <StagePopover
              contactId={contactId}
              stage={stage}
              coords={coords}
              onChanged={onChanged}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

function StagePopover({
  contactId,
  stage,
  coords,
  onChanged,
  onClose,
}: {
  contactId: string;
  stage: CrmStage | null;
  coords: { top: number; left: number };
  onChanged: () => void;
  onClose: () => void;
}) {
  const stages = useCrmData<CrmStage[]>("/api/crm/stages");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [adding]);

  const filtered = useMemo(() => {
    const rows = stages.data ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((item) => item.name.toLowerCase().includes(needle));
  }, [query, stages.data]);

  const exactMatch = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (stages.data ?? []).some((item) => item.name.toLowerCase() === needle);
  }, [query, stages.data]);

  async function assignStage(stageId: string | null) {
    setBusy(true);
    setError(null);
    try {
      await crmFetch(`/api/crm/contacts/${contactId}`, {
        method: "PATCH",
        ...jsonBody({ stageId }),
      });
      onChanged();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update stage.");
    } finally {
      setBusy(false);
    }
  }

  async function createAndAssign(nameOverride?: string) {
    const name = (nameOverride ?? query).trim();
    if (!name) {
      setAdding(true);
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await crmFetch<CrmStage>("/api/crm/stages", {
        method: "POST",
        ...jsonBody({ name, color: "#256f68", isClosed: false, isWon: false }),
      });
      await crmFetch(`/api/crm/contacts/${contactId}`, {
        method: "PATCH",
        ...jsonBody({ stageId: created.id }),
      });
      void stages.reload();
      onChanged();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create stage.");
    } finally {
      setBusy(false);
    }
  }

  function startAddToOptions() {
    const name = query.trim();
    if (name && !exactMatch) {
      void createAndAssign(name);
      return;
    }
    setAdding(true);
    setQuery("");
    setError(null);
  }

  return (
    <div
      id={`stage-popover-${contactId}`}
      role="dialog"
      aria-label="Edit stage"
      style={{ top: coords.top, left: coords.left }}
      className="fixed z-[80] w-[260px] overflow-hidden rounded-[8px] border border-[var(--crm-border)] bg-white/95 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-md"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="border-b border-[var(--crm-border)] px-2 py-1.5">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && adding) {
              event.preventDefault();
              void createAndAssign();
            }
          }}
          placeholder={adding ? "New stage name…" : "Search stages…"}
          className="h-8 w-full rounded-[4px] border-0 bg-transparent px-1.5 text-[13px] outline-none placeholder:text-[var(--crm-muted)]"
        />
      </div>

      <div className="max-h-64 overflow-y-auto py-1">
        {adding ? (
          <>
            <button
              type="button"
              disabled={busy || !query.trim()}
              onClick={() => void createAndAssign()}
              className={`${optionRowClass} text-[13px] text-[var(--crm-accent)]`}
            >
              {query.trim() ? <>+ Add &lsquo;{query.trim()}&rsquo; to options…</> : "+ Add to options…"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setAdding(false);
                setQuery("");
                setError(null);
              }}
              className={`${optionRowClass} text-[13px] text-[var(--crm-muted)]`}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {stage ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void assignStage(null)}
                className={`${optionRowClass} text-[13px] text-[var(--crm-muted)]`}
              >
                Clear stage
              </button>
            ) : null}
            {stages.loading ? (
              <div className="flex items-center justify-center gap-2 px-2.5 py-6 text-[13px] text-[var(--crm-muted)]">
                <span
                  aria-hidden
                  className="size-4 shrink-0 animate-spin rounded-full border-2 border-pp-ink/15 border-t-pp-teal"
                />
                Loading stages…
              </div>
            ) : (
              <>
                {filtered.map((item) => {
                  const selected = stage?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={busy || selected}
                      onClick={() => void assignStage(item.id)}
                      className={`${optionRowClass} justify-between ${selected ? "bg-[#eceef2]" : ""}`}
                    >
                      <StagePill stage={item} />
                      <span className="shrink-0 text-[11px] text-[var(--crm-muted)]">
                        {item.profileId ? "Custom" : "Default"}
                      </span>
                    </button>
                  );
                })}
                {!filtered.length && exactMatch ? (
                  <p className="px-2.5 py-2 text-[13px] text-[var(--crm-muted)]">No matching stages.</p>
                ) : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startAddToOptions()}
                  className={`${optionRowClass} text-[13px] text-[var(--crm-accent)]`}
                >
                  {query.trim() && !exactMatch ? (
                    <>+ Add &lsquo;{query.trim()}&rsquo; to options…</>
                  ) : (
                    "+ Add to options…"
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {error ? <p className="border-t border-[var(--crm-border)] px-2.5 py-2 text-[12px] text-[#b71c1c]">{error}</p> : null}
    </div>
  );
}

export function StagePanel({
  contactId,
  stage,
  onChanged,
}: {
  contactId: string;
  stage: CrmStage | null;
  onChanged: () => void;
}) {
  return (
    <div className="mt-4 border-t border-[var(--crm-border)] pt-3">
      <p className="mb-2 text-[12px] text-[var(--crm-muted)]">Stage</p>
      <StageCell contactId={contactId} stage={stage} onChanged={onChanged} />
      {!stage ? (
        <p className="mt-1 text-[12px] text-[var(--crm-muted)]">Track where this person is in your process.</p>
      ) : null}
    </div>
  );
}
