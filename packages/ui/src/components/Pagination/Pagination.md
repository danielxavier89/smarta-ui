---
component: Pagination
category: Navigation
import: "import { Pagination } from '@smarta/ui'"
similar: [Table]
tokens_only: true
---

# Pagination

Moves through a list too long to show at once.

## Use it when

- The user needs to **find** a specific row and the total matters.
- The list has a known length: charges, leads, documents.

## Don't use it when

| Situation | Use instead |
|---|---|
| The user scans rather than searches | "Load more", or infinite scroll |
| The total is unknown | neither — fix the query first (rule 1) |
| There are fewer than ~2 pages | nothing |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `page` | `number` | **yes** | — | 1-based. |
| `pageCount` | `number` | **yes** | — | |
| `onPageChange` | `(page: number) => void` | **yes** | — | |
| `totalItems` | `number` | no | — | Renders "121–140 of 318". |
| `pageSize` | `number` | no | — | Needed for the range. |
| `showNumbers` | `boolean` | no | `true` | Turn off below about five pages. |

## States

First page (previous disabled) · Middle · Last page (next disabled) · Single page (render nothing instead).
The number window is never more than seven slots: `1 … 4 5 [6] 7 8 … 20`.

## Rules

1. **Never paginate a list whose total the interface cannot state.** A page 2 with no idea how many pages exist is a dead end. If the backend cannot count, use "Load more".
2. **Always pass `totalItems` and `pageSize` when you have them.** "121–140 of 318" is the sentence users actually want; the arrows are secondary.
3. **The current page carries `aria-current="page"`** — handled for you.
4. **Page state belongs in the URL** where the list is a page of its own, so a shared link lands in the right place.
5. **Don't mix pagination and infinite scroll** in the same list.

## Do and don't

```
✓  121–140 of 318        ‹  1 … 5 [6] 7 … 16  ›
✗  ‹ 6 ›                                        — of how many?
✓  4 pages → showNumbers, no ellipsis needed
✓  1 page  → render nothing
```

## Examples

```tsx
<Pagination
  page={page}
  pageCount={Math.ceil(total / 20)}
  onPageChange={setPage}
  totalItems={total}
  pageSize={20}
/>
```

## Related

`Table` · `List`
