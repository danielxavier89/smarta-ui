---
component: Field
category: Form
import: "import { Field } from '@smarta/ui'"
similar: [Input, Label]
tokens_only: true
---

# Field

Label, control, and the one line underneath — wired together so the hint and the error actually reach a screen reader.

## Use it when

- You are wrapping a control this library does not provide: a native date input, a colour picker, a third-party editor.
- You need the same label/hint/error contract as `Input` around something of your own.

## Don't use it when

| Situation | Use instead |
|---|---|
| The control is a text field | `Input` — it already uses Field |
| The control is a select, textarea, or radio group | those components — same |
| You only need a label | `Label` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `children` | `(ids) => ReactNode` | **yes** | — | Render prop. Spread `ids` onto your control. |
| `label` | `ReactNode` | no | — | |
| `hint` | `ReactNode` | no | — | |
| `error` | `ReactNode` | no | — | Replaces the hint while set. |
| `optional` | `boolean` | no | `false` | |
| `id` | `string` | no | generated | |

`ids` is `{ id, "aria-describedby", "aria-invalid" }`.

## States

Same as `Input`: the error replaces the hint, sets `aria-invalid`, and is announced via `role="alert"`.

## Rules

1. **It is a render prop, not `cloneElement`.** The wiring is visible at the call site rather than happening to a child behind its back — which is why you can see, in review, that the control actually got the ids.
2. **Spread every id.** Dropping `aria-describedby` silently removes the hint and the error from the accessibility tree, and nothing on screen changes, so nobody notices.
3. **Same validation timing as everything else:** blur, then live.

## Examples

```tsx
<Field label="Filed on" hint="The date the return was accepted." optional>
  {(ids) => (
    <input
      type="date"
      className="h-[var(--control-height-md)] rounded-md border border-border bg-surface px-[var(--control-padding-x-md)] text-base text-fg outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]"
      {...ids}
    />
  )}
</Field>
```

## Related

`Input` · `Label` · `Textarea` · `Select`
