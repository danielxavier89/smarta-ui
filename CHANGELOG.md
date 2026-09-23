# Changelog

Kept by hand, in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
order, and versioned per [SemVer](https://semver.org/) — with the readings of
minor and major that matter for a design system written down in
[docs/OWNERSHIP.md](docs/OWNERSHIP.md).

Entries are written for the person upgrading. "Refactored Table" tells them
nothing; "a clickable row now needs `onActivate`" tells them what to change.

## Unreleased

### Added

- **The package builds.** `@smarta/ui` now emits ESM, CJS, `.d.ts` and
  sourcemaps to `dist/`, plus compiled CSS. It could not be installed before:
  it was `private: true` and pointed at raw TypeScript, which every product's
  bundler skips.
- **`@smarta/ui/reset.css`**, the page-level reset, as a separate opt-in
  import.
- **Labels.** Everything the library says on its own behalf — a close button's
  accessible name, a spinner's announcement, the pagination landmark — is
  overridable through `ThemeProvider`'s `labels` prop. English is the fallback.
  `useLabels()`, `SmartaLabels`, `defaultLabels`, `mergeLabels`.
- **Formatting helpers**: `formatCurrency`, `formatSignedCurrency`,
  `formatNumber`, `formatPercent`, `formatFileSize`, `formatDate`,
  `formatDateTime`, `formatMonth`, `formatRelativeDay`. For `de-DE`, `pt-PT`
  and `en-GB`. Components still never format — these are for the product to
  call before the value reaches one.
- **`TR`'s `onActivate`**, which makes a row activatable by mouse *and*
  keyboard in one prop.
- **`CardTitle`'s `as`**, so a card can sit at the right heading level.
- **Tests and CI.** 82 tests covering keyboard, focus, overlays, forms, upload,
  disabled and loading states and the providers; axe over a composed surface in
  all four product/mode combinations; a consumer smoke build against Webpack
  and Vite. All of it on every pull request.

### Changed

- **The stylesheet no longer restyles the page it lands on.** `styles.css` used
  to set `body`, every `button`/`input`/`select`/`textarea`, every
  `:focus-visible` and every element under `prefers-reduced-motion`, globally.
  Those moved to the opt-in `reset.css`. The focus ring and the reduced-motion
  rule stayed, scoped to `[data-product]`, because they are promises the library
  makes about its own components.

  **What to do:** a greenfield surface adds `import "@smarta/ui/reset.css"`
  after `styles.css`. A screen being migrated alongside Ant Design, Bootstrap
  or styled-components does not, and gets the correct behaviour by default for
  the first time.

- **The font is inherited, not loaded.** `--font-sans` now falls back through
  `--smarta-font-product` to whatever the product is already using. It was
  naming Plus Jakarta Sans while only Storybook ever fetched it, so products
  silently rendered in the system font. Set
  `:root { --smarta-font-product: "…" }` to choose.

- **`Dropzone` is a `<label>` owning a real file input**, rather than a
  `div role="button"` containing one. The old markup had no accessible name on
  the input and was nested-interactive. Its `hint` now renders outside the
  label, so it no longer joins the input's accessible name.

- **`@smarta/tokens` moved to devDependencies** of `@smarta/ui` and its types
  are inlined into the emitted declarations. It is never published, so a bare
  import of it would break every consumer's typecheck.

### Deprecated

- **`TR`'s `clickable`.** It gives a row the appearance of being pressable
  without making it so, which is the defect `onActivate` exists to remove. It
  still renders, and warns in development.

  **What to do:** replace `clickable tabIndex={0} onClick={…} onKeyDown={…}`
  with `onActivate={…}`.

### Fixed

- A row with `onActivate` no longer fires when a button, link or menu inside it
  is clicked or activated by keyboard. The hand-written version at every call
  site did fire twice.
- `KeyValue`'s info control no longer lowercases the row's key to build its
  accessible name, which was wrong in German.
