---
component: DataTable
category: Containers
import: "import { DataTable } from '@smarta/ui'"
similar: [Table, ListItem]
tokens_only: true
---

# DataTable

A Table with the behaviour every list screen needs: filters, sorting, selection with bulk actions, activatable rows, loading, error, empty and pagination.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to DataTable.

## Use it when

- A list page shows records in columns: charges, receipts, customers, returns.
- People sort it, select several rows to act on together, or open one row in a Panel.
- The list has a loading, an empty and a failed state — which is every list fetched from somewhere.

## Don't use it when

| Situation | Use instead |
|---|---|
| A handful of rows with no behaviour — a summary inside a Card | `Table` |
| The layout needs something DataTable does not do: grouped rows, a footer of totals, cells spanning columns | `Table`, which looks identical |
| Items read as sentences, not columns — notifications, activity | `ListItem` |
| Two or three facts about one record | `KeyValue` |
| Filters that change the whole page, not one table — tabs of different lists, a period for a dashboard | `Tabs`, or `SearchInput` / `DateRangePicker` in the page's own toolbar |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `columns` | `DataTableColumn<T>[]` | yes | — | `{ id, header, cell, sort?, numeric?, muted?, align?, width? }` |
| `rows` | `T[]` | yes | — | |
| `getRowId` | `(row) => string` | yes | — | The record's id, never its index. |
| `caption` | `string` | yes | — | "Charges in June". A hidden caption; also names the pagination. |
| `empty` | `ReactNode` | yes | — | An `EmptyState` that says why and offers the next step. |
| `sort` / `defaultSort` / `onSortChange` | `{ columnId, direction } \| null` | no | — | Controlled sort leaves the sorting to the product. |
| `selectable` | `boolean` | no | `false` | |
| `rowLabel` | `(row) => string` | with `selectable` | — | Names each checkbox: "Select Café Miradouro, 9,50 €". |
| `selected` / `defaultSelected` / `onSelectedChange` | `string[]` | no | — | Ids. |
| `bulkActions` | `(ids) => ReactNode` | no | — | A toolbar above the table while rows are selected. |
| `onRowActivate` | `(row) => void` | no | — | Click, Enter or Space opens the record. |
| `activeRowId` | `string` | no | — | The row open in a Panel. |
| `loading` | `boolean` | no | `false` | Skeleton rows in the real columns; `aria-busy`. |
| `error` / `onRetry` | `ReactNode` / `() => void` | no | — | Replaces the rows with the reason and "Try again". |
| `pagination` | `{ page, pageCount, onPageChange, totalItems?, pageSize? }` | no | — | Server paging. |
| `pageSize` | `number` | no | — | Client paging: the table slices `rows` itself. |
| `filters` | `DataTableFilter<T>[]` | no | — | Above the table. `{ id, type: "search", label, placeholder?, match? }`, `{ id, type: "options", label, options, value }` or `{ id, type: "dateRange", label, value, presets? }`. |
| `filterValues` / `defaultFilterValues` / `onFiltersChange` | `Record<id, string \| string[] \| { from, to }>` | no | — | Controlled filter values leave the filtering to the product, as with sort. |
| `emptyFiltered` | `ReactNode` | no | "Nothing matches these filters" + clear | What to say when the filters, not the data, emptied the table. |
| `stickyHeader` | `boolean` | no | `false` | |

## States

- **Loading** — skeleton rows shaped like the columns, the table `aria-busy`, the skeletons hidden from screen readers.
- **Empty** — the product's `empty`, inside the table so the headings still say what would be here.
- **Error** — "This could not be loaded.", the product's reason, and "Try again".
- **Filtered** — the filter row above the table, "Clear the filters" while any is set, and "12 of 53 shown" announced as the list narrows. A filter that leaves nothing shows its own empty state with the way back, never the product's "no charges yet".
- **Sorted** — `aria-sort` on the column; a third click returns to the product's own order.
- **Selected** — rows tinted, the header checkbox ticked or mixed, the bulk toolbar showing "3 selected".
- **Active** — the row open in a Panel stays tinted while the Panel is open.

## Rules

1. **`empty` is required.** A table that says "No data" has told nobody anything.
2. **Sorting follows the locale.** Ö sorts with O in German; blanks go last whichever way.
3. **Sort cycles asc → desc → off.** The order the product chose is a sort too, and the only way back to it.
4. **Every checkbox is named for its row.** Twenty "Select row" checkboxes are twenty guesses.
5. **The header checkbox selects the page, not the world.** "All 318" is a separate, explicit action in `bulkActions`.
6. **A row's own controls don't open the row.** Clicking a checkbox, a menu or a link inside a row does only that.
7. **Money columns are `numeric`**, right-aligned and tabular, formatted by the product before they arrive.
8. **Filters narrow, then sorting orders, then pages slice** — and a filter change goes back to page 1. Selected rows a filter hides drop out of the bulk actions: an action on records nobody can see is the one nobody meant.
9. **Search ignores case and accents**, and by default reads the row's own text and numbers. Pass `match` when what people search for is not on the row — a supplier's former name, an IBAN.
10. **A period takes whole days at both ends.** A charge at 18:00 on the 30th is in a period ending the 30th.

## Do and don't

```
✓  [☐] Date ↕   Supplier ↕        Amount ↕            ✗  rows that open on click but not on Enter
   [☑] 3 Jun    Staples Lisboa      86,40 €            ✗  "No data"
   [☐] 3 Jun    Galp Energia        61,02 €            ✗  a header checkbox that silently selects 318 rows on 16 pages
```

## Examples

```tsx
<DataTable
  caption="Charges in June"
  columns={[
    { id: "date", header: "Date", cell: (c) => formatDate(c.date, locale), sort: (c) => c.date, muted: true },
    { id: "supplier", header: "Supplier", cell: (c) => c.supplier, sort: (c) => c.supplier },
    { id: "amount", header: "Amount", cell: (c) => eur(c.amount), sort: (c) => c.amount, numeric: true },
    { id: "status", header: "Status", cell: (c) => <Chip tone={tone(c)}>{word(c)}</Chip> },
  ]}
  rows={charges}
  getRowId={(c) => c.id}
  onRowActivate={(c) => setOpenId(c.id)}
  activeRowId={openId}
  selectable
  rowLabel={(c) => `${c.supplier}, ${eur(c.amount)}`}
  bulkActions={(ids) => <Button onClick={() => askForReceipts(ids)}>Ask for the receipts</Button>}
  loading={isLoading}
  error={loadError && "The bank connection timed out."}
  onRetry={refetch}
  pageSize={20}
  filters={[
    { id: "q", type: "search", label: "Search charges", placeholder: "Search by supplier" },
    { id: "category", type: "options", label: "Category", options: categories, value: (c) => c.category },
    { id: "booked", type: "dateRange", label: "Period", value: (c) => c.date, presets: periods },
  ]}
  empty={<EmptyState title="No charges in June yet" description="They show up here as the bank sends them, usually the next morning." />}
/>
```

## Related

`Table` · `Pagination` · `EmptyState` · `Panel` · `Checkbox`
