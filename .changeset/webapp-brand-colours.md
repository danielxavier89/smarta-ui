---
"@smarta/ui": minor
---

**The webapp takes the smarta brand guidelines' colours, and stays clearly
different from the backoffice.**

The webapp's magenta (`#9B3F92`) and plum greys are gone. They were not brand
colours, and the team found them too pink.

- **Deep Purple `#280028`**, the guidelines' primary, is the webapp's text,
  primary buttons, links and focus ring. Its pale greys are Deep Purple mixed
  with white, the way the guidelines build their tint strip, so pages read
  neutral rather than pink.
- **Lime and Lime Extra** mark selection: selected rows and options, avatars,
  the current page in pagination and in the navigation. Dark mode tints
  selected rows purple and keeps Lime for the text and the nav pill.
- **Lavender** is now only the dark-mode button fill.
- **AppShell's navigation is Deep Purple in the webapp**, with a Lime Extra pill
  on the current page. A new `.sui-nav-surface` scope re-points the ordinary
  tokens inside the sidebar, top bar and drawer, so anything a product puts
  there renders correctly on Deep Purple. New `--nav-*` tokens back it.
- **The backoffice is unchanged** apart from AppShell's top bar, which is now
  solid white instead of a translucent canvas tint.
- **Links are underlined in the webapp too.** Deep Purple links in Deep Purple
  text have no hue left to stand out with.
- **Fonts follow the guidelines**: `--font-sans` names Euclid Circular A, then
  Poppins, then Arial. A new `--font-display` (`sui:font-display`) names Ulm
  Grotesk for `PageHeader` titles and `StatCard` figures. Neither font is
  loaded by the library. A product that self-hosts them sets
  `--smarta-font-product` / `--smarta-font-display`.

**What to do:** nothing, unless a product read the removed primitives
(`--p-plum-*`, `--p-magenta-*`), which components never should. Use the
semantic tokens, or `--p-purple-*` and the named brand colours.
