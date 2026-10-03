---
component: DateRangePicker
category: Form
import: "import { DateRangePicker } from '@smarta/ui'"
similar: [DatePicker, Select]
tokens_only: true
---

# DateRangePicker

A from–to period, picked on a two-month calendar or from presets.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to DateRangePicker.

## Use it when

- A list is filtered by a period: charges in June, receipts this quarter.
- The usual answers are a handful of known periods — give them as `presets`.
- The range is chosen by looking at a calendar, not copied off a document.

## Don't use it when

| Situation | Use instead |
|---|---|
| A form asks for a start and an end as two answers | two `DatePicker`s labelled From and To — typed, and validated one at a time |
| The period is always a whole month | `Select` of months |
| It is one day | `DatePicker` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | yes in practice | — | Part of the trigger's accessible name, with the range. |
| `value` / `defaultValue` | `{ from: Date \| null; to: Date \| null }` | no | empty | `from` without `to` is half chosen. |
| `onValueChange` | `(r) => void` | no | — | Fires on every click, including the first. |
| `presets` | `{ label: string; range: { from; to } }[]` | no | — | The product's words for the periods it uses. |
| `min` / `max` / `isDisabled` | | no | — | As `DatePicker`. |
| `hint` / `error` / `optional` / `size` / `locale` | | no | — | |

## States

- **Empty** — the trigger reads "Choose dates" (the `chooseDateRange` label).
- **Half chosen** — "1. Juni 2026 –", the calendar stays open for the second click.
- **Chosen** — "1. Juni 2026 – 30. Juni 2026"; the calendar closes.
- **Preset active** — the matching preset is pressed (`aria-pressed`).
- **Error / disabled** — as `Field`.

## Rules

1. **The trigger is named by its label and its value.** "Period, 1 June – 30 June". A button named only "Period" would keep its value a secret from a screen reader.
2. **Presets are the product's words.** "June", "Last quarter", "Since the company started" — never computed English.
3. **It closes on a complete range, not on the first click.**
4. **Two months**, side by side on a desktop, stacked on a phone — a range across a month boundary is the common case.

## Do and don't

```
✓  Period  [📅 1. Juni 2026 – 30. Juni 2026 ]     ✗  two DateRangePickers for "From" and "To"
✓  presets: This month · Last month · This quarter ✗  a calendar to pick "June" when June is always the answer
```

## Examples

```tsx
<DateRangePicker
  label="Period"
  value={period}
  onValueChange={setPeriod}
  presets={[
    { label: "This month", range: thisMonth },
    { label: "Last month", range: lastMonth },
    { label: "This quarter", range: thisQuarter },
  ]}
/>
```

## Related

`DatePicker` · `Select` · `DataTable` (filters) · `formatDate`
