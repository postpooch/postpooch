"use client";

import { useMemo, useState } from "react";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import {
  CrmPage,
  EntityAvatar,
  ErrorState,
  Field,
  FormActions,
  LoadingState,
  Modal,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  SubmitEvent,
  inputClass,
  money,
  nullableNumber,
  nullableText,
  shortDate,
} from "@/components/dashboard/crm/ui";
import type {
  CrmDeal,
  CrmDealBoard,
  CrmDealClientType,
  CrmListResponse,
  CrmContact,
  CrmPartner,
} from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function dealVolume(count: number, total: number) {
  const deals = `${count} deal${count === 1 ? "" : "s"}`;
  return `${deals} · ${money(total)}`;
}

export function DealsView() {
  const [clientType, setClientType] = useState<CrmDealClientType>("buyer");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createStageId, setCreateStageId] = useState<string | null>(null);
  const [addingStage, setAddingStage] = useState(false);
  const [stageName, setStageName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const boardPath = `/api/crm/deals?clientType=${clientType}`;
  const board = useCrmData<CrmDealBoard>(boardPath);
  const selected = board.data?.stages.flatMap((stage) => stage.deals).find((deal) => deal.id === selectedId) ?? null;

  async function reload() {
    await board.reload();
  }

  async function moveDeal(dealId: string, stageId: string) {
    setError(null);
    try {
      await crmFetch(`/api/crm/deals/${dealId}`, { method: "PATCH", ...jsonBody({ stageId }) });
      await reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to move that deal.");
    }
  }

  async function createStage(event: SubmitEvent) {
    event.preventDefault();
    const name = stageName.trim();
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      await crmFetch("/api/crm/deal-stages", {
        method: "POST",
        ...jsonBody({ name, clientType, color: "#868e96" }),
      });
      setStageName("");
      setAddingStage(false);
      await reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add that stage.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CrmPage contain>
      <PageHeader
        title="Deals"
        description="Track buyer and seller transactions across your pipeline."
        action={
          <PrimaryButton
            onClick={() => setCreateStageId(board.data?.stages[0]?.id ?? null)}
            disabled={!board.data?.stages.length}
          >
            + New Deal
          </PrimaryButton>
        }
      />

      <div className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-[var(--crm-border)] bg-white px-4">
        <div className="flex items-center gap-1" role="tablist" aria-label="Deal pipeline">
          {(["buyer", "seller"] as const).map((type) => {
            const active = clientType === type;
            return (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setClientType(type);
                  setSelectedId(null);
                  setCreateStageId(null);
                  setError(null);
                }}
                className={`relative px-3 py-2 text-[13px] transition ${
                  active
                    ? "font-medium text-[var(--crm-text)]"
                    : "font-normal text-[var(--crm-secondary)] hover:text-[var(--crm-text)]"
                }`}
              >
                {type === "buyer" ? "Buyers" : "Sellers"}
                {active ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--crm-accent)]" /> : null}
              </button>
            );
          })}
        </div>
        {error ? <p className="truncate text-[12px] font-medium text-[var(--crm-danger)]">{error}</p> : null}
      </div>

      {board.loading ? (
        <LoadingState />
      ) : board.error || !board.data ? (
        <ErrorState message={board.error ?? "Unable to load deals."} retry={board.reload} />
      ) : (
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--crm-sidebar)] p-3">
          <div className="flex min-h-full min-w-max gap-3">
            {board.data.stages.map((stage) => (
              <section
                key={stage.id}
                className="flex w-[180px] shrink-0 flex-col overflow-hidden rounded-xl border border-[var(--crm-border)] bg-white"
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const dealId = event.dataTransfer.getData("text/deal-id") || draggingId;
                  setDraggingId(null);
                  if (dealId) void moveDeal(dealId, stage.id);
                }}
              >
                <div className="h-1 shrink-0" style={{ backgroundColor: stage.color }} />
                <div className="flex items-start justify-between gap-2 border-b border-[var(--crm-border)] px-2.5 py-2">
                  <div className="min-w-0">
                    <h2 className="truncate text-[13px] font-medium text-[var(--crm-text)]">{stage.name}</h2>
                    <p className="mt-0.5 truncate text-[11px] text-[var(--crm-muted)]">
                      {dealVolume(stage.dealCount, stage.totalPrice)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Add deal to ${stage.name}`}
                    onClick={() => setCreateStageId(stage.id)}
                    className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--crm-accent)] text-[14px] leading-none text-white transition hover:bg-[var(--crm-accent-hover)]"
                  >
                    +
                  </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
                  {stage.deals.length ? (
                    stage.deals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        dragging={draggingId === deal.id}
                        onOpen={() => setSelectedId(deal.id)}
                        onDragStart={() => setDraggingId(deal.id)}
                        onDragEnd={() => setDraggingId(null)}
                      />
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCreateStageId(stage.id)}
                      className="rounded-lg border border-dashed border-[var(--crm-border)] px-2 py-6 text-center text-[12px] text-[var(--crm-muted)] transition hover:border-[var(--crm-accent)] hover:text-[var(--crm-accent)]"
                    >
                      No deals, <span className="underline">add deal</span>
                    </button>
                  )}
                </div>
              </section>
            ))}

            <section className="flex w-[180px] shrink-0 flex-col overflow-hidden rounded-xl border border-dashed border-[var(--crm-border)] bg-white/70">
              {addingStage ? (
                <form onSubmit={createStage} className="flex flex-col gap-2 p-3">
                  <Field label="Stage name">
                    <input
                      autoFocus
                      className={inputClass}
                      value={stageName}
                      onChange={(event) => setStageName(event.target.value)}
                      placeholder="e.g. Inspection"
                    />
                  </Field>
                  <div className="flex flex-wrap gap-1.5">
                    <PrimaryButton disabled={busy || !stageName.trim()} type="submit">
                      Add
                    </PrimaryButton>
                    <SecondaryButton type="button" onClick={() => { setAddingStage(false); setStageName(""); }}>
                      Cancel
                    </SecondaryButton>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingStage(true)}
                  className="flex min-h-28 flex-1 items-center justify-center px-3 text-[13px] font-medium text-[var(--crm-secondary)] transition hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]"
                >
                  + Add a stage
                </button>
              )}
            </section>
          </div>
        </div>
      )}

      {createStageId ? (
        <DealFormModal
          clientType={clientType}
          stageId={createStageId}
          stages={board.data?.stages ?? []}
          onClose={() => setCreateStageId(null)}
          onSaved={async (deal) => {
            setCreateStageId(null);
            await reload();
            setSelectedId(deal.id);
          }}
        />
      ) : null}

      {selected ? (
        <DealDetailModal
          deal={selected}
          stages={board.data?.stages ?? []}
          onClose={() => setSelectedId(null)}
          onChanged={async () => {
            await reload();
          }}
          onDeleted={async () => {
            setSelectedId(null);
            await reload();
          }}
        />
      ) : null}
    </CrmPage>
  );
}

function DealCard({
  deal,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  deal: CrmDeal;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const people = [...deal.contacts.map((c) => c.name), ...deal.partners.map((p) => p.name)].filter(Boolean);
  return (
    <button
      type="button"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/deal-id", deal.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={`w-full min-w-0 overflow-hidden rounded-lg border border-[var(--crm-border)] bg-white p-2.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-[var(--crm-accent)]/40 hover:shadow-sm ${
        dragging ? "opacity-50" : ""
      }`}
    >
      <p className="truncate text-[13px] font-medium text-[var(--crm-text)]">{deal.name}</p>
      <div className="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[13px] font-semibold tabular-nums text-[var(--crm-success)]">{money(deal.price)}</span>
        {deal.commission != null ? (
          <span className="truncate text-[11px] tabular-nums text-[var(--crm-secondary)]">{money(deal.commission)}</span>
        ) : null}
      </div>
      {deal.closeDate ? (
        <p className="mt-1.5 truncate text-[11px] text-[var(--crm-muted)]">
          Close {shortDate(deal.closeDate)}
        </p>
      ) : null}
      {people.length ? (
        <div className="mt-2 flex items-center -space-x-1">
          {people.slice(0, 4).map((name) => (
            <span key={`${deal.id}-${name}`} className="rounded-full ring-2 ring-white">
              <EntityAvatar name={name} size={18} />
            </span>
          ))}
          {people.length > 4 ? (
            <span className="pl-2 text-[10px] font-medium text-[var(--crm-muted)]">+{people.length - 4}</span>
          ) : null}
        </div>
      ) : null}
    </button>
  );
}

function DealFormModal({
  clientType,
  stageId,
  stages,
  deal,
  onClose,
  onSaved,
}: {
  clientType: CrmDealClientType;
  stageId: string;
  stages: CrmDealBoard["stages"];
  deal?: CrmDeal;
  onClose: () => void;
  onSaved: (deal: CrmDeal) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contacts = useCrmData<CrmListResponse<CrmContact>>("/api/crm/contacts?pageSize=100");
  const partners = useCrmData<CrmListResponse<CrmPartner>>("/api/crm/partners?pageSize=100");
  const [contactIds, setContactIds] = useState<string[]>(deal?.contacts.map((c) => c.id) ?? []);
  const [partnerIds, setPartnerIds] = useState<string[]>(deal?.partners.map((p) => p.id) ?? []);

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const body = {
        name: String(form.get("name") ?? "").trim(),
        price: nullableNumber(form.get("price")),
        commission: nullableNumber(form.get("commission")),
        closeDate: nullableText(form.get("closeDate")),
        earnestMoneyDue: nullableText(form.get("earnestMoneyDue")),
        mutualAcceptance: nullableText(form.get("mutualAcceptance")),
        dueDiligence: nullableText(form.get("dueDiligence")),
        finalWalkThrough: nullableText(form.get("finalWalkThrough")),
        possession: nullableText(form.get("possession")),
        propertyAddress: nullableText(form.get("propertyAddress")),
        description: nullableText(form.get("description")),
        clientType,
        stageId: String(form.get("stageId") ?? stageId),
        contactIds,
        partnerIds,
      };
      const saved = deal
        ? await crmFetch<CrmDeal>(`/api/crm/deals/${deal.id}`, { method: "PATCH", ...jsonBody(body) })
        : await crmFetch<CrmDeal>("/api/crm/deals", { method: "POST", ...jsonBody(body) });
      await onSaved(saved);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save that deal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open title={deal ? "Edit deal" : "New deal"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Deal name" className="sm:col-span-2">
            <input name="name" required defaultValue={deal?.name ?? ""} className={inputClass} placeholder="My First Deal" />
          </Field>
          <Field label="Stage">
            <select name="stageId" defaultValue={deal?.stageId ?? stageId} className={inputClass}>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input name="price" type="number" min={0} step={1} defaultValue={deal?.price ?? ""} className={inputClass} />
          </Field>
          <Field label="Commission">
            <input name="commission" type="number" min={0} step={0.01} defaultValue={deal?.commission ?? ""} className={inputClass} />
          </Field>
          <Field label="Close date">
            <input name="closeDate" type="date" defaultValue={deal?.closeDate ?? ""} className={inputClass} />
          </Field>
          <Field label="Earnest money due">
            <input name="earnestMoneyDue" type="date" defaultValue={deal?.earnestMoneyDue ?? ""} className={inputClass} />
          </Field>
          <Field label="Mutual acceptance">
            <input name="mutualAcceptance" type="date" defaultValue={deal?.mutualAcceptance ?? ""} className={inputClass} />
          </Field>
          <Field label="Due diligence">
            <input name="dueDiligence" type="date" defaultValue={deal?.dueDiligence ?? ""} className={inputClass} />
          </Field>
          <Field label="Final walk through">
            <input name="finalWalkThrough" type="date" defaultValue={deal?.finalWalkThrough ?? ""} className={inputClass} />
          </Field>
          <Field label="Possession">
            <input name="possession" type="date" defaultValue={deal?.possession ?? ""} className={inputClass} />
          </Field>
          <Field label="Property address" className="sm:col-span-2">
            <input name="propertyAddress" defaultValue={deal?.propertyAddress ?? ""} className={inputClass} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea name="description" rows={3} defaultValue={deal?.description ?? ""} className={inputClass} />
          </Field>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <MultiPick
            label="People (contacts)"
            loading={contacts.loading}
            options={(contacts.data?.data ?? []).map((contact) => ({
              id: contact.id,
              label: `${contact.firstName} ${contact.lastName}`.trim(),
            }))}
            selected={contactIds}
            onChange={setContactIds}
          />
          <MultiPick
            label="Team (partners)"
            loading={partners.loading}
            options={(partners.data?.data ?? []).map((partner) => ({
              id: partner.id,
              label: `${partner.name} · ${label(partner.partnerType)}`,
            }))}
            selected={partnerIds}
            onChange={setPartnerIds}
          />
        </div>

        <FormActions busy={busy} error={error} onCancel={onClose} submitLabel={deal ? "Save changes" : "Create deal"} />
      </form>
    </Modal>
  );
}

function DealDetailModal({
  deal,
  stages,
  onClose,
  onChanged,
  onDeleted,
}: {
  deal: CrmDeal;
  stages: CrmDealBoard["stages"];
  onClose: () => void;
  onChanged: () => Promise<void>;
  onDeleted: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!window.confirm(`Delete “${deal.name}”? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      await crmFetch(`/api/crm/deals/${deal.id}`, { method: "DELETE" });
      await onDeleted();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete that deal.");
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <DealFormModal
        clientType={deal.clientType}
        stageId={deal.stageId ?? stages[0]?.id ?? ""}
        stages={stages}
        deal={deal}
        onClose={() => setEditing(false)}
        onSaved={async () => {
          setEditing(false);
          await onChanged();
        }}
      />
    );
  }

  const created = shortDate(deal.createdAt.slice(0, 10));

  return (
    <Modal open title={deal.name} description={`Created ${created}`} onClose={onClose}>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-[var(--crm-secondary)]">
        <span>{deal.clientType === "buyer" ? "Buyers" : "Sellers"}</span>
        <span aria-hidden>›</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--crm-text)]">
          <span className="size-2 rounded-full" style={{ backgroundColor: deal.stage?.color ?? "#999" }} />
          {deal.stage?.name ?? "Unstaged"}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {[
          ["Price", money(deal.price)],
          ["Commission", money(deal.commission)],
          ["Close date", deal.closeDate ? shortDate(deal.closeDate) : "—"],
          ["Earnest money due", deal.earnestMoneyDue ? shortDate(deal.earnestMoneyDue) : "—"],
          ["Mutual acceptance", deal.mutualAcceptance ? shortDate(deal.mutualAcceptance) : "—"],
          ["Due diligence", deal.dueDiligence ? shortDate(deal.dueDiligence) : "—"],
          ["Final walk through", deal.finalWalkThrough ? shortDate(deal.finalWalkThrough) : "—"],
          ["Possession", deal.possession ? shortDate(deal.possession) : "—"],
          ["Property address", deal.propertyAddress || "—"],
        ].map(([labelText, value]) => (
          <div key={labelText} className="flex min-h-9 items-center gap-3 border-b border-[var(--crm-border)] py-1.5">
            <dt className="w-36 shrink-0 text-[11px] font-medium uppercase tracking-wide text-[var(--crm-muted)]">{labelText}</dt>
            <dd className="min-w-0 truncate text-[13px] text-[var(--crm-text)]">{value}</dd>
          </div>
        ))}
      </dl>

      {deal.description ? (
        <p className="mt-4 text-[13px] leading-5 text-[var(--crm-secondary)]">{deal.description}</p>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <LinkedGroup title="People" empty="No contacts linked" items={deal.contacts.map((c) => c.name)} />
        <LinkedGroup title="Team" empty="No partners linked" items={deal.partners.map((p) => p.name)} />
      </div>

      {error ? <p className="mt-4 text-[13px] font-medium text-[var(--crm-danger)]">{error}</p> : null}

      <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--crm-border)] pt-4 sm:flex-row sm:justify-between">
        <SecondaryButton disabled={busy} type="button" onClick={() => void remove()} className="text-[var(--crm-danger)]">
          Delete deal
        </SecondaryButton>
        <div className="flex justify-end gap-1.5">
          <SecondaryButton type="button" onClick={onClose}>Close</SecondaryButton>
          <PrimaryButton type="button" onClick={() => setEditing(true)}>Edit</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

