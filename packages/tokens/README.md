# @smarta/tokens

Three layers, in this order. The order is the whole design.

```
primitives.css   raw ramps            --p-plum-600, --p-grey-800, --p-green-tint
semantic.css     jobs, per product    --canvas, --fg-muted, --accent, --ok-bg
foundation.css   non-colour scales    type, radius, elevation, density, layering
theme.css        Tailwind bridge      --color-canvas: var(--canvas)
reset.css        page-level defaults  body, focus, reduced motion, touch targets
```

## Why three layers

A component that reads `--p-plum-600` is hardcoded to the webapp in light mode.
A component that reads `--fg-muted` is not. The primitive layer exists so that
the semantic layer has something to point at — and so that "is this component
themeable?" is answerable by grep.

**Components may only read the semantic layer.** `theme.css` is the enforcement:
it lists every colour a Tailwind utility can reach, and nothing else resolves.

## Resolution

```
[data-product]  webapp | backoffice
[data-theme]    light | dark | absent (follow the OS)
```

Both inherit, so they can sit on `<html>`, on a `<body>`, or on any wrapper — which
is how Storybook puts four combinations on one page. An explicit `data-theme` beats
`prefers-color-scheme` in both directions.

`:root` falls back to webapp light, so a page that forgets the attributes still
renders something coherent rather than unstyled.

## What differs between the products

| | webapp | backoffice |
|---|---|---|
| Brand | plum + magenta | grayscale |
| Accent in dark | light magenta, dark text on it | near-white, dark text on it |
| Links | no underline | **underlined** — no hue left to signal with |
| Control heights | 30 / 36 / 42 | 28 / 34 / 40 |
| Row density | 12 × 20 | 10 × 16 |
| Shadow tint | plum | neutral |
| Status colours | identical — meaning, not brand |

Only one of these is a *behaviour* rather than a value: `--link-decoration`. That is
deliberate. When the two products genuinely need to behave differently, add a token
rather than a branch, so components never ask which product they are in.

## Accessibility notes baked into the values

- `--fg-subtle` is the quietest colour that still carries text. `--fg-faint` is
  decoration only — dots, empty-state icons, hover borders — and never a word.
- Light status colours are nudged darker than a naive ramp so a 12px chip clears
  4.5:1 against **its own tint**, not merely against white.
- `--accent` (a fill) and `--link` (the same brand as text) are separate tokens,
  because a fill and a glyph need different contrast against different grounds.
- **In dark mode the accent inverts in both products**: a light fill carrying dark
  text. A mid-tone fill with white text measured 4.35:1, and its hover — being
  lighter — was worse. A light fill gets *better* on hover instead of worse.
- Every one of these is checked, not asserted: `npm run audit:contrast` measures
  all 104 text/background pairs across the four themes and fails below 4.5:1. It
  found two real defects the first time it ran.

## Importing

```css
@import "tailwindcss";
@import "@smarta/tokens/css";
```

In TypeScript, `@smarta/tokens` exports `Product`, `Theme`, `themeAttributes()`,
and the `COLOR_TOKENS` / `SCALE_TOKENS` metadata that the Storybook token sheet
renders from — so the documentation cannot drift from the list.


## Checks

```sh
npm run audit:contrast   # 104 pairs x 4 themes against WCAG AA, plus a drift check
npm run lint:tokens      # no hardcoded colour anywhere in packages/ui/src
npm run check            # typecheck + both of the above
```

The drift check exists because the `prefers-color-scheme` fallback has to repeat
the explicit `[data-theme="dark"]` values — CSS cannot say "this media query OR
this attribute" in one place. Duplication nobody checks is duplication that
diverges, and the resulting bug is visible only to users who never touched the
toggle.

## A possible simplification

`light-dark()` would collapse each token to one declaration and remove the
fallback duplication entirely:

```css
[data-product="webapp"] { color-scheme: light dark; --canvas: light-dark(#FBF9FB, #17121A); }
[data-product="webapp"][data-theme="light"] { color-scheme: light }
[data-product="webapp"][data-theme="dark"]  { color-scheme: dark }
```

It is baseline-available in every browser these products support. It was not done
here only because it is a rewrite of a file that is now measured and passing; the
drift check covers the risk in the meantime.
