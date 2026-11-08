import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** Shared heading style for home sections: small eyebrow label + serif heading. */
export default function SectionHeading({
  eyebrow,
  title,
  subline,
  action,
  className = "mb-14",
}: {
  eyebrow: string;
  title: ReactNode;
  subline?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-6 ${className}`}
    >
      <Reveal className="max-w-2xl">
        <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.3em] text-accent-text">
          {eyebrow}
        </p>
        <h2 className="text-[clamp(1.7rem,3.3vw_+_0.85rem,2.5rem)] font-display font-semibold leading-[1.15] tracking-[0.03em]">
          {title}
        </h2>
        {subline && <p className="mt-4 text-lg text-muted">{subline}</p>}
      </Reveal>
      {action}
    </div>
  );
}
