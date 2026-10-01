import * as React from "react";
import { Popover } from "radix-ui";
import { CalendarRange } from "lucide-react";
import type { DateRange as DayPickerRange } from "react-day-picker";
import { cn } from "../../lib/utils";
import { formatDate, type SmartaLocale } from "../../lib/format";
import { useLabels, useLocale, ThemeScope } from "../ThemeProvider";
import { Field } from "../Field";
import { inputShell } from "../Input/Input";
import { Calendar } from "../DatePicker/Calendar";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePreset {
  /** The product's words: "This month", "Last quarter", "June". */
  label: string;
  range: { from: Date; to: Date };
}

export interface DateRangePickerProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  id?: string;
  /** Controlled when passed. A range with only `from` is half chosen. */
  value?: DateRange;
  defaultValue?: DateRange;
  /** Fires on every change, including the first click of a range. */
  onValueChange?: (value: DateRange) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** Ranges people actually filter by — a month, a quarter — one click away. */
  presets?: DateRangePreset[];
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  locale?: SmartaLocale;
  className?: string;
}

const EMPTY: DateRange = { from: null, to: null };

/**
 * A from–to range, picked on a two-month calendar or from presets.
 *
 * For filtering a list by a period, which is what the backoffice does with
 * most of its date pickers: "charges in June", "receipts this quarter". Not
 * for entering two independent dates on a form — two DatePickers labelled From
 * and To are faster to type into and clearer to validate one at a time.
 *
 * The trigger is a button whose accessible name is the label AND the current
 * range — "Period, 1 June 2026 – 30 June 2026" — because a label alone would
 * announce the field and keep its value a secret.
 */
export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker(
  {
    label,
    hint,
    error,
    optional,
    id,
    value: valueProp,
    defaultValue = EMPTY,
    onValueChange,
    min,
    max,
    isDisabled,
    presets,
    disabled = false,
    size = "md",
    locale: localeProp,
    className,
  },
  ref,
) {
  const labels = useLabels();
  const contextLocale = useLocale();
  const locale = localeProp ?? contextLocale;

  const controlled = valueProp !== undefined;
  const [inner, setInner] = React.useState<DateRange>(defaultValue);
  const value = controlled ? valueProp : inner;
  const [open, setOpen] = React.useState(false);
  const valueId = React.useId();

  const commit = (r: DateRange) => {
    if (!controlled) setInner(r);
    onValueChange?.(r);
  };

  const text =
    value.from && value.to
      ? `${formatDate(value.from, locale)} – ${formatDate(value.to, locale)}`
      : value.from
        ? `${formatDate(value.from, locale)} –`
        : null;

  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={className}>
      {(ids) => (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              ref={ref}
              type="button"
              id={ids.id}
              aria-describedby={ids["aria-describedby"]}
              aria-invalid={ids["aria-invalid"]}
              aria-labelledby={label ? `${ids.id}-label ${valueId}` : undefined}
              disabled={disabled}
              className={cn(
                inputShell({ size }),
                "sui:cursor-pointer sui:text-left sui:disabled:cursor-not-allowed sui:disabled:bg-surface-sunken sui:disabled:opacity-70",
                "sui:aria-[invalid=true]:border-bad",
                "sui:focus-visible:outline-none sui:focus-visible:border-accent sui:focus-visible:shadow-focus",
              )}
            >
              <CalendarRange size={16} aria-hidden className="sui:shrink-0 sui:text-fg-subtle" />
              <span id={valueId} className={cn("sui:min-w-0 sui:flex-1 sui:truncate sui:tabular-nums", !text && "sui:text-fg-subtle")}>
                {text ?? labels.chooseDateRange}
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <ThemeScope>
              <Popover.Content
                align="start"
                sideOffset={6}
                collisionPadding={8}
                aria-label={labels.chooseDateRange}
                className={cn(
                  "sui:z-[var(--z-dropdown)] sui:flex sui:max-w-[calc(100vw-16px)] sui:flex-col sui:sm:flex-row",
                  "sui:rounded-lg sui:border sui:border-border sui:bg-surface-raised sui:shadow-lg",
                  "sui:max-h-[var(--radix-popover-content-available-height)] sui:overflow-y-auto",
                  "sui:data-[state=open]:animate-in sui:data-[state=closed]:animate-out",
                )}
              >
                {presets && presets.length > 0 && (
                  <ul className="sui:m-0 sui:flex sui:list-none sui:flex-row sui:flex-wrap sui:gap-[4px] sui:border-b sui:border-border-soft sui:p-[8px] sui:sm:flex-col sui:sm:border-r sui:sm:border-b-0">
                    {presets.map((p) => {
                      const active =
                        value.from?.getTime() === p.range.from.getTime() && value.to?.getTime() === p.range.to.getTime();
                      return (
                        <li key={p.label}>
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => {
                              commit({ from: p.range.from, to: p.range.to });
                              setOpen(false);
                            }}
                            className={cn(
                              "sui:w-full sui:rounded-md sui:border-0 sui:bg-transparent sui:px-[10px] sui:py-[6px] sui:text-left sui:text-sm sui:text-fg sui:cursor-pointer sui:whitespace-nowrap",
                              "sui:hover:bg-surface-hover sui:touch:min-h-[var(--touch-target)]",
                              active && "sui:bg-selected-bg sui:text-selected-fg sui:hover:bg-selected-bg",
                            )}
                          >
                            {p.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <Calendar
                  mode="range"
                  locale={locale}
                  autoFocus
                  numberOfMonths={2}
                  selected={{ from: value.from ?? undefined, to: value.to ?? undefined } as DayPickerRange}
                  defaultMonth={value.from ?? undefined}
                  disabled={[
                    ...(min ? [{ before: min }] : []),
                    ...(max ? [{ after: max }] : []),
                    ...(isDisabled ? [isDisabled] : []),
                  ]}
                  onSelect={(r: DayPickerRange | undefined) => {
                    const next = { from: r?.from ?? null, to: r?.to ?? null };
                    commit(next);
                    // Close once there is a range, not on the first click.
                    if (next.from && next.to && next.from.getTime() !== next.to.getTime()) setOpen(false);
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
