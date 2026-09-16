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

## Rules

1. **Hover never fires on touch.** Anything that lives only in a tooltip is simply gone on a phone. Never the only home for information.
2. **It cannot be reached, selected or copied.** A tax number the user needs to copy goes in a `KeyValue` row with a copy button.
3. **No interactive content.** Radix will let you; the user's pointer will not survive the trip.
4. **The trigger must be focusable** — a `<button>`, a link, or something with `tabIndex`. A tooltip on a `<span>` is invisible to a keyboard.
5. **A disabled button's tooltip must still be reachable** — which is one more reason to prefer `aria-disabled` plus an explanation on click.
6. **Sentence case, no full stop.**
7. **The content is portalled but stays in its theme.** Radix renders into
   `document.body`, outside the element carrying `data-product`/`data-theme`,
   so the tooltip used to resolve its tokens from `:root` and could come out in
   a different palette from the surface that opened it. `ThemeScope` re-applies
   the scope inside the portal. The same applies to `Panel`, `Dialog` and
   `DropdownMenu`; if you add another portalled surface, wrap its portal too.

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
