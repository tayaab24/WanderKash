"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useTrip } from "@/context/TripContext";
import { EASE } from "@/lib/motion";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/plan", label: "Plan" },
  { href: "/itinerary", label: "My Trip", badge: true },
] as const;

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href === "/destinations")
    return pathname === "/destinations" || pathname.startsWith("/destination/");
  return pathname === href;
}

/** Space is reserved from the start; the number fades in once the saved trip has loaded. */
function Badge({ count, ready }: { count: number; ready: boolean }) {
  return (
    <span
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-[13px] font-bold tabular-nums text-bg text-shadow-none transition-opacity ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {ready ? count : 0}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { totalStops, ready } = useTrip();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers which page it was opened on, so it closes on route change
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;

  // Shares framer-motion's single scroll source (no extra listener); state only flips at 24px
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid
          ? "border-line bg-surface/95 md:bg-surface/85 md:backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Scrim: a darker backdrop at the top of any hero photo, only while transparent */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-bg/90 via-bg/70 to-transparent transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />

      <nav className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 md:h-20">
        <Link
          href="/"
          className="flex min-h-11 items-center font-display text-2xl font-bold tracking-[-0.015em] text-fg text-shadow-sm text-shadow-bg/50 md:text-3xl"
        >
          Wander<span className="text-accent">Kash</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => {
            const active = isActive(l.href, pathname);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-11 min-w-11 items-center justify-center gap-2 text-[15px] font-bold tracking-[0.01em] text-shadow-sm text-shadow-bg/60 transition-colors lg:text-base ${
                    active
                      ? solid
                        ? "text-accent"
                        : "text-accent-hover"
                      : "text-fg hover:text-accent"
                  }`}
                >
                  <span className="relative">
                    {l.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-accent transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </span>
                  {"badge" in l && <Badge count={totalStops} ready={ready} />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuPath(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-fg md:hidden"
        >
          {ready && totalStops > 0 && !open && (
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
          )}
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 rounded bg-fg shadow-sm shadow-bg/50 transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-6 rounded bg-fg shadow-sm shadow-bg/50 transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-6 rounded bg-fg shadow-sm shadow-bg/50 transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE }}
            className="border-t border-line bg-surface md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
              {LINKS.map((l) => {
                const active = isActive(l.href, pathname);
                return (
                  <li key={l.href} className="border-b border-line last:border-b-0">
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuPath(null)}
                      className={`flex items-center justify-between py-4 text-xl font-bold tracking-[0.01em] transition-colors ${
                        active ? "text-accent" : "text-fg hover:text-accent"
                      }`}
                    >
                      {l.label}
                      {"badge" in l && <Badge count={totalStops} ready={ready} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
