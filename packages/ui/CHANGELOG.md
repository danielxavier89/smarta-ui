# @smarta/ui

## 0.2.0

### Minor Changes

- c781a1a: **The first version a product can install.** A minor bump rather than a major
  because the package is still 0.x and has never been published, so there is no
  installed base to break — but if you were consuming it from the workspace, read
  "What to do" under each change.

  ### It installs

  - **Built output.** ESM, CJS, `.d.ts` and `.d.cts`, sourcemaps, and compiled
    CSS in `dist/`. It used to be `private: true` and point at raw TypeScript,
    which every product's bundler skips. `exports` routes `import` and `require`
    to their own declarations, so CommonJS consumers on `node16` resolution work.
  - **`@smarta/tokens` is inlined**, not a dependency — it is never published.
  - **Runtime dependencies stay external**, so a product that also uses Radix gets
    one copy of it, and one copy of its React contexts.

  ### It shares a page

  - **Every utility is prefixed: `sui:flex`.** The webapp's own Tailwind also
    defines `.text-base`, at a different size, and without the prefix whichever
    stylesheet loaded last restyled the other's elements.
  - **Everything is scoped under a `.smarta-ui` root**, which `ThemeProvider`
    renders and `ThemeScope` adds inside portals. Nothing in `styles.css` paints
    outside it.
  - **The CSS ships unlayered, on a deliberate specificity ladder.** Bootstrap's
    reboot and Ant Design's globals are unlayered and used to beat everything the
    library shipped in `@layer` — every `CardTitle` in the backoffice rendered at
    28px. Now host element rules sit below the library's scoped base, host
    classes above it, and the library's utilities above both.
  - **Tailwind's preflight is no longer in `styles.css`.** The library gets it
    scoped to `.smarta-ui`, generated from Tailwind's own file.
  - **The focus ring survives Ant Design's `a:focus { outline: 0 }`.**

    **What to do:** a screen being migrated inside Ant Design or Bootstrap wraps
    itself in a plain `<ThemeProvider>`. Keep `asRoot` for a page the library
    owns, and add `import "@smarta/ui/reset.css"` there. To restyle a component,
    write CSS one class more specific than the library's — see "Overriding a
    component" in the README. `className` still works for anything that only
    adds (a margin), not for overriding what the component sets.

  ### It speaks German

  - **`ThemeProvider` takes `labels`**, overriding every word a component says on
    its own behalf — a close button's accessible name, a spinner, the pagination
    landmark, a table's scroll region. English fills the gaps. Interpolated
    labels are functions, so word order is yours.
  - **Formatting helpers** for `de-DE`, `pt-PT` and `en-GB`: `formatCurrency`,
    `formatSignedCurrency`, `formatNumber`, `formatPercent`, `formatFileSize`,
    `formatDate`, `formatDateTime`, `formatMonth`, `formatRelativeDay`.

  ### It is accessible where it was not

  - **`TR` gains `onActivate`**: the appearance, `tabIndex`, click and Enter/Space
    in one prop, without double-firing on a button, link, menu or `Checkbox`
    label inside the row, and without a negative `tabIndex` taking the row out of
    reach.
  - **A `Table` wider than its card** becomes a named, focusable scroll region
    while it overflows, so a keyboard user can scroll it.
  - **`Dropzone`** is a `<label>` owning a real file input; its hint describes the
    input without joining its name.
  - **`Progress`** is named by its visible label when it shows one.
  - **`PanelSection` headings are `<h3>`**, under the panel's `<h2>`.
  - **`CardTitle` takes `as`**, so a card can sit at the right heading level.
  - **`Button`'s `loadingLabel`** is announced even when the caller set an
    `aria-label`.
  - **The backoffice's quiet text grey** is darker — `#686868`, from `#6E6E6E` —
    because it measured 4.24:1 on a selected row.

  ### Deprecated

  - **`TR`'s `clickable`.** It gives a row the look of being pressable without
    making it so. It still renders, and warns in development.

    **What to do:** replace `clickable tabIndex={0} onClick={…} onKeyDown={…}`
    with `onActivate={…}`.

  ### Changed

  - **The font is inherited, not fetched.** `--font-sans` falls back through
    `--smarta-font-product` to the product's own font. Set
    `:root { --smarta-font-product: "…" }` to choose.
  - **The design tokens live on `[data-product]`, not `:root`**, so importing the
    stylesheet no longer sets `color-scheme` on the whole document. A component
    rendered outside any `ThemeProvider` now has no tokens rather than
    webapp-light ones.

- 05d0643: **The components the products' remaining screens need, and Formik.**

  ### New components

  - **`InputNumber`** — a number typed in the locale (`9,50` in German), read on
    blur, clamped and rounded; arrow keys and optional steppers; `role="spinbutton"`.
  - **`CurrencyInput`** — `InputNumber` with two decimals and the currency symbol
    where the locale puts it.
  - **`DatePicker`** — a date typed in the locale's order (`03.06.2026`) or picked
    from a calendar. Refuses dates that do not exist instead of rolling them over;
    `min`, `max` and `isDisabled`; the calendar's names come from `labels`.
  - **`DateRangePicker`** — a period on a two-month calendar, with the product's
    own presets.
  - **`Combobox`** — one option out of a long list, type to narrow (ignoring case
    and accents), server search with `filter={false}`. Built on downshift.
  - **`MultiSelect`** — several options as removable tags; the list stays open
    between choices.
  - **`Upload`** — a Dropzone with each file's size, status in words, progress,
    retry and remove; arrivals and failures announced. The product does the
    uploading.
  - **`FilePreview`** — an image or PDF in place, with "open in a new tab" and
    download, and a fallback that still offers the file.
  - **`DataTable`** — `Table` plus sorting (locale collation), selection with a
    header checkbox and bulk actions, activatable rows, loading, error, required
    empty state, and client or server pagination.
  - **`PageHeader`** — the page's h1, breadcrumbs or a back link, a line on where
    things stand, and the primary action.
  - **`AppShell`**, **`NavItem`**, **`NavGroup`** — skip link, main navigation,
    top bar and `<main>`; a drawer on a phone.

  ### Formik

  - **`@smarta/ui/formik`**, a second entry: `useFormikField`, `useFormikValue`,
    `useFormikCheckbox` and `useFormikSubmit` return a field's props with the
    error shown the house way (on blur, then live; everything on submit). Formik
    is an optional peer dependency.

  ### Changed

  - **`ThemeProvider` takes `locale`** (default `en-GB`), read by every field that
    parses or formats; `useLocale()` reads it. A nested `ThemeProvider` inherits
    whatever it does not set — product, theme, locale and labels — rather than
    resetting them.
  - **`--z-dropdown` is 55, above dialogs and panels**, from 20. A menu or calendar
    opened inside a Panel or Dialog rendered behind it.
  - **New labels** for every name the new components say on their own: calendar
    navigation, date messages, option lists, upload states, file actions, table
    selection, breadcrumbs and navigation. Translate them in `labels`.
  - **`parseNumber`, `parseDate`, `isValidDate`, `numberSeparators`, `dateOrder`**
    are exported, so a product reads input the same way the fields do.

  ### Fixed

  - **`Button asChild` and `IconButton asChild` always threw** ("Slot failed to
    slot onto its children"): the child was handed to Radix Slot beside the icon
    slots, and an empty slot still counts as a child. The child now becomes the
    button with the icon inside it.

- 0338e44: **The webapp takes the brand guidelines' primary colour, Deep Purple, on light
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
