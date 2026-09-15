import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The number. Anything above `max` renders as "max+". */
  count: number;
  max?: number;
  tone?: "bad" | "accent" | "neutral";
  /** Renders a plain dot with no number — "something changed", not "how many". */
  dotOnly?: boolean;
  /**
   * Announced instead of the bare number, which on its own reads as "12" with
   * no clue what twelve of. Pass e.g. "unread messages".
   */
  unit?: string;
  /** Hidden at zero by default: a badge reading 0 is worse than no badge. */
  showZero?: boolean;
}

/**
 * A count on top of something else: the unread bubble on a nav item, the
 * number of open tasks on a tab.
 *
 * Not to be confused with Chip. A Badge counts; a Chip states a status. If the
 * thing you want to show is a word, it is a Chip.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, count, max = 99, tone = "bad", dotOnly = false, unit, showZero = false, ...props },
  ref,
) {
  if (count <= 0 && !showZero) return null;

  const tones = {
    bad: "bg-bad text-on-status",
    accent: "bg-accent text-accent-fg",
    neutral: "bg-surface-sunken text-fg-muted",
  }[tone];

  if (dotOnly) {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={unit ? `${count} ${unit}` : `${count}`}
        className={cn("inline-block size-[7px] rounded-full", tones, className)}
        {...props}
      />
    );
  }

  return (
    <span
      ref={ref}
      role="status"
      aria-label={unit ? `${count} ${unit}` : undefined}
      className={cn(
        "inline-grid place-items-center rounded-full",
        "min-w-[20px] h-[20px] px-[6px]",
        "text-2xs font-semibold leading-none not-italic",
        tones,
        className,
      )}
      {...props}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
});
