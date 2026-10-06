---
"@smarta/ui": minor
---

**Follow-ups from the review.**

- **The library inherits the product's font.** Unless `--smarta-font-product`
  is set, components render in the host page's own font, with nothing to
  configure. Before, the fallback named Plus Jakarta Sans, which nobody loads,
  so a product that hadn't set the variable silently got the system font. Pages
  the library owns outright (`asRoot` with `reset.css`) still fall back to the
  system face, because there is no host font to inherit.

  **What to do:** nothing, if the product's font is what you want. To give the
  library a face of its own, set `:root { --smarta-font-product: "…"; }`.

- **`labelsDe`: every label in German**, typed as the full set:
  `<ThemeProvider labels={labelsDe} locale="de-DE">`.
- **The calendar's month navigation is named** ("Change month", or the
  `calendarNavigation` label). It used to be announced as just "navigation".
- **`styles.css` ships a sourcemap**, `styles.css.map`, with relative source
  paths.
- **Breaking: `TR`'s `clickable` prop is removed.** It gave a row the look of
  being pressable without the keyboard support. It had been deprecated since
  0.2.

  **What to do:** replace `clickable` (with its hand-written `tabIndex`,
  `onClick` and `onKeyDown`) with `onActivate`.
