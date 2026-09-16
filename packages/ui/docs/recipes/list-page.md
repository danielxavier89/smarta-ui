---
kind: recipe
screen: a list or table with filters, detail, and the states around it
components: [SearchInput, DropdownMenu, SegmentedControl, Tabs, Table, ListItem, Chip, EmptyState, Pagination, Panel, Skeleton]
---

# A list page

The commonest screen in both products: receipts, charges, leads, documents,
assets. Start here rather than assembling from scratch.

## Shape

```
PageHeader        title, and the one primary action if the page has one
Toolbar           SearchInput · filters (DropdownMenu) · view (SegmentedControl)
Tabs              only when the tabs change WHICH rows, with counts
Table | List      the rows
Pagination        only when the total is knowable
Panel             opens on a row click, over the list
```

## Choosing the row component

| The rows are | Use |
|---|---|
| The same columns, compared down a column | `Table` |
| Read across — a title, prose, an avatar | `ListItem` inside `List` |

## The states, in the order you will hit them

1. **Loading** — `SkeletonList rows={n}` inside the same `List`/`Table` shell, so
   the page does not jump when data lands. Under ~300ms, keep the old rows with
   `aria-busy`.
2. **Loaded** — rows.
3. **Empty, first run** — `EmptyState variant="first-run"` with the action that
   creates the first one.
4. **Empty from a filter** — `EmptyState variant="no-results"` **inside
   `TableEmpty`** so the header row survives and the user can see what they
   filtered. Offer to clear the filter.
5. **Locked** — `EmptyState variant="locked"`: say why and where to go instead.
6. **Failed** — `EmptyState variant="error"` with a retry, or a `Callout` above
   the list if some rows did load.

## Rules particular to this screen

- **Tab counts derive from the rows the tab renders.** `count={rows.length}` for
  the same array the panel shows. A count fetched separately will eventually
  disagree with the list under it.
- **A clickable row needs `tabIndex={0}` and a key handler.** The component gives
  you hover and the focus ring; it cannot give you the keyboard.
- **A clickable row may not contain another button** unless it stops
  propagation. If rows need their own actions, use `ListItem` without
  `clickable` and put a `Button` in `actions`.
- **Selecting a row marks it.** `selected` on the row whose `Panel` is open, so
  the user does not lose their place when they look right.
- **Never paginate a list whose total you cannot state.** "Page 2 of ?" is a dead
  end — use "Load more" instead.
- **Filters live in the URL** where the list is a page of its own; panel state
  does not, because a history entry per panel means ten back-presses to leave.

## Skeleton

```tsx
const rows = useRows(filters);

<div className="flex flex-col gap-[16px]">
  <div className="flex flex-wrap items-center gap-[10px]">
    <SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")}
      placeholder="Search receipts, charges, messages" />
    <DropdownMenu>{/* checkbox items for status */}</DropdownMenu>
  </div>

  <Tabs value={tab} onValueChange={setTab}>
    <TabsList>
      <Tab value="all" count={all.length}>All charges</Tab>
      <Tab value="missing" count={missing.length}>No receipt</Tab>
    </TabsList>
    <TabPanel value={tab}>
      {loading ? (
        <SkeletonList rows={6} />
      ) : (
        <Table>
          <THead sticky><TR><TH>Date</TH><TH>Supplier</TH><TH align="right">Amount</TH><TH>Status</TH></TR></THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.id} clickable tabIndex={0} selected={openId === r.id}
                  onClick={() => setOpenId(r.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") setOpenId(r.id); }}>
                <TD muted>{r.date}</TD>
                <TD>{r.supplier}</TD>
                <TD numeric>{eur(r.amount)}</TD>
                <TD><Chip tone={r.tone} size="sm">{r.label}</Chip></TD>
              </TR>
            ))}
            {rows.length === 0 && (
              <TableEmpty colSpan={4}>
                <EmptyState size="sm" variant="no-results"
                  title={`Nothing matches “${q}”`}
                  description="Check the spelling, or clear the search to see all 53 charges."
                  action={<Button size="sm" onClick={clear}>Clear the search</Button>} />
              </TableEmpty>
            )}
          </TBody>
        </Table>
      )}
    </TabPanel>
  </Tabs>

  <Pagination page={page} pageCount={pageCount} onPageChange={setPage}
    totalItems={total} pageSize={20} />
</div>
```

## Related

`docs/recipes/detail-panel.md` for what opens on a row click.
