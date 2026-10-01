# Working in this repository

Read this before adding a component or changing a token. `CLAUDE.md` is a symlink
to this file.

## The shape of it

```
packages/tokens   primitives → semantics → Tailwind bridge → base
packages/ui       34 components, one folder each
apps/storybook    stories, with product and mode toggles
```

Two products (`webapp`, `backoffice`) × two modes (`light`, `dark`) = four
combinations every component must be right in.

## The rule that matters

**No component contains a colour.** Not a hex, not `rgb()`, not `bg-red-500`, not
`var(--p-plum-600)`. Components read semantic tokens only — `bg-canvas`,
`text-fg-muted`, `border-border`.

The moment a component contains `#9B3F92` it belongs to the webapp in light mode,
and the library is two libraries. `npm run lint:tokens` enforces it.

If you need a colour that does not exist, **add a semantic token** in
`packages/tokens/src/semantic.css` (all four blocks *and* the two
`prefers-color-scheme` blocks), map it in `theme.css`, describe it in
`packages/tokens/src/index.ts`, then run `npm run audit:contrast`.

## The second rule that matters

**No component contains an English word it made up.** Everything a screen says
is a prop and always was. What a component has to produce on its own — a close
button's accessible name, a spinner's announcement, the pagination landmark —
lives in `packages/ui/src/lib/labels.ts` and is read with `useLabels()`.

The backoffice is German and the webapp is German and English. A hardcoded
string makes a component belong to one language the same way a hardcoded colour
makes it belong to one product, and an accessible name is the worst place to
hide one: invisible on screen, and read aloud to the one user who cannot work
around it. `npm run lint:tokens` enforces the first rule; `npm run lint:i18n`
enforces this one.

Adding a label: put it in `SmartaLabels`, give it an English default, read it
with `useLabels()`. If it interpolates, make it a function — `${first}–${last}
of ${total}` puts "von" in the middle in German.

## The third rule that matters

**Every utility is written `sui:flex`, never `flex`.** Tailwind is configured
with `prefix(sui)`, so an unprefixed class is not an error — it is simply not
generated, and the component renders unstyled with a green build.
`npm run lint:prefix` is what catches it; `node scripts/prefix-classes.mjs`
fixes it.

The prefix is not decoration. The webapp is moving to its own Tailwind, which
also defines `.text-base` — at 16px, where ours is 14px. Without the prefix our
class names were the host's class names, and whichever stylesheet loaded last
restyled the other one's elements, in both directions.

Two things follow from it, and from the library's CSS being unlayered:

- **Turn the focus ring off with `sui:focus-visible:outline-none`, not
  `sui:outline-none`.** The ring sits at (0,1,3) so that Ant Design's
  `a:focus { outline: 0 }` cannot remove it from our links, and a bare
  `outline-none` at (0,1,0) no longer reaches it.
- **Never write an element selector in a component.** Anything that styles a
  bare `h3` or `p` belongs in `packages/tokens/src/base.css`, scoped under
  `.smarta-ui` with the `:not(sui-…)` bump, on the rung of the ladder described
  in `scripts/gen-preflight.mjs`. `npm run test:coexistence` measures it against
  Ant Design 4, Bootstrap 5 and a host Tailwind.

## Before you finish

```sh
npm run check            # typecheck, token/i18n/prefix lints, contrast, generated files
npm test                 # behaviour, the labels layer, formatting, and axe
npm run build            # the library must still compile to dist/
npm run test:consumer    # and still install into Webpack and Vite
npm run test:coexistence # and still share a page with Ant Design, Bootstrap, Tailwind
npm run build-storybook  # catches anything the types do not
```

If a change is supposed to be visually invisible — a refactor, a dependency
bump, anything in `packages/tokens` — prove it:

```sh
npm run visual-diff -- <baseline-storybook-static> apps/storybook/storybook-static
```

It screenshots every story in all four themes from both builds and reports
what differs. It is not in CI, because screenshots move by a pixel between
machines, but it is the only check that looks at the result. It found, in one
afternoon, a focus halo that had vanished, every Toast story crashing, a
Panel rendering in the wrong product's palette, and a rem that had shrunk
by an eighth — with every other check green.

CI runs all of it on every pull request.

`npm run test:consumer` is the one that catches what the others cannot. Every
other check runs against `src` through a workspace symlink; this one packs the
library, installs the tarball into a throwaway app and builds it with both
products' bundlers. It is the check that would have caught the package being
uninstallable while everything else was green.

