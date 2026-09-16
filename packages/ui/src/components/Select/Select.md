---
component: Select
category: Form
import: "import { Select } from '@smarta/ui'"
similar: [RadioGroup, SegmentedControl, DropdownMenu]
tokens_only: true
---

# Select

A native `<select>`, styled. One value from a known list.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Select.

## Use it when

- The user is choosing a **value that gets stored**: an assignee, a period, a Bundesland, a template.
- There are more than about five options, or the choice is routine enough not to deserve the room.

## Don't use it when

| Situation | Use instead |
|---|---|
| The items **do** something rather than being stored | `DropdownMenu` |
| There are ≤5 options and the choice matters enough to read | `RadioGroup` |
| It switches how the same content is displayed | `SegmentedControl` |
| The user needs to search hundreds of options | a combobox — not in this library yet |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `options` | `SelectOption[]` | **yes** | — | `{ value, label, disabled?, group? }`. Consecutive matching `group` values become one `<optgroup>`. |
| `placeholder` | `string` | no | — | Renders a disabled empty row. Omit when a value is always set. |
| `label` / `hint` / `error` / `optional` | | no | — | Same contract as `Input`. |
| `size` | `sm \| md \| lg` | no | `md` | |
| …all native `<select>` props | | | | |

## States

Empty (placeholder) · Focus · Error · Disabled.
There is no loading state — if the options are still arriving, disable the field and say so in the hint.

## Rules

1. **It stays native.** Both prototypes settled on native selects and native date inputs: on a phone the platform picker beats anything we would build, it needs no portal, no focus trap and no scroll lock, and it cannot be the reason a form is unusable with a keyboard. Do not replace this with a Radix listbox to win a rounded corner.
2. **A menu is not a select.** If choosing the item runs something, it is a `DropdownMenu`.
3. **Order the options the way the user thinks**, not alphabetically by accident: most likely first, or a real sequence (periods in date order).
4. **`placeholder` is not a value.** Treat the empty string as "not answered" and validate it.
5. **Disable individual options rather than hiding them** when the user should know the option exists but cannot pick it yet.

## Do and don't

```
✓  Select  → Assignee: Erik / Michael / Annekatrin        (stored)
✗  Select  → Actions: Edit / Download / Delete            (these run)

✓  RadioGroup for 3 weighty choices the user must read
✗  Select for 2 options the user must compare
```

## Examples

```tsx
<Select label="Assignee" options={assignees} value={who} onChange={(e) => setWho(e.target.value)} />

<Select
  label="Move to"
  placeholder="Choose a queue"
  options={[
    { value: "docs", label: "Documents", group: "Onboarding" },
    { value: "tax",  label: "Tax numbers", group: "Onboarding" },
    { value: "ops",  label: "Tax Ops", group: "Review" },
  ]}
/>
```

## Related

`RadioGroup` · `SegmentedControl` · `DropdownMenu` · `Field`
