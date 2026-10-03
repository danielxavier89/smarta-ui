import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Spinner } from "../Spinner";

/**
 * Every value here is a token. There is no hex, no px radius and no literal
 * font size in this file, which is why the same Button renders Deep Purple in the
 * webapp and graphite in the backoffice with no branch anywhere.
 */
const buttonVariants = cva(
  [
    "sui-touch-target sui:inline-flex sui:items-center sui:justify-center sui:gap-[6px] sui:whitespace-nowrap",
    "sui:rounded-md sui:border sui:font-medium",
    "sui:transition-[background-color,border-color,color,box-shadow] sui:duration-[var(--duration-fast)]",
    "sui:cursor-pointer sui:select-none",
    "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring",
    // Disabled is a look AND a state. aria-disabled covers the case where the
    // button must stay focusable so it can explain why it is off.
    "sui:disabled:pointer-events-none sui:disabled:opacity-55",
    "sui:aria-disabled:opacity-55 sui:aria-disabled:cursor-not-allowed",
    "sui:[&_svg]:pointer-events-none sui:[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "sui:bg-accent sui:border-accent sui:text-accent-fg sui:hover:bg-accent-hover sui:hover:border-accent-hover",
        secondary:
          "sui:bg-surface sui:border-border sui:text-fg sui:hover:border-border-strong sui:hover:bg-surface-hover",
        ghost:
          "sui:bg-transparent sui:border-transparent sui:text-fg-muted sui:hover:bg-surface-sunken sui:hover:text-fg",
        danger:
          // A solid STATUS fill, so the text is --on-status, not --accent-fg:
          // in dark mode --bad is a light red and white on it measures 2.87:1.
          "sui:bg-bad sui:border-bad sui:text-on-status sui:hover:brightness-110",
        /** A destructive action that is not the page's main move. */
        "danger-quiet":
          "sui:bg-transparent sui:border-border sui:text-bad sui:hover:bg-bad-bg sui:hover:border-bad",
      },
      size: {
        sm: "sui:h-[var(--control-height-sm)] sui:px-[var(--control-padding-x-sm)] sui:text-xs",
        md: "sui:h-[var(--control-height-md)] sui:px-[var(--control-padding-x-md)] sui:text-sm",
        lg: "sui:h-[var(--control-height-lg)] sui:px-[var(--control-padding-x-lg)] sui:text-base",
      },
      fullWidth: {
        true: "sui:w-full",
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
      {...props}
      // After the spread, not before it.
      //
      // Before, `{...props}` put the caller's own aria-label back on top and
      // loadingLabel was silently dropped for every button that had one — so
      // the busy state was announced only to the callers who had not thought
      // about the accessible name at all. aria-busy alone is not enough: a
      // screen reader says "busy" without saying what is busy.
      //
      // While not loading, the caller's aria-label is still exactly what it was.
      aria-label={loading && loadingLabel ? loadingLabel : props["aria-label"]}
    >
      {loading ? <Spinner size={iconSize} label="" /> : iconLeft}
      {/* With asChild, the child becomes the button and the icons go inside it.
          Without Slottable, Slot was handed three children and threw. */}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
      {!loading && iconRight}
    </Comp>
  );
});

export { buttonVariants };
