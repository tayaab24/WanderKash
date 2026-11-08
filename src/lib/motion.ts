/**
 * One motion system for the whole site. CSS uses the matching tokens in globals.css
 * (--ease-soft, --default-transition-duration), so JS and CSS animations feel the same.
 */

/** Soft "ease out" used everywhere (matches --ease-soft in CSS). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Durations in seconds. */
export const DURATION = {
  /** Hover, press, small UI state changes */
  fast: 0.2,
  /** Menus, dialogs, accordions, step changes */
  base: 0.35,
  /** Scroll-in reveals */
  reveal: 0.8,
} as const;
