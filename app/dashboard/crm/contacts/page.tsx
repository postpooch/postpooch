import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactsView } from "@/components/dashboard/crm/contacts-view";
import { LoadingState, CrmPage } from "@/components/dashboard/crm/ui";

export const metadata: Metadata = { title: "CRM Contacts" };

export default function ContactsPage() {
  return (
    <Suspense fallback={<CrmPage><LoadingState /></CrmPage>}>
      <ContactsView />
    </Suspense>
  );
}


