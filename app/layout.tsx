"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import ReactGA from "react-ga4";
import { useEffect } from "react";
const TRACKING_ID = "G-WVGS3GBFZ2";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(TRACKING_ID);

    // Report page view on first load
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
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
