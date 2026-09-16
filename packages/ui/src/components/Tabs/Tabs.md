---
component: Tabs
category: Navigation
import: "import { Tabs, TabsList, Tab, TabPanel } from '@smarta/ui'"
similar: [SegmentedControl, Select]
tokens_only: true
---

# Tabs

Switches **what** is shown, within one page.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Tabs.

## Use it when

- Two to six views of the same record or list, only one relevant at a time.
- Each view has a different set of rows: "All charges" / "No receipt" / "Matched".
- Counts help the user pick.

## Don't use it when

| Situation | Use instead |
|---|---|
| It changes **how** the same content is displayed | `SegmentedControl` |
| It is a form answer | `RadioGroup` |
| There are more than about six | a `Select`, or a sidebar |
| The views are separate pages with their own URLs | real routes |

## Props

**`Tabs`** — Radix `Tabs.Root`: `value`, `onValueChange`, `defaultValue`.
**`TabsList`** — the bar. Scrolls horizontally rather than wrapping on a phone.
**`Tab`** — `value`, `count?`, `disabled?`.
**`TabPanel`** — `value`.

## States

Inactive · Active (accent underline and text) · Hover · Focus · Disabled · With count.

## Rules

1. **Derive the count from the rows the tab renders.** `count={rows.length}` for the same list the panel shows. A count passed in separately is a count that will eventually disagree with the list underneath it — which is exactly the bug the webapp's `setTabCounts` mechanism exists to prevent.
2. **Active state lives in the value, never in a CSS class you read back.**
3. **A tab with a count of 0 stays visible** — it is information that the bucket is empty. This is the one place a zero is worth showing, because the alternative is a tab bar that changes shape.
4. **Sentence case, and short.** "No receipt", not "Charges Without A Receipt".
5. **Keep the panel mounted or don't** — but be consistent, so filters and scroll position behave the same on every tab.

## Do and don't

```
✓  All charges 53   No receipt 12   Matched 41
     ───────────
✗  All charges      No receipt (12)   Matched
                     ↑ count from a different query than the list

✓  Tabs   → All / No receipt / Matched      (different rows)
✓  Segmented → List / Grid / Calendar       (same rows)
```

## Examples

```tsx
const rows = data[tab];

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <Tab value="all" count={data.all.length}>All charges</Tab>
    <Tab value="missing" count={data.missing.length}>No receipt</Tab>
    <Tab value="matched" count={data.matched.length}>Matched</Tab>
  </TabsList>
  <TabPanel value={tab}>{/* renders `rows` — the same array the counts came from */}</TabPanel>
</Tabs>
```

## Related

`SegmentedControl` · `Select` · `Table` · `Badge`
