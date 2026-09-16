---
component: SearchInput
category: Form
import: "import { SearchInput } from '@smarta/ui'"
similar: [Input]
tokens_only: true
---

# SearchInput

The pill-shaped search field from both products' top bars.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to SearchInput.

## Use it when

- The user is narrowing a list that is already on screen.
- The field sits in a top bar, a toolbar, or above a table — on the canvas rather than inside a form.

## Don't use it when

| Situation | Use instead |
|---|---|
| The value is submitted and stored | `Input` |
| It is one field among several in a form | `Input` |
| The filter is a fixed set of choices | `DropdownMenu` with checkbox items, or `SegmentedControl` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `string` | no | `"Search"` | The accessible name. The magnifier is not a label. |
| `onClear` | `() => void` | no | — | Shows the clear button once there is text, and returns focus to the field. |
| `size` | `sm \| md` | no | `md` | |
| …all native `<input>` props except `type` | | | | |

## States

- **Empty** — placeholder names what is searchable: "Search receipts, charges, messages".
- **Focus** — the pill takes the ring; the input drops its own outline.
- **Has value** — the clear button appears if `onClear` is given.
- **No results** — not a state of this component. Render an `EmptyState` with `variant="no-results"` in the list below, and offer to clear the search.

## Rules

1. **It is a separate component, not a variant of `Input`** — different shape, different ground, and almost never a visible label. Three props' worth of difference.
2. **Always pass `onClear` when the search can be non-empty.** Clearing by selecting-all-and-deleting is not a feature.
3. **The placeholder names the haystack.** "Search" alone tells the user nothing about what will be searched.
4. **Debounce in the product, not here.** This component is controlled and fires on every keystroke by design.
5. **The empty result belongs to the list, not the field.** Never gray out the search box to say nothing matched.

## Do and don't

```
✓  placeholder="Search receipts, charges, messages"
✗  placeholder="Search"

✓  value + onClear  →  an × appears
✗  value with no way to clear it
```

## Examples

```tsx
const [q, setQ] = useState("");

<SearchInput
  value={q}
  onChange={(e) => setQ(e.target.value)}
  onClear={() => setQ("")}
  placeholder="Search receipts, charges, messages"
  label="Search the portal"
/>
```

## Related

`Input` · `EmptyState` · `DropdownMenu`
