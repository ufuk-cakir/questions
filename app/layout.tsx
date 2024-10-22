import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import ReactGA from "react-ga";

const TRACKING_ID = "G-WVGS3GBFZ2";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(trackingId);

    // Report page view on first load
    ReactGA.pageview(window.location.pathname + window.location.search);
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
