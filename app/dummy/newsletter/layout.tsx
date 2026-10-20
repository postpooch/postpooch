import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter template seeder",
  description: "Dev tool for adding MJML newsletter templates to postpooch.",
};

export default function DummyNewsletterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
