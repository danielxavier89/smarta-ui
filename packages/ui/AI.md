---
kind: entry-point
system: smarta-ui
products: [webapp, backoffice]
load: always
see_also:
  - docs/inventory.md
  - docs/conventions.md
  - docs/recipes/
  - src/components/<Name>/<Name>.md
---

# smarta-ui — start here

One component library, two products. The client-facing **webapp** is plum; the
internal **backoffice** is grayscale. Both run in light and dark. That is four
combinations, and **no component contains a colour**, which is what makes them
one library instead of two.

Read this file first, then `docs/inventory.md` — every component and every token
on one page, generated from source. Open `docs/conventions.md` before writing any
UI copy or any state handling, and a component's own `.md` only when you are
about to use it. Never load all 34; that is ~25k tokens.

## Setup

```tsx
import "@smarta/ui/styles.css";
import { ThemeProvider, TooltipProvider, ToastProvider } from "@smarta/ui";

<ThemeProvider asRoot product="backoffice" theme={userChoice}>
  <TooltipProvider><ToastProvider>{app}</ToastProvider></TooltipProvider>
</ThemeProvider>
```

Everything else imports by name from `@smarta/ui`.

## Three rules that are never negotiable

1. **Never write a colour.** No hex, no `rgb()`, no `bg-red-500`, no
   `var(--p-plum-600)`. Use semantic tokens: `bg-canvas`, `text-fg-muted`,
   `border-border`, `bg-accent`, `text-ok-fg`. `npm run lint:tokens` fails the
   build otherwise. Full list: `packages/tokens/src/theme.css`.
2. **Never build a second version of a component that exists.** Especially not a
   second panel, a second modal, or a second table. If the one here does not fit,
   say so rather than forking it.
3. **Never ask which product you are in.** The tokens handle it. If a *behaviour*
   genuinely differs, add a token — `--link-decoration` is the worked example —
   rather than branching on `product`.

## Which component?

| You need | Use | Not |
|---|---|---|
| A control that performs an action | `Button` | |
| …an icon-only control | `IconButton` (label is required) | a `Button` with no text |
| …a control inside a sentence | `TextLink` | an `<a href="#">` |
| A short text answer | `Input` | |
| …more than one line | `Textarea` | |
| …one of a known set, stored | `Select` (native) | a custom listbox |
| …one of ≤5 important choices | `RadioGroup` | `Select` |
| …an independent on/off | `Checkbox` | |
| …narrowing a list on screen | `SearchInput` | `Input` |
| …files | `Dropzone` | a bare `<input type="file">` |
| …a control we do not have | `Field` wrapping your own | re-deriving the aria |
| A status in one or two words | `Chip` | |
| A count on top of something | `Badge` | `Chip` |
| A person | `Avatar` / `AvatarStack` | |
| Work in flight, no known end | `Spinner` | |
| Work with a known end | `Progress` | |
| A placeholder while loading | `Skeleton` | a full-page spinner |
| A titled block of content | `Card` | |
| One number that is the point | `StatCard` | |
| Rows with the same columns, compared | `Table` | |
| Rows read across, varying shape | `ListItem` in `List` | `Table` |
| The facts about one record | `KeyValue` | a two-column `Table` |
| Nothing to show | `EmptyState` | the word "No data" |
| Switching **what** is shown | `Tabs` (with counts) | |
| Switching **how** it is shown | `SegmentedControl` | `Tabs` |
| Moving through a long list | `Pagination` | |
| A list of actions | `DropdownMenu` | `Select` |
| Detail beside the list | `Panel` | a second drawer |
| One question that cannot wait | `Dialog` | `Panel` |
| A short label on hover | `Tooltip` | anything the user must read |
| A message that stays | `Callout` | `Toast` |
| A change the user cannot see | `Toast` | `Callout` |

## The distinctions people get wrong

- **Chip vs Badge** — a Chip states a status in words ("Overdue"); a Badge counts
  ("3"). If it is a number, it is a Badge.
- **Tabs vs SegmentedControl** — Tabs change *what* is shown and carry counts;
  a segmented control changes *how* the same content is shown.
- **Select vs DropdownMenu** — a Select stores a value; a menu runs an action.
- **Panel vs Dialog** — a Dialog is only for the irreversible, or for work that
  would be lost on exit. Everything else is a Panel.
- **Toast vs Callout** — a toast is a moment, a callout is a place. Errors are
  always a callout or a field error, never only a toast.
- **Table vs ListItem** — compared down a column, or read across a row.
- **StatCard vs ListItem** — is the answer *how many*, or *which one*? Prefer
  naming the missing thing over counting it.

## Building a whole screen

Do not assemble from scratch. Start from the recipe:

| Screen | Recipe |
|---|---|
| A list or table with filters and detail | `docs/recipes/list-page.md` |
| A detail view beside a list | `docs/recipes/detail-panel.md` |
| A form, or a multi-step flow | `docs/recipes/form.md` |

## Say so when a request breaks a rule

Do not quietly comply, and do not quietly ignore the request. Three lines: what
the rule is, why in one sentence, and what you will do instead — then build the
compliant version. If the person reaffirms after that, build what they asked and
note the deviation.

> "Two primary buttons on one view — the system allows one, because two means the
> page hasn't decided what it's for. I'll make 'Send to Ana' primary and 'Save a
> draft' secondary. Say the word if you want both filled."

The full table of common cases is in the skill at
`.claude/skills/smarta-ui/SKILL.md`. Two are never negotiable because they break
the build or the product: a hardcoded colour, and nesting interactive elements.

## Before you say you are done

```sh
npm run check   # typecheck + no hardcoded colours + contrast across 4 themes
```

And read the component's `.md` for anything you used but had not used before.
The **Don't use it when** table in each is the part that prevents the common
mistake.
