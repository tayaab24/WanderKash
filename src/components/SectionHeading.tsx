import type { ReactNode } from "react";

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
      <div className="max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-serif text-[clamp(2rem,4vw_+_1rem,3rem)] leading-tight">
          {title}
        </h2>
        {subline && <p className="mt-4 text-lg text-muted">{subline}</p>}
      </div>
      {action}
    </div>
  );
}
