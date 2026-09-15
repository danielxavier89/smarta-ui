import * as React from "react";
import { cn } from "@/lib/utils";

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

export interface TRProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Adds hover, cursor and a focus ring. Give it a tabIndex and a key handler too. */
  clickable?: boolean;
  selected?: boolean;
}

export const TR = React.forwardRef<HTMLTableRowElement, TRProps>(function TR(
  { className, clickable = false, selected = false, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(
        "border-b border-border-soft last:border-b-0",
        clickable && "cursor-pointer hover:bg-surface-hover",
        clickable && "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring",
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
