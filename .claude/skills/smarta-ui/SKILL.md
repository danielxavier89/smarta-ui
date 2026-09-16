---
name: smarta-ui
description: The smarta design system — shared React components, design tokens and UI rules for the smarta webapp and backoffice. Use whenever building, changing or reviewing any user interface in a smarta product: screens, pages, forms, tables, panels, dialogs, empty states, or anything imported from @smarta/ui. Also use when choosing between components, writing UI copy, or deciding how something should behave when it is loading, empty, disabled or wrong.
---

# smarta-ui

One component library, two products. The client-facing **webapp** is plum; the
internal **backoffice** is grayscale. Both run in light and dark — four
combinations, and no component contains a colour, which is what makes them one
library rather than two.

The system lives at:

```
~/Library/Mobile Documents/com~apple~CloudDocs/AI Projects/smarta-ui
```

referred to below as `$SMARTA_UI`.

## How to use this skill

**Always read first:** `$SMARTA_UI/packages/ui/AI.md` — ~1k tokens. What the
library is, the hard rules, and a decision table mapping "you need X" to the
component to use.

**Before writing UI copy or handling any state:**
`$SMARTA_UI/packages/ui/docs/conventions.md` — copy and tone, the six states
every screen owes the user, forms and validation, colour and meaning, numbers
and money, accessibility, spacing.

**Before building a whole screen**, start from the recipe rather than assembling
from scratch:

| Screen | File |
|---|---|
| A list or table with filters and detail | `$SMARTA_UI/packages/ui/docs/recipes/list-page.md` |
| A detail view beside a list | `$SMARTA_UI/packages/ui/docs/recipes/detail-panel.md` |
| A form or multi-step flow | `$SMARTA_UI/packages/ui/docs/recipes/form.md` |

**Before using a component you have not used in this session:**
`$SMARTA_UI/packages/ui/src/components/<Name>/<Name>.md`. The **Don't use it
when** table in each is the part that prevents the usual mistake.

Do not load all 34 component files — that is ~25k tokens. Load the entry point,
then only what you are about to use.

## The rules that hold even if you read nothing else

1. **Never write a colour.** No hex, no `rgb()`, no `bg-red-500`, no
   `var(--p-*)`. Use semantic tokens: `bg-canvas`, `text-fg-muted`,
   `border-border`, `bg-accent`, `text-ok-fg`. `npm run lint:tokens` fails the
   build on any literal.
2. **Never build a second version of something that exists** — above all a second
   panel, modal or table. If the one here does not fit, say so instead of forking.
3. **Never branch on which product you are in.** Tokens handle it. If a
   *behaviour* differs, add a token (`--link-decoration` is the worked example).
4. **Sentence case everywhere**, and buttons name the outcome: "Upload it",
   "Reject & tell the customer". Never "Submit", "OK", "Confirm".
5. **One primary button per view** or per panel footer.
6. **Empty states explain and offer a next step.** Never "No data".
7. **Status is never colour alone** — a chip always carries a word.
8. **A disabled control always carries a reachable reason.**
9. **Errors show in place.** A toast is only for a change the user cannot see,
   and never the only copy of an error.
10. **Reversible destructive actions get Undo; irreversible ones get a Dialog**
    whose button names the act.

## Setup in a product

```tsx
import "@smarta/ui/styles.css";
import { ThemeProvider, TooltipProvider, ToastProvider } from "@smarta/ui";

<ThemeProvider asRoot product="backoffice" theme={userChoice}>
  <TooltipProvider><ToastProvider>{app}</ToastProvider></TooltipProvider>
</ThemeProvider>
```

## Seeing it

```sh
cd "$SMARTA_UI/apps/storybook" && npm run storybook   # localhost:6006
```

Each component's Docs tab renders the same `.md` file this skill points you at —
one source of truth, so what a designer reads and what you read cannot drift.

## Before saying the work is done

```sh
cd "$SMARTA_UI" && npm run check
```

Typecheck, no hardcoded colours, and 140 text/background contrast pairs across
the four themes.
