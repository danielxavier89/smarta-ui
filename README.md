# smarta-ui

The shared design system for the two smarta products: the client-facing **webapp**
and the internal **backoffice**.

One set of components, one set of tokens, two brands and two modes. A `<Button>`
renders plum in the webapp and graphite in the backoffice, in light or dark, with
no conditional anywhere in the component — because no component in this repository
contains a colour.

```
packages/tokens     design tokens: primitives → semantics → Tailwind bridge
packages/ui         45 React components, shadcn/Radix underneath
apps/storybook      every component, with product and mode toggles
```

## If you are here to review it

Storybook is the system; this repository is where it is kept. Read it in this
order and it takes about twenty minutes:

| Where | Why |
|---|---|
| **Foundations → Start here** | The whole thing in five minutes, including the five rules that are not negotiable |
| **Recipes → A list page** | Docs tab is the written rules; Canvas tab is that screen actually running |
| **Foundations → States** | The six states every screen owes the user. The part most screens are missing |
| Any component → **Docs** tab | Especially the *Don't use it when* table, which is what prevents the usual mistake |

```sh
npm install
npm run storybook        # http://localhost:6006
```

**It builds and installs now.** `npm run build` emits ESM, CJS, `.d.ts`,
sourcemaps and compiled CSS to `packages/ui/dist`, and `npm run test:consumer`
proves it by resolving the package through its `exports` map and building a
real app with Webpack and with Vite. It is not published to a registry yet —
see [docs/OWNERSHIP.md](docs/OWNERSHIP.md), which is the short list of things
that need someone with admin on the GitHub account.

## Running it

```sh
npm install
npm run storybook        # http://localhost:6006

npm run check            # typecheck, no hardcoded colours, no hardcoded English,
                         # contrast across the four themes
npm run build            # the library, to packages/ui/dist
npm test                 # behaviour, labels, formatting, and axe
npm run test:consumer    # resolve and build the package with Webpack and Vite
npm run build-storybook
```

Node 20+. The workspace uses **npm workspaces** — no pnpm needed. CI runs
exactly the list above on every pull request; see `.github/workflows/ci.yml`.

## The four combinations

Product and mode are two independent axes, so every component has four states to
be right in. Storybook's toolbar has a control for each, plus a **Compare** control
that puts two or four of them on screen at once — which is the only reliable way to
notice that a tone drifted in one of them.

Product and mode persist as you move between stories. Compare does not: it resets
to Single on every load, so a link someone pastes you cannot leave you staring at
four panels with no idea why. Storybook defaults to webapp, light, single.

```
data-product="webapp"     data-theme="light"      plum
data-product="webapp"     data-theme="dark"       plum, inverted
data-product="backoffice" data-theme="light"      grayscale
data-product="backoffice" data-theme="dark"       grayscale, inverted
```

Omit `data-theme` and the surface follows `prefers-color-scheme`.

## Using it in a product

There are two ways in, and which one you want depends on whether this library
owns the page.

**Migrating a screen inside an existing app** — the backoffice, the webapp
today. Wrap the screen, not the app:

```tsx
// once, anywhere
import "@smarta/ui/styles.css";
import { ThemeProvider, ToastProvider, TooltipProvider } from "@smarta/ui";

<ThemeProvider product="backoffice" theme={userChoice} labels={{ close: "Schließen" }}>
  <TooltipProvider>
    <ToastProvider>
      <MigratedScreen />
    </ToastProvider>
  </TooltipProvider>
</ThemeProvider>
```

That renders a `<div class="smarta-ui">`, and everything the library paints is
scoped to it. The rest of the page — its Ant Design, its Bootstrap, its own
Tailwind — is untouched, and the library's components are untouched by them.

**A page this library owns** — something new, built on it from the start:

```tsx
import "@smarta/ui/styles.css";
import "@smarta/ui/reset.css";

<ThemeProvider asRoot product="webapp" theme={userChoice}>
  <App />
</ThemeProvider>
```

`asRoot` puts the theme on `<html>` and the `.smarta-ui` root on `<body>`, which
makes the whole document an island. Don't use it on a page that also runs Ant
Design or Bootstrap: it is exactly as invasive as it sounds.

```tsx
import { Button, Card, Chip, Table } from "@smarta/ui";
```

### Why it can share a page

Alisson's P0-2 was that this stylesheet would break the pages it lands on. It
did, and then — once the reset was split out — it was broken BY them instead,
which nobody had checked. `npm run test:coexistence` now loads the library into
a page running Ant Design 4, Bootstrap 5 and a host Tailwind, in both import
orders, and fails on any of:

