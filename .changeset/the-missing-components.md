---
"@smarta/ui": minor
---

**The components the products' remaining screens need, and Formik.**

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

- **`Button asChild` and `IconButton asChild` threw** ("Slot failed to slot onto
  its children") whenever there was an icon. The child now becomes the button
  with the icon inside it.
