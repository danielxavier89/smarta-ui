import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";
import { IconButton } from "../IconButton";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Renders "121–140 of 318" beside the controls. */
  totalItems?: number;
  pageSize?: number;
  /** Numbered buttons as well as the arrows. Off below about five pages. */
  showNumbers?: boolean;
}

/** 1 … 4 5 [6] 7 8 … 20 — never more than seven slots wide. */
function pageWindow(page: number, count: number): Array<number | "gap"> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out: Array<number | "gap"> = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(count - 1, page + 1);
  if (from > 2) out.push("gap");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < count - 1) out.push("gap");
  out.push(count);
  return out;
}

/**
 * Moves through a list that is too long to show at once.
 *
 * Only reach for it when the user needs to *find* a specific row and the total
 * matters. For a feed the user scans rather than searches, "load more" costs
 * less thought. Either way, never paginate a list whose total the interface
 * cannot state — a page 2 with no idea of page count is a dead end.
 */
export function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
  showNumbers = true,
  ...props
}: PaginationProps) {
  const labels = useLabels();

  const first = pageSize ? (page - 1) * pageSize + 1 : undefined;
  const last =
    pageSize && totalItems ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <nav
      aria-label={labels.pagination}
      className={cn("flex flex-wrap items-center justify-between gap-[10px]", className)}
      {...props}
    >
      {totalItems !== undefined && (
        <p className="m-0 text-xs text-fg-subtle tabular-nums">
          {first !== undefined && last !== undefined
            ? labels.pageRange(first, last, totalItems)
            : labels.totalItems(totalItems)}
        </p>
      )}

      <div className="flex items-center gap-[4px]">
        <IconButton
          variant="ghost"
          size="sm"
          label={labels.previousPage}
          icon={<ChevronLeft size={16} />}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          // The arrows grow with the numbers rather than relying on the hit
          // area an IconButton carries by default. In a row this tight the two
          // approaches disagree: a 30px arrow with 44px of invisible tap around
          // it overlaps the 44px page number beside it, and the number wins.
          className="touch:size-[var(--touch-target)]"
        />
        {showNumbers &&
          pageWindow(page, pageCount).map((p, i) =>
            p === "gap" ? (
              <span key={`gap-${i}`} aria-hidden className="px-[4px] text-fg-faint">
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-label={labels.page(p)}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
                className={cn(
                  "min-w-[28px] cursor-pointer rounded-md border-0 bg-transparent px-[7px] py-[5px]",
                  // 28px is a comfortable click and a bad tap. On a finger the
                  // slot squares up to 44, and the row wraps rather than
                  // pushing the total off the edge.
                  "touch:min-h-[var(--touch-target)] touch:min-w-[var(--touch-target)]",
                  "text-sm tabular-nums text-fg-muted",
                  "hover:bg-surface-sunken",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                  p === page && "bg-selected-bg font-medium text-selected-fg hover:bg-selected-bg",
                )}
              >
                {p}
              </button>
            ),
          )}
        <IconButton
          variant="ghost"
          size="sm"
          label={labels.nextPage}
          icon={<ChevronRight size={16} />}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="touch:size-[var(--touch-target)]"
        />
      </div>
    </nav>
  );
}
