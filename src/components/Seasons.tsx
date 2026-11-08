"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import SafeImage from "./SafeImage";
import { getAll } from "@/lib/destinations";
import { useMediaQuery } from "@/lib/useMediaQuery";

const SEASONS = [
  {
    name: "Spring",
    range: "March to May",
    months: [3, 4, 5],
    line: "Tulips in bloom, almond blossom and snowmelt streams.",
    image: "/images/mughal-gardens.jpg",
  },
  {
    name: "Summer",
    range: "June to August",
    months: [6, 7, 8],
    line: "Green meadows, cool pine forest and long golden evenings.",
    image: "/images/pahalgam.jpg",
  },
  {
    name: "Autumn",
    range: "September to November",
    months: [9, 10, 11],
    line: "Chinar leaves turning red and amber, and crisp, clear skies.",
    image: "/images/gurez.jpg",
  },
  {
    name: "Winter",
    range: "December to February",
    months: [12, 1, 2],
    line: "Deep snow, quiet valleys and the slopes of Gulmarg.",
    image: "/images/gulmarg.jpg",
  },
];

// Destinations whose best months overlap each season
const seasons = SEASONS.map((s) => ({
  ...s,
  places: getAll().filter((d) => d.months.some((m) => s.months.includes(m))),
}));

type Season = (typeof seasons)[number];

function Panel({ season }: { season: Season }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SafeImage
        src={season.image}
        alt={`Kashmir in ${season.name.toLowerCase()}`}
        label={season.name}
        sizes="100vw"
      />
      {/* Soft overlays: darker at the bottom and left, where the text sits */}
      <div className="absolute inset-0 bg-linear-to-t from-bg/95 via-bg/40 to-bg/10" />
      <div className="absolute inset-0 bg-linear-to-r from-bg/60 via-bg/10 to-transparent" />

      <div className="relative flex h-full flex-col justify-end px-6 pb-24 pt-28 md:px-16 md:pb-32">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">
            {season.range}
          </p>
          <h3 className="mt-3 font-display text-6xl font-bold leading-none tracking-[-0.015em] md:text-8xl lg:text-9xl">
            {season.name}
          </h3>
          <p className="mt-5 max-w-xl text-lg text-fg/90 md:text-xl">
            {season.line}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {season.places.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/destination/${d.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-bg/70 px-4 text-sm font-bold text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Desktop: section pins while vertical scroll slides the panels sideways. */
function PinnedSeasons() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(3, Math.max(0, Math.round(v * 3))));
  });

  return (
    <section
      ref={ref}
      aria-label="Kashmir through the seasons"
      className="relative h-[400vh] border-t border-line"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[400%]">
          {seasons.map((s) => (
            <div key={s.name} className="h-full w-1/4 shrink-0">
              <Panel season={s} />
            </div>
          ))}
        </motion.div>

        {/* Title + progress indicator */}
        <div className="pointer-events-none absolute inset-x-0 top-24 px-16">
          <p className="mx-auto max-w-6xl text-[13px] font-bold uppercase tracking-[0.3em] text-fg/80">
            Kashmir through the seasons
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-10 px-16">
          <div className="mx-auto flex max-w-6xl items-center gap-6">
            <ol className="flex gap-6 text-[13px] font-bold uppercase tracking-[0.2em]">
              {seasons.map((s, i) => (
                <li
                  key={s.name}
                  aria-current={i === active ? "step" : undefined}
                  className={`transition-colors duration-300 ${
                    i === active ? "text-accent" : "text-muted"
                  }`}
                >
                  {s.name}
                </li>
              ))}
            </ol>
            <div className="relative h-px flex-1 bg-line">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-0 origin-left bg-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mobile and reduced motion: panels stacked vertically with a simple fade. */
function StackedSeasons({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section
      aria-label="Kashmir through the seasons"
      className="border-t border-line"
    >
      <p className="px-6 pt-20 text-[13px] font-bold uppercase tracking-[0.3em] text-accent">
        <span className="mx-auto block max-w-6xl">
          Kashmir through the seasons
        </span>
      </p>
      <div className="mt-8">
        {seasons.map((s) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8 }}
            className="h-[80vh] min-h-120"
          >
            <Panel season={s} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Seasons() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return isDesktop && !reduceMotion ? (
    <PinnedSeasons />
  ) : (
    <StackedSeasons reduceMotion={reduceMotion} />
  );
}
