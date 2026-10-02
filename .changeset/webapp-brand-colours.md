---
"@smarta/ui": minor
---

**The webapp takes the brand guidelines' primary colour, Deep Purple, on light
grey.**

The magenta (`#9B3F92`) and plum-tinted greys were not brand colours, and the
team found the muted pink too much.

- **Light mode:** Deep Purple `#280028` is used for primary buttons, checked
  states, links, the focus ring and tooltips. Text uses Deep Purple and its
  tints. The page, wells, borders, the selected pill and the row tint are plain
  light grey.
- **Dark mode:** surfaces are Deep Purple taken towards black. The primary fill
  is Lavender with Deep Purple text, as the guidelines pair them.
- **Links in the webapp are now underlined.** Deep Purple links in Deep Purple
  text have no hue left to stand out with.
- **The backoffice is unchanged.**

**What to do:** nothing, unless a product read the removed primitives
(`--p-plum-*`, `--p-magenta-*`), which components never should. Use the
semantic tokens, or `--p-purple-*` and the named brand colours (`--p-lavender`,
`--p-coral`, `--p-lime`, `--p-lime-extra`).
