import type { Metadata } from "next";
import { PropertyDetail } from "@/components/dashboard/crm/property-detail";
export const metadata: Metadata = { title: "CRM Property" };
export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) { return <PropertyDetail id={(await params).id} />; }

