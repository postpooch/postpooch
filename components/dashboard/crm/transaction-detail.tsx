"use client";

import { useState } from "react";

import { useCrmData } from "@/components/dashboard/crm/api";
import { TaskForm } from "@/components/dashboard/crm/contact-detail";
import { TransactionForm } from "@/components/dashboard/crm/transactions-view";
import {
  BackLink,
  CrmPage,
  EntityAvatar,
  ErrorState,
  LoadingState,
  MetaGrid,
  PageHeader,
  Pill,
  PrimaryButton,
  SecondaryButton,
  money,
  shortDate,
} from "@/components/dashboard/crm/ui";
import type { CrmTransaction } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TransactionDetail({ id }: { id: string }) {
  const transaction = useCrmData<CrmTransaction>(`/api/crm/transactions/${id}`);
  const [edit, setEdit] = useState(false);
  const [task, setTask] = useState(false);
  if (transaction.loading) return <CrmPage><LoadingState /></CrmPage>;
  if (transaction.error || !transaction.data) return <CrmPage><ErrorState message={transaction.error ?? "Transaction not found."} retry={transaction.reload} /></CrmPage>;
  const item = transaction.data;
  return (
    <CrmPage>
      <PageHeader
        title={item.title}
        description={`${label(item.side)} side`}
        action={
          <div className="flex items-center gap-1.5">
            <SecondaryButton onClick={() => setTask(true)}>Add task</SecondaryButton>
            <PrimaryButton onClick={() => setEdit(true)}>Edit</PrimaryButton>
          </div>
        }
      />
      <div className="border-b border-[var(--crm-border)] px-3 py-2">
        <BackLink href="/dashboard/crm/transactions">Back to Transactions</BackLink>
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <EntityAvatar name={item.title} size={32} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-medium">{item.title}</h2>
              <Pill tone={item.status === "lost" ? "coral" : "teal"}>{label(item.status)}</Pill>
            </div>
            {item.contactName ? (
              <p className="mt-0.5 text-[13px] text-[var(--crm-secondary)]">{item.contactName}</p>
            ) : null}
          </div>
        </div>
        <MetaGrid
          items={[
            { label: "Est. value", value: money(item.estimatedValue) },
            { label: "Offer", value: money(item.offerAmount) },
            { label: "Est. commission", value: money(item.estimatedCommission) },
            { label: "Expected close", value: shortDate(item.expectedClosingDate) },
            { label: "Actual close", value: shortDate(item.actualClosingDate) },
            { label: "Lead source", value: item.leadSource || "—" },
            { label: "Client", value: item.contactName || "Not linked" },
            { label: "Property", value: item.propertyAddress || "Not linked" },
          ]}
        />
        {item.description ? <p className="mt-4 whitespace-pre-wrap border-t border-[var(--crm-border)] pt-4 text-[13px] leading-5">{item.description}</p> : null}
      </div>
      <TransactionForm open={edit} transaction={item} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); void transaction.reload(); }} />
      <TaskForm open={task} onClose={() => setTask(false)} onSaved={() => setTask(false)} transactionId={item.id} contactId={item.contactId ?? undefined} />
    </CrmPage>
  );
}
