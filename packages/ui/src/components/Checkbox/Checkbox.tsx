import * as React from "react";
import { Checkbox as RCheckbox } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const box = size === "sm" ? "size-[15px]" : "size-[17px]";

  const control = (
    <RCheckbox.Root
      ref={ref}
      id={id}
      disabled={disabled}
      aria-describedby={descId}
      className={cn(
        box,
        "grid shrink-0 place-items-center rounded-xs border border-border-strong bg-surface",
        "transition-[background-color,border-color] duration-[var(--duration-fast)]",
        "cursor-pointer",
        "hover:border-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
        "data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent",
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-border-strong",
        error && "border-bad",
        // Sits on the label's first line rather than centring against a
        // two-line block, which is what makes a wrapped label look adrift.
        (label || description) && "mt-[2px]",
        className,
      )}
      {...props}
    >
      <RCheckbox.Indicator className="text-accent-fg">
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
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-start gap-[9px]">
        {control}
        <div className="flex flex-col gap-[1px]">
          <label
            htmlFor={id}
            className={cn(
              "text-base text-fg cursor-pointer select-none",
              disabled && "cursor-not-allowed opacity-55",
            )}
          >
            {label}
          </label>
          {description && (
            <span id={descId} className="text-xs text-fg-subtle">
              {description}
            </span>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="pl-[26px] text-xs text-bad-fg">
          {error}
        </p>
      )}
    </div>
  );
});
