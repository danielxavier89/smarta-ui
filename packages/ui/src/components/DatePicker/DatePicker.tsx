import * as React from "react";
import { Popover } from "radix-ui";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatDate, isValidDate, parseDate, type SmartaLocale } from "../../lib/format";
import { useLabels, useLocale, ThemeScope } from "../ThemeProvider";
import { Field } from "../Field";
import { inputShell } from "../Input/Input";
import { Calendar, sameDay, startOfToday } from "./Calendar";

export interface DatePickerProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** The product's error. Takes precedence over the field's own "not a date" message. */
  error?: React.ReactNode;
  optional?: boolean;
  id?: string;
  name?: string;
  /** The date, or null for empty. Controlled when passed. */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Fires with a real date, or null when the field is emptied. Never with an invalid one. */
  onValueChange?: (value: Date | null) => void;
  /** Days before this cannot be picked, and a typed one says so. */
  min?: Date;
  /** Days after this cannot be picked, and a typed one says so. */
  max?: Date;
  /** Any further days that cannot be picked: weekends, a closed period. */
  isDisabled?: (date: Date) => boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Overrides the ThemeProvider's locale for this field. */
  locale?: SmartaLocale;
  /**
   * Empty by default. A date-shaped placeholder reads as a value already filled
   * in; the format is taught by the message on blur instead.
   */
  placeholder?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}

/**
 * A date: typed in the locale's order, or picked from a calendar.
 *
 * Both, because they are different jobs. Someone copying a date off a bank
 * statement types it — 03.06.2026 is eight keystrokes, and a calendar is twelve
 * clicks back to June. Someone choosing a date with no paper in front of them
 * wants to see the month. The backoffice does the first all day.
 *
 * Typed dates are read on blur, in the locale's order (day-month-year in all
 * three products), with any separator. A date that does not exist — 31.02 — is
 * not rolled into March; the field says how to write one instead.
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label,
    hint,
    error,
    optional,
    id,
    name,
    placeholder,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    min,
    max,
    isDisabled,
    disabled = false,
    required,
    size = "md",
    locale: localeProp,
    onBlur,
    className,
  },
  ref,
) {
  const labels = useLabels();
  const contextLocale = useLocale();
  const locale = localeProp ?? contextLocale;

  const controlled = valueProp !== undefined;
  const [inner, setInner] = React.useState<Date | null>(defaultValue);
  const value = controlled ? (valueProp ?? null) : inner;

  const [text, setText] = React.useState<string | null>(null);
  const [problem, setProblem] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const show = (d: Date | null) => (d ? formatDate(d, locale, "numeric") : "");
  const example = formatDate(startOfToday(), locale, "numeric");

  const commit = (d: Date | null) => {
    setProblem(null);
    setText(null);
    const changed = d === null || value === null ? d !== value : !sameDay(d, value);
    if (!changed) return;
    sent.current = d;
    if (!controlled) setInner(d);
    onValueChange?.(d);
  };

  // A value the parent set — a form reset — replaces whatever text and message
  // were left in the field; a value this field reported itself does not.
  const sent = React.useRef<Date | null>(value);
  React.useEffect(() => {
    if (!controlled) return;
    const next = valueProp ?? null;
    const same = next === null || sent.current === null ? next === sent.current : sameDay(next, sent.current);
    if (same) return;
    sent.current = next;
    setText(null);
    setProblem(null);
  }, [controlled, valueProp]);

  const outOfRange = (d: Date) =>
    (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())
      ? labels.dateTooEarly(show(min))
      : null) ??
    (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())
      ? labels.dateTooLate(show(max))
      : null);

  const readTyped = () => {
    if (text === null) return;
    const d = parseDate(text, locale);
    if (d === null) return commit(null);
    if (!isValidDate(d)) return setProblem(labels.dateNotRecognised(example));
    const range = outOfRange(d);
    if (range) return setProblem(range);
    if (isDisabled?.(d)) return setProblem(labels.dateUnavailable);
    commit(d);
  };

  const shownError = error ?? problem ?? undefined;

  return (
    <Field label={label} hint={hint} error={shownError} optional={optional} id={id} className={className}>
      {(ids) => (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Anchor asChild>
            <div className={cn(inputShell({ size }), "sui:pr-[4px]")}>
              <input
                ref={ref}
                {...ids}
                name={name}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                value={text ?? show(value)}
                onChange={(e) => {
                  setText(e.target.value);
                  // Once it has said something, it goes live: the message
                  // clears the moment the date becomes readable.
                  if (problem) {
                    const d = parseDate(e.target.value, locale);
                    if (d === null || (isValidDate(d) && !outOfRange(d))) setProblem(null);
                  }
                }}
                onBlur={(e) => {
                  readTyped();
                  onBlur?.(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") readTyped();
                  // Alt+ArrowDown opens the calendar, as it opens a native select.
                  if (e.key === "ArrowDown" && e.altKey) {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
                className={cn(
                  "sui:w-full sui:min-w-0 sui:border-0 sui:bg-transparent sui:p-0 sui:focus-visible:outline-none",
                  "sui:text-[inherit] sui:tabular-nums sui:placeholder:text-fg-subtle sui:disabled:cursor-not-allowed",
                )}
              />
              <Popover.Trigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={labels.chooseDate}
                  className={cn(
                    "sui-touch-target sui:grid sui:size-[28px] sui:shrink-0 sui:place-items-center sui:rounded-sm",
                    "sui:border-0 sui:bg-transparent sui:text-fg-subtle sui:cursor-pointer",
                    "sui:hover:bg-surface-hover sui:hover:text-fg sui:disabled:cursor-not-allowed",
                  )}
                >
                  <CalendarDays size={16} aria-hidden />
                </button>
              </Popover.Trigger>
            </div>
          </Popover.Anchor>
          <Popover.Portal>
            <ThemeScope>
              <Popover.Content
                align="start"
                sideOffset={6}
                collisionPadding={8}
                aria-label={labels.chooseDate}
                className={cn(
                  "sui:z-[var(--z-dropdown)] sui:rounded-lg sui:border sui:border-border sui:bg-surface-raised sui:shadow-lg",
                  "sui:data-[state=open]:animate-in sui:data-[state=closed]:animate-out",
                )}
              >
                <Calendar
                  mode="single"
                  locale={locale}
                  autoFocus
                  required={false}
                  selected={value ?? undefined}
                  defaultMonth={value ?? (max && max < startOfToday() ? max : min && min > startOfToday() ? min : undefined)}
                  disabled={[
                    ...(min ? [{ before: min }] : []),
                    ...(max ? [{ after: max }] : []),
                    ...(isDisabled ? [isDisabled] : []),
                  ]}
                  onSelect={(d: Date | undefined) => {
                    // Clicking the chosen day again toggles it off in the
                    // calendar; here it only closes. Clearing is the text field's job.
                    if (d) commit(d);
                    setOpen(false);
                  }}
                />
              </Popover.Content>
            </ThemeScope>
          </Popover.Portal>
        </Popover.Root>
      )}
    </Field>
  );
});
