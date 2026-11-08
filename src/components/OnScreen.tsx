"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Marks its container with data-onscreen="true|false" (IntersectionObserver), so CSS can
 * pause looping animations and drop will-change while they're out of view.
 */
export default function OnScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-onscreen={onScreen} className={className}>
      {children}
    </div>
  );
}
