import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Field } from "@/components/Field";

const inputShell = cva(
  [
    "flex w-full items-center gap-[8px]",
    "rounded-md border border-border bg-surface",
    "text-fg transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
    "focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]",
    "has-[input:disabled]:bg-surface-sunken has-[input:disabled]:opacity-70",
    "has-[input:disabled]:cursor-not-allowed",
    "has-[[aria-invalid=true]]:border-bad has-[[aria-invalid=true]]:focus-within:shadow-none",
  ],
  {
    variants: {
      size: {
        sm: "h-[var(--control-height-sm)] px-[var(--control-padding-x-sm)] text-[length:var(--field-font-size-sm)]",
        md: "h-[var(--control-height-md)] px-[var(--control-padding-x-md)] text-[length:var(--field-font-size)]",
        lg: "h-[var(--control-height-lg)] px-[var(--control-padding-x-lg)] text-[length:var(--field-font-size)]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    VariantProps<typeof inputShell> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  /** An icon or a currency symbol before the text. Decorative — not a button. */
  prefix?: React.ReactNode;
  /** A unit, a character count, a clear button. */
  suffix?: React.ReactNode;
  /** Escape hatch for the wrapper, not the <input>. */
  containerClassName?: string;
}

/**
 * A single-line text input, with its label, hint and error wired to it.
 *
 * The type size is --field-font-size rather than a step on the type scale,
 * because it is not a typographic decision: below 16px mobile Safari zooms the
 * page on focus and never zooms back. The token is 14px on a mouse and 16px on
 * a finger.
 *
 * The focus ring lives on the wrapper, not the input: the input drops its own
 * outline so the whole control — prefix, field and suffix — lights up as one
 * thing rather than a rectangle inside a rectangle.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    size,
    label,
    hint,
    error,
    optional,
    prefix,
    suffix,
    id,
    ...props
  },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={containerClassName}>
      {(ids) => (
        <div className={cn(inputShell({ size }))}>
          {prefix && (
            <span aria-hidden className="text-fg-subtle shrink-0">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full min-w-0 border-0 bg-transparent p-0 outline-none",
              "text-[inherit] placeholder:text-fg-subtle",
              "disabled:cursor-not-allowed",
              className,
            )}
            {...ids}
            {...props}
          />
          {suffix && <span className="text-fg-subtle shrink-0">{suffix}</span>}
        </div>
      )}
    </Field>
  );
});
