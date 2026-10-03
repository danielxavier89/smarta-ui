import * as React from "react";
import { Checkbox as RCheckbox } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RCheckbox.Root>, "children"> {
  /** The clickable text beside the box. Omit only when a column header says it. */
  label?: React.ReactNode;
  /** A second, quieter line under the label. */
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: "sm" | "md";
}

/**
 * A checkbox and its label as one target.
 *
 * Indeterminate is a real value here, not a visual trick: pass
 * `checked="indeterminate"` for the header checkbox over a partly-selected
 * table, and Radix reports it correctly to assistive technology.
 */
export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof RCheckbox.Root>,
  CheckboxProps
>(function Checkbox(
  { className, label, description, error, size = "md", id: idProp, disabled, ...props },
  ref,
) {
  const reactId = React.useId();
  const id = idProp ?? reactId;
  const descId = description ? `${id}-desc` : undefined;
  // The tick stays 15/17px — it is drawn to sit on the same line as its
  // label. sui-touch-target puts a 44px tap around it on a phone without
  // stretching the box into a slot.
  const box = size === "sm" ? "sui:size-[15px]" : "sui:size-[17px]";

  const control = (
    <RCheckbox.Root
      ref={ref}
      id={id}
      disabled={disabled}
      aria-describedby={descId}
      className={cn(
        box,
        "sui-touch-target sui:grid sui:shrink-0 sui:place-items-center sui:rounded-xs sui:border sui:border-border-strong sui:bg-surface",
        "sui:transition-[background-color,border-color] sui:duration-[var(--duration-fast)]",
        "sui:cursor-pointer",
        "sui:hover:border-accent",
        "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring",
        "sui:data-[state=checked]:bg-accent sui:data-[state=checked]:border-accent",
        "sui:data-[state=indeterminate]:bg-accent sui:data-[state=indeterminate]:border-accent",
        "sui:disabled:cursor-not-allowed sui:disabled:opacity-55 sui:disabled:hover:border-border-strong",
        error && "sui:border-bad",
        // Sits on the label's first line rather than centring against a
        // two-line block, which is what makes a wrapped label look adrift.
        (label || description) && "sui:mt-[2px]",
        className,
      )}
      {...props}
    >
      <RCheckbox.Indicator className="sui:text-accent-fg">
        {props.checked === "indeterminate" ? (
          <Minus size={size === "sm" ? 11 : 12} strokeWidth={3} aria-hidden />
        ) : (
          <Check size={size === "sm" ? 11 : 12} strokeWidth={3} aria-hidden />
        )}
      </RCheckbox.Indicator>
    </RCheckbox.Root>
  );

  if (!label && !description) return control;

  return (
    <div className="sui:flex sui:flex-col sui:gap-[4px]">
      <div className="sui:flex sui:items-start sui:gap-[9px]">
        {control}
        <div className="sui:flex sui:flex-col sui:gap-[1px]">
          <label
            htmlFor={id}
            className={cn(
              "sui:text-base sui:text-fg sui:cursor-pointer sui:select-none",
              disabled && "sui:cursor-not-allowed sui:opacity-55",
            )}
          >
            {label}
          </label>
          {description && (
            <span id={descId} className="sui:text-xs sui:text-fg-subtle">
              {description}
            </span>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="sui:pl-[26px] sui:text-xs sui:text-bad-fg">
          {error}
        </p>
      )}
    </div>
  );
});
