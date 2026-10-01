import * as React from "react";
import { DropdownMenu as RMenu } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { ThemeScope } from "../ThemeProvider";

export const DropdownMenu = RMenu.Root;
export const DropdownMenuTrigger = RMenu.Trigger;

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof RMenu.Content>,
  React.ComponentPropsWithoutRef<typeof RMenu.Content>
>(function DropdownMenuContent({ className, sideOffset = 6, align = "end", ...props }, ref) {
  return (
    <RMenu.Portal>
      <ThemeScope>
      <RMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={8}
        className={cn(
          "sui:z-[var(--z-dropdown)] sui:min-w-[200px]",
          // A menu longer than the screen used to be clipped with no way to
          // reach the rest of it — overflow-hidden was there for the rounded
          // corners, and on a phone it hid the items. Radix measures the room
          // it actually has; the menu scrolls inside that.
          "sui:max-h-[var(--radix-dropdown-menu-content-available-height)] sui:overflow-y-auto",
          "sui:max-w-[calc(100vw-16px)] sui:overscroll-contain",
          "sui:rounded-lg sui:border sui:border-border sui:bg-surface-raised sui:p-[4px] sui:shadow-lg",
          "sui:data-[state=open]:animate-in sui:data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      />
    </ThemeScope>
      </RMenu.Portal>
  );
});

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof RMenu.Item> {
  icon?: React.ReactNode;
  /** Destructive items read in the bad tone and sit at the foot of the menu. */
  tone?: "default" | "danger";
  /** A keyboard shortcut or a count, right-aligned. */
  meta?: React.ReactNode;
}

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof RMenu.Item>,
  DropdownMenuItemProps
>(function DropdownMenuItem({ className, icon, tone = "default", meta, children, ...props }, ref) {
  return (
    <RMenu.Item
      ref={ref}
      className={cn(
        "sui:flex sui:cursor-pointer sui:select-none sui:items-center sui:gap-[9px] sui:rounded-sm",
        "sui:px-[9px] sui:py-[7px] sui:text-sm sui:focus-visible:outline-none",
        "sui:touch:min-h-[var(--touch-target)]",
        tone === "danger" ? "sui:text-bad" : "sui:text-fg",
        "sui:data-[highlighted]:bg-surface-hover",
        tone === "danger" && "sui:data-[highlighted]:bg-bad-bg",
        "sui:data-[disabled]:pointer-events-none sui:data-[disabled]:opacity-55",
        className,
      )}
      {...props}
    >
      {icon && <span className="sui:shrink-0 sui:text-fg-subtle">{icon}</span>}
      <span className="sui:flex-1 sui:truncate">{children}</span>
      {meta && <span className="sui:shrink-0 sui:text-xs sui:text-fg-subtle">{meta}</span>}
    </RMenu.Item>
  );
});

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof RMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof RMenu.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <RMenu.CheckboxItem
      ref={ref}
      className={cn(
        "sui:flex sui:cursor-pointer sui:select-none sui:items-center sui:gap-[9px] sui:rounded-sm",
        "sui:px-[9px] sui:py-[7px] sui:text-sm sui:text-fg sui:focus-visible:outline-none",
        "sui:touch:min-h-[var(--touch-target)]",
        "sui:data-[highlighted]:bg-surface-hover",
        "sui:data-[disabled]:pointer-events-none sui:data-[disabled]:opacity-55",
        className,
      )}
      {...props}
    >
      <span className="sui:grid sui:size-[14px] sui:shrink-0 sui:place-items-center">
        <RMenu.ItemIndicator>
          <Check size={13} strokeWidth={3} className="sui:text-accent" aria-hidden />
        </RMenu.ItemIndicator>
      </span>
      <span className="sui:flex-1 sui:truncate">{children}</span>
    </RMenu.CheckboxItem>
  );
});

export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof RMenu.Label>,
  React.ComponentPropsWithoutRef<typeof RMenu.Label>
>(function DropdownMenuLabel({ className, ...props }, ref) {
  return (
    <RMenu.Label
      ref={ref}
      className={cn("sui:px-[9px] sui:pb-[4px] sui:pt-[8px] sui:text-xs sui:font-medium sui:text-fg-subtle", className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof RMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof RMenu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <RMenu.Separator ref={ref} className={cn("sui:my-[4px] sui:h-px sui:bg-border-soft", className)} {...props} />;
});
