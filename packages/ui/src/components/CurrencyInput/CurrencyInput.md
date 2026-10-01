---
component: CurrencyInput
category: Form
import: "import { CurrencyInput } from '@smarta/ui'"
similar: [InputNumber, Input]
tokens_only: true
---

# CurrencyInput

An amount of money, typed and shown the way the user's locale writes it.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to CurrencyInput.

## Use it when

- The answer is an amount: a net value, a VAT amount, a total, a limit.
- The user types the amount rather than reading it.

## Don't use it when

| Situation | Use instead |
|---|---|
| The amount is shown, not entered | a formatted string — `formatCurrency(n, locale)` — in a `KeyValue` or a `TD numeric` |
| It is a quantity that is not money | `InputNumber` |
| It is a percentage | `InputNumber` with `suffix="%"` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `currency` | `string` | no | `"EUR"` | ISO 4217. |
| `value` / `defaultValue` | `number \| null` | no | `null` | The amount as a number — never a formatted string. |
| `onValueChange` | `(n: number \| null) => void` | no | — | |
| `min` / `max` | `number` | no | — | |
| `locale` | `string` | no | ThemeProvider's | |
| …`InputNumber`'s other props | | | | `decimals` is fixed at 2. |

## States

As `InputNumber`. The symbol sits outside the field and is decorative; the field holds only the number.

## Rules

1. **The symbol goes where the locale puts it.** After the amount in German and Portuguese (1.234,56 €), before it in English (€1,234.56). The component reads it from Intl — never pass a symbol as `prefix`.
2. **Always two decimals when settled.** A column of amounts that sometimes ends ,5 and sometimes ,50 cannot be read down.
3. **The value is a number.** Store cents as a number of euros and format on the way out. A formatted string in state is how 1.234 becomes one-point-two-three-four in the next locale.
4. **A screen reader hears the money**, "1.234,56 €", not the digits alone — `aria-valuetext` carries it.

## Do and don't

```
✓  Net   [ 1.234,56 ] €     (de-DE)          ✗  Net  [ € 1.234,56 ]   symbol typed into the value
✓  Net   € [ 1,234.56 ]     (en-GB)          ✗  prefix="€" on a German form
✓  value={1234.56}                            ✗  value="1.234,56 €"
```

## Examples

```tsx
<CurrencyInput label="Net" value={net} onValueChange={setNet} />

<CurrencyInput label="Receipt total" currency="USD" hint="As printed on the receipt." />

<CurrencyInput label="Limit" min={0} max={10000} hint="Up to 10.000 € a month." />
```

## Related

`InputNumber` · `formatCurrency` · `parseNumber` · `KeyValue`
