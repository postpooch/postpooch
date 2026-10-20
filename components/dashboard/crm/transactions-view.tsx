"use client";

import { useState } from "react";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import {
  ColIcon,
  CrmPage,
  DataTable,
  EntityName,
  ErrorState,
  Field,
  FormActions,
  LoadingState,
  Modal,
  PageHeader,
  Pill,
  PrimaryButton,
  SubmitEvent,
  inputClass,
  money,
  nullableNumber,
  nullableText,
} from "@/components/dashboard/crm/ui";
import { CRM_TRANSACTION_SIDES, CRM_TRANSACTION_STATUSES } from "@/lib/crm/constants";
import type { CrmContact, CrmListResponse, CrmProperty, CrmTransaction } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TransactionsView() {
  const transactions = useCrmData<CrmListResponse<CrmTransaction>>("/api/crm/transactions?pageSize=100");
  const [open, setOpen] = useState(false);
  const rows = transactions.data?.data ?? [];

  return (
    <CrmPage contain>
      <PageHeader title="Transactions" action={<PrimaryButton onClick={() => setOpen(true)}>+ New Transaction</PrimaryButton>} />
      {transactions.loading ? (
        <LoadingState />
      ) : transactions.error ? (
        <ErrorState message={transactions.error} retry={transactions.reload} />
      ) : (
        <DataTable
          columns={[
            {
              id: "title",
              header: "Deal",
              width: 220,
              render: (item) => <EntityName name={item.title} />,
            },
            {
              id: "contact",
              header: "Contact",
              icon: <ColIcon name="user" />,
              width: 160,
              render: (item) => item.contactName ?? <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "property",
              header: "Property",
              width: 200,
              render: (item) => item.propertyAddress ?? <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "side",
              header: "Side",
              width: 110,
              render: (item) => <span className="text-[var(--crm-secondary)]">{label(item.side)}</span>,
            },
            {
              id: "status",
              header: "Status",
              width: 110,
              render: (item) => (
                <Pill tone={item.status === "won" ? "teal" : item.status === "lost" ? "coral" : "blue"}>
                  {label(item.status)}
                </Pill>
              ),
            },
            {
              id: "value",
              header: "Value",
              icon: <ColIcon name="dollar" />,
              width: 120,
              render: (item) => <span className="tabular-nums">{money(item.estimatedValue)}</span>,
            },
            {
              id: "closing",
              header: "Expected close",
              icon: <ColIcon name="calendar" />,
              width: 130,
              render: (item) => item.expectedClosingDate ?? <span className="text-[var(--crm-muted)]">—</span>,
            },
          ]}
          rows={rows}
          getHref={(item) => `/dashboard/crm/transactions/${item.id}`}
          onAdd={() => setOpen(true)}
          addLabel="New"
          emptyMessage="Track closings and commissions here. Stages now live on each contact."
        />
      )}
      <TransactionForm open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); void transactions.reload(); }} />
    </CrmPage>
  );
}

export function TransactionForm({
  open,
  onClose,
  onSaved,
  transaction,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  transaction?: CrmTransaction;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contacts = useCrmData<CrmListResponse<CrmContact>>("/api/crm/contacts?pageSize=100");
  const properties = useCrmData<CrmListResponse<CrmProperty>>("/api/crm/properties?pageSize=100");

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      contactId: nullableText(form.get("contactId")),
      propertyId: nullableText(form.get("propertyId")),
      side: String(form.get("side")),
      status: String(form.get("status")),
      estimatedValue: nullableNumber(form.get("estimatedValue")),
      offerAmount: nullableNumber(form.get("offerAmount")),
      expectedClosingDate: nullableText(form.get("expectedClosingDate")),
      estimatedCommission: nullableNumber(form.get("estimatedCommission")),
      leadSource: nullableText(form.get("leadSource")),
      description: nullableText(form.get("description")),
    };
    try {
      await crmFetch(`/api/crm/transactions${transaction ? `/${transaction.id}` : ""}`, {
        method: transaction ? "PATCH" : "POST",
        ...jsonBody(payload),
      });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save transaction.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={transaction ? "Edit transaction" : "Add a transaction"}
      description="Optional deal record for closings and commissions. Contact stage is managed on the contact."
      onClose={onClose}
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" className="sm:col-span-2">
          <input name="title" required maxLength={250} defaultValue={transaction?.title} className={inputClass} />
        </Field>
        <Field label="Contact">
          <select name="contactId" defaultValue={transaction?.contactId ?? ""} className={inputClass}>
            <option value="">None</option>
            {(contacts.data?.data ?? []).map((contact) => (
              <option key={contact.id} value={contact.id}>{`${contact.firstName} ${contact.lastName}`.trim()}</option>
            ))}
          </select>
        </Field>
        <Field label="Property">
          <select name="propertyId" defaultValue={transaction?.propertyId ?? ""} className={inputClass}>
            <option value="">None</option>
            {(properties.data?.data ?? []).map((property) => (
              <option key={property.id} value={property.id}>{`${property.addressLine1}, ${property.city}`}</option>
            ))}
          </select>
        </Field>
        <Field label="Side">
          <select name="side" defaultValue={transaction?.side ?? "buyer"} className={inputClass}>
            {CRM_TRANSACTION_SIDES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={transaction?.status ?? "active"} className={inputClass}>
            {CRM_TRANSACTION_STATUSES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Estimated value"><input name="estimatedValue" type="number" min="0" step="1000" defaultValue={transaction?.estimatedValue ?? ""} className={inputClass} /></Field>
        <Field label="Offer amount"><input name="offerAmount" type="number" min="0" step="1000" defaultValue={transaction?.offerAmount ?? ""} className={inputClass} /></Field>
        <Field label="Expected closing"><input name="expectedClosingDate" type="date" defaultValue={transaction?.expectedClosingDate ?? ""} className={inputClass} /></Field>
        <Field label="Est. commission"><input name="estimatedCommission" type="number" min="0" step="100" defaultValue={transaction?.estimatedCommission ?? ""} className={inputClass} /></Field>
        <Field label="Lead source" className="sm:col-span-2"><input name="leadSource" defaultValue={transaction?.leadSource ?? ""} className={inputClass} /></Field>
        <Field label="Notes" className="sm:col-span-2">
          <textarea name="description" rows={3} defaultValue={transaction?.description ?? ""} className={`${inputClass} h-auto py-2`} />
        </Field>
        <div className="sm:col-span-2">
          <FormActions busy={busy} error={error} onCancel={onClose} submitLabel={transaction ? "Save changes" : "Add transaction"} />
        </div>
      </form>
    </Modal>
  );
}
