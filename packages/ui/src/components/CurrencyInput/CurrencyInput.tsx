import * as React from "react";
import { formatCurrency, type SmartaLocale } from "../../lib/format";
import { useLocale } from "../ThemeProvider";
import { InputNumber, type InputNumberProps } from "../InputNumber";

export interface CurrencyInputProps
  extends Omit<InputNumberProps, "decimals" | "fixedDecimals" | "prefix" | "suffix" | "formatValue"> {
  /** ISO 4217. The products are EUR, but a receipt can be in anything. */
  currency?: string;
}

/** Where the locale puts the symbol for this currency, and what it is. */
function symbolPlacement(locale: SmartaLocale, currency: string) {
  const parts = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(1);
  const symbolAt = parts.findIndex((p) => p.type === "currency");
  const numberAt = parts.findIndex((p) => p.type === "integer");
  const symbol = parts[symbolAt]?.value ?? currency;
  return { symbol, before: symbolAt < numberAt };
}

/**
 * An amount of money, typed and shown the way the user's locale writes it.
 *
 * The symbol goes where the locale puts it — after the amount in German and
 * Portuguese, before it in English — because "€ 1.234,56" reads as wrong to a
 * German accountant the same way "1,234.56 €" does to an English one. It is
 * decorative; the full amount, symbol and all, is what a screen reader hears.
 *
 * Two decimals always, because a column of amounts that sometimes shows ,5 and
 * sometimes ,50 cannot be read down.
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { currency = "EUR", locale: localeProp, ...props },
  ref,
) {
  const contextLocale = useLocale();
  const locale = localeProp ?? contextLocale;
  const { symbol, before } = symbolPlacement(locale, currency);

  return (
    <InputNumber
      ref={ref}
      locale={locale}
      decimals={2}
      fixedDecimals
      // The field shows the number; the symbol is drawn beside it.
      formatValue={(n, l) =>
        new Intl.NumberFormat(l, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
      }
      // A screen reader hears the money, not just the digits: "1.234,56 €".
      formatValueText={(n, l) => formatCurrency(n, l, { currency })}
      prefix={before ? symbol : undefined}
      suffix={before ? undefined : symbol}
      {...props}
    />
  );
});
