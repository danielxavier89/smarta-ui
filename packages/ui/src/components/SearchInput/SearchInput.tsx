import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Announced to screen readers; the magnifier is not a label. */
  label?: string;
  /** Shows a clear button once there is text. Fires onClear, then focuses back. */
  onClear?: () => void;
  size?: "sm" | "md";
  containerClassName?: string;
}

/**
 * The pill-shaped search field from both products' top bars.
 *
 * A separate component from Input rather than a variant of it, because it is a
 * different shape (pill, not rounded rectangle), sits on the canvas rather than
 * on a surface, and almost never carries a visible label — three decisions that
 * would otherwise become three more props on Input.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      className,
      containerClassName,
      label = "Search",
      placeholder = "Search",
      onClear,
      size = "md",
      value,
      ...props
    },
    ref,
  ) {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    const hasValue = String(value ?? "").length > 0;

    return (
      <div
        className={cn(
          "flex items-center gap-[8px] rounded-full border border-border bg-canvas",
          "text-fg-subtle transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
          // The input drops its own outline, so the pill it sits in shows the
          // focus instead of a rectangle inside a circle.
          "focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]",
          size === "sm"
            ? "h-[var(--control-height-sm)] px-[12px] text-xs"
            : "h-[var(--control-height-md)] px-[14px] text-base",
          containerClassName,
        )}
      >
        <Search size={size === "sm" ? 13 : 15} aria-hidden className="shrink-0" />
        <input
          ref={innerRef}
          type="search"
          aria-label={label}
          placeholder={placeholder}
          value={value}
          className={cn(
            "w-full min-w-0 border-0 bg-transparent p-0 outline-none",
            "text-[inherit] text-fg placeholder:text-fg-subtle",
            // Safari draws its own X on type=search and it cannot be styled.
            "[&::-webkit-search-cancel-button]:appearance-none",
            className,
          )}
          {...props}
        />
        {onClear && hasValue && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onClear();
              innerRef.current?.focus();
            }}
            className="shrink-0 rounded-full p-[2px] text-fg-subtle hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring"
          >
            <X size={13} aria-hidden />
          </button>
        )}
      </div>
    );
  },
);
