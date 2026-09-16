---
component: SegmentedControl
category: Navigation
import: "import { SegmentedControl } from '@smarta/ui'"
similar: [Tabs, RadioGroup, Select]
tokens_only: true
---

# SegmentedControl

Switches **how** the same content is shown.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to SegmentedControl.

## Use it when

- Two to four mutually exclusive views: month / quarter / year, list / grid / calendar.
- The labels are one or two words and fit on a line.
- The change is immediate and needs no saving.

## Don't use it when

| Situation | Use instead |
|---|---|
| It changes **what** is shown, and counts help | `Tabs` |
| It is an answer stored in a form | `RadioGroup` |
| More than four options, or long labels | `Select` |
| More than one can be on | `Checkbox` group, or `DropdownMenuCheckboxItem` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `options` | `SegmentOption[]` | **yes** | — | `{ value, label, icon?, disabled? }`. |
| `value` | `string` | **yes** | — | Controlled. |
| `onValueChange` | `(v: string) => void` | **yes** | — | |
| `label` | `string` | **yes** | — | The group's purpose: "Period", "View". |
| `size` | `sm \| md` | no | `md` | |
| `fullWidth` | `boolean` | no | `false` | |

## States

Selected · Unselected · Hover · Focus · Disabled option.
The value can never become empty: pressing the active segment again does nothing, because a segmented control with nothing selected has no meaning.

## Rules

1. **Always controlled.** There is no uncontrolled mode on purpose — a segmented control's value is the state of the view around it.
2. **`label` is required**, and is the group's accessible name.
3. **Two to four options.** Two is fine. Five is a `Select`.
4. **Icon plus word, or word alone — never icon alone.** An icon-only segment is a guessing game; that is what `IconButton` with a tooltip is for.
5. **Never use it for a destructive or committing choice.** It switches a view; it does not act.
6. **The labels never wrap, so on a narrow screen the track scrolls sideways rather than widening the page.** Treat a track that scrolls on a phone as the signal rule 3 already gives you: it has too many options, or the words are too long, and it wants to be a `Select`.

## Do and don't

```
✓  ( Month | Quarter | Year )        — how the same data is grouped
✓  ( List | Grid | Calendar )

✗  ( All | No receipt | Matched )    — different rows: that is Tabs
✗  ( Draft | Sent | Accepted )       — a record's status is not a view switch
```

## Examples

```tsx
<SegmentedControl
  label="Period"
  value={period}
  onValueChange={setPeriod}
  options={[
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter" },
    { value: "year", label: "Year" },
  ]}
/>
```

## Related

`Tabs` · `RadioGroup` · `Select`
