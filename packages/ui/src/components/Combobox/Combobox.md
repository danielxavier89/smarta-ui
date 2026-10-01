---
component: Combobox
category: Form
import: "import { Combobox } from '@smarta/ui'"
similar: [Select, MultiSelect, SearchInput]
tokens_only: true
---

# Combobox

One option out of a long list: type to narrow, arrow to choose.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Combobox.

## Use it when

- The list is too long to scan: booking categories, countries, a customer's 40 bank accounts.
- People know what they are looking for and can type part of it — "4930", "büro", "conceicao".
- The options come from the server as the person types.

## Don't use it when

| Situation | Use instead |
|---|---|
| Up to a dozen options everyone recognises | `Select` — native, and better on a phone |
| More than one can be chosen | `MultiSelect` |
| Up to five options and the choice matters | `RadioGroup` — all of them visible |
| The text itself is the answer, not a pick from a list | `Input` (a free-text Combobox is a different control; ask) |
| It searches a page or a table | `SearchInput` |
| The items run something | `DropdownMenu` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | yes in practice | — | Or `aria-label` when there is truly nowhere to put one. |
| `options` | `{ value, label, description?, disabled? }[]` | yes | — | `description` is searched too. |
| `value` / `defaultValue` | `string \| null` | no | `null` | |
| `onValueChange` | `(value, option) => void` | no | — | |
| `filter` | `boolean \| (options, query, locale) => options` | no | `true` | `false` when the product filters on the server. |
| `onInputChange` | `(text) => void` | no | — | Every keystroke; debounce in the product. |
| `loading` | `boolean` | no | `false` | Says "Loading" in the list. |
| `emptyMessage` | `ReactNode` | no | `noMatches` label | Say what to do: "No category has that name. Create it under Settings." |
| `clearable` | `boolean` | no | `true` | |
| `name` | `string` | no | — | Posts the value with a native form. |
| `hint` / `error` / `optional` / `disabled` / `required` / `size` / `placeholder` | | no | — | As `Input`. |

## States

- **Closed** — shows the chosen option's name.
- **Open** — every option, the chosen one ticked; typing narrows. Focus stays in the field the whole time.
- **Loading** — "Loading" with a spinner, under whatever is already listed.
- **Nothing matches** — the `emptyMessage`, announced.
- **Left with unmatched text** — the chosen name comes back. **Left empty** — the choice is cleared.
- **Error / disabled** — as `Field`.

## Rules

1. **It picks from the list and nothing else.** Text that matches nothing is not a value.
2. **Matching ignores case and accents.** Nobody types "ü" on a laptop they borrowed in Lisbon.
3. **Escape closes the list, and nothing else.** In a Dialog the first Escape closes the list and the second the Dialog. Escape on a closed list does not wipe the choice.
4. **Opening shows everything,** not just the option already chosen.
5. **The list is portalled** above Dialogs and Panels and outside anything that clips — a table cell, a card with `overflow: hidden`.

## Do and don't

```
✓  Category  [ büro             ▾ ]               ✗  Select with 180 SKR accounts
             ✓ 4930 Bürobedarf                     ✗  "No results"
               4940 Zeitschriften, Bücher           ✓  "No category has that name."
```

## Examples

```tsx
<Combobox
  label="Category"
  options={accounts.map((a) => ({ value: a.id, label: a.name, description: a.number }))}
  value={categoryId}
  onValueChange={setCategoryId}
/>

// The server searches; the component only shows what comes back
<Combobox
  label="Customer"
  options={results}
  filter={false}
  loading={isFetching}
  onInputChange={debouncedSearch}
  emptyMessage="No customer by that name or Steuernummer."
/>
```

## Related

`Select` · `MultiSelect` · `SearchInput` · `DropdownMenu` · `Field`
