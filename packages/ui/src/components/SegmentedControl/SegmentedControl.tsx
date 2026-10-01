import * as React from "react";
import { ToggleGroup } from "radix-ui";
import { cn } from "../../lib/utils";

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
        "sui:inline-flex sui:items-center sui:gap-[2px] sui:rounded-full sui:bg-surface-sunken sui:p-[3px]",
        // The labels never wrap — that is the point of a segmented control —
        // so on a narrow screen the track scrolls instead of pushing the page
        // sideways. Four short segments still fit a 360px phone; past that,
        // the component's own rule applies and it should have been a Select.
        "sui:max-w-full sui:overflow-x-auto sui:overscroll-x-contain",
        "sui:[scrollbar-width:none] sui:[&::-webkit-scrollbar]:hidden",
        fullWidth && "sui:flex sui:w-full",
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
            "sui:inline-flex sui:flex-1 sui:items-center sui:justify-center sui:gap-[6px] sui:whitespace-nowrap",
            "sui:cursor-pointer sui:rounded-full sui:border-0 sui:bg-transparent sui:font-medium sui:text-fg-subtle",
            "sui:transition-[background-color,color,box-shadow] sui:duration-[var(--duration-fast)]",
            size === "sm" ? "sui:h-[24px] sui:px-[10px] sui:text-xs" : "sui:h-[28px] sui:px-[13px] sui:text-sm",
            "sui:touch:min-h-[var(--touch-target)]",
            "sui:hover:text-fg",
            "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-1 sui:focus-visible:outline-focus-ring",
            "sui:data-[state=on]:bg-surface sui:data-[state=on]:text-fg sui:data-[state=on]:shadow-xs",
            "sui:disabled:opacity-55 sui:disabled:cursor-not-allowed",
          )}
        >
          {o.icon}
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
