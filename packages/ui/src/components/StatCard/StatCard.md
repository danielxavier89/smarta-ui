---
component: StatCard
category: Containers
import: "import { StatCard } from '@smarta/ui'"
similar: [Card, ListItem, Progress]
tokens_only: true
---

# StatCard

One number, named.

## Use it when

- The number itself is the fact the user came for.
- It links to the list behind it.

## Don't use it when

| Situation | Use instead |
|---|---|
| The useful answer is *which one* | `ListItem` naming it |
| The number would be reassuring on a normal day | nothing — see rule 1 |
| It needs more than a caption of context | `Card` |
| It is a proportion with a real total | `Progress` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | **yes** | — | A noun phrase: "Missing charges", not "Missing". |
| `value` | `ReactNode` | **yes** | — | **Already formatted.** Money goes through the product's currency helper first. |
| `caption` | `ReactNode` | no | — | One line naming the thing, not restating the count. |
| `tone` | `default \| ok \| warn \| bad` | no | `default` | |
| `icon` | `ReactNode` | no | — | 15px, `--fg-faint`. |
| `onClick` | `() => void` | no | — | Makes the whole tile a link to the list behind the number. |
| `loading` | `boolean` | no | `false` | Skeleton in place of the value. |

## States

Default · Loading (value only) · Interactive (hover, arrow affordance, focus) · Tone.
There is no empty state: a StatCard with nothing to count should not be rendered, or should read `0` with a caption saying that is good news.

## Rules

1. **Don't report that fine things are fine.** A tile reading "0 overdue" every day is a tile nobody reads on the day it says 3. Both prototypes removed statistics that reported that fine things were fine.
2. **Name the missing thing rather than counting it.** "Revolut ···· 7731 missing" beats "2 of 3 — 1 missing". Reach for a StatCard when the number is the point, and a `ListItem` when the answer is *which one*.
3. **A tile that states a number must have rows behind it.** No off-screen constants, no "and 196 more".
4. **The tile does not format money.** `value` arrives as a string the product produced.
5. **`tone` follows the number's meaning**, not the page's mood: `bad` only when the figure is actually a problem.
6. **If it is clickable, it goes somewhere specific** — the filtered list for that number, not a general page.

## Do and don't

```
✓  Missing charges          ✓  Card statements
   12                          Revolut ···· 7731
   €3,094.10 unsupported       the one still missing

✗  Everything fine          ✗  Card statements
   0                           2 of 3 — 1 missing
```

## Examples

```tsx
<StatCard
  label="Missing charges"
  value="12"
  caption="€3,094.10 unsupported"
  tone="bad"
  icon={<AlertTriangle size={15} />}
  onClick={() => go("/receipts?filter=missing")}
/>

<StatCard label="Unread from Ana" value={eur(total)} loading={loading} />
```

## Related

`Card` · `ListItem` · `Progress` · `Table`
