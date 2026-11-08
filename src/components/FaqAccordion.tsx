"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { FaqItem } from "@/data/faq";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.35;

  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `faq-q-${item.id}`;
        const panelId = `faq-a-${item.id}`;

        return (
          <li key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={`font-serif text-xl transition-colors md:text-2xl ${
                    open ? "text-accent" : "text-fg group-hover:text-accent"
                  }`}
                >
                  {item.question}
                </span>
                {/* Plus that rotates into a minus */}
                <span
                  aria-hidden
                  className="relative h-8 w-8 shrink-0 rounded-full border border-line transition-colors group-hover:border-accent"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-accent" />
                  <span
                    className={`absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-accent transition-transform duration-300 motion-reduce:transition-none ${
                      open ? "rotate-0" : "rotate-90"
                    }`}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 leading-relaxed text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
