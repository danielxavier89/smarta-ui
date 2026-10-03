import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

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
  info: { box: "sui:bg-info-bg sui:text-info-fg sui:border-info/30", icon: Info },
  ok: { box: "sui:bg-ok-bg sui:text-ok-fg sui:border-ok/30", icon: CheckCircle2 },
  warn: { box: "sui:bg-warn-bg sui:text-warn-fg sui:border-warn/30", icon: AlertTriangle },
  bad: { box: "sui:bg-bad-bg sui:text-bad-fg sui:border-bad/30", icon: XCircle },
  neutral: { box: "sui:bg-surface-sunken sui:text-fg-muted sui:border-border", icon: Lock },
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
  const labels = useLabels();

  const { box, icon: DefaultIcon } = toneMap[tone];
  return (
    <div
      role={tone === "bad" ? "alert" : "status"}
      className={cn(
        "sui:flex sui:gap-[10px] sui:rounded-md sui:border sui:px-[14px] sui:py-[12px] sui:text-sm",
        box,
        className,
      )}
      {...props}
    >
      <span aria-hidden className="sui:mt-[1px] sui:shrink-0">
        {icon ?? <DefaultIcon size={16} />}
      </span>
      <div className="sui:flex sui:min-w-0 sui:flex-1 sui:flex-col sui:gap-[4px]">
        {title && <p className="sui:m-0 sui:font-semibold">{title}</p>}
        {children && <div className="sui:[&>p]:m-0 sui:[&>p+p]:mt-[4px]">{children}</div>}
        {/* Two buttons and an icon leave a callout about 240px of width on a
            phone. They wrap rather than stretch the box past the screen. */}
        {action && <div className="sui:mt-[4px] sui:flex sui:flex-wrap sui:gap-[8px]">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={labels.dismiss}
          className="sui:ml-[4px] sui:shrink-0 sui:self-start sui:rounded-xs sui:opacity-60 sui:hover:opacity-100 sui:focus-visible:outline-2 sui:focus-visible:outline-focus-ring"
        >
          <XCircle size={15} aria-hidden />
        </button>
      )}
    </div>
  );
}
