"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/editor/components/ui/sonner";
import { TooltipProvider } from "@/editor/components/ui/tooltip";
import "@/editor/theme.css";

export function VideoCenterShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <TooltipProvider>
        <div
          className={
            className ?? "opencut-root min-h-full font-sans antialiased"
          }
        >
          {children}
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
