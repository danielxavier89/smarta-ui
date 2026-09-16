---
component: Spinner
category: Status
import: "import { Spinner } from '@smarta/ui'"
similar: [Progress, Skeleton]
tokens_only: true
---

# Spinner

The one busy indicator, for work with no knowable end.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Spinner.

## Use it when

- An action is in flight: a save, a send, a verify.
- The wait has no percentage attached to it.

## Don't use it when

| Situation | Use instead |
|---|---|
| The end is known (an upload, a checklist) | `Progress` |
| A list or card is arriving and the shape is predictable | `Skeleton` |
| The wait is under ~300ms | nothing — keep the old content with `aria-busy` |
| The whole page is loading | nothing — never a full-page spinner |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `size` | `number` | no | `14` | Pixels. |
| `label` | `string` | no | `"Loading"` | Pass `""` inside a control that already announces itself. |

## Rules

1. **It inherits `currentColor`**, so it is the right colour inside a primary button, a ghost button and a table cell without being told.
2. **It goes where the work is.** In the button that was pressed, in the row that is refreshing — never floating in the middle of the page.
3. **Pass `label=""` inside a `Button`** that is already `aria-busy`, or the wait is announced twice.
4. **Reduced motion is handled globally** in `reset.css`; do not add a second rule.

## Examples

```tsx
<Button variant="primary" loading>Sending</Button>     {/* uses Spinner internally */}

<span className="inline-flex items-center gap-[6px] text-fg-subtle">
  <Spinner size={13} label="" /> Reading the statement
</span>
```

## Related

`Progress` · `Skeleton` · `Button`
