import type { Metadata } from "next";
import { TasksView } from "@/components/dashboard/crm/tasks-view";
export const metadata: Metadata = { title: "CRM Tasks" };
export default function TasksPage() { return <TasksView />; }

