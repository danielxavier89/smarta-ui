import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * A table, as a card.
 *
 * Note what the wrapper does NOT do: overflow-hidden. That establishes a scroll
 * container, which becomes the containing block for position:sticky — so the
 * sticky column headings get scoped to the card and scroll away with it. The
 * corners are clipped by rounding the first and last cells instead. This bug
 * was found the hard way in the webapp prototype; the fix is load-bearing.
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement> & { containerClassName?: string }
>(function Table({ className, containerClassName, ...props }, ref) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface",
        // Horizontal scroll only, so sticky headings still resolve vertically.
        "overflow-x-auto",
        // A table is the one thing on a phone the user swipes sideways. Without
        // containment that swipe reaches the browser at the end of the scroll
        // and iOS reads it as "go back".
        "overscroll-x-contain",
        containerClassName,
      )}
    >
      <table
        ref={ref}
        className={cn("w-full border-collapse text-base", className)}
        {...props}
      />
    </div>
  );
});

export const THead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { sticky?: boolean }
>(function THead({ className, sticky = false, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn(
        sticky && "sticky top-0 z-[var(--z-sticky)]",
        className,
      )}
      {...props}
    />
  );
});

export const TBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function TBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={className} {...props} />;
  },
);

/**
 * Anything inside the row that handles its own Enter, Space or click.
 *
 * `label` is in the list and is the one that is easy to miss. A label is not
 * itself interactive, but clicking one forwards the click to the control it
 * names — so without it, clicking the text beside a Checkbox toggled the
 * checkbox AND activated the row. The library's own Checkbox renders exactly
 * that shape: a Radix button for the box, and a sibling <label> for the words.
 */
const INTERACTIVE =
  'button, a[href], input, select, textarea, label, summary, ' +
  '[role="button"], [role="link"], [role="checkbox"], [role="menuitem"], ' +
  '[tabindex]:not([tabindex="-1"])';

export interface TRProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Makes the row activatable — the whole thing, by mouse and by keyboard.
   *
   * This is the only supported way to make a row do something. It supplies the
   * appearance, `tabIndex`, the click handler and Enter/Space itself, because
   * the previous API supplied only the appearance and asked every caller to
   * remember the rest. Callers reliably did not, and a row that looks pressable
   * and does nothing under the keyboard is not a styling slip — it is a screen
   * a keyboard user cannot operate.
   */
  onActivate?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  /**
   * @deprecated Use `onActivate`. This gives a row the appearance of being
   * pressable without making it so; on its own it produces exactly the defect
   * described above. It is kept only so existing screens keep rendering.
   */
  clickable?: boolean;
  selected?: boolean;
}

