import * as React from "react";
import { RadioGroup as RRadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RRadioGroup.Root>, "children"> {
  options: RadioOption[];
  /** The question the options answer. Rendered as the group's legend. */
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** "card" gives each option a bordered surface — for two or three fat choices. */
  appearance?: "plain" | "card";
}

/**
 * One choice from a small set, all of them visible.
 *
 * Use it up to about five options where the choice matters enough to be read
 * without opening anything. Past that, or where the choice is routine, a
 * Select costs less room and less attention.
 */
export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RRadioGroup.Root>,
  RadioGroupProps
>(function RadioGroup(
  { className, options, label, hint, error, appearance = "plain", ...props },
  ref,
) {
  const reactId = React.useId();
  const hintId = hint ? `${reactId}-hint` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;

  return (
    <fieldset className="m-0 border-0 p-0" aria-describedby={errorId ?? hintId}>
      {label && (
        <legend className="mb-[8px] p-0 text-sm font-medium text-fg-muted">
          {label}
        </legend>
      )}
      <RRadioGroup.Root
        ref={ref}
        className={cn("flex flex-col gap-[8px]", className)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {options.map((o) => {
          const id = `${reactId}-${o.value}`;
          const descId = o.description ? `${id}-desc` : undefined;
          return (
            <div
              key={o.value}
              className={cn(
                "flex items-start gap-[9px]",
                appearance === "card" &&
                  "rounded-md border border-border bg-surface p-[12px] transition-[border-color] duration-[var(--duration-fast)] has-[[data-state=checked]]:border-accent has-[[data-state=checked]]:bg-accent-soft",
                appearance === "card" && o.disabled && "opacity-55",
              )}
            >
              <RRadioGroup.Item
                id={id}
                value={o.value}
                disabled={o.disabled}
                aria-describedby={descId}
                className={cn(
                  "mt-[2px] size-[17px] shrink-0 rounded-full border border-border-strong bg-surface",
                  "grid place-items-center cursor-pointer",
                  "transition-[border-color] duration-[var(--duration-fast)]",
                  "hover:border-accent",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                  "data-[state=checked]:border-accent",
                  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-border-strong",
                )}
              >
                <RRadioGroup.Indicator className="size-[9px] rounded-full bg-accent" />
              </RRadioGroup.Item>
              <div className="flex flex-col gap-[1px]">
                <label
                  htmlFor={id}
                  className={cn(
                    "text-base text-fg cursor-pointer select-none",
                    o.disabled && "cursor-not-allowed",
                  )}
                >
                  {o.label}
                </label>
                {o.description && (
                  <span id={descId} className="text-xs text-fg-subtle">
                    {o.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </RRadioGroup.Root>
      {error ? (
        <p id={errorId} role="alert" className="mt-[6px] text-xs text-bad-fg">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-[6px] text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
});