- **the host changing.** Every host element computes the same styles with our
  stylesheet loaded as without.
- **us changing.** Every element of our components computes the same styles on
  that page as on a page with nothing but our CSS. This is the half that used to
  fail: Bootstrap's `h3 { font-size: 1.75rem }` rendered every `CardTitle` in the
  backoffice at 28px.
- **capture.** Host content placed inside one of our panels, carrying the host's
  own `text-base`, keeps the host's value.
- **the focus ring.** It tabs through our controls and checks the ring survives
  Ant Design's `a:focus { outline: 0 }`.

Three decisions make that hold:

1. **Every utility is prefixed** — `sui:flex`, `sui:text-base`. The webapp's own
   Tailwind also defines `.text-base`, at 16px where ours is 14px; without the
   prefix, whichever stylesheet loaded last restyled the other's elements.
2. **The CSS is unlayered.** Bootstrap's reboot and Ant Design's globals are
   unlayered, and unlayered CSS beats any cascade layer regardless of
   specificity. Inside `@layer`, the library lost every fight.
3. **A deliberate specificity ladder.** Host element rules (`h3`, `p`) sit
   below our scoped base; host *classes* (`.ant-btn`) sit above it, so an Ant
   Design button you place inside one of our panels still looks like one; our
   utilities sit above both. The full ladder is in `scripts/gen-preflight.mjs`.

### Overriding a component

`<Button className="…">` used to be the way to restyle a button. It no longer
is, and on purpose: your app's classes are your stylesheet's, ours are
`sui:`-prefixed in ours, and `cn()` will not merge across the two.

A class of yours that only ADDS something the component does not set — a
margin to space it from its neighbour, a width — works exactly as before. You
need more only to CHANGE something the component already sets. Our utilities
are a single class, so a single class of yours ties with them and the stylesheet
loaded later wins — which works if yours loads after ours, and silently doesn't
if it ever loads first. One more class wins in either order, and
`npm run test:coexistence` checks all three cases:

```css
/* styled-components */
const WideButton = styled(Button)`&& { padding-inline: 24px; }`;

/* plain CSS */
.checkout .my-wide-button { padding-inline: 24px; }
```

The `&&` is the usual styled-components idiom for exactly this, and the same
thing you would write to override Ant Design. If you are reaching for it often,
the component is missing a prop — say so.

### Two stylesheets, and which one you want

```tsx
import "@smarta/ui/styles.css";   // always: tokens and the components
import "@smarta/ui/reset.css";    // only if this library owns the page
```

`styles.css` paints nothing outside `.smarta-ui`. The build checks that against
the compiled output, not the source — it fails on any unscoped element
selector, any `:root` rule that paints, or any `color-scheme` outside the
island — because the source once gave no sign of a problem that was entirely in
the output: `@import "tailwindcss"` had kept pulling Tailwind's preflight in.

What it does still put on your document: Tailwind's theme variables, as
`--sui-*` custom properties on `:root`. They are inert and namespaced. The
semantic tokens — `--canvas`, `--fg`, `--border` — live on the `[data-product]`
element, not on `:root`, so they only exist inside an island.

`reset.css` is Tailwind's preflight plus the page-level rules — `body`, every
form control, every `:focus-visible` — for the whole document. **A page this
library owns takes it. A screen being migrated does not.** Nothing in the
library needs it.

### The font

The library names Plus Jakarta Sans and then inherits. It does not fetch it —
a request to Google Fonts from inside a component library is a CSP entry and a
privacy review the host did not ask for. Tell it what to use:

```css
:root { --smarta-font-product: "Inter", sans-serif; }   /* match the product */
:root { --smarta-font-product: "Plus Jakarta Sans"; }   /* if you self-host it */
```

During the migration the first is the right answer.

### Words the library says for itself

A close button, a spinner, the pagination landmark. They default to English and
a product overrides what it needs:

```tsx
import type { PartialLabels } from "@smarta/ui";

const de: PartialLabels = {
  close: "Schließen",
  previousPage: "Vorherige Seite",
  pageRange: (first, last, total) => `${first}–${last} von ${total}`,
};
```

Interpolated ones are functions, not templates, because word order is not
universal. Your own copy is still passed in as props, as it always was.

### Dates, numbers and money

