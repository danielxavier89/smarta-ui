---
component: Checkbox
category: Form
import: "import { Checkbox } from '@smarta/ui'"
similar: [RadioGroup, SegmentedControl]
tokens_only: true
---

# Checkbox

An independent on/off choice, or a row selector in a table.

## Use it when

- The choice is genuinely binary and independent of its neighbours.
- The user is selecting rows to act on in bulk.
- The user is agreeing to something before continuing.

## Don't use it when

| Situation | Use instead |
|---|---|
| The options are mutually exclusive | `RadioGroup` |
| Ticking it immediately changes a view | `SegmentedControl` |
| It is one of many filters in a toolbar | `DropdownMenuCheckboxItem` |
| It is a setting that applies instantly with no save | a switch — not in this library yet; use a `Checkbox` and say the change is immediate |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | no (yes in practice) | — | Omit only when a column header names it; then pass `aria-label`. |
| `description` | `ReactNode` | no | — | A quieter second line, wired via `aria-describedby`. |
| `checked` | `boolean \| "indeterminate"` | no | — | `"indeterminate"` is a real value, reported correctly to assistive tech. |
| `error` | `ReactNode` | no | — | |
| `size` | `sm \| md` | no | `md` | `sm` for table rows. |
| …Radix Checkbox props | | | | |

## States

Unchecked · Checked · **Indeterminate** · Disabled (each of the three) · Error.
The box sits 2px down from the label's first line, so a wrapped two-line label does not leave it adrift.

## Rules

1. **The label is part of the target.** Clicking the words toggles the box. Never ship a bare box with text beside it that does nothing.
2. **Use `indeterminate` for a partly-selected group**, never a dash drawn by hand — the real value is what a screen reader announces.
3. **The label is a positive statement.** "Send Ana a copy", not "Do not send a copy" — a negative label plus an unchecked box is a double negative.
4. **A disabled checkbox needs a reason**, like every other disabled control.
5. **Don't use a checkbox to arm a destructive button.** The confirmation rule covers that: a `Dialog` whose button names the act.

## Do and don't

```
✓  ☑ Send Ana a copy
✗  ☐ Do not send Ana a copy

✓  header: ⊟ (indeterminate)  "3 selected"
✗  header: ☐ with a hand-drawn dash inside

✓  <Checkbox size="sm" aria-label="Staples Lisboa" />   in a row whose column says Supplier
```

## Examples

```tsx
<Checkbox label="Send Ana a copy" />

<Checkbox
  label="Keep the original file"
  description="The scan stays on the lead even after the value is copied into master data."
/>

// Select-all over a partly-selected table
<Checkbox
  size="sm"
  checked={all ? true : some ? "indeterminate" : false}
  onCheckedChange={(v) => setPicked(v === true ? rows : [])}
  aria-label="Select all suppliers"
/>
```

## Related

`RadioGroup` · `Table` · `DropdownMenu`
