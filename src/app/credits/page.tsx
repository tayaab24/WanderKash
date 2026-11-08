import type { Metadata } from "next";
import credits from "@/data/photo-credits.json";
import { getAll } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Photo credits | WanderKash",
  description: "Credits and licences for the photography used on WanderKash.",
};

export default function CreditsPage() {
  const names = new Map(getAll().map((d) => [d.image, d.name]));

  return (
    <section className="mx-auto min-h-screen max-w-3xl px-6 pb-20 pt-36">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        Credits
      </p>
      <h1 className="font-serif text-5xl leading-tight md:text-6xl">
        Photography
      </h1>
      <p className="mt-6 text-muted">
        The Dal Lake photo comes from Pexels (Pexels License) and the rest of
        the destination photos from Wikimedia Commons under Creative Commons
        licences. All have been resized and compressed for the web.
      </p>

      <ul className="mt-12 divide-y divide-line border-y border-line">
        {credits.map((c) => (
          <li
            key={c.image}
            className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="font-serif text-2xl">
              {c.image === "/images/hero.jpg"
                ? "Home hero: sunset over Dal Lake"
                : (names.get(c.image) ?? c.image)}
            </span>
            <span className="text-sm text-muted">
              {c.source ? (
                <a
                  href={c.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                >
                  {c.author}
                </a>
              ) : (
                <span className="text-fg">{c.author}</span>
              )}
              {c.license && <>{" · "}{c.license}</>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
