import type { Metadata } from "next";
import { PropertiesView } from "@/components/dashboard/crm/properties-view";
export const metadata: Metadata = { title: "CRM Properties" };
export default function PropertiesPage() { return <PropertiesView />; }

