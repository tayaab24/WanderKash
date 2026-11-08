"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { MotionConfig, cancelFrame, frame } from "framer-motion";

let lenis: Lenis | null = null;

/** Smooth-scroll to the top via Lenis; instant jump for reduced motion. */
export function scrollToTop() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (lenis && !reduceMotion) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Start Lenis once
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    lenis = new Lenis({ lerp: 0.1 });
    // Drive Lenis from framer-motion's frame loop so scrolling and scroll-linked
    // animations update in the same frame (no second rAF loop, no fighting)
    const update = ({ timestamp }: { timestamp: number }) => lenis?.raf(timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Smooth-scroll links that point to a #section on the current page
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link || !lenis) return;

      const url = new URL(link.href, window.location.href);
      const samePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname;
      if (!samePage || !url.hash) return;

      const el = document.querySelector(url.hash) as HTMLElement | null;
      if (!el) return;

      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(el);
      window.history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // On page change: go to the #anchor if there is one, otherwise to top
  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      const el = hash
        ? (document.querySelector(hash) as HTMLElement | null)
        : null;

      if (el) {
        // New page may be taller than the last: refresh Lenis's cached limits first
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(el);
        }
        else el.scrollIntoView({ behavior: "smooth" });
      } else if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  // reducedMotion="user": framer animations drop movement for reduced-motion users
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}