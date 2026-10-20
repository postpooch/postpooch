import type { Metadata } from "next";
import { TransactionsView } from "@/components/dashboard/crm/transactions-view";
export const metadata: Metadata = { title: "CRM Transactions" };
export default function TransactionsPage() { return <TransactionsView />; }

