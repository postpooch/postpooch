import type { Metadata } from "next";

import { DealsView } from "@/components/dashboard/crm/deals-view";

export const metadata: Metadata = { title: "CRM Deals" };

export default function DealsPage() {
  return <DealsView />;
}
