---
component: InputNumber
category: Form
import: "import { InputNumber } from '@smarta/ui'"
similar: [CurrencyInput, Input]
tokens_only: true
---

# InputNumber

A number, typed in the user's own locale, with the spinbutton role.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to InputNumber.

## Use it when

- The answer is a quantity: a useful life in years, a percentage, a count.
- The user types the number rather than choosing it.
- People type it in German, Portuguese or English and all three have to work.

## Don't use it when

| Situation | Use instead |
|---|---|
| It is an amount of money | `CurrencyInput` — the symbol, two decimals, and the amount read aloud with its currency |
| It is a reference that happens to be digits — a NIF, an IBAN, a phone number | `Input`. Those are not quantities: "0123" is not "123", and nobody steps a phone number |
| It is one of a handful of values | `Select` or `SegmentedControl` |
| It is a range | two InputNumbers labelled From and To |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `value` / `defaultValue` | `number \| null` | no | `null` | `null` is empty. |
| `onValueChange` | `(n: number \| null) => void` | no | — | Fires as the user types (only for what can be read), and again on blur after clamping. |
| `min` / `max` | `number` | no | — | Clamped on blur. `min={0}` also brings up the phone's number pad, which has no minus key; without it the field keeps the full keyboard. |
| `step` | `number` | no | `1` | Arrow keys and steppers. PageUp/PageDown and Shift+arrow move ten. |
| `decimals` | `number` | no | — | The most decimals kept; rounded on blur. |
| `fixedDecimals` | `boolean` | no | `false` | Always show `decimals` digits when not editing. |
| `steppers` | `boolean` | no | `false` | Up/down buttons beside the field. Not in the tab order. |
| `locale` | `string` | no | ThemeProvider's | Override for one field. |
| `formatValue` | `(n, locale) => string` | no | grouped | What the field shows. |
| `formatValueText` | `(n, locale) => string` | no | `formatValue` | What a screen reader hears as the value. |
| …`Input`'s props | | | | `label`, `hint`, `error`, `optional`, `prefix`, `suffix`, `size`. |

## States

- **Empty** — blank; `aria-valuenow` absent.
- **Editing** — shows exactly what was typed, never reformatted under the cursor.
- **Settled** — on blur: clamped, rounded, grouped the locale's way (1.234.567 in German).
- **Unreadable** — on blur, text that is not a number stays in the field with "Write the number like 1.234,5." under it, and the value becomes `null`. It clears the moment the text reads. Grouping must really group: `12.50` in German is refused, not read as 1250.
- **Error / disabled / read-only** — as `Input`.

## Rules

1. **The locale decides the separators, not the browser.** That is the reason this is not `<input type="number">`, which accepts 1,5 or 1.5 depending on the operating system's language rather than the product's.
2. **Nothing is reformatted while it is being typed.** Grouping appears on blur. Inserting a thousands separator under the cursor moves the cursor.
3. **Clamp, do not refuse.** A value over `max` becomes `max` on blur; the user sees what happened. If the limit needs explaining, say it in the `hint`.
4. **Steppers are for small, discrete values** — a count of years, not an amount. For money they are noise.
5. **Validate on blur, then live** — the house rule for every field. `onValueChange` fires while typing so a product can go live after the first error.

## Do and don't

```
✓  Useful life   [   5  ⌃⌄]  years         ✗  <input type="number"> — 1,5 rejected on an English OS
✓  1.234.567 after blur (de-DE)            ✗  1.234 inserted under the cursor while typing "1234"
✓  NIF in an Input                          ✗  NIF in an InputNumber — leading zeros vanish
```

## Examples

```tsx
<InputNumber label="Useful life" suffix="years" min={1} max={30} steppers defaultValue={5} />

<InputNumber label="VAT rate" suffix="%" decimals={1} min={0} max={100} />

// Controlled, with the blur-then-live house rule
const [life, setLife] = useState<number | null>(null);
const [touched, setTouched] = useState(false);
<InputNumber
  label="Useful life"
  value={life}
  onValueChange={setLife}
  onBlur={() => setTouched(true)}
  error={touched && life === null ? "How many years will it be used?" : undefined}
/>
```

## Related

`CurrencyInput` · `Input` · `Field` · `formatNumber` · `parseNumber`