function LinkedGroup({ title, empty, items }: { title: string; empty: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--crm-muted)]">{title}</p>
      {items.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((name) => (
            <span key={name} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--crm-border)] bg-[var(--crm-hover)] px-2 py-1 text-[12px]">
              <EntityAvatar name={name} size={16} />
              {name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[13px] text-[var(--crm-muted)]">{empty}</p>
      )}
    </div>
  );
}

function MultiPick({
  label: fieldLabel,
  loading,
  options,
  selected,
  onChange,
}: {
  label: string;
  loading: boolean;
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-[var(--crm-secondary)]">{fieldLabel}</p>
      <div className="max-h-40 overflow-y-auto rounded-lg border border-[var(--crm-border)]">
        {loading ? (
          <p className="px-2.5 py-2 text-[12px] text-[var(--crm-muted)]">Loading…</p>
        ) : options.length ? (
          options.map((option) => {
            const checked = selectedSet.has(option.id);
            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 border-b border-[var(--crm-border)] px-2.5 py-1.5 text-[13px] last:border-b-0 hover:bg-[var(--crm-hover)]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onChange(checked ? selected.filter((id) => id !== option.id) : [...selected, option.id]);
                  }}
                />
                <span className="truncate">{option.label}</span>
              </label>
            );
          })
        ) : (
          <p className="px-2.5 py-2 text-[12px] text-[var(--crm-muted)]">Nothing to attach yet.</p>
        )}
      </div>
    </div>
  );
}
