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
        "sui:flex sui:flex-col sui:items-center sui:justify-center sui:text-center",
        size === "sm" ? "sui:gap-[8px] sui:px-[20px] sui:py-[28px]" : "sui:gap-[10px] sui:px-[24px] sui:py-[48px]",
        className,
      )}
      role={variant === "error" ? "alert" : undefined}
      {...props}
    >
      {icon && (
        <div
          aria-hidden
          className={cn(
            "sui:grid sui:place-items-center sui:rounded-full",
            size === "sm" ? "sui:size-[36px]" : "sui:size-[46px]",
            variant === "error" ? "sui:bg-bad-bg sui:text-bad" : "sui:bg-surface-sunken sui:text-fg-faint",
          )}
        >
          {icon}
        </div>
      )}
      <p className={cn("sui:m-0 sui:font-semibold sui:text-fg", size === "sm" ? "sui:text-base" : "sui:text-lg")}>
        {title}
      </p>
      {description && (
        <p className="sui:m-0 sui:max-w-[42ch] sui:text-sm sui:text-fg-subtle">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="sui:mt-[6px] sui:flex sui:flex-wrap sui:items-center sui:justify-center sui:gap-[8px]">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
