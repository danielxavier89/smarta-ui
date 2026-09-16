import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/Spinner";

const iconButtonVariants = cva(
  [
    // touch-target, not a bigger size: on a phone the tap is 44px while the
    // drawn circle stays whatever the size prop asked for. Growing the box
    // instead turned every icon button into an oval and shoved the toolbars
    // it sits in out of alignment with the inputs beside them.
    "touch-target relative inline-grid place-items-center shrink-0",
    "rounded-full border",
    "transition-[background-color,border-color,color] duration-[var(--duration-fast)]",
    "cursor-pointer select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    "disabled:pointer-events-none disabled:opacity-55",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        secondary: "bg-surface border-border text-fg-muted hover:border-border-strong hover:text-fg",
        ghost: "bg-transparent border-transparent text-fg-muted hover:bg-surface-sunken hover:text-fg",
        primary: "bg-accent border-accent text-accent-fg hover:bg-accent-hover",
        danger: "bg-transparent border-transparent text-bad hover:bg-bad-bg",
      },
      size: {
        sm: "size-[var(--control-height-sm)]",
        md: "size-[var(--control-height-md)]",
        lg: "size-[var(--control-height-lg)]",
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
  asChild?: boolean;
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
      ...props
    },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : "button";
    const dotTone = {
      bad: "bg-bad",
      warn: "bg-warn",
      ok: "bg-ok",
      accent: "bg-accent",
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
        {loading ? <Spinner size={16} label="" /> : icon}
        {indicator && (
          <span
            aria-hidden
            className={cn(
              "absolute top-[6px] right-[7px] size-[7px] rounded-full",
              // The ring is the button's own ground, so the dot reads as
              // sitting on the button rather than floating over it.
              "ring-2 ring-surface",
              dotTone,
            )}
          />
        )}
      </Comp>
    );
  },
);

export { iconButtonVariants };
