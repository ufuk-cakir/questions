"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add Google Analytics GA4 script dynamically
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-WVGS3GBFZ2`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", "G-WVGS3GBFZ2", {
      page_path: window.location.pathname + window.location.search,
    });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
