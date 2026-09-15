---
component: KeyValue
category: Containers
import: "import { KeyValue } from '@smarta/ui'"
similar: [Table, ListItem, Field]
tokens_only: true
---

# KeyValue

The facts about one thing, as a real `<dl>`.

## Use it when

- A Panel or card is showing the details of a single record: a receipt's supplier, date, VAT and total.
- The user reads down the right-hand edge for values.

## Don't use it when

| Situation | Use instead |
|---|---|
| There are many records of the same shape | `Table` |
| A value can be edited | `Field` + the relevant control |
| It is prose | a paragraph |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `rows` | `KeyValueRow[]` | **yes** | — | `{ key, value, action?, tone?, note? }`. |
| `layout` | `rows \| stacked` | no | `rows` | `stacked` for narrow columns and long values. |
| `size` | `sm \| md` | no | `md` | |

`KeyValueRow.tone` — `default \| ok \| warn \| bad`, for a value that failed a check.
`KeyValueRow.note` — a quiet line under the value saying where the number came from.
`KeyValueRow.action` — a control beside the value: copy, "Put into master data".

## States

Static. No hover, no focus of its own — only whatever `action` you put in a row.
While a value is loading, put a `Skeleton` in `value`.

## Rules

1. **It is for showing, not editing.** The moment a value can be changed, it is a `Field`.
2. **It is a real `<dl>`**, so a screen reader reads each value with its own label rather than a wall of text. Don't rebuild it out of divs to win a layout.
3. **Keys are labels, not sentences.** "VAT at 23%", not "The VAT charged on this receipt".
4. **Use `note` for provenance**, not for a second value: "Converted at 1.1105 on 14 June."
5. **`tone` marks a value that failed a check** — a mismatch, an unreclaimable VAT — not a value that is merely interesting.
6. **Money is already formatted** before it reaches a row.

## Do and don't

```
✓  Supplier            Staples Lisboa
   NIF                  503 214 665  ⧉
   VAT at 23%                €16.16
   Total                     €86.40

✓  Charged                  €486.22
                            Converted at 1.1105 on 14 June.

✗  Total                    [ 86.40 ]      — editable: use a Field
✗  The VAT charged on this receipt   €16.16
```

## Examples

```tsx
<KeyValue
  rows={[
    { key: "Supplier", value: "Staples Lisboa" },
    { key: "NIF", value: "503 214 665",
      action: <IconButton size="sm" variant="ghost" label="Copy the NIF" icon={<Copy size={13} />} /> },
    { key: "VAT at 23%", value: eur(16.16) },
    { key: "Total", value: eur(86.40) },
    { key: "Input VAT", value: "Not reclaimable", tone: "warn",
      note: "A purchase outside the EU carries no Portuguese VAT." },
  ]}
/>
```

## Related

`Panel` · `Table` · `Field` · `Chip`
