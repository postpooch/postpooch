"use client";

import { useMemo, useState } from "react";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import { TaskForm } from "@/components/dashboard/crm/contact-detail";
import {
  ColIcon,
  CrmPage,
  DataTable,
  ErrorState,
  LoadingState,
  PageHeader,
  Pill,
  PrimaryButton,
  RelativeTime,
  SearchBar,
  toolbarSelectClass,
} from "@/components/dashboard/crm/ui";
import type { CrmListResponse, CrmTask } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TasksView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("open");
  const [open, setOpen] = useState(false);
  const path = useMemo(
    () => `/api/crm/tasks?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(status ? { status } : {}), pageSize: "100" })}`,
    [search, status],
  );
  const tasks = useCrmData<CrmListResponse<CrmTask>>(path);
  async function toggle(task: CrmTask) {
    await crmFetch(`/api/crm/tasks/${task.id}`, {
      method: "PATCH",
      ...jsonBody({ completedAt: task.completedAt ? null : new Date().toISOString() }),
    });
    void tasks.reload();
  }
  const rows = tasks.data?.data ?? [];
  return (
    <CrmPage contain>
      <PageHeader title="Tasks" action={<PrimaryButton onClick={() => setOpen(true)}>+ New Task</PrimaryButton>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search tasks…" viewLabel="All Tasks" count={tasks.loading ? undefined : rows.length}>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={toolbarSelectClass}>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
          <option value="">All tasks</option>
        </select>
      </SearchBar>
      {tasks.loading ? (
        <LoadingState />
      ) : tasks.error ? (
        <ErrorState message={tasks.error} retry={tasks.reload} />
      ) : (
        <DataTable
          columns={[
            {
              id: "done",
              header: "",
              width: 44,
              interactive: true,
              render: (task) => (
                <button
                  type="button"
                  onClick={() => void toggle(task)}
                  aria-label={task.completedAt ? "Reopen task" : "Complete task"}
                  className={`grid size-4 place-items-center rounded-[4px] border text-[9px] leading-none text-white ${
                    task.completedAt
                      ? "border-[var(--crm-accent)] bg-[var(--crm-accent)]"
                      : "border-[#cfcfcf] bg-white hover:border-[var(--crm-accent)]"
                  }`}
                >
                  {task.completedAt ? "✓" : null}
                </button>
              ),
            },
            {
              id: "title",
              header: "Task",
              icon: <ColIcon name="check" />,
              width: 260,
              render: (task) => (
                <span className={`truncate ${task.completedAt ? "text-[var(--crm-muted)] line-through" : "font-medium"}`}>
                  {task.title}
                </span>
              ),
            },
            {
              id: "related",
              header: "Related",
              icon: <ColIcon name="user" />,
              width: 180,
              render: (task) => (
                <span className="truncate text-[var(--crm-secondary)]">{task.contactName ?? task.transactionTitle ?? "—"}</span>
              ),
            },
            {
              id: "type",
              header: "Type",
              icon: <ColIcon name="tag" />,
              width: 130,
              render: (task) => <span className="text-[var(--crm-secondary)]">{label(task.taskType)}</span>,
            },
            {
              id: "priority",
              header: "Priority",
              width: 110,
              render: (task) => <Pill tone={task.priority === "high" ? "coral" : "sand"}>{label(task.priority)}</Pill>,
            },
            {
              id: "due",
              header: "Due",
              icon: <ColIcon name="calendar" />,
              width: 140,
              render: (task) => (
                <span
                  className={
                    task.dueAt && !task.completedAt && new Date(task.dueAt) < new Date()
                      ? "text-[var(--crm-danger)]"
                      : "text-[var(--crm-secondary)]"
                  }
                >
                  <RelativeTime value={task.dueAt} />
                </span>
              ),
            },
          ]}
          rows={rows}
          onAdd={() => setOpen(true)}
          addLabel="New"
          emptyMessage={search ? "Try a different search." : status === "completed" ? "Completed tasks will collect here." : "Your follow-up queue is clear."}
        />
      )}
      <TaskForm open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); void tasks.reload(); }} />
    </CrmPage>
  );
}
