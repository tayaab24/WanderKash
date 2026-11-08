@AGENTS.md

# WanderKash: design notes

## Fonts

Headings: Cinzel (`font-display`, 600 for section headings and names, 700 for the hero and CTA;
letter-spacing ~0.03em, never negative; line-height ~1.15). Use it only for the logo, hero, page
`h1`s and section `h2`s, destination and season names, the CTA and the footer wordmark; never
under 20px, for numbers, or for long sentences. Body: Archivo (`font-sans`) for everything else:
400 body (line-height 1.65), 500 buttons/nav/labels, 600 small titles, 700 totals.
Prices and numbers use `tabular-nums`.

## Palette: "Sunset over Dal Lake"

Taken from the hero photo: warm haze cream page, cloud slate-blue text, sky-amber accents, and a
few dark slate bands for contrast. All colours are Tailwind tokens in `src/app/globals.css`
(`@theme`). Use the tokens (opacity modifiers or `color-mix()` if needed), never raw hex values,
and never pure black or white.

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#F6EEE3` | Page background (warm haze cream) |
| `surface` | `#FCF7F0` | Cards, panels, navbar when scrolled |
| `surface-hover` | `#F1E5D4` | Hover states |
| `line` | `#E3D3BC` | Borders, dividers |
| `fg` | `#2F3A4B` | Main text (cloud slate-blue) |
| `muted` | `#5F6470` | Secondary text |
| `accent` | `#E9A55B` | Sky amber: button fills, highlights, badges |
| `accent-hover` | `#E39A4E` | Accent fill hover |
| `accent-text` | `#9A5119` | Links and accent-coloured text on light backgrounds |
| `on-accent` | `#2F3A4B` | Text on accent fills (never re-scoped) |
| `warn` | `#A8452A` | Off-season warnings |
| `deep` | `#2F3A4B` | Dark band background (cloud slate) |
| `deep-fg` | `#F6EEE3` | Text on dark bands |
| `deep-muted` | `#B8C0CC` | Secondary text on dark bands |
| `deep-accent` | `#F2C27E` | Links and highlights on dark bands |

How it fits together:

- **Dark scopes**: add `on-dark` to a dark band or a container of text over a photo. It re-points
  `fg`, `muted`, `accent-text` and `line` to their `deep-*` values, so `text-fg`, `text-muted`,
  `text-accent-text`, secondary buttons and focus rings adapt automatically. Use `on-light` to
  reset a light card that sits inside a dark scope.
- **Home rhythm**: light sections alternate `bg` / `surface` (Intro, Seasons, Stacked destinations,
  Quick planner, Right now, How it works, FAQ); dark `deep` bands for Ready-made trips, Beyond the
  views and the footer. `MountainDivider from=… to=…` softens each light/dark change.
- **Photos**: text stays `deep-fg` (via `on-dark`) over slate overlays of `deep` at 35-60%,
  darker only where the text sits. Photo cards get a warm shadow (`fg` at 10-12%).
- **Buttons** (`src/lib/ui.ts`): primary = `accent` fill + `on-accent` text, `accent-hover` on hover;
  secondary = transparent with an `fg` border (`deep-fg` inside `on-dark`).
- **Navbar**: cream text + slate scrim only over hero photos (home, destination pages); otherwise
  and once scrolled, `surface` with blur, `fg` text and a `line` border.
- **Atmosphere**: no grain; ambient glows are static soft amber (`accent` ~12%) on light sections only.
- Form controls use `border-muted/80` so their edges reach 3:1 on cream.
- `src/app/icon.svg` and `themeColor` in `layout.tsx` can't read CSS variables; keep their hex in sync.

Contrast (WCAG AA): `fg` 10.0:1 on `bg` / 10.8:1 on `surface`; `muted` 5.2 / 5.6; `accent-text`
5.1 / 5.5; `warn` 5.1 / 5.6; `on-accent` on `accent` 5.5:1; on `deep`: `deep-fg` 10.0:1,
`deep-muted` 6.3:1, `deep-accent` 7.0:1.

## Motion

- One scroll system: `lenis/react` (`ReactLenis root`, `autoRaf: false`) driven by framer-motion's
  `frame.update`, so Lenis and every `useScroll` value share one clock. Reduced motion: no Lenis,
  no scroll-linked animation.
- One motion system: `src/lib/motion.ts` (`EASE` [0.22, 1, 0.36, 1]; `DURATION` fast 0.2 / base 0.5
  / slow 0.9; `REVEAL_Y` 20px; `STAGGER` 0.07, max 5) and the `--ease-soft` /
  `--default-transition-duration` tokens in CSS. Use `<Reveal>` for the one standard reveal.
- Animate only `transform` and `opacity`. Reveal section headings, key images and card groups once;
  body text, labels and small UI appear without animation. One motion per element; no springs,
  rotation, blur-in or text scale. Hovers: images scale to 1.03 over 0.6s; buttons change colour.
