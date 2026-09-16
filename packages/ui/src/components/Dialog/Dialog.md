---
component: Dialog
category: Overlays
import: "import { Dialog } from '@smarta/ui'"
similar: [Panel, Callout, Toast]
tokens_only: true
---

# Dialog

A modal that interrupts to ask one question.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Dialog.

## Use it when

Only these two cases:

1. **The action is irreversible** — delete, reject, convert, send something a customer will see.
2. **Leaving would lose work** — a half-finished form whose content would go.

## Don't use it when

| Situation | Use instead |
|---|---|
| The user can back out of it | `Panel` |
| It is detail about a row | `Panel` |
| It is a rule about the page | `Callout` |
| It is confirmation that something worked | `Toast` |
| The action is reversible | do it, and raise an Undo `Toast` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `open` / `onOpenChange` | | **yes** | — | Controlled. |
| `title` | `ReactNode` | **yes** | — | The question. |
| `description` | `ReactNode` | no (yes for destructive) | — | The consequence, in plain words. |
| `confirm` | `{ label, onConfirm, variant?, loading?, disabled? }` | no | — | The button that does the thing. |
| `cancelLabel` | `string` | no | `"Cancel"` | |
| `blocking` | `boolean` | no | `false` | Removes Escape, click-outside and the close button. |
| `size` | `sm \| md \| lg` | no | `sm` | |

## States

Closed · Open · Confirm loading · Blocking (no escape hatch).

## Rules

1. **The confirm button names the act.** "Reject & tell the customer", "Convert Petra", "Delete the upload". Never "OK", "Yes", "Confirm", "Submit".
2. **The description says what will happen, including to other people.** "Lena will be told what to send instead, and the onboarding goes back to waiting on the customer."
3. **Reversible actions do not get a dialog.** Do it, and offer Undo in a toast. A dialog in front of something undoable is friction with no payoff.
4. **`blocking` is rare.** Reserve it for something that genuinely cannot be shrugged off; everything else lets the user press Escape.
5. **Cancel is a ghost button on the left; confirm is on the right.** Never the reverse, and never two primary-looking buttons. Below `sm` the pair stacks full-width with the confirm on top — a button that names the act does not fit beside a Cancel on a phone. The DOM order does not change, so the keyboard still reaches Cancel first.
6. **Long content scrolls inside the dialog, it does not grow past the screen.** The box is capped at the viewport height and the body scrolls; the title and the buttons stay put. A phone in landscape is about 380px tall, so this is the normal case, not the edge one.
7. **One question per dialog.** Two questions is a `Panel` with a form.
8. **Don't stack dialogs.**

## Do and don't

```
✓  Reject the Gewerbeanmeldung?
   Lena will be told what to send instead, and the onboarding
   goes back to waiting on the customer.
   [Cancel]            [Reject & tell the customer]

✗  Are you sure?
   [Cancel]  [OK]

✓  reversible delete → do it + toast "Receipt deleted  [Undo]"
✗  reversible delete → dialog
```

## Examples

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Reject the Gewerbeanmeldung?"
  description="Lena will be told what to send instead, and the onboarding goes back to waiting on the customer."
  confirm={{ label: "Reject & tell the customer", variant: "danger", onConfirm: reject }}
>
  <Textarea label="What should Lena send instead?" rows={3} />
</Dialog>
```

## Related

`Panel` · `Toast` · `Callout` · `Button`
