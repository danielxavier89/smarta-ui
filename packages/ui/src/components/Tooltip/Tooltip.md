---
component: Tooltip
category: Overlays
import: "import { Tooltip, TooltipProvider } from '@smarta/ui'"
similar: [Callout, Chip]
tokens_only: true
---

# Tooltip

A short label on hover and on keyboard focus.

Wrap the app in `<TooltipProvider>` once. It is not mandatory — a Tooltip
supplies its own when none is found, so a library component that renders one
internally cannot crash an app that forgot. Mounting it at the root is still
worth doing: it is what makes tooltips share a delay group, so the second one
you hover appears immediately instead of waiting again.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Tooltip.

## Use it when

- Naming an `IconButton` beyond its `aria-label`, for sighted users.
- A unit, a full date behind a relative one, an exact figure behind a rounded one.
- Saying why a disabled control is disabled.

## Don't use it when

| Situation | Use instead |
|---|---|
| The user must read it to decide something | put it on the page |
| It contains a link or a button | `Popover` (not in this library yet) or `Panel` |
| It is more than about ten words | `Callout` |
| It is the only copy of the information | anywhere but here |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `content` | `ReactNode` | **yes** | — | Short. |
| `children` | `ReactNode` | **yes** | — | The trigger. Must be a real, focusable element. |
| `side` | `top \| right \| bottom \| left` | no | `top` | |
| `align` | `start \| center \| end` | no | `center` | |
| `delayDuration` | `number` | no | `200` | |
| `open` / `onOpenChange` | | no | — | For pinning it on touch. |

## States

Hidden · Delayed open · Open. It uses `--inverse-surface`, which flips: dark in light mode, light in dark mode.

## What may live only in a tooltip

Provenance and units. Nothing else.

| Allowed | Not allowed |
|---|---|
| Where a number came from — "Converted at 1.1105 on 14 June." | The value itself — a NIF the user needs to copy |
| The full date behind a relative one | An action, a link, or a button |
| Why a control is disabled — "2 documents still missing" | A consequence — "This will delete the receipt" |
| The name of an icon-only control | Anything that changes a decision |

## Rules

1. **Hover never fires on touch**, and a tooltip cannot be re-read once the
   pointer moves. That is the whole reason for the table above.
2. **Where provenance does live in a tooltip, its trigger is a real `<button>`** —
   so a keyboard opens it on focus and a finger can tap it. `KeyValue`'s note
   icon is the worked example.
3. **No interactive content.** Radix will let you; the user's pointer will not
   survive the trip.
4. **The trigger must be focusable.** A tooltip on a `<span>` is invisible to a
   keyboard.
5. **A disabled control's tooltip must still be reachable** — one more reason to
   prefer `aria-disabled` plus an explanation on click.
6. **Sentence case, no full stop**, and about ten words.
7. **The content is portalled but stays in its theme.** `ThemeScope` handles it;
   wrap any new portalled surface the same way.

## Do and don't

```
✓  (i) → "Depreciated over 4 years"
✓  [Convert Petra] (dimmed) → "2 documents and 1 tax number missing"

✗  tooltip containing [Upload it]
✗  the NIF only in a tooltip
✗  a paragraph in a tooltip
```

## Examples

```tsx
<TooltipProvider>
  <Tooltip content="Depreciated over 4 years">
    <IconButton variant="ghost" label="About depreciation" icon={<Info size={15} />} />
  </Tooltip>

  <Tooltip content="2 documents and 1 tax number are still missing" side="bottom">
    <Button disabled>Convert Petra</Button>
  </Tooltip>
</TooltipProvider>
```

## Related

`Callout` · `IconButton` · `KeyValue`
