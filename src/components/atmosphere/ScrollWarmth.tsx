"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fixed page-level glow behind the home page: soft amber near the top,
 * fading out as you scroll. Only opacity changes.
 */
export default function ScrollWarmth() {
  const { scrollYProgress } = useScroll();
  const warm = useTransform(scrollYProgress, [0, 0.55], [1, 0.15]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <motion.div
        style={{ opacity: warm }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_30%_15%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent_70%)]"
      />
    </div>
  );
}
