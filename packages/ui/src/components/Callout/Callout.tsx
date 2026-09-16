import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "info" | "ok" | "warn" | "bad" | "neutral";
  title?: React.ReactNode;
  icon?: React.ReactNode;
  /** The next step, right where the problem is described. */
  action?: React.ReactNode;
  onDismiss?: () => void;
}

const toneMap = {
  info: { box: "bg-info-bg text-info-fg border-info/30", icon: Info },
  ok: { box: "bg-ok-bg text-ok-fg border-ok/30", icon: CheckCircle2 },
  warn: { box: "bg-warn-bg text-warn-fg border-warn/30", icon: AlertTriangle },
  bad: { box: "bg-bad-bg text-bad-fg border-bad/30", icon: XCircle },
  neutral: { box: "bg-surface-sunken text-fg-muted border-border", icon: Lock },
} as const;

/**
 * A message that stays on the page: a locked period, a blocked conversion, a
 * rule the user needs to know before they act.
 *
 * A Callout persists and belongs to a place. A Toast is transient and belongs
 * to a moment — use it for "that worked", and a Callout for "here is why this
 * is the way it is".
 */
export function Callout({
  className,
  tone = "info",
  title,
  icon,
  action,
  onDismiss,
  children,
  ...props
}: CalloutProps) {
  const { box, icon: DefaultIcon } = toneMap[tone];
  return (
    <div
      role={tone === "bad" ? "alert" : "status"}
      className={cn(
        "flex gap-[10px] rounded-md border px-[14px] py-[12px] text-sm",
        box,
        className,
      )}
      {...props}
    >
      <span aria-hidden className="mt-[1px] shrink-0">
        {icon ?? <DefaultIcon size={16} />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        {title && <p className="m-0 font-semibold">{title}</p>}
        {children && <div className="[&>p]:m-0 [&>p+p]:mt-[4px]">{children}</div>}
        {/* Two buttons and an icon leave a callout about 240px of width on a
            phone. They wrap rather than stretch the box past the screen. */}
        {action && <div className="mt-[4px] flex flex-wrap gap-[8px]">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="ml-[4px] shrink-0 self-start rounded-xs opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-focus-ring"
        >
          <XCircle size={15} aria-hidden />
        </button>
      )}
    </div>
  );
}
