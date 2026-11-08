"use client";

import Link from "next/link";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { btn } from "@/lib/ui";
import { motion } from "framer-motion";
import SafeImage from "./SafeImage";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const words = "Your Kashmir starts here.".split(" ");

export default function ClosingCta() {
  const reduceMotion = usePrefersReducedMotion();


  const t = (delay: number, duration = 0.8) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE };

  return (
    <section
      className="on-dark relative flex min-h-[70vh] items-center overflow-hidden"
    >
      {/* Background photo (static) */}
      <div className="absolute inset-0">
        <SafeImage
          src="/images/pahalgam.jpg"
          alt="The Pahalgam valley: pine forest, a river and mountains"
          sizes="100vw"
          className="object-[50%_40%]"
        />
      </div>

      {/* Soft overlay: bg token, heavier on the left behind the text */}
      <div className="absolute inset-0 bg-linear-to-r from-deep/78 via-deep/55 to-deep/15" />
      <div className="absolute inset-0 bg-linear-to-t from-deep/55 via-transparent to-deep/35" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-28">
        {/* The section's one motion: words rise in one by one, once */}
        <h2 className="max-w-3xl text-[clamp(1.9rem,4.2vw_+_0.85rem,3.3rem)] font-display font-bold leading-[1.15] tracking-[0.03em]">
          {words.map((word, i) => (
            <span
              key={i}
              className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={t(i * STAGGER, DURATION.base)}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <p
          className="mt-6 max-w-xl text-lg text-muted"
        >
          Pick a few places, choose your month, and see your trip come
          together.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/plan"
            className={btn.primary}
          >
            Start planning
          </Link>
          <Link
            href="/destinations"
            className={btn.secondary}
          >
            Browse destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
