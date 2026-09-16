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

**Survey before you choose.** Read both of these before picking a component or a
colour, every time:

- `$SMARTA_UI/packages/ui/docs/inventory.md` — every component and every semantic
  token on one page, generated from source so it cannot drift. 34 components, 44
  colour tokens, 34 scale tokens. If what you need is not in those tables, say so
  rather than inventing one.
- `$SMARTA_UI/packages/ui/AI.md` — the hard rules, and a decision table
mapping "you need X" to the component to use.

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

Do not load all 34 component files — that is ~25k tokens. Load the inventory and
the entry point, then only the component files you are about to use.

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

## Push back when a request breaks a rule

These rules exist because the two products already got them wrong once. So when
a request conflicts with one, **say so before doing it** — do not quietly comply,
and do not quietly ignore the request either.

Keep it to three lines:

1. What the rule is.
2. Why, in one sentence.
3. What you will do instead.

Then do the compliant version. If the person reaffirms after reading that, build
what they asked for and note the deviation in one line — it is their product.

> "Two primary buttons on one view — the system allows one, because two means
> the page hasn't decided what it's for. I'll make 'Send to Ana' primary and
> 'Save a draft' secondary. Say the word if you want both filled."

Common ones, and the answer:

| The request | Push back with |
|---|---|
| "Make it red" / any hex | No colour literals — a hardcoded hex belongs to one product in one mode. Use `tone="bad"` or `text-bad`. |
| "Add a drawer for this screen" | There is one `Panel`, and every detail view is a caller of it. A second drawer is the thing both prototypes banned by name. |
| "Two primary buttons" | One per view — two means the page hasn't decided what it's for. |
| "Full-page spinner while it loads" | A `Skeleton` shaped like the result, or nothing under ~300ms. A full-page spinner hides the page's shape. |
| "Grey out the button" | A disabled control needs a reachable reason, or a screen-reader user never learns it exists. Tooltip, or keep it enabled and explain on click. |
| "Toast the error" | Errors show in place — a toast leaves before it can be acted on and can't be re-read. |
| "Delete it without a confirm" | Reversible → do it and offer Undo. Irreversible → a `Dialog` whose button names the act. |
| "Just say 'No data'" | An empty state explains the situation and offers a next step, or names who to wait for. |
| "Colour the row by status" | Status is never colour alone — it has to survive greyscale and being read aloud. Add the word. |
| "Title Case the buttons" | Sentence case everywhere, and buttons name the outcome: "Upload it", not "Submit". |
| "Build a custom dropdown" | `Select` stays native: the platform picker wins on a phone and can't break keyboard access. A menu of *actions* is `DropdownMenu`. |
| "Put the tax number in a tooltip" | Tooltips hold provenance and units only. Hover doesn't fire on touch, and a number you can't select is a number you can't use. |
| "Make the backoffice plum like the webapp" | Product identity lives in tokens, not components. Changing it is a token change, and it affects both products. |
| "Hardcode 16px padding" | Spacing comes from `--density-*` and `--control-height-*`, which is how the backoffice runs tighter for free. |
| "Add a component for X" | Check `inventory.md` first. If it genuinely doesn't exist, adding one is a design-system decision — propose it, don't ship it inside a screen. |

Two things are not negotiable regardless of what is asked, because they break the
build or the product: **a hardcoded colour** (`npm run lint:tokens` fails) and
**nesting interactive elements** (invalid HTML, unreachable by keyboard). Offer
the compliant version instead.

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
