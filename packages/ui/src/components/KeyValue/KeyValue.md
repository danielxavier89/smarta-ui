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
`KeyValueRow.note` — shown on an info icon beside the key, not as a second line.
`KeyValueRow.action` — a control beside the value: copy, "Put into master data".
`KeyValueRow.nowrap` — keeps the value on one line whatever the column width.

## States

Static. No hover, no focus of its own — only whatever `action` you put in a row.
While a value is loading, put a `Skeleton` in `value`.

## How it behaves when the room runs out

This is the part worth knowing, because the failure is silent and looks like a
styling nit rather than a wrong number.

1. **The key gives way first.** A long label wraps or shrinks so the figure
   beside it keeps its room.
2. **A value wraps at spaces, never inside a word.** "Not reclaimable" may become
   two lines; `€486.22` may not become `€486.2` / `2`.
3. **`nowrap` refuses even that.** Use it for money, tax numbers, references and
   dates. A number broken across two lines is not a smaller number, it is a
   different one — and a Steuernummer split mid-string cannot be checked against
   a document by eye.
4. **Below 260px the rows layout stops trying.** A container query drops it to
   stacked, which is correct at any width. Measured at 200px, `rows` clipped a
   `nowrap` value and shredded an address into `Prinze / nstraß / e 84,`; stacked
   rendered every value whole. The component now falls back rather than degrade.

So: pass `nowrap` on anything numeric, and let the component decide the layout.
Reach for `layout="stacked"` explicitly when you already know the column is
narrow, or when most values are prose.

## Rules

1. **It is for showing, not editing.** The moment a value can be changed, it is a `Field`.
2. **It is a real `<dl>`**, so a screen reader reads each value with its own label rather than a wall of text. Don't rebuild it out of divs to win a layout.
3. **Keys are labels, not sentences.** "VAT at 23%", not "The VAT charged on this receipt".
4. **Use `note` for provenance**, not for a second value: "Converted at 1.1105 on 14 June."
   It renders as an info icon beside the key, so a column of figures stays a
   column of figures. Keep it to a sentence, and keep it explanatory — a
   tooltip cannot be re-read once the pointer moves, so anything the user has
   to act on belongs on the page. The icon is a real button: reachable by
   keyboard, and tappable on touch, where hover never fires.
5. **`tone` marks a value that failed a check** — a mismatch, an unreclaimable VAT — not a value that is merely interesting.
6. **Money is already formatted** before it reaches a row, and carries `nowrap`.
7. **Do not nest a `KeyValue` in a flex row with anything else.** It is a grid
   per row so the note can span both columns; dropping it into a flex line puts
   the note beside the value and squeezes the figure until it breaks. That is
   exactly the bug this component shipped with.

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
