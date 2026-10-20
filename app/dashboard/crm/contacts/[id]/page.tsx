import type { Metadata } from "next";
import { ContactDetail } from "@/components/dashboard/crm/contact-detail";
export const metadata: Metadata = { title: "CRM Contact" };
export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) { return <ContactDetail id={(await params).id} />; }

