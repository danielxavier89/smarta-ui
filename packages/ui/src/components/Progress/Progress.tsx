import * as React from "react";
import { Progress as RProgress } from "radix-ui";
import { cn } from "../../lib/utils";

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RProgress.Root>, "value"> {
  /** 0–100. Pass null for work with no knowable end. */
  value: number | null;
  /** What is progressing. Required — "62%" of what is not a message. */
  label: string;
  /** Shows the label and the percentage above the bar. */
  showLabel?: boolean;
  tone?: "accent" | "ok" | "warn" | "bad";
  size?: "sm" | "md";
}

/**
 * A determinate bar for work whose end is known: an upload, a checklist, a
 * period's completeness.
 *
 * Do not use it to report that fine things are fine. A bar that sits at 100%
 * on a normal day is decoration. If the useful fact is *which* item is
 * missing, name it in a ListItem instead of drawing a bar at 2 of 3.
 *
 * For work with no known end — a request in flight — use a Spinner.
 */
export function Progress({
  className,
  value,
  label,
  showLabel = false,
  tone = "accent",
  size = "md",
  ...props
}: ProgressProps) {
  const pct = value === null ? null : Math.max(0, Math.min(100, value));
  const fill = { accent: "bg-accent", ok: "bg-ok", warn: "bg-warn", bad: "bg-bad" }[tone];

  return (
    <div className="flex flex-col gap-[5px]">
      {showLabel && (
        <div className="flex items-baseline justify-between gap-[10px] text-xs">
          <span className="text-fg-muted">{label}</span>
          {pct !== null && <span className="tabular-nums text-fg-subtle">{Math.round(pct)}%</span>}
        </div>
      )}
      <RProgress.Root
        value={pct}
        aria-label={showLabel ? undefined : label}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-surface-sunken",
          size === "sm" ? "h-[4px]" : "h-[7px]",
          className,
        )}
        {...props}
      >
        <RProgress.Indicator
          className={cn(
            "h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)]",
            fill,
            // No known end: a slice that travels rather than a bar that fills.
            pct === null && "w-1/3 animate-[skeleton_1.4s_ease-in-out_infinite]",
          )}
          style={pct === null ? undefined : { width: `${pct}%` }}
        />
      </RProgress.Root>
    </div>
  );
}
