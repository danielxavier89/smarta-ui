---
component: Label
category: Form
import: "import { Label } from '@smarta/ui'"
similar: [Field]
tokens_only: true
---

# Label

The words naming a control.

## Use it when

- You are laying out a form by hand and need the label alone.
- A control sits outside a `Field` but still needs a real `<label for>`.

## Don't use it when

| Situation | Use instead |
|---|---|
| You need label + hint + error | `Field` |
| The control is `Input`/`Select`/`Textarea` | pass their `label` prop |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `htmlFor` | `string` | yes in practice | — | Without it, the label is decoration. |
| `optional` | `boolean` | no | `false` | Appends a quiet "optional". |

## Rules

1. **Optional is marked; required is not.** Marking everything required puts a mark on most of the form and draws the eye to the wrong thing. Marking the two fields a user may skip tells them something they did not already assume.
2. **Sentence case, no colon.** "Company name", not "Company Name:".
3. **A label is a noun phrase; a question is fine for a `Textarea` or `RadioGroup`.**
4. **Never replace it with a placeholder.**

## Examples

```tsx
<Label htmlFor="nif">NIF</Label>
<Label htmlFor="trading" optional>Trading name</Label>
```

## Related

`Field` · `Input`
