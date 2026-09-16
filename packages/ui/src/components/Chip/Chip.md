---
component: Chip
category: Status
import: "import { Chip } from '@smarta/ui'"
similar: [Badge, Callout]
tokens_only: true
---

# Chip

A short, non-interactive status pill: "Matched", "Overdue", "Waiting on Ana".

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Chip.

## Use it when

- A row, card or panel needs to state a status in one or two words.
- The status is one of a small, known set.

## Don't use it when

| Situation | Use instead |
|---|---|
| It shows *how many* | `Badge` |
| Pressing it does something | `Button` (or a `Chip` inside a `CardAction`) |
| It is a filter the user toggles | `DropdownMenuCheckboxItem` or `SegmentedControl` |
| It needs a sentence of explanation | `Callout` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `children` | `ReactNode` | **yes** | — | The word. Never empty. |
| `tone` | `neutral \| ok \| warn \| bad \| info \| accent` | no | `neutral` | |
| `size` | `sm \| md` | no | `md` | `sm` inside table rows. |
| `appearance` | `solid \| outline` | no | `solid` | |
| `dot` | `boolean` | no | `false` | A leading dot in the tone's colour. |
| `icon` | `ReactNode` | no | — | 12px. |

## Tone means

| Tone | Means | Examples |
|---|---|---|
| `ok` | Done, settled, nothing owed | Matched · Verified · Paid · Filed |
| `warn` | Waiting, approaching, needs a look | Due in 3 days · Waiting on the customer · In review |
| `bad` | Overdue, failed, missing, rejected | Overdue · Mismatch · Rejected · No receipt |
| `info` | Neutral fact worth noticing | Duplicate · Foreign currency · Auto-matched |
| `accent` | New or brand-flagged | New · Beta |
| `neutral` | No status yet | Draft · Not started · Transfer |

## States

A Chip has one state — itself. It has no hover, no focus and no disabled: it is not interactive.
It has no loading state either; while a status is unknown, render a `Skeleton` in its place or nothing at all.

## Rules

1. **Never colour alone.** A Chip always carries a word; the dot and the tint reinforce it. A bare coloured dot with no label anywhere is not allowed — it stops working in greyscale, for a colour-blind reader, and when the row is read aloud.
2. **One chip per row.** Two chips side by side make the reader rank them. If a row has two facts, one of them is a column.
3. **The word is the status, not the object.** "Overdue", not "Overdue invoice" — the row already says what it is.
4. **`outline` on a busy table**, where a column of filled tints turns into stripes.
5. **Tone is meaning, not decoration.** Never pick a tone because it looks good against the row.
6. **Sentence case, no full stop.**

## Do and don't

```
✓  ● Matched        ✓  ● Overdue        ✓  Draft
✗  ●                ✗  ●                 — colour with no word

✓  row: Staples Lisboa   -€86.40   [Matched]
✗  row: Staples Lisboa   [Matched] [Receipt] [EU]

✓  size="sm" in a table row
```

## Examples

```tsx
<Chip tone="ok">Matched</Chip>
<Chip tone="warn" dot>Waiting on the customer</Chip>
<Chip tone="bad" icon={<AlertTriangle size={12} />}>Mismatch</Chip>
<Chip tone="neutral" size="sm" appearance="outline">Draft</Chip>
```

## Related

`Badge` · `Callout` · `Table` · `ListItem`
