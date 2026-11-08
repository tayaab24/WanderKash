import type { Metadata, Viewport } from "next";
import { Archivo, Cinzel } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TripProvider } from "@/context/TripContext";

// Display headings only (logo, hero, section headings, destination and season names)
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-cinzel",
});

// Everything else: body, UI, labels, prices, small titles
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-archivo",
});

export const viewport: Viewport = {
  themeColor: "#f6eee3", // = --color-bg (meta tags can't read CSS variables)
  colorScheme: "light",
};

export const metadata: Metadata = {
  // Absolute base for Open Graph image URLs; set NEXT_PUBLIC_SITE_URL when deploying
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "WanderKash | Plan Your Kashmir, Day by Day",
  description:
    "A Kashmir travel planner. Pick destinations, shape your itinerary, know your budget.",
  openGraph: {
    title: "WanderKash",
    description: "Plan Your Kashmir, Day by Day.",
    type: "website",
    siteName: "WanderKash",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${archivo.variable}`}>
      <body>
        <TripProvider>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </TripProvider>
      </body>
    </html>
  );
}