"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { DURATION, reveal, revealTransition } from "@/lib/motion";

/**
 * The one reveal used across the site: fade + 20px rise, once.
 * Use for section headings, key images and card groups only.
 * (Reduced motion: the global MotionConfig drops the movement; opacity is instant.)
 */
export default function Reveal({
  children,
  className,
  index = 0,
  duration = DURATION.base,
}: {
  children: ReactNode;
  className?: string;
  /** Position in a staggered group (0-based) */
  index?: number;
  duration?: number;
}) {
  return (
    <motion.div {...reveal} transition={revealTransition(index, duration)} className={className}>
      {children}
    </motion.div>
  );
}
