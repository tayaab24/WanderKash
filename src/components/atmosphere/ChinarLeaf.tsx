/**
 * Thin line-art chinar (Oriental plane) leaf: five pointed lobes with veins.
 * Decorative only; colour comes from currentColor (set accent at ~8% by the caller).
 */
export default function ChinarLeaf({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.6}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={`pointer-events-none ${className}`}
    >
      {/* Outline */}
      <path d="M50 76 Q40 76 30 73 L6 61 L16 57 L24 52 L10 40 L15 25 L24 31 L36 38 L33 22 L42 18 L50 4 L58 18 L67 22 L64 38 L76 31 L85 25 L90 40 L76 52 L84 57 L94 61 L70 73 Q60 76 50 76 Z" />
      {/* Stem */}
      <path d="M50 76 Q49 86 51 97" />
      {/* Main veins */}
      <path d="M50 76 L50 10" />
      <path d="M50 70 L17 29" />
      <path d="M50 70 L83 29" />
      <path d="M50 73 L10 59" />
      <path d="M50 73 L90 59" />
      {/* Side veins */}
      <path d="M50 40 L42 30 M50 40 L58 30 M50 55 L40 47 M50 55 L60 47" />
      <path d="M33 50 L27 44 M67 50 L73 44 M30 64 L24 62 M70 64 L76 62" />
    </svg>
  );
}
