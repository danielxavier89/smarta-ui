# smarta-ui

The shared design system for the two smarta products: the client-facing **webapp**
and the internal **backoffice**.

One set of components, one set of tokens, two brands and two modes. A `<Button>`
renders plum in the webapp and graphite in the backoffice, in light or dark, with
no conditional anywhere in the component — because no component in this repository
contains a colour.

```
packages/tokens     design tokens: primitives → semantics → Tailwind bridge
packages/ui         34 React components, shadcn/Radix underneath
apps/storybook      every component, with product and mode toggles
```

## Running it

```sh
npm install
npm run storybook        # http://localhost:6006
npm run typecheck
npm run build-storybook
```

Node 20+. The workspace uses **npm workspaces** — no pnpm needed.

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

```tsx
// once, at the root
import "@smarta/ui/styles.css";
import { ThemeProvider, ToastProvider, TooltipProvider } from "@smarta/ui";

<ThemeProvider asRoot product="backoffice" theme={userChoice}>
  <TooltipProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </TooltipProvider>
</ThemeProvider>
```

```tsx
import { Button, Card, Chip, Table } from "@smarta/ui";
```

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
npm run audit:contrast   # 104 text/background pairs x 4 themes, WCAG AA
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
**Form** Field · Label · Input · Textarea · Select · SearchInput · Checkbox · RadioGroup · Dropzone
**Status** Chip · Badge · Avatar · Spinner · Progress · Skeleton
**Containers** Card · StatCard · Table · ListItem · KeyValue · EmptyState
**Navigation** Tabs · SegmentedControl · Pagination · DropdownMenu
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
- `prefers-reduced-motion` is honoured once, globally, in `reset.css`.
