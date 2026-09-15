---
component: Textarea
category: Form
import: "import { Textarea } from '@smarta/ui'"
similar: [Input, Field]
tokens_only: true
---

# Textarea

A multi-line text field.

## Use it when

- The answer is prose: a note to Ana, a reason for rejecting, a message to a customer.
- The user may reasonably write more than one sentence.

## Don't use it when

| Situation | Use instead |
|---|---|
| The answer fits on a line | `Input` |
| It needs formatting, links or attachments | a composer, not this |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` / `hint` / `error` / `optional` | | no | — | Same contract as `Input`. |
| `rows` | `number` | no | `4` | The resting height. |
| `autoResize` | `boolean` | no | `false` | Grows with the content; disables manual resize. |
| `showCount` | `boolean` | no | `false` | Renders "n / max" as the hint. Requires `maxLength`. |
| …all native `<textarea>` props | | | | |

## States

Empty · Focus · Error · Disabled — identical in behaviour to `Input`.
`showCount` occupies the hint line, so a `hint` and a count cannot both be shown; `error` beats both.

## Rules

1. **Same validation timing as `Input`:** silent while typing, on blur, then live once it has complained.
2. **Only set `maxLength` when a real limit exists downstream** — a character cap the system does not actually enforce is a cap that will be wrong.
3. **`autoResize` for a composer, fixed `rows` for a form field.** A field that grows inside a dense form pushes everything below it around as the user types.
4. **Ask for what you want.** The label is a question — "What should Lena send instead?" — not a noun like "Comments".

## Do and don't

```
✓  What should Lena send instead?
✗  Comments

✓  rows={3} inside a dialog
✗  autoResize inside a dense form beside six other fields
```

## Examples

```tsx
<Textarea label="What should Ana know?" rows={3} hint="One or two sentences is plenty." />

<Textarea label="Message to the customer" maxLength={240} showCount />

<Textarea label="Reply" autoResize rows={2} placeholder="Keep going…" />
```

## Related

`Input` · `Field` · `Dialog`
