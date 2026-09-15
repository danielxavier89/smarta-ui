import * as React from "react";
import { cn } from "@/lib/utils";

export interface KeyValueRow {
  key: React.ReactNode;
  value: React.ReactNode;
  /** A control on the right of the value: copy, "put into master data". */
  action?: React.ReactNode;
  /** Draws the value in the bad tone — a mismatch, a value that failed a check. */
  tone?: "default" | "ok" | "warn" | "bad";
  /** A quiet line under the value explaining where the number came from. */
  note?: React.ReactNode;
}

export interface KeyValueProps extends React.HTMLAttributes<HTMLDListElement> {
  rows: KeyValueRow[];
  /**
   * rows     key left, value right — a panel's facts, read down the right edge
   * stacked  key above value — narrow columns, and long values
   */
  layout?: "rows" | "stacked";
  size?: "sm" | "md";
}

/**
 * The facts about one thing: a receipt's supplier, date, VAT and total.
 *
 * A real <dl>, so a screen reader reads each value with its own label instead
 * of a wall of text. It is for showing, not editing — the moment a value can be
 * changed, it is a Field.
 */
export function KeyValue({ className, rows, layout = "rows", size = "md", ...props }: KeyValueProps) {
  const toneClass = {
    default: "text-fg",
    ok: "text-ok-fg",
    warn: "text-warn-fg",
    bad: "text-bad-fg",
  };

  return (
    <dl
      className={cn(
        "m-0 grid",
        layout === "rows" ? "gap-y-[9px]" : "gap-y-[12px]",
        size === "sm" ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          className={cn(
            layout === "rows"
              ? "flex items-start justify-between gap-[16px]"
              : "flex flex-col gap-[1px]",
          )}
        >
          <dt className={cn("m-0 shrink-0 text-fg-subtle", layout === "stacked" && "text-xs")}>
            {r.key}
          </dt>
          <dd
            className={cn(
              "m-0 flex min-w-0 items-start gap-[6px] font-medium",
              layout === "rows" && "text-right justify-end",
              toneClass[r.tone ?? "default"],
            )}
          >
            <span className="min-w-0 break-words">{r.value}</span>
            {r.action}
          </dd>
          {r.note && (
            <dd className="col-span-full m-0 text-xs font-normal text-fg-subtle">{r.note}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
