---
component: DatePicker
category: Form
import: "import { DatePicker } from '@smarta/ui'"
similar: [DateRangePicker, Input]
tokens_only: true
---

# DatePicker

One date: typed in the locale's order, or picked from a calendar.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to DatePicker.

## Use it when

- The answer is a single day: a booking date, a filing date, when an asset was bought.
- People will often type it off a document — the field takes 03.06.2026 straight.
- The allowed days are bounded: not before the company existed, not in a closed period.

## Don't use it when

| Situation | Use instead |
|---|---|
| The answer is a period to filter a list by | `DateRangePicker` |
| A form needs a start and an end as two separate answers | two DatePickers labelled From and To — each typed and validated on its own |
| The answer is a month, not a day — a filing period | `Select` of months; a calendar asks for a day nobody has |
| It is a time, or a date and a time | not built yet — ask |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | yes in practice | — | |
| `value` / `defaultValue` | `Date \| null` | no | `null` | Controlled when `value` is passed. |
| `onValueChange` | `(d: Date \| null) => void` | no | — | Only ever a real date, or `null` when emptied. Never an invalid one. |
| `min` / `max` | `Date` | no | — | Days outside cannot be picked; a typed one shows a message. |
| `isDisabled` | `(d: Date) => boolean` | no | — | Any further unpickable days. |
| `hint` / `error` / `optional` | | no | — | As `Field`. `error` wins over the field's own message. |
| `locale` | `string` | no | ThemeProvider's | |
| `size` | `sm \| md \| lg` | no | `md` | |

## States

- **Empty** — no placeholder. A date-shaped one reads as a value already filled in; the format is taught by the message on blur.
- **Typing** — silent. Nothing is read or reported until the field is left or Enter is pressed.
- **Unreadable** — "Write the date like 25.11.2026." under the field, `aria-invalid`, and no value reported. Once shown, it clears the moment the text becomes a date.
- **Out of range** — "Choose 01.06.2026 or later."
- **Open** — a calendar dialog, focus on the selected day (or today). Arrow keys move by day and week, PageUp/PageDown by month, Escape closes and returns focus.
- **Disabled** — as `Input`.

## Rules

1. **Typing is first-class.** The backoffice copies dates off statements all day; eight keystrokes beat twelve clicks back to June.
2. **Day-month-year, in the locale's separators.** Any separator is accepted on the way in — 3.6.26, 03/06/2026, 3 6 2026.
3. **A date that does not exist is refused, not rolled over.** 31.02 does not quietly become 3 March.
4. **Validation is the house rule**: silent while typing, on blur, then live.
5. **The calendar speaks the product's language.** Its button names and day names come from `labels` and the locale, never from the calendar library's English.
6. **Alt+ArrowDown opens the calendar** from the field, as it opens a native select.

## Do and don't

```
✓  Booked on  [ 03.06.2026        📅 ]            ✗  Booked on  [ 2026-06-03 ]   ISO in a German product
✓  "Write the date like 25.11.2026."               ✗  "Invalid date"
✓  31.02.2026 → refused                            ✗  31.02.2026 → 03.03.2026
```

## Examples

```tsx
<DatePicker label="Booked on" value={booked} onValueChange={setBooked} />

<DatePicker
  label="Bought on"
  max={new Date()}
  hint="As it appears on the invoice."
/>

// A closed period can't be booked into
<DatePicker
  label="Booked on"
  min={firstOpenDay}
  isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
/>
```

## Related

`DateRangePicker` · `Input` · `parseDate` · `formatDate` · `Field`
