import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TripProvider } from "@/context/TripContext";

// The only font family: Roboto (400 body, 500 UI and labels, 700 headings)
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
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
    <html lang="en" className={roboto.variable}>
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