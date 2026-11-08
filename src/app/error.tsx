"use client";

import Link from "next/link";
import { btn } from "@/lib/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen-safe flex items-center px-6 pb-20 pt-28">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
          Something went wrong
        </p>
        <h1 className="max-w-2xl font-display text-[clamp(2.5rem,6vw_+_1rem,4.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          We hit a snowdrift.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          This page couldn&apos;t load. Your saved trip is safe in this browser.
          Try again, or head back home.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className={btn.primary}>
            Try again
          </button>
          <Link href="/" className={btn.secondary}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
