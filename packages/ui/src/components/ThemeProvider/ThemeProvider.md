---
component: ThemeProvider
category: Foundations
import: "import { ThemeProvider, useTheme } from '@smarta/ui'"
similar: []
tokens_only: true
---

# ThemeProvider

Owns a theme scope: which product's tokens resolve, and in which mode.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to ThemeProvider.

## Use it when

- Once, at the root of a product, with `asRoot` so the attributes land on `<html>`.
- Around a preview, an embedded surface, or a Storybook cell that must render in a different product or mode than the page around it.

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `product` | `"webapp" \| "backoffice"` | no | `"webapp"` | |
| `theme` | `"light" \| "dark"` | no | — | **Omit to follow `prefers-color-scheme`.** |
| `asRoot` | `boolean` | no | `false` | Sets the attributes on `<html>` instead of rendering a wrapper. |

## How resolution works

```
data-product  →  which brand    (plum / grayscale)
data-theme    →  which mode     (light / dark; absent = system)
```

Both are plain HTML attributes, and every token is an inherited custom property. So:

- Nesting works, and an inner provider wins.
- Four combinations can sit on one page at once — which is exactly what the Storybook "Compare" toolbar does.
- An explicit `data-theme` always beats `prefers-color-scheme`, in both directions.

## Rules

1. **Use `asRoot` in a real application.** A wrapper `<div>` around the whole app is one more element between `<body>` and the layout.
2. **Omit `theme` to respect the operating system.** Pin it only where the user has chosen.
3. **`useTheme()` is a last resort.** The point of the token layer is that a component looks right in either product without asking which one it is in. When a *behaviour* genuinely differs, prefer adding a token — `--link-decoration` is the worked example — over branching on `product`.
4. **Never read `product` to pick a colour.** That is what the semantic layer is for, and it is how the library stops being two libraries.

## Examples

```tsx
// A product, at the root
<ThemeProvider asRoot product="backoffice" theme={userChoice}>
  <App />
</ThemeProvider>

// A preview of the other product, inside this one
<ThemeProvider product="webapp" theme="dark" className="rounded-lg p-4">
  <ReceiptCard />
</ThemeProvider>
```

## Related

`@smarta/tokens` · every component in the library
