import type { Metadata } from "next";
import { TransactionDetail } from "@/components/dashboard/crm/transaction-detail";
export const metadata: Metadata = { title: "CRM Transaction" };
export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) { return <TransactionDetail id={(await params).id} />; }

