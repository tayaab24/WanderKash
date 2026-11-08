import type { Metadata, Viewport } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TripProvider } from "@/context/TripContext";

// Body and UI. Lato ships only 400 and 700 (plus italics), so nothing may ask for 500/600.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lato",
});

// Headings and display text (variable font: any weight 400-900)
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const viewport: Viewport = {
  themeColor: "#0e1a22", // = --color-bg (meta tags can't read CSS variables)
  colorScheme: "dark",
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
    <html lang="en" className={`${lato.variable} ${playfair.variable}`}>
      <body>
        <TripProvider>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </TripProvider>
        {/* Subtle static film grain over every page (decorative, never intercepts input) */}
        <div aria-hidden className="grain-overlay pointer-events-none fixed inset-0 z-70" />
      </body>
    </html>
  );
}