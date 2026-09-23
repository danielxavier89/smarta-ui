import * as React from "react";
import { Tooltip as RTooltip } from "radix-ui";
import { cn } from "../../lib/utils";
import { ThemeScope } from "../ThemeProvider";

/**
 * True when an app has mounted TooltipProvider above us.
 *
 * Radix's provider is what makes tooltips share a delay group: once one is
 * open, the next shows instantly instead of waiting again. An app should mount
 * one at the root to get that.
 *
 * But a component deep in the library may render a Tooltip of its own — see
 * KeyValue's note icon — and Radix throws outright without a provider. A
 * library component that crashes because of how the host app was wired is a bad
 * trade, so Tooltip supplies its own when none is found, losing only the shared
 * delay.
 */
const HasTooltipProvider = React.createContext(false);

export function TooltipProvider({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof RTooltip.Provider>) {
  return (
    <HasTooltipProvider.Provider value={true}>
      <RTooltip.Provider delayDuration={200} skipDelayDuration={300} {...props}>
        {children}
      </RTooltip.Provider>
    </HasTooltipProvider.Provider>
  );
}

export interface TooltipProps {
  /**
   * Short. A tooltip is a label or a unit, not a paragraph — it cannot be
   * reached on touch, cannot be selected, and disappears the moment the
   * pointer moves. Anything the user must read belongs on the page.
   */
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  /** Controlled open, for a tooltip that a click pins on a touch device. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A short label on hover and on keyboard focus.
 *
 * Never put an action, a link, or the only copy of a piece of information in
 * one. On a touch screen hover never fires, so the content is simply gone.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  open,
  onOpenChange,
}: TooltipProps) {
  const hasProvider = React.useContext(HasTooltipProvider);

  const root = (
    <RTooltip.Root delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
      <ThemeScope>
        <RTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            "z-[var(--z-tooltip)] max-w-[260px] rounded-md",
            "bg-inverse-surface px-[9px] py-[6px] text-xs text-inverse-fg",
            "shadow-md",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          {content}
          <RTooltip.Arrow className="fill-[var(--inverse-surface)]" width={10} height={5} />
        </RTooltip.Content>
      </ThemeScope>
      </RTooltip.Portal>
    </RTooltip.Root>
  );

  return hasProvider ? root : <RTooltip.Provider>{root}</RTooltip.Provider>;
}
