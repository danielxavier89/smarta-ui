import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatNumber, parseNumber, type SmartaLocale } from "../../lib/format";
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
    error,
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
  // Set on blur when the text is not a number; then live, as the house rule asks.
  const [problem, setProblem] = React.useState<string | null>(null);

  // A value the parent set — a form reset — replaces whatever unreadable text
  // was left in the field; a value this field reported itself does not.
  const sent = React.useRef<number | null>(value);
  React.useEffect(() => {
    if (!controlled || (valueProp ?? null) === sent.current) return;
    sent.current = valueProp ?? null;
    setProblem(null);
  }, [controlled, valueProp]);

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
    // Intl, not String(n): String(1e21) is exponent text that would not parse back.
    (n: number) => new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }).format(n),
    [locale],
  );

  const commit = (n: number | null) => {
    // Nothing changed, nothing reported: a spurious onValueChange marks a
    // Formik field dirty for having been tabbed through.
    if (n === value) return;
    sent.current = n;
    if (!controlled) setInner(n);
    onValueChange?.(n);
  };

  const decimalsOf = (n: number) => (String(n).split(".")[1] ?? "").length;

  const settle = (n: number) => {
    let out = n;
    if (min !== undefined) out = Math.max(min, out);
    if (max !== undefined) out = Math.min(max, out);
    if (decimals !== undefined) out = Number(out.toFixed(decimals));
    return out;
  };

  const nudge = (by: number) => {
    if (disabled || readOnly) return;
    const from = value ?? (min !== undefined && min > 0 ? min : 0);
    // 0.2 + 0.1 is 0.30000000000000004; round to the finer of the two.
    const next = settle(Number((from + by).toFixed(Math.max(decimalsOf(from), decimalsOf(by)))));
    commit(next);
    if (editing) setText(editable(next));
  };

  const shown = editing || problem ? text : value === null ? "" : display(value);

  return (
    <Input
      ref={ref}
      type="text"
      // A phone's number pad has no minus key. Only a field that cannot go
      // negative gets one; the others keep the full keyboard.
      inputMode={min !== undefined && min >= 0 ? (decimals === 0 ? "numeric" : "decimal") : "text"}
      role="spinbutton"
      aria-valuenow={value ?? undefined}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={value === null ? undefined : (formatValueText ?? display)(value, locale)}
      autoComplete="off"
      disabled={disabled}
      readOnly={readOnly}
      error={error ?? problem ?? undefined}
      value={shown}
      onFocus={(e) => {
        setEditing(true);
        if (!problem) setText(value === null ? "" : editable(value));
        onFocus?.(e);
      }}
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        const n = parseNumber(t, locale);
        // Report what can be read as it is typed; "1," mid-word is not a number
        // yet and is not reported, rather than reported as an error.
        if (n === null || !Number.isNaN(n)) {
          commit(n);
          setProblem(null);
        }
      }}
      onBlur={(e) => {
        const n = parseNumber(text, locale);
        if (n === null) commit(null);
        else if (!Number.isNaN(n)) commit(settle(n));
        else {
          // Unreadable text stays, with a message, and the value empties.
          // Falling back to the last number that parsed kept 1,23 out of a
          // half-typed 1.234,56 and said nothing.
          setProblem(labels.numberNotRecognised(display(1234.5)));
          commit(null);
        }
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
        // Home and End stay with the caret: this is a text field first.
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
