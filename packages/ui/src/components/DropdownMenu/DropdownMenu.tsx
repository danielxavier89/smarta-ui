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
          "z-[var(--z-dropdown)] min-w-[200px]",
          // A menu longer than the screen used to be clipped with no way to
          // reach the rest of it — overflow-hidden was there for the rounded
          // corners, and on a phone it hid the items. Radix measures the room
          // it actually has; the menu scrolls inside that.
          "max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto",
          "max-w-[calc(100vw-16px)] overscroll-contain",
          "rounded-lg border border-border bg-surface-raised p-[4px] shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
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
        "flex cursor-pointer select-none items-center gap-[9px] rounded-sm",
        "px-[9px] py-[7px] text-sm outline-none",
        "touch:min-h-[var(--touch-target)]",
        tone === "danger" ? "text-bad" : "text-fg",
        "data-[highlighted]:bg-surface-hover",
        tone === "danger" && "data-[highlighted]:bg-bad-bg",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-55",
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-fg-subtle">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {meta && <span className="shrink-0 text-xs text-fg-subtle">{meta}</span>}
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
        "flex cursor-pointer select-none items-center gap-[9px] rounded-sm",
        "px-[9px] py-[7px] text-sm text-fg outline-none",
        "touch:min-h-[var(--touch-target)]",
        "data-[highlighted]:bg-surface-hover",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-55",
        className,
      )}
      {...props}
    >
      <span className="grid size-[14px] shrink-0 place-items-center">
        <RMenu.ItemIndicator>
          <Check size={13} strokeWidth={3} className="text-accent" aria-hidden />
        </RMenu.ItemIndicator>
      </span>
      <span className="flex-1 truncate">{children}</span>
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
      className={cn("px-[9px] pb-[4px] pt-[8px] text-xs font-medium text-fg-subtle", className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof RMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof RMenu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <RMenu.Separator ref={ref} className={cn("my-[4px] h-px bg-border-soft", className)} {...props} />;
});