Two things `npm test` does not do, despite appearances. Its axe run loops over
the four product/mode combinations, but no component branches on either and
the tests load no CSS, so those four renders are the same DOM — it is three
assertions run four times, kept as insurance rather than as evidence. And
colour contrast cannot run under jsdom at all; `npm run audit:contrast` is
what actually checks it, against the token values.

## Adding a component

A component is four files in one folder:

```
packages/ui/src/components/Thing/
  Thing.tsx           the component
  Thing.md            the rules — see below
  Thing.stories.tsx   every state, in every product and mode
  index.ts            named exports, including the props type
```

Then add it to `packages/ui/src/index.ts` under the right heading.

Build on Radix (`import { Dialog } from "radix-ui"`) where the behaviour is
non-trivial — focus traps, menus, tooltips. Use `cva` for variants and `cn()` for
class merging, so a caller's `className` reliably wins.

## Writing the .md

These are read by people and by models. Keep the structure — it is what lets a
model pick the right component instead of the first plausible one.

```markdown
---
component: Thing
category: Actions | Form | Status | Containers | Navigation | Overlays
import: "import { Thing } from '@smarta/ui'"
similar: [OtherThing]
tokens_only: true
---

# Thing
One line saying what it is.

## Use it when          — three or four bullets
## Don't use it when    — a TABLE: situation → use this instead
## Props                — table: name, type, required, default, notes
## States               — default, hover, focus, loading, empty, error, disabled
## Rules                — numbered, each with its reason
## Do and don't         — an ASCII block, the two side by side
## Examples             — real code, real smarta copy
## Related
```

The **Don't use it when** table is the important part. "Use a Badge, not a Chip,
when the thing you are showing is a number" is the sentence that prevents the
mistake.

## House rules

Both come from the shipped prototypes and hold across the library:

- Sentence case everywhere.
- Buttons name the outcome: "Upload it", "Reject & tell the customer". Never "Submit" or "OK".
- One primary button per view.
- Empty states explain the situation and offer the next action. Never "No data".
- Status is never colour alone — a Chip always carries a word.
- A disabled control always carries a reachable reason.
- Errors show in place; Toasts are only for changes the user cannot see.
- Reversible destructive actions get Undo; irreversible ones get a Dialog naming the act.
- Validation is silent while typing, fires on blur, then goes live.
- Currency is formatted by the product before it reaches a component.
- `prefers-reduced-motion` is honoured in exactly two places, both in
  `packages/tokens/src`: `base.css` scopes it to `[data-product]` and always
  ships, `reset.css` widens it to the document and is opt-in. A component
  never adds a third.

## Sample data is published

Storybook is deployed to a public URL, and the repository is public. Every story
is therefore a published document.

The sample data is invented — the names, the companies, the addresses — and
invented is enough. Keep writing it the way it is written: specific, plausible,
and the kind of thing that makes a screen read like the real one. The one
exception is arithmetic:

- **Tax numbers must fail their checksum.** A NIF or a USt-IdNr is not just a
  string of the right shape — it carries a check digit, so a number invented at
  random can still land on a real registration. The tax-facing components —
  KeyValue, Panel, Input — are the ones that attract them. Change the last digit
  until the checksum fails, and it cannot be anybody's.
- Card numbers stay masked to the last four.

## Traps that have already bitten

- **`overflow-hidden` on a table wrapper** scopes `position: sticky` to the wrapper, so sticky headings scroll away. Clip corners on the cells instead.
- **A card wrapped in a `<button>`** makes every control inside it invalid and keyboard-unreachable. `Card` stretches the affordance with `::after` instead.
- **`<a href="#">`** runs the handler, then empties `location.hash`, and the router sends the page Home. That is why `TextLink` is a `<button>`.
- **Tailwind skips `node_modules`**, and this library is reached through a workspace symlink. `packages/ui/src/styles.css` registers the sources with `@source`; remove it and every utility silently disappears. A new folder of `.tsx` needs its own `@source` line too — the piecewise Tailwind import has no automatic detection, and `recipes/` went unstyled until it got one.
- **`@import "tailwindcss"` brings preflight with it.** That is ~150 lines of unscoped element selectors that restyle the host page. `styles.css` imports Tailwind in pieces on purpose, and the build fails if preflight comes back.
- **Storybook resolves `@smarta/ui` to source, not to `dist`.** Otherwise `preview.tsx` gets the built providers while stories get the source components — two React contexts, so every Toast story threw and every portal rendered in the wrong product's palette.
- **`asRoot` means the library owns the page.** It puts `.smarta-ui` on `<body>`, which makes the whole document an island. A screen being migrated inside an Ant Design or Bootstrap app wraps itself in a plain `<ThemeProvider>` instead.
