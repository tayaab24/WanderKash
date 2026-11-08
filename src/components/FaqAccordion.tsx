"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { EASE } from "@/lib/motion";
import type { Block, FaqItem, Inline } from "@/data/faq";

function Parts({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((x, i) =>
        typeof x === "string" ? (
          <span key={i}>{x}</span>
        ) : (
          <Link
            key={i}
            href={x.href}
            className="text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent-text hover:decoration-accent-text"
          >
            {x.text}
          </Link>
        )
      )}
    </>
  );
}

function Answer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-3xl space-y-4 pb-6 leading-relaxed text-muted">
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i}>
            <Parts parts={b.parts} />
          </p>
        ) : (
          <div key={i}>
            <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.2em] text-accent-text">
              {b.title}
            </p>
            <ul className="space-y-1.5">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line" />
                  <span>
                    <Parts parts={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}

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
                  className={`text-xl font-bold leading-[1.1] tracking-[-0.02em] transition-colors md:text-2xl ${
                    open ? "text-accent-text" : "text-fg group-hover:text-accent-text"
                  }`}
                >
                  {item.question}
                </span>
                {/* Plus that rotates into a minus */}
                <span
                  aria-hidden
                  className="relative h-8 w-8 shrink-0 rounded-full border border-line transition-colors group-hover:border-accent"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-accent-text" />
                  <span
                    className={`absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-accent-text transition-transform duration-300 motion-reduce:transition-none ${
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
                  transition={{ duration, ease: EASE }}
                  className="overflow-hidden"
                >
                  <Answer blocks={item.answer} />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
