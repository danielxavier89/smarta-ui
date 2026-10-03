import * as React from "react";
import { Tabs as RTabs } from "radix-ui";
import { cn } from "../../lib/utils";

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
        "sui:flex sui:items-center sui:gap-[20px] sui:border-b sui:border-border",
        // Tabs overflow on a phone long before they wrap well.
        "sui:overflow-x-auto sui:[scrollbar-width:none] sui:[&::-webkit-scrollbar]:hidden",
        // Without this, swiping past the last tab hands the gesture to the
        // browser and iOS navigates back out of the page.
        "sui:overscroll-x-contain",
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
        "sui:relative sui:-mb-px sui:shrink-0 sui:cursor-pointer sui:whitespace-nowrap",
        "sui:border-0 sui:border-b-2 sui:border-transparent sui:bg-transparent",
        "sui:px-[2px] sui:py-[8px] sui:text-sm sui:font-medium sui:text-fg-subtle",
        "sui:touch:min-h-[var(--touch-target)]",
        "sui:transition-[color,border-color] sui:duration-[var(--duration-fast)]",
        "sui:hover:text-fg",
        "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring sui:rounded-xs",
        "sui:data-[state=active]:border-accent sui:data-[state=active]:text-accent-soft-fg",
        "sui:disabled:opacity-55 sui:disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
      {typeof count === "number" && (
        <span className="sui:ml-[6px] sui:text-fg-subtle sui:tabular-nums">{count}</span>
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
        "sui:pt-[16px] sui:focus-visible:outline-2 sui:focus-visible:outline-focus-ring sui:rounded-xs",
        className,
      )}
      {...props}
    />
  );
});
