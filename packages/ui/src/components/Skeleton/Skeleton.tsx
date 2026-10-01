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
        "sui:animate-[skeleton_1.4s_ease-in-out_infinite] sui:bg-skeleton",
        shape === "circle" ? "sui:rounded-full" : shape === "block" ? "sui:rounded-md" : "sui:rounded-xs",
        shape === "line" && !height && "sui:h-[0.9em]",
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
    <div className={cn("sui:flex sui:flex-col", className)} role="status" aria-label={labels.loading}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="sui:flex sui:items-center sui:gap-[14px] sui:border-b sui:border-border-soft sui:px-[var(--density-row-x)] sui:py-[var(--density-row-y)] sui:last:border-b-0"
        >
          <Skeleton shape="circle" width="30px" height="30px" />
          <div className="sui:flex sui:flex-1 sui:flex-col sui:gap-[6px]">
            <Skeleton width={`${55 + ((i * 13) % 30)}%`} />
            <Skeleton width={`${30 + ((i * 7) % 25)}%`} height="0.75em" />
          </div>
        </div>
      ))}
    </div>
  );
}