Components never format a value — that has not changed, and it is why the
product owns the locale. What is new is that everyone can get the same answer:

```tsx
import { formatCurrency, formatDate } from "@smarta/ui";

formatCurrency(1234.56, "de-DE");   // "1.234,56 €"
formatCurrency(1234.56, "en-GB");   // "€1,234.56"
formatDate("2026-06-03", "de-DE");  // "3. Juni 2026"
```

The fields that read a value — InputNumber, CurrencyInput, DatePicker — read it
in the same locale, from `<ThemeProvider locale="de-DE">`: `9,50` and
`03.06.2026` in German, `9.50` and `03/06/2026` in English. `parseNumber` and
`parseDate` are exported for a product that needs the same reading elsewhere.

### Formik

`@smarta/ui/formik` is a second entry with one hook per kind of field. Each
returns the field's props, with the error shown the house way — silent while
typing, on blur, then live:

```tsx
import { useFormikField, useFormikValue, useFormikSubmit } from "@smarta/ui/formik";

<Input label="Email" {...useFormikField("email")} />
<CurrencyInput label="Amount" currency="EUR" {...useFormikValue<number | null>("amount")} />
<DatePicker label="Booked on" {...useFormikValue<Date | null>("bookedOn")} />
<Button type="submit" variant="primary" {...useFormikSubmit()}>Book the charge</Button>
```

Formik is an optional peer dependency: a product that never imports
`@smarta/ui/formik` never needs it installed.

## The one rule

**Components use tokens, never hardcoded values.**

Not a style preference — it is the mechanism. The moment a component contains
`#9B3F92` it belongs to the webapp in light mode, and the library becomes two
libraries. Every colour a component may use is listed in
`packages/tokens/src/theme.css`; anything not in that block cannot be reached
through a Tailwind utility, which is the enforcement.

```sh
npm run check            # typecheck + token lint + contrast audit
npm run lint:tokens      # no hardcoded colour in packages/ui/src
npm run audit:contrast   # 35 token pairs x 4 themes = 140 checks, WCAG AA
```

The contrast audit is not decoration: it found two real defects the first time it
ran — the backoffice's quiet grey at 4.0:1 on canvas, and white on the webapp's
dark accent at 4.35:1. Neither is visible by eye.

## Each component's folder holds its own rules

```
packages/ui/src/components/Button/
  Button.tsx          the component
  Button.md           when to use it, when not to, props, states, do's and don'ts
  Button.stories.tsx  every state, in every product and mode
  index.ts
```

The `.md` files are written for an AI as much as for a person: each one opens with
YAML frontmatter, then **Use it when** / **Don't use it when** with a table pointing
at the component to reach for instead. That table is the part that stops a model
picking a Chip when it wanted a Badge.

## What is in here

**Actions** Button · IconButton · TextLink
**Form** Field · Label · Input · InputNumber · CurrencyInput · DatePicker · DateRangePicker · Textarea · Select · Combobox · MultiSelect · SearchInput · Checkbox · RadioGroup · Dropzone · Upload
**Status** Chip · Badge · Avatar · Spinner · Progress · Skeleton
**Containers** Card · StatCard · Table · DataTable · ListItem · KeyValue · EmptyState · FilePreview
**Navigation** AppShell · PageHeader · Tabs · SegmentedControl · Pagination · DropdownMenu
**Formik** `@smarta/ui/formik` — useFormikField · useFormikValue · useFormikCheckbox · useFormikSubmit
**Overlays** Panel · Dialog · Tooltip · Toast · Callout
**Foundations** ThemeProvider

## House rules, in one place

These come from the two shipped prototypes and are enforced across the library:

- Sentence case everywhere. No Title Case on buttons, headings, tabs or labels.
- Buttons say what happens: "Upload it", "Match them", "Reject & tell the customer". Never "Submit" or "OK".
- One primary button per view.
- Empty and locked states explain the situation and offer the next action. Never "No data".
- Status is never colour alone — a Chip always carries a word.
- A disabled control always carries a reachable reason.
- A state change the user cannot see gets a Toast; everything else shows in place. Errors never live only in a Toast.
- Reversible destructive actions get Undo; irreversible ones get a Dialog whose button names the act.
- Validation is silent while typing, fires on blur, then goes live.
- Currency is formatted by the product before it reaches a component.
- `prefers-reduced-motion` is honoured for the library's own components in
  `base.css`, scoped, and always ships. `reset.css` widens it to the whole
  document, and is opt-in. Never a third rule in a component.
