import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Spinner } from "../Spinner";

const iconButtonVariants = cva(
  [
    // sui-touch-target, not a bigger size: on a phone the tap is 44px while the
    // drawn circle stays whatever the size prop asked for. Growing the box
    // instead turned every icon button into an oval and shoved the toolbars
    // it sits in out of alignment with the inputs beside them.
    "sui-touch-target sui:relative sui:inline-grid sui:place-items-center sui:shrink-0",
    "sui:rounded-full sui:border",
    "sui:transition-[background-color,border-color,color] sui:duration-[var(--duration-fast)]",
    "sui:cursor-pointer sui:select-none",
    "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring",
    "sui:disabled:pointer-events-none sui:disabled:opacity-55",
    "sui:[&_svg]:pointer-events-none sui:[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        secondary: "sui:bg-surface sui:border-border sui:text-fg-muted sui:hover:border-border-strong sui:hover:text-fg",
        ghost: "sui:bg-transparent sui:border-transparent sui:text-fg-muted sui:hover:bg-surface-sunken sui:hover:text-fg",
        primary: "sui:bg-accent sui:border-accent sui:text-accent-fg sui:hover:bg-accent-hover",
        danger: "sui:bg-transparent sui:border-transparent sui:text-bad sui:hover:bg-bad-bg",
      },
      size: {
        sm: "sui:size-[var(--control-height-sm)]",
        md: "sui:size-[var(--control-height-md)]",
        lg: "sui:size-[var(--control-height-lg)]",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  /**
   * Required. An icon-only control is unreadable to a screen reader and
   * unguessable to anyone new, so the label is not optional and not a prop
   * you can forget — TypeScript will stop you.
   */
  label: string;
  icon: React.ReactNode;
  /** Renders the child — an <a>, a router Link — as the button, with the icon inside it. */
  asChild?: boolean;
  /** Only with asChild: the element to render as. */
  children?: React.ReactElement;
  loading?: boolean;
  /** A small dot in the top-right corner: unread mail, a pending change. */
  indicator?: boolean;
  /** The dot's meaning. Defaults to bad, which is what an unread count is. */
  indicatorTone?: "bad" | "warn" | "ok" | "accent";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      className,
      variant,
      size,
      label,
      icon,
      asChild = false,
      loading = false,
      indicator = false,
      indicatorTone = "bad",
      disabled,
      type,
      children,
      ...props
    },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : "button";
    const dotTone = {
      bad: "sui:bg-bad",
      warn: "sui:bg-warn",
      ok: "sui:bg-ok",
      accent: "sui:bg-accent",
    }[indicatorTone];

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        aria-label={label}
        title={label}
        className={cn(iconButtonVariants({ variant, size }), className)}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild && <Slot.Slottable>{children}</Slot.Slottable>}
        {loading ? <Spinner size={16} label="" /> : icon}
        {indicator && (
          <span
            aria-hidden
            className={cn(
              "sui:absolute sui:top-[6px] sui:right-[7px] sui:size-[7px] sui:rounded-full",
              // The ring is the button's own ground, so the dot reads as
              // sitting on the button rather than floating over it.
              "sui:ring-2 sui:ring-surface",
              dotTone,
            )}
          />
        )}
      </Comp>
    );
  },
);

export { iconButtonVariants };
