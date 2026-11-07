"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import SafeImage from "./SafeImage";

const words = "Plan Your Kashmir, Day by Day.".split(" ");
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-end overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <SafeImage
          src="/images/hero.jpg"
          alt="Shikara boats on Dal Lake at sunrise"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Soft grey overlay (no black) */}
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-bg/20" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative mx-auto w-full max-w-6xl px-6 pb-28"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-5 text-xs uppercase tracking-[0.3em] text-accent"
        >
          Kashmir travel planner
        </motion.p>

        <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] sm:text-7xl md:text-8xl">
          {words.map((word, i) => (
            <span
              key={i}
              className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
          className="mt-6 max-w-xl text-lg text-muted"
        >
          Pick your destinations, shape your itinerary, know your budget.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/destinations"
            className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            Start Planning
          </Link>
          <Link
            href="/itinerary"
            className="rounded-full border border-line px-7 py-3 text-sm text-fg transition-colors hover:bg-surface"
          >
            View My Trip
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}