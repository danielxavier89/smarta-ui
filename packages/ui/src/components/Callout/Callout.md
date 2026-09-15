---
component: Callout
category: Overlays
import: "import { Callout } from '@smarta/ui'"
similar: [Toast, EmptyState, Chip]
tokens_only: true
---

# Callout

A message that stays on the page.

## Use it when

- A rule applies that the user needs before they act: a closed period, a blocked conversion.
- Something failed, and the failure belongs beside the thing that failed.
- A standing piece of guidance the user will want again tomorrow.

## Don't use it when

| Situation | Use instead |
|---|---|
| It is about a moment, not a place | `Toast` |
| There is nothing to show at all | `EmptyState` |
| It is a one-or-two-word status on a row | `Chip` |
| It is about one field | that field's `error` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `tone` | `info \| ok \| warn \| bad \| neutral` | no | `info` | `bad` renders `role="alert"`. |
| `title` | `ReactNode` | no | — | The point, in one line. |
| `children` | `ReactNode` | no | — | One or two short paragraphs. |
| `action` | `ReactNode` | no | — | The next step, right where the problem is described. |
| `icon` | `ReactNode` | no | tone default | |
| `onDismiss` | `() => void` | no | — | Only for advice, never for an error. |

## States

One per tone. A Callout has no loading or disabled state; it is content.

## Rules

1. **A Callout persists and belongs to a place; a Toast is transient and belongs to a moment.** Use a toast for "that worked" and a callout for "here is why this is the way it is".
2. **Errors live here, not in a Toast.** Re-readable, and still there when the user comes back.
3. **Put the fix in the callout.** A `warn` callout describing a blocker should carry the button that resolves it, or say plainly who owes what.
4. **`onDismiss` only where the message is advice.** A dismissible error is an error the user can hide from themselves.
5. **At most one per view.** Two callouts stacked is a page arguing with itself.
6. **`neutral` for a locked or read-only state** — it is a fact, not a warning.

## Do and don't

```
✓  ⚠ Two documents are blocking the conversion
     The customer owes a Gewerbeanmeldung; Tax Ops owes the Steuernummer check.
     [See what]

✓  🔒 This period is read-only
     You can still ask Ana to reopen it.

✗  ✕ Something went wrong.            — no cause, no way out
✗  three callouts stacked at the top of a page
```

## Examples

```tsx
<Callout tone="warn" title="Two documents are blocking the conversion" action={<Button size="sm">See what</Button>}>
  <p>The customer owes a Gewerbeanmeldung; Tax Ops owes the Steuernummer check.</p>
</Callout>

<Callout tone="neutral" title="May 2026 is closed">
  <p>Ana filed it on 18 June. You can still <TextLink>ask her to reopen it</TextLink>.</p>
</Callout>
```

## Related

`Toast` · `EmptyState` · `Dialog` · `Chip`
