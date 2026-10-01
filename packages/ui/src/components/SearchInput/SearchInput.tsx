import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

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
      label,
      placeholder,
      onClear,
      size = "md",
      value,
      ...props
    },
    ref,
  ) {
    const labels = useLabels();

    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    const hasValue = String(value ?? "").length > 0;

    return (
      <div
        className={cn(
          "sui:flex sui:items-center sui:gap-[8px] sui:rounded-full sui:border sui:border-border sui:bg-canvas",
          "sui:text-fg-subtle sui:transition-[border-color,box-shadow] sui:duration-[var(--duration-fast)]",
          // The input drops its own outline, so the pill it sits in shows the
          // focus instead of a rectangle inside a circle.
          "sui:focus-within:border-accent sui:focus-within:shadow-focus",
          size === "sm"
            ? "sui:h-[var(--control-height-sm)] sui:px-[12px] sui:text-[length:var(--field-font-size-sm)]"
            : "sui:h-[var(--control-height-md)] sui:px-[14px] sui:text-[length:var(--field-font-size)]",
          containerClassName,
        )}
      >
        <Search size={size === "sm" ? 13 : 15} aria-hidden className="sui:shrink-0" />
        <input
          ref={innerRef}
          type="search"
          aria-label={label ?? labels.search}
          placeholder={placeholder ?? labels.search}
          value={value}
          className={cn(
            "sui:w-full sui:min-w-0 sui:border-0 sui:bg-transparent sui:p-0 sui:focus-visible:outline-none",
            "sui:text-[inherit] sui:text-fg sui:placeholder:text-fg-subtle",
            // Safari draws its own X on type=search and it cannot be styled.
            "sui:[&::-webkit-search-cancel-button]:appearance-none",
            className,
          )}
          {...props}
        />
        {onClear && hasValue && (
          <button
            type="button"
            aria-label={labels.clearSearch}
            onClick={() => {
              onClear();
              innerRef.current?.focus();
            }}
            // The X is 13px of icon inside a 44px tap on a phone. Growing the
            // button instead would burst the pill it sits in.
            className="sui-touch-target sui:shrink-0 sui:rounded-full sui:p-[2px] sui:text-fg-subtle sui:hover:text-fg sui:focus-visible:outline-2 sui:focus-visible:outline-focus-ring"
          >
            <X size={13} aria-hidden />
          </button>
        )}
      </div>
    );
  },
);
