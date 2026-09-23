import * as React from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  /** What the situation is, as a sentence fragment: "No receipts yet". */
  title: React.ReactNode;
  /** Why it is empty and what would fill it. One or two lines. */
  description?: React.ReactNode;
  /** The next action. An empty state without one is a dead end. */
  action?: React.ReactNode;
  /** A quieter second option. */
  secondaryAction?: React.ReactNode;
  /**
   * first-run   nothing here yet, and that is normal
   * no-results  a filter or a search hid everything
   * locked      there is data, but this user or this period cannot see it
   * error       something failed; offer a retry, not an explanation of HTTP
   */
  variant?: "first-run" | "no-results" | "locked" | "error";
  size?: "sm" | "md";
}

/**
 * The state a list is in when it has nothing to list.
 *
 * The rule both prototypes hold to: an empty state explains the situation and
 * offers the next action. It never just says "No data". Which of the four
 * variants it is decides what the next action should be — clearing a filter is
 * not the same offer as uploading the first receipt.
 */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "first-run",
  size = "md",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "gap-[8px] px-[20px] py-[28px]" : "gap-[10px] px-[24px] py-[48px]",
        className,
      )}
      role={variant === "error" ? "alert" : undefined}
      {...props}
    >
      {icon && (
        <div
          aria-hidden
          className={cn(
            "grid place-items-center rounded-full",
            size === "sm" ? "size-[36px]" : "size-[46px]",
            variant === "error" ? "bg-bad-bg text-bad" : "bg-surface-sunken text-fg-faint",
          )}
        >
          {icon}
        </div>
      )}
      <p className={cn("m-0 font-semibold text-fg", size === "sm" ? "text-base" : "text-lg")}>
        {title}
      </p>
      {description && (
        <p className="m-0 max-w-[42ch] text-sm text-fg-subtle">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-[6px] flex flex-wrap items-center justify-center gap-[8px]">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
