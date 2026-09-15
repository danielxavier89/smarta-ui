---
component: Badge
category: Status
import: "import { Badge } from '@smarta/ui'"
similar: [Chip]
tokens_only: true
---

# Badge

A count on top of something else: the unread bubble on a nav item, the number beside a tab.

## Use it when

- The useful fact is **how many**, and the number is small enough to be read at a glance.
- It sits on or beside another element rather than standing alone.

## Don't use it when

| Situation | Use instead |
|---|---|
| The fact is a word, not a number | `Chip` |
| The number is the point of the whole tile | `StatCard` |
| It counts rows behind a tab | `Tab`'s own `count` prop |
| It only means "something changed" | `IconButton`'s `indicator`, or `dotOnly` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `count` | `number` | **yes** | — | Renders nothing at 0 unless `showZero`. |
| `max` | `number` | no | `99` | Above this it reads "99+". |
| `tone` | `bad \| accent \| neutral` | no | `bad` | |
| `dotOnly` | `boolean` | no | `false` | A plain dot, no number. |
| `unit` | `string` | no | — | The accessible name: "unread messages". |
| `showZero` | `boolean` | no | `false` | |

## States

Hidden (count 0) · Number · Capped ("99+") · Dot only.
No hover, focus or disabled — a Badge is not interactive. When it sits on a button, the *button* is the control.

## Rules

1. **A badge reading 0 is worse than no badge.** Zero hides by default; only set `showZero` when the absence itself is the news.
2. **Always pass `unit`.** "12" read aloud tells a screen-reader user twelve of nothing.
3. **`bad` is for things the user owes attention to**, `accent` for things that are merely new, `neutral` for a count with no urgency.
4. **Never put a badge on a badge**, or two on one element. If there are two counts, one of them belongs in the row.
5. **Don't animate the number changing.** An unprompted change rewrites the screen under the reader's eye.

## Do and don't

```
✓  Messages        (3)
✓  Notifications        — 0, so nothing is drawn
✗  Notifications   (0)

✓  <Badge count={12} unit="open tasks" />
✗  <Badge count={12} />                    — "twelve" of what?
```

## Examples

```tsx
<Badge count={unread} unit="unread messages" />

<div className="relative inline-flex">
  <IconButton label="Notifications, 5 unread" icon={<Bell size={16} />} />
  <span className="absolute -right-[6px] -top-[6px]"><Badge count={5} unit="unread notifications" /></span>
</div>
```

## Related

`Chip` · `IconButton` · `Tabs` · `StatCard`
