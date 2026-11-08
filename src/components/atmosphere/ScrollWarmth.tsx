"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fixed page-level glow behind everything on the home page: warm gold near the top,
 * easing to a cooler slate further down. Only opacity changes with scroll.
 */
export default function ScrollWarmth() {
  const { scrollYProgress } = useScroll();
  const warm = useTransform(scrollYProgress, [0, 0.55], [1, 0.15]);
  const cool = useTransform(scrollYProgress, [0.25, 1], [0, 1]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <motion.div
        style={{ opacity: warm }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_30%_15%,color-mix(in_srgb,var(--color-accent)_9%,transparent),transparent_70%)]"
      />
      <motion.div
        style={{ opacity: cool }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_85%,color-mix(in_srgb,var(--color-muted)_8%,transparent),transparent_70%)]"
      />
    </div>
  );
}
