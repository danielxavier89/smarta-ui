import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Field } from "../Field";

export const inputShell = cva(
  [
    "sui:flex sui:w-full sui:items-center sui:gap-[8px]",
    "sui:rounded-md sui:border sui:border-border sui:bg-surface",
    "sui:text-fg sui:transition-[border-color,box-shadow] sui:duration-[var(--duration-fast)]",
    "sui:focus-within:border-accent sui:focus-within:shadow-focus",
    "sui:has-[input:disabled]:bg-surface-sunken sui:has-[input:disabled]:opacity-70",
    "sui:has-[input:disabled]:cursor-not-allowed",
    "sui:has-[[aria-invalid=true]]:border-bad sui:has-[[aria-invalid=true]]:focus-within:shadow-none",
  ],
  {
    variants: {
      size: {
        sm: "sui:h-[var(--control-height-sm)] sui:px-[var(--control-padding-x-sm)] sui:text-[length:var(--field-font-size-sm)]",
        md: "sui:h-[var(--control-height-md)] sui:px-[var(--control-padding-x-md)] sui:text-[length:var(--field-font-size)]",
        lg: "sui:h-[var(--control-height-lg)] sui:px-[var(--control-padding-x-lg)] sui:text-[length:var(--field-font-size)]",
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
            <span aria-hidden className="sui:text-fg-subtle sui:shrink-0">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "sui:w-full sui:min-w-0 sui:border-0 sui:bg-transparent sui:p-0 sui:focus-visible:outline-none",
              "sui:text-[inherit] sui:placeholder:text-fg-subtle",
              "sui:disabled:cursor-not-allowed",
              className,
            )}
            {...ids}
            {...props}
          />
          {suffix && <span className="sui:text-fg-subtle sui:shrink-0">{suffix}</span>}
        </div>
      )}
    </Field>
  );
});
