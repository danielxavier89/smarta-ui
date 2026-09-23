import * as React from "react";
import { cn } from "../../lib/utils";
import { Card } from "../Card";

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "prefix" | "onClick"> {
  /** Makes the whole tile a link to the list behind the number. */
  onClick?: () => void;
  /** What the number is. A noun phrase: "Missing charges", not "Missing". */
  label: React.ReactNode;
  /**
   * Already formatted. Money goes through the product's currency helper before
   * it gets here — a StatCard does not know what a euro is.
   */
  value: React.ReactNode;
  /** One line under the value, naming the thing rather than restating the count. */
  caption?: React.ReactNode;
  tone?: "default" | "ok" | "warn" | "bad";
  icon?: React.ReactNode;
  loading?: boolean;
}

/**
 * One number, named.
 *
 * Both prototypes carry a hard-won rule about these: do not report that fine
 * things are fine. A tile that says "0 overdue" every day is a tile nobody
 * reads on the day it says 3. And a count that stands alone — "2 of 3, one
 * missing" — is worse than naming the missing thing: "Revolut ···· 7731
 * missing". Reach for a StatCard when the number itself is the point, and for
 * a ListItem when the answer is *which one*.
 */
export function StatCard({
  className,
  label,
  value,
  caption,
  tone = "default",
  icon,
  onClick,
  loading = false,
  ...props
}: StatCardProps) {
  const tones = {
    default: "text-fg",
    ok: "text-ok",
    warn: "text-warn",
    bad: "text-bad",
  }[tone];

  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      affordance="arrow"
      // The tile's own words are the card's accessible name, so a screen
      // reader hears "Missing charges" rather than "button".
      affordanceLabel={typeof label === "string" ? label : undefined}
      className={cn("p-[var(--density-card-p)]", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-[10px]">
        <p className="m-0 text-sm text-fg-subtle">{label}</p>
        {icon && <span className="shrink-0 text-fg-faint">{icon}</span>}
      </div>
      {loading ? (
        <div className="mt-[6px] h-[30px] w-[90px] animate-[skeleton_1.4s_ease-in-out_infinite] rounded-sm bg-skeleton" />
      ) : (
        <p className={cn("m-0 mt-[2px] text-2xl font-semibold tracking-tight tabular-nums", tones)}>
          {value}
        </p>
      )}
      {caption && <p className="m-0 mt-[2px] text-xs text-fg-subtle">{caption}</p>}
    </Card>
  );
}
