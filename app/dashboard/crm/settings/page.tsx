import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/crm/settings-view";
export const metadata: Metadata = { title: "CRM Settings" };
export default function CrmSettingsPage() { return <SettingsView />; }

