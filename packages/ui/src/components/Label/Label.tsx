import * as React from "react";
import { Label as RLabel } from "radix-ui";
import { cn } from "../../lib/utils";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof RLabel.Root> {
  /** Adds the optional marker. Required is the default, so it is never marked. */
  optional?: boolean;
}

/**
 * Optional is marked, required is not.
 *
 * The inverse — an asterisk on everything required — puts a mark on most of
 * the form and draws the eye to the wrong thing. Marking the two fields a user
 * can skip tells them something they did not already assume.
 */
export const Label = React.forwardRef<
  React.ComponentRef<typeof RLabel.Root>,
  LabelProps
>(function Label({ className, optional = false, children, ...props }, ref) {
  return (
    <RLabel.Root
      ref={ref}
      className={cn(
        "inline-flex items-center gap-[6px] text-sm font-medium text-fg-muted",
        "peer-disabled:opacity-55",
        className,
      )}
      {...props}
    >
      {children}
      {optional && (
        <span className="text-xs font-normal text-fg-subtle">optional</span>
      )}
    </RLabel.Root>
  );
});
