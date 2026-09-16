---
component: RadioGroup
category: Form
import: "import { RadioGroup } from '@smarta/ui'"
similar: [Select, SegmentedControl, Checkbox]
tokens_only: true
---

# RadioGroup

One choice from a small set, with every option visible.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to RadioGroup.

## Use it when

- There are two to five options.
- The choice matters enough that the user should read all of it before deciding.
- The answer is stored as part of a form.

## Don't use it when

| Situation | Use instead |
|---|---|
| More than about five options | `Select` |
| The choice is routine and low-stakes | `Select` |
| It switches how content is displayed, not what is stored | `SegmentedControl` |
| More than one can be true | `Checkbox` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `options` | `RadioOption[]` | **yes** | — | `{ value, label, description?, disabled? }`. |
| `label` | `ReactNode` | no (yes in practice) | — | The question. Rendered as a `<legend>`. |
| `hint` / `error` | `ReactNode` | no | — | |
| `appearance` | `plain \| card` | no | `plain` | `card` gives each option a bordered surface. |
| …Radix RadioGroup props | | | | |

## States

Unselected group · Selected · Disabled option · Disabled group · Error.
In `card` appearance, the chosen option's surface turns `--accent-soft` with an `--accent` border.

## Rules

1. **Always inside a `<fieldset>` with a `<legend>`** — the component does this for you. Pass `label`, always.
2. **The label is the question the options answer.** "How was this asset paid for?", not "Payment".
3. **`appearance="card"` for two or three fat choices** that each need a line of explanation. Plain for anything denser.
4. **Descriptions go on the option, not in the hint.** If each option needs explaining, explain it where it is.
5. **Prefer no default over a guessed one** when the answer has consequences — a pre-selected radio is an answer the user never gave.

## Do and don't

```
✓  How was this asset paid for?
     ○ It is on a bank statement
     ○ Paid in cash
     ○ Something else — we will ask Ana to look at it

✗  Payment
     ○ Statement  ○ Cash  ○ Other

✓  6 options → Select
✗  6 radios stacked down the page
```

## Examples

```tsx
<RadioGroup
  label="How was this asset paid for?"
  value={how}
  onValueChange={setHow}
  options={[
    { value: "statement", label: "It is on a bank statement" },
    { value: "cash", label: "Paid in cash" },
    { value: "other", label: "Something else", description: "We will ask Ana to look at it." },
  ]}
/>

<RadioGroup
  label="Which offer template?"
  appearance="card"
  options={[
    { value: "de", label: "German", description: "The customer receives it in German." },
    { value: "en", label: "English", description: "For customers who asked in English." },
  ]}
/>
```

## Related

`Select` · `SegmentedControl` · `Checkbox` · `Field`
