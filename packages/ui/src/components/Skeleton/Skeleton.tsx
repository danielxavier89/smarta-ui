import * as React from "react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS width: "100%", "180px", "12ch". */
  width?: string;
  height?: string;
  shape?: "line" | "block" | "circle";
}

/**
 * A placeholder in the shape of the thing that is coming.
 *
 * Only worth it when the skeleton actually resembles the result — a list of
 * rows, a card, an avatar. For anything shorter than about 300ms it is a
 * flash of grey that makes the page feel less finished, not more, so prefer
 * leaving the old content in place with aria-busy.
 */
export function Skeleton({ className, width, height, shape = "line", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-[skeleton_1.4s_ease-in-out_infinite] bg-skeleton",
        shape === "circle" ? "rounded-full" : shape === "block" ? "rounded-md" : "rounded-xs",
        shape === "line" && !height && "h-[0.9em]",
        className,
      )}
      style={{ width, height, ...props.style }}
      {...props}
    />
  );
}

/** A run of skeleton rows shaped like a list. */
export function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  const labels = useLabels();
  return (
    <div className={cn("flex flex-col", className)} role="status" aria-label={labels.loading}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-[14px] border-b border-border-soft px-[var(--density-row-x)] py-[var(--density-row-y)] last:border-b-0"
        >
          <Skeleton shape="circle" width="30px" height="30px" />
          <div className="flex flex-1 flex-col gap-[6px]">
            <Skeleton width={`${55 + ((i * 13) % 30)}%`} />
            <Skeleton width={`${30 + ((i * 7) % 25)}%`} height="0.75em" />
          </div>
        </div>
      ))}
    </div>
  );
}
