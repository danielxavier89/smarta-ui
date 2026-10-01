import * as React from "react";
import { cn } from "../../lib/utils";

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
    bad: "sui:bg-bad sui:text-on-status",
    accent: "sui:bg-accent sui:text-accent-fg",
    neutral: "sui:bg-surface-sunken sui:text-fg-muted",
  }[tone];

  if (dotOnly) {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={unit ? `${count} ${unit}` : `${count}`}
        className={cn("sui:inline-block sui:size-[7px] sui:rounded-full", tones, className)}
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
        "sui:inline-grid sui:place-items-center sui:rounded-full",
        "sui:min-w-[20px] sui:h-[20px] sui:px-[6px]",
        "sui:text-2xs sui:font-semibold sui:leading-none sui:not-italic",
        tones,
        className,
      )}
      {...props}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
});
