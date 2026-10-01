import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#102d27",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://novohoms.com"),
  title: { default: "NOVOHOMS — Spaces That Move You Forward", template: "%s | NOVOHOMS" },
  description: "A modern real estate advisory platform for residential, commercial, land and investment opportunities in Bhubaneswar.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "NOVOHOMS — Spaces That Move You Forward",
    description: "A modern real estate advisory platform for residential, commercial, land and investment opportunities in Bhubaneswar.",
    url: "https://novohoms.com",
    siteName: "NOVOHOMS",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
