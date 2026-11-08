"use client";

import { useRef } from "react";
import Link from "next/link";
import { EASE } from "@/lib/motion";
import { btn } from "@/lib/ui";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import SafeImage from "./SafeImage";
import { useIsSmallScreen, usePrefersReducedMotion } from "@/lib/useMediaQuery";

const words = "Your Kashmir starts here.".split(" ");
const ease = EASE;
const STAGGER = 0.12;
const AFTER = words.length * STAGGER + 0.3;

export default function ClosingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const small = useIsSmallScreen(); // no parallax on phones

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const t = (delay: number, duration = 0.8) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease };

  return (
    <section
      ref={ref}
      className="on-dark relative flex min-h-[70vh] items-center overflow-hidden"
    >
      {/* Slight parallax background (static for reduced motion) */}
      <motion.div
        style={reduceMotion || small ? undefined : { y: imageY }}
        className="absolute -inset-y-[10%] inset-x-0"
      >
        <SafeImage
          src="/images/pahalgam.jpg"
          alt="The Pahalgam valley: pine forest, a river and mountains"
          sizes="100vw"
          className="object-[50%_40%]"
        />
      </motion.div>

      {/* Soft overlay: bg token, heavier on the left behind the text */}
      <div className="absolute inset-0 bg-linear-to-r from-deep/78 via-deep/55 to-deep/15" />
      <div className="absolute inset-0 bg-linear-to-t from-deep/55 via-transparent to-deep/35" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-28">
        {/* Words rise in one by one, like the hero */}
        <h2 className="max-w-3xl text-[clamp(2.25rem,5vw_+_1rem,4rem)] font-bold leading-[1.1] tracking-[-0.02em]">
          {words.map((word, i) => (
            <span
              key={i}
              className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={t(i * STAGGER, 0.9)}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={t(AFTER)}
          className="mt-6 max-w-xl text-lg text-muted"
        >
          Pick a few places, choose your month, and see your trip come
          together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={t(AFTER + 0.2)}
          className="mt-10 flex flex-wrap gap-4"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
