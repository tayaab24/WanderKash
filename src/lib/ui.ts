/**
 * Shared interactive styles, so every button looks and behaves the same:
 * 44px minimum height, the same radius, hover, pressed (scale) and focus states
 * (focus ring comes from the global :focus-visible rule in globals.css).
 * Timing comes from the theme defaults (200ms, --ease-soft).
 */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-7 text-sm transition-[color,background-color,border-color,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

export const btn = {
  /** Solid accent: the main action on a screen */
  primary: `${base} bg-accent font-semibold text-bg hover:bg-accent-hover`,
  /** Outline: secondary actions */
  secondary: `${base} border border-fg bg-transparent font-medium text-fg hover:border-accent hover:text-accent`,
};

/** Standard card surface. */
export const card = "rounded-2xl border border-line bg-surface";
