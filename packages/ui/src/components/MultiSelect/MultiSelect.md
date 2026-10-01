---
component: MultiSelect
category: Form
import: "import { MultiSelect } from '@smarta/ui'"
similar: [Combobox, Checkbox]
tokens_only: true
---

# MultiSelect

Several options out of a long list, shown as removable tags in the field.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to MultiSelect.

## Use it when

- A filter takes several values from a long list: categories, assignees, banks.
- A record carries several tags from a known set.
- The list is long enough that checkboxes would push the form off the screen.

## Don't use it when

| Situation | Use instead |
|---|---|
| Only one can be chosen | `Combobox` |
| Up to six options, all worth seeing at once | a group of `Checkbox`es |
| The values are free text — email addresses to copy in | not built yet; ask |
| It is a toggle between views | `Tabs` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | yes in practice | — | |
| `options` | `{ value, label, description?, disabled? }[]` | yes | — | |
| `value` / `defaultValue` | `string[]` | no | `[]` | In the order chosen. |
| `onValueChange` | `(values, options) => void` | no | — | |
| `filter` / `onInputChange` / `loading` / `emptyMessage` | | no | — | As `Combobox`. |
| `name` | `string` | no | — | Posts one field per value. |
| `hint` / `error` / `optional` / `disabled` / `size` / `placeholder` | | no | — | The placeholder shows only while nothing is chosen. |

## States

- **Empty** — the placeholder, if any.
- **Chosen** — a tag per value, each with a remove button named "Remove Travel". The field grows a line rather than scrolling sideways.
- **Open** — the list stays open while choosing; chosen options are ticked.
- **After a change** — "3 selected" is announced.
- **Loading / nothing matches / error / disabled** — as `Combobox`.

## Rules

1. **The list stays open between choices.** Five categories are five Enters, not five trips.
2. **Choosing a chosen option removes it**, so the list is also the way to undo.
3. **Backspace in an empty field removes the last tag**; ArrowLeft walks into the tags, and Backspace or Delete removes the one focused.
4. **Every remove button says what it removes.** Six buttons all named "Remove" is a list nobody can use without sight.
5. **Tags carry the option's name, never a colour.**

## Do and don't

```
✓  Categories [ Travel × ] [ Meals × ] [       ▾ ]    ✗  "Travel, Meals, Software, +4" in a single line nobody can edit
✓  Remove Travel                                      ✗  ×  (named "Remove", six times)
```

## Examples

```tsx
<MultiSelect
  label="Categories"
  options={categories}
  value={filter.categories}
  onValueChange={(categories) => setFilter({ ...filter, categories })}
  placeholder="All categories"
/>
```

## Related

`Combobox` · `Checkbox` · `Chip` · `DataTable` (filters)
