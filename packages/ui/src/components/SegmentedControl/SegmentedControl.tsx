import * as React from "react";
import { ToggleGroup } from "radix-ui";
import { cn } from "@/lib/utils";

export interface SegmentOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ToggleGroup.Root>,
    "type" | "children" | "onValueChange" | "value" | "defaultValue"
  > {
  options: SegmentOption[];
  value: string;
  onValueChange: (value: string) => void;
  /** Announced as the group's purpose: "Period", "View". */
  label: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

/**
 * Two to four mutually exclusive views of the same content: month / quarter /
 * year, list / grid.
 *
 * It switches how something is shown. Tabs switch *what* is shown, and carry
 * counts; a RadioGroup records an answer in a form. If the choice is longer
 * than four options, or the labels do not fit on one line, it is a Select.
 *
 * The value is never allowed to become empty: pressing the active segment
 * again does nothing, because a segmented control with nothing selected has no
 * meaning.
 */
export function SegmentedControl({
  className,
  options,
  value,
  onValueChange,
  label,
  size = "md",
  fullWidth = false,
  ...props
}: SegmentedControlProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onValueChange(v);
      }}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-[2px] rounded-full bg-surface-sunken p-[3px]",
        // The labels never wrap — that is the point of a segmented control —
        // so on a narrow screen the track scrolls instead of pushing the page
        // sideways. Four short segments still fit a 360px phone; past that,
        // the component's own rule applies and it should have been a Select.
        "max-w-full overflow-x-auto overscroll-x-contain",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        fullWidth && "flex w-full",
        className,
      )}
      {...props}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap",
            "cursor-pointer rounded-full border-0 bg-transparent font-medium text-fg-subtle",
            "transition-[background-color,color,box-shadow] duration-[var(--duration-fast)]",
            size === "sm" ? "h-[24px] px-[10px] text-xs" : "h-[28px] px-[13px] text-sm",
            "touch:min-h-[var(--touch-target)]",
            "hover:text-fg",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring",
            "data-[state=on]:bg-surface data-[state=on]:text-fg data-[state=on]:shadow-xs",
            "disabled:opacity-55 disabled:cursor-not-allowed",
          )}
        >
          {o.icon}
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
