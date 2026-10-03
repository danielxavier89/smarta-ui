import * as React from "react";
import { Label as RLabel } from "radix-ui";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

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
  const labels = useLabels();

  return (
    <RLabel.Root
      ref={ref}
      className={cn(
        "sui:inline-flex sui:items-center sui:gap-[6px] sui:text-sm sui:font-medium sui:text-fg-muted",
        "sui:peer-disabled:opacity-55",
        className,
      )}
      {...props}
    >
      {children}
      {optional && (
        <span className="sui:text-xs sui:font-normal sui:text-fg-subtle">{labels.optional}</span>
      )}
    </RLabel.Root>
  );
});
