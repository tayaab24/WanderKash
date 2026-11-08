import type { Metadata } from "next";
import Link from "next/link";
import ChinarLeaf from "@/components/atmosphere/ChinarLeaf";
import AmbientGlow from "@/components/atmosphere/AmbientGlow";
import { btn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Page not found | WanderKash",
  description: "This page doesn't exist. Head back home or browse Kashmir destinations.",
};

export default function NotFound() {
  return (
    <section className="min-h-screen-safe relative isolate flex items-center overflow-x-clip px-6 pb-20 pt-28">
      <AmbientGlow
        glows={[
          { tone: "warm", className: "-left-[15%] top-[5%] w-[70vw] max-w-[820px]", duration: 48 },
          { tone: "cool", className: "-right-[20%] bottom-0 w-[60vw] max-w-[720px]", duration: 40 },
        ]}
      />
      <ChinarLeaf className="absolute -right-10 top-24 -z-10 w-56 rotate-[18deg] text-accent-text/10 md:right-10 md:w-80" />
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.3em] text-accent-text">
          404 · Off the map
        </p>
        <h1 className="max-w-2xl text-[clamp(2.5rem,6vw_+_1rem,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
          This trail doesn&apos;t lead anywhere.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          The page you were looking for has moved or never existed. Let&apos;s
          get you back to the valley.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className={btn.primary}>
            Back to home
          </Link>
          <Link href="/destinations" className={btn.secondary}>
            Browse destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
