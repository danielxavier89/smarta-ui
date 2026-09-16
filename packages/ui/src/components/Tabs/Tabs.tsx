import * as React from "react";
import { Tabs as RTabs } from "radix-ui";
import { cn } from "@/lib/utils";

export const Tabs = RTabs.Root;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof RTabs.List> {}

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof RTabs.List>,
  TabsListProps
>(function TabsList({ className, ...props }, ref) {
  return (
    <RTabs.List
      ref={ref}
      className={cn(
        "flex items-center gap-[20px] border-b border-border",
        // Tabs overflow on a phone long before they wrap well.
        "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        // Without this, swiping past the last tab hands the gesture to the
        // browser and iOS navigates back out of the page.
        "overscroll-x-contain",
        className,
      )}
      {...props}
    />
  );
});

export interface TabProps
  extends React.ComponentPropsWithoutRef<typeof RTabs.Trigger> {
  /**
   * The number of rows behind this tab. Derive it from the same list the tab
   * renders — a count that is passed in separately is a count that will
   * eventually disagree with the list underneath it.
   */
  count?: number;
}

export const Tab = React.forwardRef<
  React.ComponentRef<typeof RTabs.Trigger>,
  TabProps
>(function Tab({ className, count, children, ...props }, ref) {
  return (
    <RTabs.Trigger
      ref={ref}
      className={cn(
        "relative -mb-px shrink-0 cursor-pointer whitespace-nowrap",
        "border-0 border-b-2 border-transparent bg-transparent",
        "px-[2px] py-[8px] text-sm font-medium text-fg-subtle",
        "touch:min-h-[var(--touch-target)]",
        "transition-[color,border-color] duration-[var(--duration-fast)]",
        "hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring rounded-xs",
        "data-[state=active]:border-accent data-[state=active]:text-accent-soft-fg",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
      {typeof count === "number" && (
        <span className="ml-[6px] text-fg-subtle tabular-nums">{count}</span>
      )}
    </RTabs.Trigger>
  );
});

export const TabPanel = React.forwardRef<
  React.ComponentRef<typeof RTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RTabs.Content>
>(function TabPanel({ className, ...props }, ref) {
  return (
    <RTabs.Content
      ref={ref}
      className={cn(
        "pt-[16px] focus-visible:outline-2 focus-visible:outline-focus-ring rounded-xs",
        className,
      )}
      {...props}
    />
  );
});
