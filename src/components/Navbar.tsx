"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrip } from "@/context/TripContext";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { totalStops: tripCount } = useTrip();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (active: boolean) =>
    `text-sm transition-colors ${
      active ? "text-fg" : "text-muted hover:text-fg"
    }`;

  const onDestinations =
    pathname === "/destinations" || pathname.startsWith("/destination/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          Wander<span className="text-accent">Kash</span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className={linkClass(pathname === "/")}>
            Home
          </Link>
          <Link href="/destinations" className={linkClass(onDestinations)}>
            Destinations
          </Link>
          <Link
            href="/itinerary"
            className={linkClass(pathname === "/itinerary")}
          >
            <span className="flex items-center gap-2">
              My Trip
              <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-xs text-accent">
                {tripCount}
              </span>
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}