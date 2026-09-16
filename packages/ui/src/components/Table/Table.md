---
component: Table
category: Containers
import: "import { Table, THead, TBody, TR, TH, TD, TableEmpty } from '@smarta/ui'"
similar: [ListItem, KeyValue, Pagination]
tokens_only: true
---

# Table

Rows with the same columns, meant to be compared.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Table.

## Use it when

- Every row has the same fields, and the user scans **down a column** to compare: amounts, dates, statuses.
- Sorting or filtering by a column is useful.
- Charges, documents, leads, assets.

## Don't use it when

| Situation | Use instead |
|---|---|
| Rows are read **across**, not compared — a title, prose, an avatar | `ListItem` inside `List` |
| Fields vary from row to row | `ListItem` |
| It is the facts about one thing | `KeyValue` |
| There are two columns and three rows | `KeyValue` |

## Anatomy

```
<Table>
  <THead sticky><TR><TH/><TH align="right"/><TH sort onSort/></TR></THead>
  <TBody>
    <TR clickable selected tabIndex={0} onClick onKeyDown>
      <TD muted/><TD numeric/><TD><Chip size="sm"/></TD>
    </TR>
    <TableEmpty colSpan={3}><EmptyState/></TableEmpty>
  </TBody>
</Table>
```

## Props

**`Table`** — `containerClassName` targets the bordered wrapper.
**`THead`** — `sticky` pins the heading row.
**`TR`** — `clickable`, `selected`.
**`TH`** — `align`, `sort` (`asc | desc | none`), `onSort`. Sets `aria-sort` for you.
**`TD`** — `align`, `muted`, `numeric` (right-aligns and sets tabular figures).

## States

- **Loaded** — rows.
- **Empty** — `TableEmpty` wrapping an `EmptyState`, so the header row stays and the user can see what the columns were.
- **Loading** — `SkeletonList`, or keep the old rows with `aria-busy`.
- **Row selected** — `--accent-soft` fill, `aria-selected`.
- **Row hover** — only when `clickable`.

## Rules

1. **The wrapper is `overflow-x-auto`, never `overflow-hidden`.** `overflow-hidden` establishes a scroll container, which becomes the containing block for `position: sticky` — so sticky column headings get scoped to the card and scroll away with it. The corners are clipped by rounding the first and last cells instead. This is a real regression the webapp prototype hit; the fix is load-bearing.
2. **Every column of money uses `numeric`.** Tabular figures are global, but the right alignment is not.
3. **A clickable row needs `tabIndex={0}` and a key handler.** The component gives you the focus ring; it cannot give you the keyboard.
4. **Never put a second interactive element in a clickable row** unless it stops propagation — same trap as `Card`.
5. **The empty state keeps the header.** A table that vanishes when filtered to nothing leaves the user unable to see what they filtered.
6. **Don't paginate a list whose total you cannot state.** See `Pagination`.
7. **Row identity is a stable id, not an array index**, the moment anything can be inserted or removed.

## Do and don't

```
✓  Date   Supplier            Account          Amount   Status
   3 Jun  Staples Lisboa      Visa ···· 4417   -€86.40  [Matched]
                                                ↑ right-aligned, tabular

✗  Amount left-aligned in a column of money
✗  <div className="overflow-hidden"> wrapping a table with sticky headings
✓  filtered to nothing → header stays, EmptyState in the body
```

## Examples

```tsx
<Table>
  <THead sticky>
    <TR><TH>Date</TH><TH>Supplier</TH><TH align="right">Amount</TH><TH>Status</TH></TR>
  </THead>
  <TBody>
    {rows.map((r) => (
      <TR key={r.id} clickable tabIndex={0} onClick={() => open(r)}
          onKeyDown={(e) => { if (e.key === "Enter") open(r); }}>
        <TD muted>{r.date}</TD>
        <TD>{r.supplier}</TD>
        <TD numeric>{eur(r.amount)}</TD>
        <TD><Chip tone={r.tone} size="sm">{r.label}</Chip></TD>
      </TR>
    ))}
    {rows.length === 0 && (
      <TableEmpty colSpan={4}>
        <EmptyState size="sm" variant="no-results" title="Nothing matches that search"
          action={<Button size="sm" onClick={clear}>Clear the search</Button>} />
      </TableEmpty>
    )}
  </TBody>
</Table>
```

## Related

`ListItem` · `KeyValue` · `Pagination` · `EmptyState` · `Chip`