export const TR = React.forwardRef<HTMLTableRowElement, TRProps>(function TR(
  { className, clickable = false, selected = false, onActivate, onClick, onKeyDown, tabIndex, ...props },
  ref,
) {
  const activatable = Boolean(onActivate);

  /**
   * An activatable row is always in the tab order, even if the caller passed a
   * negative tabIndex.
   *
   * `tabIndex` arrives through React.HTMLAttributes, so nothing stopped
   * `<TR onActivate tabIndex={-1}>` — which rendered a row with the pressable
   * appearance, a working click, and no way to reach it from a keyboard. That
   * is precisely the defect onActivate exists to make impossible, reintroduced
   * through a prop nobody would think to look at. The guarantee wins over the
   * override; a warning says so rather than letting it pass silently.
   */
  const negativeTabIndex = activatable && typeof tabIndex === "number" && tabIndex < 0;
  const resolvedTabIndex = activatable ? (negativeTabIndex ? 0 : (tabIndex ?? 0)) : tabIndex;

  if (process.env.NODE_ENV !== "production") {
    if (clickable && !onActivate) {
      // eslint-disable-next-line no-console
      console.warn(
        "[@smarta/ui] <TR clickable> without onActivate renders a row that looks " +
          "pressable but cannot be reached or fired from a keyboard. Pass onActivate instead.",
      );
    }
    if (negativeTabIndex) {
      // eslint-disable-next-line no-console
      console.warn(
        "[@smarta/ui] <TR onActivate> ignores a negative tabIndex, because it would " +
          "take an activatable row out of the keyboard's reach. Using 0.",
      );
    }
  }

  /**
   * A row is often full of its own controls — a menu, a copy button. Those
   * handle their own activation, and the row must not fire a second time on
   * top of them.
   *
   * The row itself matches INTERACTIVE once onActivate has given it a
   * tabIndex, so `closest` finds the row when the click was on a plain cell.
   * Only a match strictly between the target and the row counts.
   */
  const fromChildControl = (target: EventTarget | null, row: EventTarget | null) => {
    if (!(target instanceof Element) || !(row instanceof Element)) return false;
    const hit = target.closest(INTERACTIVE);
    return hit !== null && hit !== row && row.contains(hit);
  };

  return (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      tabIndex={resolvedTabIndex}
      onClick={(e) => {
        onClick?.(e);
        if (!onActivate || e.defaultPrevented) return;
        if (fromChildControl(e.target, e.currentTarget)) return;
        onActivate(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!onActivate || e.defaultPrevented) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        // A control inside the row owns its own keys.
        if (e.target !== e.currentTarget) return;
        // Space scrolls the page otherwise, and Enter can submit a form.
        e.preventDefault();
        onActivate(e);
      }}
      className={cn(
        "border-b border-border-soft last:border-b-0",
        (clickable || activatable) && "cursor-pointer hover:bg-surface-hover",
        (clickable || activatable) &&
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring",
        selected && "bg-accent-soft",
        className,
      )}
      {...props}
    />
  );
});

export interface THProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "right" | "center";
  /** Renders the sort affordance and the aria-sort the header needs. */
  sort?: "asc" | "desc" | "none";
  onSort?: () => void;
}

export const TH = React.forwardRef<HTMLTableCellElement, THProps>(function TH(
  { className, align = "left", sort, onSort, children, ...props },
  ref,
) {
  const content = onSort ? (
    <button
      type="button"
      onClick={onSort}
      className="inline-flex items-center gap-[4px] bg-transparent border-0 p-0 font-[inherit] text-[inherit] cursor-pointer hover:text-fg"
    >
      {children}
      <span aria-hidden className="text-fg-faint">
        {sort === "asc" ? "↑" : sort === "desc" ? "↓" : "↕"}
      </span>
    </button>
  ) : (
    children
  );

  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={
        sort === "asc" ? "ascending" : sort === "desc" ? "descending" : sort ? "none" : undefined
      }
      className={cn(
        "border-b border-border bg-surface-sunken/70",
        "px-[var(--density-row-x)] py-[10px]",
        "text-xs font-medium text-fg-subtle",
        "first:rounded-tl-lg last:rounded-tr-lg",
        { left: "text-left", right: "text-right", center: "text-center" }[align],
        className,
      )}
      {...props}
    >
      {content}
    </th>
  );
});

export interface TDProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "right" | "center";
  /** Quieter than the row's default: a date, a reference, a note. */
  muted?: boolean;
  /** Right-aligned and tabular. Use on every column of money. */
  numeric?: boolean;
}

export const TD = React.forwardRef<HTMLTableCellElement, TDProps>(function TD(
  { className, align, muted = false, numeric = false, ...props },
  ref,
) {
  const a = align ?? (numeric ? "right" : "left");
  return (
    <td
      ref={ref}
      className={cn(
        "px-[var(--density-row-x)] py-[var(--density-row-y)] align-middle",
        "first:rounded-bl-lg last:rounded-br-lg",
        { left: "text-left", right: "text-right", center: "text-center" }[a],
        muted ? "text-fg-subtle" : "text-fg",
        numeric && "tabular-nums font-medium",
        className,
      )}
      {...props}
    />
  );
});

/** A full-width row for "nothing here" inside an otherwise real table. */
export function TableEmpty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-[var(--density-row-x)] py-[40px] text-center text-fg-subtle">
        {children}
      </td>
    </tr>
  );
}
