"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Generate or retrieve visitor-id cookie
    const visitorCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("visitor-id="));
    
    if (!visitorCookie) {
      const visitorId = window.crypto?.randomUUID() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      document.cookie = `visitor-id=${visitorId}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        disableTransitionOnChange
      >
        <TooltipProvider>
          {mounted ? children : <div className="min-h-screen bg-background" />}
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
