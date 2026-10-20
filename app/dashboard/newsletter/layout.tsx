import { NewsletterShell } from "@/components/dashboard/newsletter/shell";

export default function NewsletterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NewsletterShell>{children}</NewsletterShell>;
}
