"use client";

import { scrollToTop } from "@/components/SmoothScroll";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
    >
      Back to top
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        ↑
      </span>
    </button>
  );
}
