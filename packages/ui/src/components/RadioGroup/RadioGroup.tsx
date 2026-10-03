import * as React from "react";
import { RadioGroup as RRadioGroup } from "radix-ui";
import { cn } from "../../lib/utils";

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
    <fieldset className="sui:m-0 sui:border-0 sui:p-0" aria-describedby={errorId ?? hintId}>
      {label && (
        <legend className="sui:mb-[8px] sui:p-0 sui:text-sm sui:font-medium sui:text-fg-muted">
          {label}
        </legend>
      )}
      <RRadioGroup.Root
        ref={ref}
        className={cn("sui:flex sui:flex-col sui:gap-[8px]", className)}
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
                "sui:flex sui:items-start sui:gap-[9px]",
                appearance === "card" &&
                  "sui:rounded-md sui:border sui:border-border sui:bg-surface sui:p-[12px] sui:transition-[border-color] sui:duration-[var(--duration-fast)] sui:has-[[data-state=checked]]:border-accent sui:has-[[data-state=checked]]:bg-accent-soft",
                appearance === "card" && o.disabled && "sui:opacity-55",
              )}
            >
              <RRadioGroup.Item
                id={id}
                value={o.value}
                disabled={o.disabled}
                aria-describedby={descId}
                className={cn(
                  // The dot keeps its 17px; the tap around it is 44px on a
                  // phone. See .sui-touch-target in the token reset.
                  "sui-touch-target sui:mt-[2px] sui:size-[17px] sui:shrink-0 sui:rounded-full sui:border sui:border-border-strong sui:bg-surface",
                  "sui:grid sui:place-items-center sui:cursor-pointer",
                  "sui:transition-[border-color] sui:duration-[var(--duration-fast)]",
                  "sui:hover:border-accent",
                  "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring",
                  "sui:data-[state=checked]:border-accent",
                  "sui:disabled:cursor-not-allowed sui:disabled:opacity-55 sui:disabled:hover:border-border-strong",
                )}
              >
                <RRadioGroup.Indicator className="sui:size-[9px] sui:rounded-full sui:bg-accent" />
              </RRadioGroup.Item>
              <div className="sui:flex sui:flex-col sui:gap-[1px]">
                <label
                  htmlFor={id}
                  className={cn(
                    "sui:text-base sui:text-fg sui:cursor-pointer sui:select-none",
                    o.disabled && "sui:cursor-not-allowed",
                  )}
                >
                  {o.label}
                </label>
                {o.description && (
                  <span id={descId} className="sui:text-xs sui:text-fg-subtle">
                    {o.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </RRadioGroup.Root>
      {error ? (
        <p id={errorId} role="alert" className="sui:mt-[6px] sui:text-xs sui:text-bad-fg">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="sui:mt-[6px] sui:text-xs sui:text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
});
