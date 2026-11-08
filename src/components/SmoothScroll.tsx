"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { ReactLenis, type LenisRef } from "lenis/react";
import { MotionConfig, cancelFrame, frame } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

// The live Lenis instance (null when reduced motion turns smooth scrolling off)
let lenis: Lenis | null = null;

/** Smooth-scroll to the top via Lenis; instant jump for reduced motion. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "auto" });
}

/** Keeps Lenis on framer-motion's clock and handles route-change scrolling. */
function LenisDriver({ lenisRef }: { lenisRef: React.RefObject<LenisRef | null> }) {
  const pathname = usePathname();

  // One clock: Lenis advances inside framer-motion's frame loop, so smooth scrolling
  // and every useScroll-driven value update in the same animation frame
  useEffect(() => {
    // (ReactLenis creates its instance after this child effect runs, so read the ref lazily)
    const update = ({ timestamp }: { timestamp: number }) => {
      lenis = lenisRef.current?.lenis ?? null;
      lenis?.raf(timestamp);
    };
    frame.update(update, true);
    return () => {
      cancelFrame(update);
      lenis = null;
    };
  }, [lenisRef]);

  // On page change: go to the #anchor if there is one, otherwise to the top
  useEffect(() => {
    const timer = setTimeout(() => {
      const l = lenisRef.current?.lenis;
      const el = window.location.hash ? (document.querySelector(window.location.hash) as HTMLElement | null) : null;
      if (l) {
        l.resize(); // the new page may be taller than the last
        if (el) l.scrollTo(el);
        else l.scrollTo(0, { immediate: true });
      } else if (el) el.scrollIntoView();
      else window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, lenisRef]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  return (
    // reducedMotion="user": framer animations drop movement for reduced-motion users
    <MotionConfig reducedMotion="user">
      {reduceMotion ? (
        // Reduced motion: no smooth scrolling at all (native scroll, instant jumps)
        children
      ) : (
        <ReactLenis
          root
          ref={lenisRef}
          options={{
            lerp: 0.09,
            smoothWheel: true,
            syncTouch: false, // phones keep native touch scrolling
            anchors: true, // same-page #links scroll through lenis.scrollTo
            autoRaf: false, // driven by framer-motion's frame loop below
          }}
        >
          <LenisDriver lenisRef={lenisRef} />
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
