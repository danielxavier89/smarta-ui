---
"@smarta/ui": minor
---

**DataTable filters.** A `filters` prop puts a row of filters above the table.
There are three kinds: a search (`type: "search"`), a pick-several list of
values (`type: "options"`), and a period (`type: "dateRange"`).

- **Who filters:** the table filters `rows` itself, unless you pass
  `filterValues` and `onFiltersChange`. Then filtering is left to the product,
  for server-side filtering, the same way `sort` works.
- **Search** ignores case and accents and matches the row's own text and
  numbers. Pass `match` to search something that isn't on the row.
- **Periods** include whole days at both ends.
- **Clearing:** "Clear the filters" appears while any filter is set.
- **Announcements:** screen readers hear "12 of 53 shown" as the list narrows.
- **Empty results:** when the filters leave nothing, the table shows its own
  "Nothing matches these filters" with a way back, not the product's `empty`.
  `emptyFiltered` overrides it.
- **Paging:** a filter change goes back to page 1.
- **Selection:** selected rows the filters hide drop out of the bulk actions.
- **New labels** to translate: `filterAll`, `clearFilters`, `noFilterMatches`,
  `noFilterMatchesHint` and `filteredCount`.
