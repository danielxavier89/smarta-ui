import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";
import { Tooltip } from "../Tooltip";

export interface KeyValueRow {
  key: React.ReactNode;
  value: React.ReactNode;
  /** A control on the right of the value: copy, "put into master data". */
  action?: React.ReactNode;
  /** Draws the value in the bad tone — a mismatch, a value that failed a check. */
  tone?: "default" | "ok" | "warn" | "bad";
  /**
   * Where the value came from, or the rule behind it. Shown on an info icon
   * beside the key rather than as a second line, so a column of figures stays
   * a column of figures.
   *
   * Keep it to a sentence, and keep it explanatory. Anything the user has to
   * act on belongs on the page — a tooltip cannot be re-read once the pointer
   * moves. The icon is a real button, so it is reachable by keyboard and can be
   * tapped on a touch screen, where hover never fires.
   */
  note?: React.ReactNode;
  /**
   * Keeps the value on one line, whatever the column width.
   *
   * Use it for money, tax numbers, references and dates. A wrapped number is
   * not a smaller number, it is a different number: "€486.2 / 2" reads as two
   * figures, and a Steuernummer split across lines cannot be checked against a
   * document by eye. Prose values should be left to wrap.
   */
  nowrap?: boolean;
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
/**
 * The info icon beside a key.
 *
 * A real <button>, not a bare icon: Radix opens the tooltip on focus as well as
 * hover, so a keyboard reaches it, and the click handler pins it open on a
 * touch screen — where hover never fires and the content would otherwise be
 * unreachable.
 */
function NoteTip({ label, note }: { label: React.ReactNode; note: React.ReactNode }) {
  const labels = useLabels();
  const [open, setOpen] = React.useState(false);
  const name = labels.aboutValue(typeof label === "string" ? label : undefined);

  return (
    <Tooltip content={note} open={open} onOpenChange={setOpen} side="top">
      <button
        type="button"
        aria-label={name}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          // 15px of icon, 44px of tap on a phone. A min-height here instead
          // would set the height of the whole row, and a column of figures
          // would gain a gap wherever a note happened to exist.
          "sui-touch-target sui:grid sui:size-[15px] sui:shrink-0 sui:place-items-center sui:rounded-full",
          "sui:text-fg-faint sui:transition-colors sui:duration-[var(--duration-fast)]",
          "sui:hover:text-fg-subtle",
          "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-1 sui:focus-visible:outline-focus-ring",
        )}
      >
        <Info size={13} aria-hidden />
      </button>
    </Tooltip>
  );
}

export function KeyValue({ className, rows, layout = "rows", size = "md", ...props }: KeyValueProps) {
  const toneClass = {
    default: "sui:text-fg",
    ok: "sui:text-ok-fg",
    warn: "sui:text-warn-fg",
    bad: "sui:text-bad-fg",
  };

  return (
    <dl
      className={cn(
        // A container, so each row can ask how much width it actually has.
        // The rows layout is only readable while the value has room beside the
        // key; below that it stops degrading and starts destroying — a nowrap
        // figure gets clipped, a long word gets shredded. Rather than guess,
        // the rows fall back to stacked, which is correct at any width.
        "sui:m-0 sui:grid sui:@container",
        layout === "rows" ? "sui:gap-y-[9px] sui:@max-[260px]:gap-y-[12px]" : "sui:gap-y-[12px]",
        size === "sm" ? "sui:text-sm" : "sui:text-base",
        className,
      )}
      {...props}
    >
      {rows.map((r, i) => (
        // A grid, not a flex row. The note is a third child that has to sit on
        // its own line spanning both columns, which a flex row cannot express —
        // as a flex item it became a third column instead, squeezing the value
        // until overflow-wrap broke it mid-number.
        <div
          key={i}
          className={cn(
            "sui:grid",
            layout === "rows"
              ? [
                  "sui:grid-cols-[minmax(0,auto)_minmax(0,1fr)] sui:items-start sui:gap-x-[16px] sui:gap-y-[2px]",
                  "sui:@max-[260px]:grid-cols-1 sui:@max-[260px]:gap-y-[1px]",
                ]
              : "sui:grid-cols-1 sui:gap-y-[1px]",
          )}
        >
          <dt
            className={cn(
              "sui:m-0 sui:flex sui:min-w-0 sui:items-center sui:gap-[4px] sui:text-fg-subtle",
              // The key gives way before the value does: a long label may wrap,
              // so the figure beside it keeps its room.
              layout === "stacked" && "sui:text-xs",
              layout === "rows" && "sui:@max-[260px]:text-xs",
            )}
          >
            <span className="sui:min-w-0">{r.key}</span>
            {r.note && <NoteTip label={r.key} note={r.note} />}
          </dt>
          <dd
            className={cn(
              "sui:m-0 sui:flex sui:min-w-0 sui:items-start sui:gap-[6px] sui:font-medium",
              layout === "rows" && "sui:justify-end sui:text-right",
              layout === "rows" && "sui:@max-[260px]:justify-start sui:@max-[260px]:text-left",
              toneClass[r.tone ?? "default"],
            )}
          >
            <span
              className={cn(
                "sui:min-w-0",
                // break-words is the last resort, not the plan: it only splits a
                // word that cannot fit on a line by itself. nowrap opts out of
                // even that, for values a break would falsify.
                r.nowrap ? "sui:whitespace-nowrap" : "sui:break-words",
              )}
            >
              {r.value}
            </span>
            {r.action}
          </dd>
        </div>
      ))}
    </dl>
  );
}
