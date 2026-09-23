import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Spinner } from "../Spinner";

/**
 * Every value here is a token. There is no hex, no px radius and no literal
 * font size in this file, which is why the same Button renders plum in the
 * webapp and graphite in the backoffice with no branch anywhere.
 */
const buttonVariants = cva(
  [
    "touch-target inline-flex items-center justify-center gap-[6px] whitespace-nowrap",
    "rounded-md border font-medium",
    "transition-[background-color,border-color,color,box-shadow] duration-[var(--duration-fast)]",
    "cursor-pointer select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    // Disabled is a look AND a state. aria-disabled covers the case where the
    // button must stay focusable so it can explain why it is off.
    "disabled:pointer-events-none disabled:opacity-55",
    "aria-disabled:opacity-55 aria-disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent border-accent text-accent-fg hover:bg-accent-hover hover:border-accent-hover",
        secondary:
          "bg-surface border-border text-fg hover:border-border-strong hover:bg-surface-hover",
        ghost:
          "bg-transparent border-transparent text-fg-muted hover:bg-surface-sunken hover:text-fg",
        danger:
          // A solid STATUS fill, so the text is --on-status, not --accent-fg:
          // in dark mode --bad is a light red and white on it measures 2.87:1.
          "bg-bad border-bad text-on-status hover:brightness-110",
        /** A destructive action that is not the page's main move. */
        "danger-quiet":
          "bg-transparent border-border text-bad hover:bg-bad-bg hover:border-bad",
      },
      size: {
        sm: "h-[var(--control-height-sm)] px-[var(--control-padding-x-sm)] text-xs",
        md: "h-[var(--control-height-md)] px-[var(--control-padding-x-md)] text-sm",
        lg: "h-[var(--control-height-lg)] px-[var(--control-padding-x-lg)] text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "secondary", size: "md", fullWidth: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element — a react-router <Link>, say — keeping the styling. */
  asChild?: boolean;
  /**
   * Swaps the leading icon for a spinner and blocks the click. The label stays
   * put, so the button does not resize and the user does not lose their place.
   */
  loading?: boolean;
  /** Announced while loading. Defaults to the button's own text. */
  loadingLabel?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    loadingLabel,
    iconLeft,
    iconRight,
    disabled,
    children,
    type,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";
  const iconSize = size === "lg" ? 16 : 14;

  return (
    <Comp
      ref={ref}
      // A <button> inside a <form> submits it unless told otherwise, which has
      // reloaded more prototypes than any other single default.
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? loadingLabel : props["aria-label"]}
      {...props}
    >
      {loading ? <Spinner size={iconSize} label="" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </Comp>
  );
});

export { buttonVariants };
