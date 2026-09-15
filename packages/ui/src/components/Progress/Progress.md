---
component: Progress
category: Status
import: "import { Progress } from '@smarta/ui'"
similar: [Spinner, Skeleton, StatCard]
tokens_only: true
---

# Progress

A bar for work whose end is known.

## Use it when

- An upload, an import, a batch job with a real percentage.
- A checklist where the remaining count is the point *and* naming the missing item is not enough.

## Don't use it when

| Situation | Use instead |
|---|---|
| The end is unknown | `Spinner` |
| Content is arriving and its shape is predictable | `Skeleton` |
| The useful answer is *which one is missing* | `ListItem` naming it |
| It would sit at 100% on a normal day | nothing |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `value` | `number \| null` | **yes** | — | 0–100. `null` renders an indeterminate slice. |
| `label` | `string` | **yes** | — | What is progressing. "62%" of what is not a message. |
| `showLabel` | `boolean` | no | `false` | Renders the label and percentage above the bar. |
| `tone` | `accent \| ok \| warn \| bad` | no | `accent` | |
| `size` | `sm \| md` | no | `md` | |

## States

Determinate · Indeterminate (`value={null}`) · Complete (100%, usually `tone="ok"`).
No disabled state; no error state — a failed job shows a `Callout`, not a red bar.

## Rules

1. **Don't report that fine things are fine.** A bar pinned at 100% every day is decoration, and both prototypes deliberately removed one.
2. **A count that stands alone is worse than a name.** "2 of 3 — 1 missing" makes the reader guess which; "Revolut ···· 7731 missing" answers them. Use a bar only where the total genuinely is the fact.
   *Exception, kept from the webapp:* inside a card that then lists the three items by name, "2 of 3 received" is correct — nobody has to guess.
3. **`label` is required** and is used as `aria-label` when it is not shown.
4. **Never animate to a value the work has not reached.** A bar that runs ahead of the job teaches people to distrust it.

## Do and don't

```
✓  Uploading receipts                62%
   ████████████░░░░░░░

✗  Everything is fine               100%
   ███████████████████

✗  Card statements    2 of 3 — 1 missing
✓  Card statements    Revolut ···· 7731 still to arrive
```

## Examples

```tsx
<Progress value={62} label="Uploading receipts" showLabel />
<Progress value={null} label="Reading the statement" />
<Progress value={100} label="Upload complete" tone="ok" showLabel />
```

## Related

`Spinner` · `Skeleton` · `Dropzone` · `StatCard`
