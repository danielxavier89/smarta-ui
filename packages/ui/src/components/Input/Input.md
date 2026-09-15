---
component: Input
category: Form
import: "import { Input } from '@smarta/ui'"
similar: [Textarea, Select, SearchInput, Field]
tokens_only: true
---

# Input

A single-line text field with its label, hint and error wired to it.

## Use it when

- The answer is a short free-text value: a name, a number, a reference, an amount.
- The value is typed rather than chosen.

## Don't use it when

| Situation | Use instead |
|---|---|
| The answer is more than a line | `Textarea` |
| The answer is one of a known set | `Select` (or `RadioGroup` for ≤5 important choices) |
| It filters a list on the page | `SearchInput` |
| It is a date | a native `<input type="date">` wrapped in `Field` |
| You are building a control we don't have | `Field` — it provides the label/hint/error wiring |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `ReactNode` | no (yes in practice) | — | Omit only when a table column header already names the field. |
| `hint` | `ReactNode` | no | — | Steady guidance. Always visible. |
| `error` | `ReactNode` | no | — | **Replaces** the hint while set. Sets `aria-invalid` and `role="alert"`. |
| `optional` | `boolean` | no | `false` | Marks the label "optional". |
| `prefix` / `suffix` | `ReactNode` | no | — | Decorative only — never a button. |
| `size` | `sm \| md \| lg` | no | `md` | |
| `containerClassName` | `string` | no | — | Targets the wrapper; `className` targets the `<input>`. |
| …all native `<input>` props | | | | |

## States

- **Empty** — placeholder in `--fg-subtle`. The placeholder is an example, never a substitute for the label.
- **Focus** — the *wrapper* gains `--accent` and a 3px halo; the inner input drops its own outline, so prefix, field and suffix light up as one control.
- **Error** — border `--bad`, message under the field, `aria-describedby` pointed at it.
- **Disabled** — `--surface-sunken` fill, 70% opacity, `not-allowed` cursor.
- **Loading** — inputs do not have one. Disable the field and put the Spinner on the button that is working.

## Rules

1. **Validate on blur, then live.** Say nothing while the user is first typing. Validate when the field loses focus; once it has shown an error, re-validate on every keystroke so the message clears the instant it is fixed. Never scold mid-word, and never make someone blur again to learn they got it right.
2. **The error replaces the hint, it does not stack with it.** Two lines of small print under one field is where people stop reading either.
3. **Optional is marked; required is not.** An asterisk on everything required marks most of the form and points at nothing.
4. **The error says what to do**, not what is wrong: "A NIF is nine digits. This one has six." Not "Invalid input".
5. **Money is formatted by the product, not by the field.** Pass `prefix="€"`; never bake a currency symbol into the value.
6. **Never use a placeholder as the label.** It vanishes on the first keystroke, exactly when it is needed.

## Do and don't

```
✓  Label:  NIF
   Hint:   Nine digits, no spaces.
   Error:  A NIF is nine digits. This one has six.

✗  Placeholder-only:  [ NIF                    ]
✗  Error + hint both showing at once
✗  Error appearing on the 1st keystroke of a 9-digit number
```

## Examples

```tsx
<Input label="Company name" placeholder="Marcondes & Vale, Lda" />

<Input label="Amount" prefix="€" defaultValue="3,094.10" />

<Input label="Trading name" optional hint="Only if it differs from the legal name." />

// Blur-then-live, the house pattern
const [touched, setTouched] = useState(false);
const bad = touched && value.length !== 9;
<Input
  label="NIF"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={() => setTouched(true)}
  error={bad ? "A NIF is nine digits. This one has " + value.length + "." : undefined}
/>
```

## Related

`Textarea` · `Select` · `SearchInput` · `Field` · `Label`
