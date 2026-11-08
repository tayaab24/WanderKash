"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

type Tone = "bg" | "surface" | "deep" | "transparent";

/**
 * Layered ridges that carry one section's colour into the next.
 * `to` is the section that follows (the front ridge is solid `to`, so it melts into it);
 * `from` is the section above (the divider's own background). Back layers drift on scroll.
 */
export default function MountainDivider({
  from = "transparent",
  to,
  className = "",
}: {
  from?: Tone;
  to: Exclude<Tone, "transparent">;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const midY = useTransform(scrollYProgress, [0, 1], [7, -7]);
  const color = (t: Tone) => (t === "transparent" ? "transparent" : `var(--color-${t})`);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ backgroundColor: color(from), "--ridge": color(to) } as CSSProperties}
      className={`pointer-events-none relative h-16 w-full overflow-hidden md:h-28 ${className}`}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {/* Far ridge */}
        <motion.path
          style={reduceMotion ? undefined : { y: backY }}
          d="M0 70 L90 48 L170 62 L260 30 L350 55 L430 40 L520 66 L610 24 L700 52 L780 38 L880 60 L970 22 L1060 50 L1150 36 L1240 58 L1330 32 L1440 50 L1440 160 L0 160 Z"
          fill="var(--ridge)"
          fillOpacity={0.35}
        />
        {/* Middle ridge */}
        <motion.path
          style={reduceMotion ? undefined : { y: midY }}
          d="M0 88 L120 66 L230 80 L330 58 L450 84 L560 62 L660 80 L780 56 L900 82 L1010 64 L1120 86 L1230 60 L1340 78 L1440 66 L1440 160 L0 160 Z"
          fill="var(--ridge)"
          fillOpacity={0.65}
        />
        {/* Front ridge: the next section's colour */}
        <path
          d="M0 104 L150 90 L280 100 L420 86 L560 102 L700 92 L840 104 L980 88 L1120 100 L1260 90 L1440 100 L1440 160 L0 160 Z"
          fill="var(--ridge)"
        />
      </svg>
    </div>
  );
}
