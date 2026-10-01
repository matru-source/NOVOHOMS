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
  title: {
    default: "NOVOHOMS — Spaces That Move You Forward | Real Estate Advisory Bhubaneswar",
    template: "%s | NOVOHOMS",
  },
  description:
    "A modern real estate advisory platform for residential, commercial, land and investment opportunities in Bhubaneswar, Odisha.",
  keywords: [
    "real estate Bhubaneswar",
    "property advisory Bhubaneswar",
    "luxury apartments Bhubaneswar",
    "commercial real estate Bhubaneswar",
    "residential plots Bhubaneswar",
    "Saheed Nagar real estate",
    "property investment Odisha",
    "flats in Bhubaneswar",
    "NOVOHOMS",
  ],
  authors: [{ name: "NOVOHOMS Advisory", url: "https://novohoms.com" }],
  creator: "NOVOHOMS",
  publisher: "NOVOHOMS",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "NOVOHOMS — Spaces That Move You Forward",
    description:
      "A modern real estate advisory platform for residential, commercial, land and investment opportunities in Bhubaneswar, Odisha.",
    url: "https://novohoms.com",
    siteName: "NOVOHOMS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOVOHOMS — Spaces That Move You Forward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVOHOMS — Spaces That Move You Forward",
    description:
      "A modern real estate advisory platform for residential, commercial, land and investment opportunities in Bhubaneswar.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["RealEstateAgent", "LocalBusiness"],
      "@id": "https://novohoms.com/#organization",
      name: "NOVOHOMS",
      legalName: "NOVOHOMS Real Estate Advisory",
      url: "https://novohoms.com",
      logo: "https://novohoms.com/brand-mark.png",
      image: "https://novohoms.com/og-image.jpg",
      description:
        "Premier real estate advisory platform specializing in luxury residences, commercial developments, and strategic land investments in Bhubaneswar, Odisha.",
      telephone: "+919777958275",
      email: "hello@novohoms.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Saheed Nagar",
        addressLocality: "Bhubaneswar",
        addressRegion: "Odisha",
        postalCode: "751007",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 20.2907,
        longitude: 85.8456,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      sameAs: ["https://www.instagram.com/novohoms"],
      areaServed: [
        {
          "@type": "City",
          name: "Bhubaneswar",
        },
        {
          "@type": "AdministrativeArea",
          name: "Odisha",
        },
      ],
      priceRange: "$$$",
    },
    {
      "@type": "WebSite",
      "@id": "https://novohoms.com/#website",
      url: "https://novohoms.com",
      name: "NOVOHOMS",
      publisher: {
        "@id": "https://novohoms.com/#organization",
      },
      description:
        "Modern real estate advisory for residential, commercial, land and investment opportunities in Bhubaneswar.",
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
