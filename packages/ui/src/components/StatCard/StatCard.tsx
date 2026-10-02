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
    default: "sui:text-fg",
    ok: "sui:text-ok",
    warn: "sui:text-warn",
    bad: "sui:text-bad",
  }[tone];

  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      affordance="arrow"
      // The tile's own words are the card's accessible name, so a screen
      // reader hears "Missing charges" rather than "button".
      affordanceLabel={typeof label === "string" ? label : undefined}
      className={cn("sui:p-[var(--density-card-p)]", className)}
      {...props}
    >
      <div className="sui:flex sui:items-start sui:justify-between sui:gap-[10px]">
        <p className="sui:m-0 sui:text-sm sui:text-fg-subtle">{label}</p>
        {icon && <span className="sui:shrink-0 sui:text-fg-faint">{icon}</span>}
      </div>
      {loading ? (
        <div className="sui:mt-[6px] sui:h-[30px] sui:w-[90px] sui:animate-[skeleton_1.4s_ease-in-out_infinite] sui:rounded-sm sui:bg-skeleton" />
      ) : (
        <p className={cn("sui:m-0 sui:mt-[2px] sui:font-display sui:text-2xl sui:font-semibold sui:tracking-tight sui:tabular-nums", tones)}>
          {value}
        </p>
      )}
      {caption && <p className="sui:m-0 sui:mt-[2px] sui:text-xs sui:text-fg-subtle">{caption}</p>}
    </Card>
  );
}
