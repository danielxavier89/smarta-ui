---
component: Skeleton
category: Status
import: "import { Skeleton, SkeletonList } from '@smarta/ui'"
similar: [Spinner, Progress]
tokens_only: true
---

# Skeleton

A placeholder in the shape of the thing that is coming.

## Use it when

- A list, table, card or avatar is loading and you know its shape.
- The wait is long enough to notice — roughly 300ms or more.

## Don't use it when

| Situation | Use instead |
|---|---|
| The wait is under ~300ms | nothing — keep the old content with `aria-busy` |
| The result's shape is unknown | `Spinner` |
| An action is in flight | `Spinner` in the button |
| The result may well be empty | render, then show an `EmptyState` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `width` / `height` | `string` | no | — | Any CSS length. |
| `shape` | `line \| block \| circle` | no | `line` | |

`SkeletonList`: `rows` (default 4) — a ready-made list shape with avatar and two lines.

## States

One: pulsing. The animation is suppressed by the global reduced-motion rule.

## Rules

1. **It only earns its place when it resembles the result.** A grey rectangle where a table will be is honest; a grey rectangle where anything might be is a flash that makes the page feel less finished.
2. **Match the real row count if you know it**, so the page does not jump when the data lands.
3. **It is `aria-hidden`; the container announces the wait.** `SkeletonList` carries `role="status"` for you.
4. **Never skeleton a number you already have.** Show the old figure with `aria-busy` while the new one loads.

## Do and don't

```
✓  list of 5 rows loading → SkeletonList rows={5}
✗  200ms fetch → skeleton flash
✓  200ms fetch → old content, aria-busy

✗  <Skeleton /> in place of a StatCard you already have last hour's value for
```

## Examples

```tsx
{loading ? <SkeletonList rows={5} /> : rows.map(r => <ListItem key={r.id} {...r} />)}

<StatCard label="Missing charges" value={value} loading={loading} />
```

## Related

`Spinner` · `Progress` · `EmptyState`
