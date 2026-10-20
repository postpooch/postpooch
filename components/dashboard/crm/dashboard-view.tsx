"use client";

import Link from "next/link";

import { useCrmData } from "@/components/dashboard/crm/api";
import {
  ColIcon,
  CrmPage,
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  PrimaryButton,
  RelativeTime,
} from "@/components/dashboard/crm/ui";
import type { CrmActivity, CrmTask } from "@/lib/crm/types";

type Summary = {
  metrics: { contacts: number; hotLeads: number; activeProperties: number; activeTransactions: number; pipelineCommission: number; overdueTasks: number };
  pipeline: { id: string; name: string; color: string; position: number; count: number }[];
  upcomingTasks: CrmTask[];
  activities: CrmActivity[];
};

export function CrmDashboardView() {
  const { data, error, loading, reload } = useCrmData<Summary>("/api/crm/summary");
  if (loading) return <CrmPage><LoadingState /></CrmPage>;
  if (error || !data) return <CrmPage><ErrorState message={error ?? "Unable to load your CRM."} retry={reload} /></CrmPage>;
  const empty = !data.metrics.contacts && !data.metrics.activeProperties;
  const metrics: [string, string | number, string][] = [
    ["Contacts", data.metrics.contacts, "/dashboard/crm/contacts"],
    ["Hot leads", data.metrics.hotLeads, "/dashboard/crm/contacts?priority=hot"],
    ["Active properties", data.metrics.activeProperties, "/dashboard/crm/properties?status=active"],
    ["Overdue tasks", data.metrics.overdueTasks, "/dashboard/crm/tasks?status=open"],
  ];
  return (
    <CrmPage>
      <PageHeader title="Home" action={<Link href="/dashboard/crm/contacts"><PrimaryButton>+ New Contact</PrimaryButton></Link>} />
      {empty ? (
        <EmptyState
          title="Build your contact pipeline"
          description="Start with a lead or client, set their stage, then connect properties, tasks, and notes as the relationship grows."
          action={<Link href="/dashboard/crm/contacts"><PrimaryButton>+ New Contact</PrimaryButton></Link>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 divide-x divide-y divide-[var(--crm-border)] border-b border-[var(--crm-border)] sm:grid-cols-4 sm:divide-y-0">
            {metrics.map(([label, value, href]) => (
              <Link key={label} href={href} className="px-4 py-3 transition hover:bg-[var(--crm-hover)]">
                <p className="text-[12px] text-[var(--crm-secondary)]">{label}</p>
                <p className="mt-1 text-[20px] font-semibold tabular-nums tracking-tight text-[var(--crm-text)]">{value}</p>
              </Link>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.4fr_1fr]">
            <section className="flex min-h-0 flex-col border-b border-[var(--crm-border)] lg:border-b-0 lg:border-r">
              <div className="flex h-10 items-center justify-between px-4">
                <h2 className="text-[13px] font-medium">Contacts by stage</h2>
                <Link className="text-[13px] text-[var(--crm-secondary)] hover:text-[var(--crm-accent)]" href="/dashboard/crm/contacts">
                  All contacts
                </Link>
              </div>
              <DataTable
                fill={false}
                columns={[
                  {
                    id: "stage",
                    header: "Stage",
                    icon: <ColIcon name="tag" />,
                    width: 180,
                    render: (stage) => (
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
                        {stage.name}
                      </span>
                    ),
                  },
                  { id: "count", header: "Contacts", width: 100, render: (stage) => <span className="text-[var(--crm-secondary)]">{stage.count}</span> },
                ]}
                rows={data.pipeline}
                getHref={(stage) => `/dashboard/crm/contacts?stageId=${stage.id}`}
              />
            </section>
            <section className="flex min-h-0 flex-col">
              <div className="flex h-10 items-center justify-between px-4">
                <h2 className="text-[13px] font-medium">Next up</h2>
                <Link className="text-[13px] text-[var(--crm-secondary)] hover:text-[var(--crm-accent)]" href="/dashboard/crm/tasks">
                  All tasks
                </Link>
              </div>
              <DataTable
                fill={false}
                columns={[
                  {
                    id: "title",
                    header: "Task",
                    icon: <ColIcon name="check" />,
                    width: 200,
                    render: (task) => <span className="truncate font-medium">{task.title}</span>,
                  },
                  {
                    id: "related",
                    header: "Related",
                    icon: <ColIcon name="user" />,
                    width: 140,
                    render: (task) => <span className="truncate text-[var(--crm-secondary)]">{task.contactName ?? task.transactionTitle ?? "—"}</span>,
                  },
                  {
                    id: "due",
                    header: "Due",
                    icon: <ColIcon name="calendar" />,
                    width: 120,
                    render: (task) => (
                      <span className={task.dueAt && new Date(task.dueAt) < new Date() ? "text-[var(--crm-danger)]" : "text-[var(--crm-secondary)]"}>
                        <RelativeTime value={task.dueAt} />
                      </span>
                    ),
                  },
                ]}
                rows={data.upcomingTasks}
                emptyMessage="Nothing urgent. Your follow-up list is clear."
              />
            </section>
          </div>
          <section className="flex min-h-[220px] flex-col border-t border-[var(--crm-border)]">
            <div className="flex h-10 items-center px-4">
              <h2 className="text-[13px] font-medium">Recent activity</h2>
            </div>
            <DataTable
              fill={false}
              columns={[
                {
                  id: "summary",
                  header: "Activity",
                  icon: <ColIcon name="clock" />,
                  width: 420,
                  render: (activity) => activity.summary,
                },
                {
                  id: "when",
                  header: "When",
                  icon: <ColIcon name="calendar" />,
                  width: 140,
                  render: (activity) => <span className="text-[var(--crm-secondary)]"><RelativeTime value={activity.createdAt} /></span>,
                },
              ]}
              rows={data.activities}
              emptyMessage="Activity will appear as you build your CRM."
            />
          </section>
        </>
      )}
    </CrmPage>
  );
}
