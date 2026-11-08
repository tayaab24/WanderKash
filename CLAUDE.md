@AGENTS.md

# WanderKash: design notes

## Fonts

Headings: Playfair Display (`font-display`, weight 600-700). Body: Lato (`font-sans`, 400 and 700 only;
never use `font-medium`/`font-semibold` on Lato text). Prices and numbers use `tabular-nums`.

## Palette: "Dal Lake at dusk"

Deep blue-teal grounds that contrast with the warm sunset photography. All colours are
Tailwind tokens defined in `src/app/globals.css` (`@theme`). Use the tokens (with opacity
modifiers or `color-mix()` if needed), never raw hex values, and never pure black or white.

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#0E1A22` | Deep lake blue: page background |
| `surface` | `#15252F` | Cards, navbar, panels |
| `surface-hover` | `#1C303C` | Hover states |
| `line` | `#2A4150` | Borders, dividers (decorative) |
| `fg` | `#F1ECE2` | Main text, warm cream |
| `muted` | `#9FB0BA` | Secondary text, cool grey-blue |
| `accent` | `#E3B26A` | Saffron: buttons, links, highlights |
| `accent-hover` | `#EEC585` | Accent hover |
| `warn` | `#E08B67` | Off-season warnings |

Helper tokens derived from the palette:

| Token | Hex | Use |
| --- | --- | --- |
| `bg-lift` | `#12222C` | Lighter teal in the page background gradient |
| `teal` | `#2E6A7A` | Cool ambient glow (~12% opacity) |
| `shade` | `#071016` | Shadows |

Rules of thumb:

- Page background is a subtle `bg` → `bg-lift` → `bg` gradient on `<html>`, not a flat colour.
- Ambient glows: warm = `accent` at ~8%, cool = `teal` at ~12% (`AmbientGlow`, `ScrollWarmth`).
- Image overlays fade into `bg` so photos blend into the page.
- Buttons (`src/lib/ui.ts`): primary = `accent` fill with `bg` text; secondary = transparent with an `fg` border.
- Form controls (selects, inputs, steppers) use `border-muted/60` so their edges reach 3:1; dividers use `line`.
- `src/app/icon.svg` and the `themeColor` in `layout.tsx` can't read CSS variables; keep their hex values in sync with the tokens.

Contrast (WCAG): `fg` 15.0:1 on `bg`, 13.3:1 on `surface`; `muted` 7.9:1 on `bg`, 7.0:1 on
`surface`; `accent` 9.1:1 on `bg`; `bg` text on `accent` 9.1:1. All pass AA.

## Motion

One easing and duration set: `src/lib/motion.ts` (JS) and the `--ease-soft` /
`--default-transition-duration` tokens (CSS). Animate only `transform` and `opacity`, and
respect `prefers-reduced-motion`.
