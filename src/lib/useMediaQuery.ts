"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live matchMedia result. Always `false` on the server and during hydration,
 * so server HTML matches; the real value applies right after.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Hydration-safe reduced-motion flag (false during SSR/hydration, then live). */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
