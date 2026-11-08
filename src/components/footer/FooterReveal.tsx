"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Gentle fade-up when the footer scrolls into view; instant for reduced motion. */
export default function FooterReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.9, ease: EASE }
      }
    >
      {children}
    </motion.div>
  );
}
