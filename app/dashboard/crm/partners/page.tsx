import type { Metadata } from "next";
import { PartnersView } from "@/components/dashboard/crm/partners-view";
export const metadata: Metadata = { title: "CRM Partners" };
export default function PartnersPage() { return <PartnersView />; }

