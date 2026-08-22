import type { Metadata } from "next";
import AeroVistaLocalBadge from "@/components/AeroVistaLocalBadge";
import UmamiAnalytics from "@/components/UmamiAnalytics";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lakeday.aerovista.us";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lake Day | Coeur d'Alene Conditions Guide",
  description: "A fast, explainable lake-day recommendation for Coeur d'Alene using live weather and air-quality conditions.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Is today a good Lake Day?",
    description: "Live weather, wind, air quality and an activity-aware GO / USE CAUTION / SKIP recommendation for Lake Coeur d'Alene.",
    url: "/",
    siteName: "Lake Day",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Lake Day by AeroVista Local" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lake Day",
    description: "Check the lake conditions before you go.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AeroVistaLocalBadge />
        <UmamiAnalytics />
      </body>
    </html>
  );
}
