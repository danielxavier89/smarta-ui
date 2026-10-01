import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatNumber, parseNumber, numberSeparators, type SmartaLocale } from "../../lib/format";
import { useLabels, useLocale } from "../ThemeProvider";
import { Input, type InputProps } from "../Input";

export interface InputNumberProps
  extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "type" | "inputMode" | "min" | "max" | "step"> {
  /** The number, or null for empty. Controlled when passed. */
  value?: number | null;
  defaultValue?: number | null;
  /** Fires with the parsed number as the user types, and once more on blur after clamping. */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Arrow keys and the steppers move by this. PageUp/PageDown move by ten of it. */
  step?: number;
  /** The most decimals kept. Extra digits are rounded away on blur. */
  decimals?: number;
  /** Always show `decimals` digits when the field is not being edited — 12,50 not 12,5. */
  fixedDecimals?: boolean;
  /** Up/down buttons beside the field. Off by default: they are clutter on a form of amounts. */
  steppers?: boolean;
  /** Overrides the ThemeProvider's locale for this field. */
  locale?: SmartaLocale;
  /** Formats the value shown in the field. Defaults to the locale's grouping. */
  formatValue?: (value: number, locale: SmartaLocale) => string;
  /**
   * What a screen reader hears as the value, when that should say more than
   * the field shows — the currency, a unit. Defaults to `formatValue`.
   */
  formatValueText?: (value: number, locale: SmartaLocale) => string;
}

/**
 * A number, typed in the user's own locale.
 *
 * A German user types 1.234,56 and means one thousand two hundred and
 * thirty-four; an English user types 1,234.56. A native <input type="number">
 * rejects one of them depending on the browser's language rather than the
 * product's, gives every value a spinner the size of a pinhead, and changes the
 * number under the user's scroll wheel. This is a text field with the
 * spinbutton role instead, and it parses with the product's locale.
 *
 * While the field has focus it shows what was typed, untouched. On blur it
 * clamps to min/max, rounds to `decimals`, and shows the number grouped the
 * locale's way — so the value is never reformatted under the cursor.
 */
export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  {
    value: valueProp,
    defaultValue = null,
    onValueChange,
    min,
    max,
    step = 1,
    decimals,
    fixedDecimals = false,
    steppers = false,
    locale: localeProp,
    formatValue,
    formatValueText,
    onFocus,
    onBlur,
    onKeyDown,
    suffix,
    disabled,
    readOnly,
    className,
    ...props
  },
  ref,
) {
  const labels = useLabels();
  const contextLocale = useLocale();
  const locale = localeProp ?? contextLocale;

  const controlled = valueProp !== undefined;
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const value = controlled ? (valueProp ?? null) : inner;

  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState("");

  const display = React.useCallback(
    (n: number) =>
      formatValue
        ? formatValue(n, locale)
        : formatNumber(n, locale, {
            minimumFractionDigits: fixedDecimals ? (decimals ?? 0) : 0,
            maximumFractionDigits: decimals ?? 20,
          }),
    [formatValue, locale, fixedDecimals, decimals],
  );

  /** What goes in the field when it gains focus: no grouping, the locale's decimal mark. */
  const editable = React.useCallback(
    (n: number) => {
      const { decimal } = numberSeparators(locale);
      return String(n).replace(".", decimal);
    },
    [locale],
  );

  const commit = (n: number | null) => {
    if (!controlled) setInner(n);
    onValueChange?.(n);
  };

  const settle = (n: number) => {
    let out = n;
    if (min !== undefined) out = Math.max(min, out);
    if (max !== undefined) out = Math.min(max, out);
    if (decimals !== undefined) out = Number(out.toFixed(decimals));
    return out;
  };

  const nudge = (by: number) => {
    if (disabled || readOnly) return;
    const next = settle((value ?? (min !== undefined && min > 0 ? min : 0)) + by);
    commit(next);
    if (editing) setText(editable(next));
  };

  const shown = editing ? text : value === null ? "" : display(value);

  return (
    <Input
      ref={ref}
      type="text"
      inputMode={decimals === 0 ? "numeric" : "decimal"}
      role="spinbutton"
      aria-valuenow={value ?? undefined}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={value === null ? undefined : (formatValueText ?? display)(value, locale)}
      autoComplete="off"
      disabled={disabled}
      readOnly={readOnly}
      value={shown}
      onFocus={(e) => {
        setEditing(true);
        setText(value === null ? "" : editable(value));
        onFocus?.(e);
      }}
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        const n = parseNumber(t, locale);
        // Report what can be read as it is typed; "1," mid-word is not a number
        // yet and is not reported, rather than reported as an error.
        if (n === null || !Number.isNaN(n)) commit(n);
      }}
      onBlur={(e) => {
        const n = parseNumber(text, locale);
        if (n === null) commit(null);
        else if (!Number.isNaN(n)) {
          const settled = settle(n);
          if (settled !== value) commit(settled);
        }
        // Anything unreadable falls back to the last good value rather than
        // keeping text the field cannot hold.
        setEditing(false);
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const big = step * 10;
        if (e.key === "ArrowUp") nudge(e.shiftKey ? big : step);
        else if (e.key === "ArrowDown") nudge(-(e.shiftKey ? big : step));
        else if (e.key === "PageUp") nudge(big);
        else if (e.key === "PageDown") nudge(-big);
        else if (e.key === "Home" && min !== undefined) commit(min);
        else if (e.key === "End" && max !== undefined) commit(max);
        else return;
        e.preventDefault();
      }}
      suffix={
        steppers || suffix ? (
          <span className="sui:flex sui:items-center sui:gap-[6px]">
            {suffix}
            {steppers && (
              <span className="sui:flex sui:flex-col sui:-my-[4px]">
                {/* Out of the tab order, as the spinbutton pattern asks: the
                    arrow keys already do this from the field itself, and two
                    extra stops per number would make a form of amounts tedious. */}
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={labels.increase}
                  disabled={disabled || readOnly || (max !== undefined && value !== null && value >= max)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => nudge(step)}
                  className={cn(
                    "sui:grid sui:h-[14px] sui:w-[18px] sui:place-items-center sui:rounded-xs sui:text-fg-subtle",
                    "sui:hover:bg-surface-hover sui:hover:text-fg sui:disabled:opacity-40 sui:disabled:cursor-not-allowed",
                  )}
                >
                  <ChevronUp size={12} aria-hidden />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={labels.decrease}
                  disabled={disabled || readOnly || (min !== undefined && value !== null && value <= min)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => nudge(-step)}
                  className={cn(
                    "sui:grid sui:h-[14px] sui:w-[18px] sui:place-items-center sui:rounded-xs sui:text-fg-subtle",
                    "sui:hover:bg-surface-hover sui:hover:text-fg sui:disabled:opacity-40 sui:disabled:cursor-not-allowed",
                  )}
                >
                  <ChevronDown size={12} aria-hidden />
                </button>
              </span>
            )}
          </span>
        ) : undefined
      }
      className={cn("sui:tabular-nums", className)}
      {...props}
    />
  );
});
