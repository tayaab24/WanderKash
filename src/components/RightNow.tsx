"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SafeImage from "./SafeImage";
import SectionHeading from "./SectionHeading";
import { MONTHS, getAll, seasonStatus } from "@/lib/destinations";

const SEASON_LINES: Record<number, string> = {
  1: "Deep winter: Gulmarg is snow-bound and skiing is at its best.",
  2: "Late winter: crisp days, frozen edges on the lakes, powder on the slopes.",
  3: "Snowmelt and the first almond blossom; the valley starts to wake.",
  4: "Tulip season: gardens in full colour and Dal Lake glassy in the mornings.",
  5: "Spring turns green; meadows open up and the high roads begin to clear.",
  6: "Early summer: long days, wildflowers and every valley within reach.",
  7: "High summer in the meadows, cool air above the tree line.",
  8: "Late summer: lush valleys, rushing rivers, the last of the alpine treks.",
  9: "Clear skies and golden light; the remote valleys are still open.",
  10: "Chinar trees turn red and amber; calm, crisp and uncrowded.",
  11: "Late autumn: bare chinars, misty mornings and the first snow on the peaks.",
  12: "Winter arrives: snow returns to Gulmarg and the lakes go quiet.",
};

const noop = () => () => {};
const getMonth = () => new Date().getMonth() + 1;
const getServerMonth = () => null; // skeleton on the server and during hydration

const listNames = (names: string[]) =>
  names.length <= 1
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

function Skeleton() {
  return (
    <div aria-hidden className="animate-pulse motion-reduce:animate-none">
      <div className="mb-3 h-3 w-24 rounded bg-surface" />
      <div className="h-10 w-80 max-w-full rounded-lg bg-surface" />
      <div className="mt-4 h-5 w-120 max-w-full rounded bg-surface" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-4/3 rounded-xl bg-surface" />
        ))}
      </div>
    </div>
  );
}

export default function RightNow() {
  const month = useSyncExternalStore(noop, getMonth, getServerMonth);
  const reduceMotion = useReducedMotion();

  if (month === null) return <Skeleton />;

  const name = MONTHS[month - 1];
  const all = getAll();
  const good = all.filter((d) => seasonStatus(d, month) === "good");
  const edge = all.filter((d) => seasonStatus(d, month) === "shoulder");
  const off = all.filter((d) => seasonStatus(d, month) === "off");
  // If nothing is at its peak (e.g. November), feature the edge-of-season places instead
  const peak = good.length > 0;
  const featured = peak ? good : edge;
  const listed = peak ? edge : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <SectionHeading
        className=""
        eyebrow="This month"
        title={
          <>
            Right now in Kashmir <span className="text-accent">·</span> {name}
          </>
        }
        subline={SEASON_LINES[month]}
      />

      {!peak && featured.length > 0 && (
        <p className="mt-10 text-fg">
          Nothing is at its absolute peak in {name}, but these are close, and
          quieter than usual:
        </p>
      )}

      {featured.length > 0 && (
        <ul
          className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${
            peak ? "mt-10" : "mt-6"
          }`}
        >
          {featured.map((d) => (
            <li key={d.id}>
              <Link
                href={`/destination/${d.id}`}
                className="group block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:bg-surface-hover"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <SafeImage
                    src={d.image}
                    alt=""
                    label={d.name}
                    sizes="(min-width: 1024px) 270px, 50vw"
                    className="transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="font-serif text-lg">{d.name}</span>
                  {peak ? (
                    <span className="text-xs text-accent">✓ In season</span>
                  ) : (
                    <span className="text-xs text-muted">Edge of season</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {listed.length > 0 && (
        <p className="mt-6 text-sm text-muted">
          <span className="text-fg">Edge of season:</span>{" "}
          {listed.map((d, i) => (
            <span key={d.id}>
              <Link
                href={`/destination/${d.id}`}
                className="transition-colors hover:text-accent"
              >
                {d.name}
              </Link>
              {i < listed.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

      {off.length > 0 && (
        <p className="mt-4 inline-block rounded-xl border border-warn/30 bg-warn/10 px-4 py-2 text-base text-warn">
          {listNames(off.map((d) => d.name))} {off.length === 1 ? "is" : "are"}{" "}
          off-season now.
        </p>
      )}

      <div className="mt-10">
        <Link
          href={`/plan?month=${month}`}
          className="inline-block rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
        >
          Plan a trip for {name}
        </Link>
      </div>
    </motion.div>
  );
}
