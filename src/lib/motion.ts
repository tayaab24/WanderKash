/**
 * The WanderKash motion system: one curve, three durations, one distance.
 * Used by every JS animation; CSS mirrors it with --ease-soft and the
 * --default-transition-duration token in globals.css.
 *
 * Principles: animate only transform and opacity; reveal headings, key images and
 * card groups once (never body text or small UI); no springs, rotation, blur-in or
 * text scale; one motion per element.
 */

/** Soft "ease out" used everywhere (matches --ease-soft in CSS). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Durations in seconds. */
export const DURATION = {
  /** Hovers and small state changes */
  fast: 0.2,
  /** Reveals, menus, step changes */
  base: 0.5,
  /** Hero headline and big images */
  slow: 0.9,
} as const;

/** The only reveal distance (px). */
export const REVEAL_Y = 20;

/** Stagger between items in a group, and the most items that ever stagger. */
export const STAGGER = 0.07;
export const MAX_STAGGERED = 5;

/** Delay for item `i` in a staggered group (items past the cap share the last delay). */
export const staggerDelay = (i: number) => Math.min(i, MAX_STAGGERED - 1) * STAGGER;

/** Standard reveal: fade + 20px rise, once, when ~20% is in view. */
export const reveal = {
  initial: { opacity: 0, y: REVEAL_Y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
} as const;

export const revealTransition = (i = 0, duration: number = DURATION.base) => ({
  duration,
  delay: staggerDelay(i),
  ease: EASE,
});
