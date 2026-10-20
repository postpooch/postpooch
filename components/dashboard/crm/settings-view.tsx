"use client";

import { useState } from "react";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import {
  Card,
  CrmPage,
  ErrorState,
  Field,
  FormActions,
  LoadingState,
  Modal,
  PageHeader,
  SecondaryButton,
  SubmitEvent,
  inputClass,
} from "@/components/dashboard/crm/ui";
import type { CrmRelationshipType, CrmStage, CrmTag } from "@/lib/crm/types";

export function SettingsView() {
  const stages = useCrmData<CrmStage[]>("/api/crm/stages");
  const tags = useCrmData<CrmTag[]>("/api/crm/tags");
  const relationshipTypes = useCrmData<CrmRelationshipType[]>("/api/crm/relationship-types");
  const [stageOpen, setStageOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [relationshipOpen, setRelationshipOpen] = useState(false);
  const error = stages.error || tags.error || relationshipTypes.error;
  if (stages.loading || tags.loading || relationshipTypes.loading) return <CrmPage><LoadingState /></CrmPage>;
  if (error) {
    return (
      <CrmPage>
        <ErrorState
          message={error}
          retry={() => {
            void stages.reload();
            void tags.reload();
            void relationshipTypes.reload();
          }}
        />
      </CrmPage>
    );
  }
  return (
    <CrmPage>
      <PageHeader title="Settings" />
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--crm-border)] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-medium">Contact stages</h2>
              <p className="text-[12px] text-[var(--crm-muted)]">Shared defaults plus any stages you add</p>
            </div>
            <SecondaryButton onClick={() => setStageOpen(true)}>Add stage</SecondaryButton>
          </div>
          <div className="divide-y divide-[var(--crm-border)]">
            {stages.data?.map((stage) => (
              <div key={stage.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="flex-1 text-[13px] font-medium">{stage.name}</span>
                <span className="text-[12px] text-[var(--crm-muted)]">
                  {stage.profileId ? "Custom" : "Default"}
                  {" · #"}
                  {stage.position + 1}
                  {stage.isClosed ? stage.isWon ? " · won" : " · closed" : ""}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--crm-border)] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-medium">Contact tags</h2>
              <p className="text-[12px] text-[var(--crm-muted)]">Flexible segments for your database</p>
            </div>
            <SecondaryButton onClick={() => setTagOpen(true)}>Add tag</SecondaryButton>
          </div>
          <div className="flex flex-wrap gap-2 p-4">
            {tags.data?.length ? tags.data.map((tag) => (
              <span key={tag.id} className="inline-flex items-center gap-2 rounded-full border border-[var(--crm-border)] bg-[var(--crm-hover)] px-2.5 py-1 text-[13px]">
                <span className="size-2 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </span>
            )) : <p className="text-[13px] text-[var(--crm-muted)]">No tags yet.</p>}
          </div>
        </Card>
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[var(--crm-border)] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-medium">Relationship types</h2>
              <p className="text-[12px] text-[var(--crm-muted)]">
                Shared defaults plus custom roles. Pair labels (Parent / Child) or a single label (Spouse).
              </p>
            </div>
            <SecondaryButton onClick={() => setRelationshipOpen(true)}>Add type</SecondaryButton>
          </div>
          <div className="divide-y divide-[var(--crm-border)]">
            {relationshipTypes.data?.map((type) => (
              <div key={type.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="flex-1 text-[13px] font-medium">
                  {type.type2 ? `${type.type1} / ${type.type2}` : type.type1}
                </span>
                <span className="text-[12px] text-[var(--crm-muted)]">
                  {type.profileId ? "Custom" : "Default"}
                  {type.type2 ? "" : " · symmetric"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <StageForm open={stageOpen} onClose={() => setStageOpen(false)} onSaved={() => { setStageOpen(false); void stages.reload(); }} />
      <TagForm open={tagOpen} onClose={() => setTagOpen(false)} onSaved={() => { setTagOpen(false); void tags.reload(); }} />
      <RelationshipTypeForm
        open={relationshipOpen}
        onClose={() => setRelationshipOpen(false)}
        onSaved={() => { setRelationshipOpen(false); void relationshipTypes.reload(); }}
      />
    </CrmPage>
  );
}

function StageForm({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      await crmFetch("/api/crm/stages", {
        method: "POST",
        ...jsonBody({
          name: String(form.get("name") ?? ""),
          color: String(form.get("color") ?? "#256f68"),
          isClosed: form.get("isClosed") === "on",
          isWon: form.get("isWon") === "on",
        }),
      });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add stage.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title="Add contact stage" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Stage name"><input name="name" required className={inputClass} /></Field>
        <Field label="Color"><input name="color" type="color" defaultValue="#256f68" className={`${inputClass} h-11`} /></Field>
        <div className="flex flex-col justify-center gap-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-[13px] font-medium"><input name="isClosed" type="checkbox" />Closed stage</label>
          <label className="flex items-center gap-2 text-[13px] font-medium"><input name="isWon" type="checkbox" />Successful outcome</label>
        </div>
        <div className="sm:col-span-2"><FormActions busy={busy} error={error} onCancel={onClose} submitLabel="Add stage" /></div>
      </form>
    </Modal>
  );
}

function TagForm({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      await crmFetch("/api/crm/tags", { method: "POST", ...jsonBody({ name: String(form.get("name") ?? ""), color: String(form.get("color") ?? "#256f68") }) });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add tag.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title="Add contact tag" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field label="Tag name"><input name="name" required className={inputClass} /></Field>
        <Field label="Color"><input name="color" type="color" defaultValue="#256f68" className={`${inputClass} h-11`} /></Field>
        <div className="sm:col-span-2"><FormActions busy={busy} error={error} onCancel={onClose} submitLabel="Add tag" /></div>
      </form>
    </Modal>
  );
}

function RelationshipTypeForm({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const type2 = String(form.get("type2") ?? "").trim();
    try {
      await crmFetch("/api/crm/relationship-types", {
        method: "POST",
        ...jsonBody({
          type1: String(form.get("type1") ?? ""),
          type2: type2 || null,
        }),
      });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add relationship type.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open={open}
      title="Add relationship type"
      description="Use one label for symmetric ties (Spouse). Use two labels for directed ties (Parent / Child)."
      onClose={onClose}
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="First role (person 1)">
          <input name="type1" required maxLength={80} placeholder="Parent" className={inputClass} />
        </Field>
        <Field label="Second role (optional)">
          <input name="type2" maxLength={80} placeholder="Child — leave blank if symmetric" className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <FormActions busy={busy} error={error} onCancel={onClose} submitLabel="Add type" />
        </div>
      </form>
    </Modal>
  );
}
