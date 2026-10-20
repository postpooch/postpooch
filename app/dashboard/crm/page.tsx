import type { Metadata } from "next";
import { CrmDashboardView } from "@/components/dashboard/crm/dashboard-view";
export const metadata: Metadata = { title: "CRM" };
export default function CrmDashboardPage() { return <CrmDashboardView />; }

