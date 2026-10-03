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
        "sui:flex sui:w-full sui:flex-wrap sui:items-start sui:gap-[14px] sui:text-left",
        "sui:border-b sui:border-border-soft sui:last:border-b-0",
        "sui:px-[var(--density-row-x)] sui:py-[var(--density-row-y)]",
        "sui:bg-transparent",
        clickable && [
          "sui:cursor-pointer sui:transition-colors sui:duration-[var(--duration-fast)]",
          "sui:hover:bg-surface-hover",
          "sui:focus-visible:outline-2 sui:focus-visible:-outline-offset-2 sui:focus-visible:outline-focus-ring",
        ],
        selected && "sui:bg-accent-soft",
        disabled && "sui:pointer-events-none sui:opacity-60",
        className,
      )}
      {...props}
    >
      {leading && <span className="sui:mt-[1px] sui:shrink-0">{leading}</span>}

      <div className="sui:min-w-0 sui:flex-1">
        <div className="sui:flex sui:items-center sui:gap-[7px]">
          {unread && <span aria-hidden className="sui:size-[6px] sui:shrink-0 sui:rounded-full sui:bg-accent" />}
          <p className={cn("sui:m-0 sui:truncate sui:text-base", unread ? "sui:font-semibold sui:text-fg" : "sui:text-fg")}>
            {title}
          </p>
        </div>
        {description && (
          <div className="sui:mt-[2px] sui:text-sm sui:text-fg-subtle sui:[&>p]:m-0">{description}</div>
        )}
      </div>

      {meta && <div className="sui:shrink-0 sui:text-right sui:text-xs sui:text-fg-subtle">{meta}</div>}

      {actions && (
        // Full width on a phone, where a button squeezed beside two lines of
        // text is a button nobody can hit.
        <div className="sui:order-5 sui:flex sui:w-full sui:shrink-0 sui:gap-[8px] sui:sm:order-none sui:sm:w-auto sui:sm:items-center">
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
        className={cn("sui:overflow-hidden sui:rounded-lg sui:border sui:border-border sui:bg-surface", className)}
        {...props}
      />
    );
  },
);
