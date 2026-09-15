import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Matches the control it sits in. Defaults to the parent's font size. */
  size?: number;
  /** What a screen reader announces. Set to "" inside a control that already says it. */
  label?: string;
}

/**
 * The one busy indicator. Inherits currentColor, so it is the right colour
 * inside a primary button, a ghost button and a table cell without being told.
 */
export function Spinner({ size = 14, label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("animate-[spin_1.1s_linear_infinite]", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
