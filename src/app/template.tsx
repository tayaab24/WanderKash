"use client";

import { useEffect, useState, type ReactNode } from "react";

// The first page load renders without the fade, so it never delays the first paint.
// Every later client-side navigation re-mounts this template and fades in (250ms, opacity only).
let hasMounted = false;

export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);
  return <div className={animate ? "page-fade" : undefined}>{children}</div>;
}
