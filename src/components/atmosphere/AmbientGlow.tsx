import type { CSSProperties } from "react";

export type Glow = {
  tone: "warm" | "cool";
  /** Position + size utilities, e.g. "-left-[10%] top-0 w-[70vw] max-w-[900px]" */
  className: string;
  /** Drift loop length in seconds (30-60) */
  duration?: number;
  /** Strength, as % of the token mixed into transparent (defaults: warm 8, cool 12) */
  strength?: number;
};

const TOKEN = { warm: "var(--color-accent)", cool: "var(--color-teal)" };

/**
 * Large, soft radial glows behind a section's content. Soft falloff comes from the
 * gradient itself (no CSS blur filter), and only `transform` animates.
 * Parent must be `relative isolate`.
 */
export default function AmbientGlow({ glows }: { glows: Glow[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip"
    >
      {glows.map((g, i) => (
        <div
          key={i}
          className={`ambient-drift absolute aspect-square rounded-full ${g.className}`}
          style={
            {
              background: `radial-gradient(closest-side, color-mix(in srgb, ${TOKEN[g.tone]} ${g.strength ?? (g.tone === "warm" ? 8 : 12)}%, transparent), transparent)`,
              animationDuration: `${g.duration ?? 45}s`,
              animationDelay: `${-i * 7}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
