import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "../../lib/utils";

export interface ListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** An avatar, an icon in a tinted circle, a thumbnail. */
  leading?: React.ReactNode;
  title: React.ReactNode;
  /** The line under the title: a supplier, a date, a sentence of context. */
  description?: React.ReactNode;
  /** A chip, an amount, a timestamp — right-aligned, above the actions. */
  meta?: React.ReactNode;
  /** Buttons. On a phone they wrap to their own full-width row. */
  actions?: React.ReactNode;
  clickable?: boolean;
  asChild?: boolean;
  /** Bolder title and a dot: unread mail, an unseen notification. */
  unread?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * One row in a list of things: a message, a notification, a task, a document.
 *
 * Use it when the rows have different shapes — a title, some prose, maybe an
 * avatar. Use a Table when every row has the same columns and the user will
 * compare down a column rather than read across a row.
 */
export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(function ListItem(
  {
    className,
    leading,
    title,
    description,
    meta,
    actions,
    clickable = false,
    asChild = false,
    unread = false,
    selected = false,
    disabled = false,
    ...props
  },
  ref,
) {
  // Typed loosely on purpose: div, button and Slot do not share a prop set.
  const Comp = (asChild ? Slot.Root : clickable ? "button" : "div") as React.ElementType;
  return (
    <Comp
      ref={ref as never}
      type={clickable && !asChild ? "button" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex w-full flex-wrap items-start gap-[14px] text-left",
        "border-b border-border-soft last:border-b-0",
        "px-[var(--density-row-x)] py-[var(--density-row-y)]",
        "bg-transparent",
        clickable && [
          "cursor-pointer transition-colors duration-[var(--duration-fast)]",
          "hover:bg-surface-hover",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring",
        ],
        selected && "bg-accent-soft",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
      {...props}
    >
      {leading && <span className="mt-[1px] shrink-0">{leading}</span>}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[7px]">
          {unread && <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-accent" />}
          <p className={cn("m-0 truncate text-base", unread ? "font-semibold text-fg" : "text-fg")}>
            {title}
          </p>
        </div>
        {description && (
          <div className="mt-[2px] text-sm text-fg-subtle [&>p]:m-0">{description}</div>
        )}
      </div>

      {meta && <div className="shrink-0 text-right text-xs text-fg-subtle">{meta}</div>}

      {actions && (
        // Full width on a phone, where a button squeezed beside two lines of
        // text is a button nobody can hit.
        <div className="order-5 flex w-full shrink-0 gap-[8px] sm:order-none sm:w-auto sm:items-center">
          {actions}
        </div>
      )}
    </Comp>
  );
});

/** The surface a run of ListItems sits on. */
export const List = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function List({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}
        {...props}
      />
    );
  },
);
